import Interview from "../models/Interview.js";
import { generateInterviewQuestions, evaluateAnswer } from "../utils/aiService.js";

export const startInterview = async (req, res) => {
  try {
    const { role, difficulty, numQuestions, tags } = req.body;

    const questions = await generateInterviewQuestions({
      role,
      difficulty,
      numQuestions,
      skills: req.user.resume?.parsedSkills || [],
    });

    const interview = await Interview.create({
      user: req.user._id,
      role,
      difficulty,
      tags: tags || [],
      questions: questions.map((q) => ({
        prompt: q.prompt,
        type: q.type || "technical",
      })),
    });

    res.status(201).json({ interview });
  } catch (err) {
    res.status(500).json({ message: "Failed to start interview", error: err.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionIndex, answer, code, language } = req.body;

    const interview = await Interview.findOne({ _id: id, user: req.user._id });
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const question = interview.questions[questionIndex];
    if (!question) return res.status(400).json({ message: "Invalid question index" });

    const evaluation = await evaluateAnswer({ question, answer, code, language });

    question.answer = answer || "";
    question.code = code || "";
    question.language = language || "javascript";
    question.evaluation = evaluation;

    await interview.save();
    res.json({ question });
  } catch (err) {
    res.status(500).json({ message: "Failed to evaluate answer", error: err.message });
  }
};

export const completeInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOne({ _id: id, user: req.user._id });
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const scored = interview.questions.filter((q) => q.evaluation?.score != null);
    const avg = scored.length
      ? scored.reduce((sum, q) => sum + q.evaluation.score, 0) / scored.length
      : 0;

    interview.status = "completed";
    interview.overallScore = Math.round(avg * 10) / 10;
    interview.overallFeedback =
      avg >= 8
        ? "Strong performance across most questions. Ready for real interviews at this level."
        : avg >= 5
        ? "Solid foundation with a few gaps worth targeted practice before the real thing."
        : "Needs focused practice -- revisit fundamentals for this role before your next attempt.";

    await interview.save();
    res.json({ interview });
  } catch (err) {
    console.error("Start Interview Error:", err);

  res.status(500).json({
    message: "Failed to start interview",
    error: err.message,
  });

  }
};

export const getInterview = async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) return res.status(404).json({ message: "Interview not found" });
  res.json({ interview });
};

// Powers the History page: search by role/tag, filter by status/difficulty, paginate
export const listInterviews = async (req, res) => {
  const { page, limit, search, status, difficulty } = req.query;

  const query = { user: req.user._id };
  if (status) query.status = status;
  if (difficulty) query.difficulty = difficulty;
  if (search) query.$text = { $search: search };

  const [interviews, total] = await Promise.all([
    Interview.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-questions.evaluation.feedback"), // keep list payload light
    Interview.countDocuments(query),
  ]);

  res.json({
    interviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

// Powers the Dashboard analytics cards/charts
export const getDashboardStats = async (req, res) => {
  const userId = req.user._id;

  const [totals, byRole, recentScores] = await Promise.all([
    Interview.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalInterviews: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          avgScore: { $avg: "$overallScore" },
        },
      },
    ]),
    Interview.aggregate([
      { $match: { user: userId, status: "completed" } },
      { $group: { _id: "$role", count: { $sum: 1 }, avgScore: { $avg: "$overallScore" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Interview.find({ user: userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("role overallScore createdAt"),
  ]);

  res.json({
    summary: totals[0] || { totalInterviews: 0, completed: 0, avgScore: 0 },
    byRole,
    recentScores,
  });
};

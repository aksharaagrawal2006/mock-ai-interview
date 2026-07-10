import User from "../models/User.js";
import Interview from "../models/Interview.js";

export const getPlatformStats = async (_req, res) => {
  const [userCount, interviewCount, completedCount, avgScoreAgg] = await Promise.all([
    User.countDocuments(),
    Interview.countDocuments(),
    Interview.countDocuments({ status: "completed" }),
    Interview.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, avg: { $avg: "$overallScore" } } },
    ]),
  ]);

  const signupsByDay = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 30 },
  ]);

  res.json({
    userCount,
    interviewCount,
    completedCount,
    avgScore: avgScoreAgg[0]?.avg?.toFixed(1) || 0,
    signupsByDay,
  });
};

// Search & filter users -- same pagination pattern as interview history
export const listUsers = async (req, res) => {
  const { page = 1, limit = 10, search, role } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) query.$text = { $search: search };

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({ users, pagination: { page: Number(page), limit: Number(limit), total } });
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

export const setUserActive = async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

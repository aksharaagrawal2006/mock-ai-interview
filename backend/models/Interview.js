import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    type: {
      type: String,
      enum: ["behavioral", "technical", "coding"],
      default: "technical",
    },
    answer: { type: String, default: "" },
    code: { type: String, default: "" },
    language: { type: String, default: "javascript" },
    evaluation: {
      score: { type: Number, min: 0, max: 10 },
      feedback: String,
      strengths: [String],
      improvements: [String],
    },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, required: true, trim: true }, // e.g. "Frontend Engineer"
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
      index: true,
    },
    questions: [questionSchema],
    overallScore: { type: Number, min: 0, max: 10 },
    overallFeedback: { type: String },
    durationSeconds: { type: Number, default: 0 },
    tags: [{ type: String, index: true }], // e.g. ["react", "system-design"]
  },
  { timestamps: true }
);

// Indexes that power dashboard analytics, history search & filters
interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ role: "text" });
interviewSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Interview", interviewSchema);

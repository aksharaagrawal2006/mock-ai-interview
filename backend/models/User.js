import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: { type: String, default: "" },
    provider: {
      type: String,
      enum: ["google", "github", "local"],
      required: true,
    },
    googleId: { type: String, index: true, sparse: true },
    githubId: { type: String, index: true, sparse: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    resume: {
      url: String,
      publicId: String,
      parsedSkills: [String],
      uploadedAt: Date,
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Compound index used by the admin dashboard's user search/filter
userSchema.index({ name: "text", email: "text" });

export default mongoose.model("User", userSchema);

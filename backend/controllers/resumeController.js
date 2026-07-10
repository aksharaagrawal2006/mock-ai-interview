import pdfParse from "pdf-parse";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";
import User from "../models/User.js";

// Very small keyword-matching "parser" -- swap for a proper NLP/AI call
// if you want richer skill extraction.
const SKILL_KEYWORDS = [
  "javascript", "typescript", "react", "node", "express", "mongodb", "sql",
  "python", "java", "django", "aws", "docker", "kubernetes", "graphql",
  "next.js", "redux", "git", "ci/cd", "rest api", "html", "css", "tailwind",
];

const extractSkills = (text) => {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => lower.includes(skill));
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "resumes");

    let parsedSkills = [];
    if (req.file.mimetype === "application/pdf") {
      const parsed = await pdfParse(req.file.buffer);
      parsedSkills = extractSkills(parsed.text);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        resume: {
          url: result.secure_url,
          publicId: result.public_id,
          parsedSkills,
          uploadedAt: new Date(),
        },
      },
      { new: true }
    );

    res.json({ resume: user.resume });
  } catch (err) {
    res.status(500).json({ message: "Resume upload failed", error: err.message });
  }
};

export const getResume = async (req, res) => {
  res.json({ resume: req.user.resume || null });
};

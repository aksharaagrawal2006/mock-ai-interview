import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-2.5-flash";

export const generateInterviewQuestions = async ({
  role,
  difficulty,
  numQuestions,
  skills = [],
}) => {
  const prompt = `
You are a senior technical interviewer.

Generate ${numQuestions} interview questions.

Role: ${role}
Difficulty: ${difficulty}
Candidate Skills: ${skills.join(", ") || "None"}

Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "prompt": "...",
      "type": "technical"
    }
  ]
}

Question type must be one of:
- technical
- behavioral
- coding

Do not return markdown.
Do not use \`\`\`.
Do not explain anything.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const raw = response.text;

  const parsed = JSON.parse(raw);

  return parsed.questions;
};

export const evaluateAnswer = async ({
  question,
  answer,
  code,
  language,
}) => {
  const prompt = `
You are a senior interviewer.

Question:
${question.prompt}

Question Type:
${question.type}

Candidate Answer:
${answer || "No answer"}

Candidate Code (${language || "N/A"}):
${code || "No code"}

Return ONLY valid JSON:

{
  "score": 8,
  "feedback": "...",
  "strengths": [
    "...",
    "..."
  ],
  "improvements": [
    "...",
    "..."
  ]
}

No markdown.
No explanation.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  return JSON.parse(response.text);
};
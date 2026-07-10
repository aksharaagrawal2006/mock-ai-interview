import { z } from "zod";

// Generic validator factory: validate({ body: schema, query: schema })
export const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.query) req.query = schemas.query.parse(req.query);
    if (schemas.params) req.params = schemas.params.parse(req.params);
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors?.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
};

export const schemas = {
  startInterview: z.object({
    role: z.string().min(2).max(100),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    numQuestions: z.number().int().min(1).max(15).default(5),
    tags: z.array(z.string()).optional(),
  }),
  submitAnswer: z.object({
    questionIndex: z.number().int().min(0),
    answer: z.string().max(8000).optional(),
    code: z.string().max(20000).optional(),
    language: z.string().max(30).optional(),
  }),
  interviewQuery: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().max(100).optional(),
    status: z.enum(["in_progress", "completed", "abandoned"]).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  }),
};

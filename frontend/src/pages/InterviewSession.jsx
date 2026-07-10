import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Editor from "@monaco-editor/react";
import { Loader2, Send, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../lib/api.js";
import { useTheme } from "../context/ThemeContext.jsx";
import ScoreBadge from "../components/ScoreBadge.jsx";

const LANGUAGES = ["javascript", "python", "java", "cpp", "typescript"];

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    api.get(`/interviews/${id}`)
      .then(({ data }) => setInterview(data.interview))
      .catch(() => toast.error("Interview not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const question = interview?.questions?.[active];

  useEffect(() => {
    if (!question) return;
    setAnswer(question.answer || "");
    setCode(question.code || "");
    setLanguage(question.language || "javascript");
  }, [active, question]);

  const handleSubmitAnswer = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post(`/interviews/${id}/answer`, {
        questionIndex: active,
        answer,
        code: question.type === "coding" ? code : undefined,
        language: question.type === "coding" ? language : undefined,
      });

      setInterview((prev) => {
        const questions = [...prev.questions];
        questions[active] = { ...questions[active], ...data.question };
        return { ...prev, questions };
      });
      toast.success("Answer evaluated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Evaluation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = async () => {
    setFinishing(true);
    try {
      const { data } = await api.post(`/interviews/${id}/complete`);
      toast.success(`Interview complete — score ${data.interview.overallScore}/10`);
      navigate("/history");
    } catch {
      toast.error("Couldn't finish the interview");
    } finally {
      setFinishing(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading interview…</div>;
  }
  if (!interview) return null;

  const allAnswered = interview.questions.every((q) => q.evaluation?.score != null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[240px_1fr] gap-8">
      {/* Question list sidebar */}
      <aside className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-3">
          {interview.role} · {interview.difficulty}
        </p>
        {interview.questions.map((q, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between gap-2 transition-colors ${
              active === i ? "bg-accent/15 text-ink dark:text-paper" : "hover:bg-paper-soft dark:hover:bg-ink-line"
            }`}
          >
            <span className="truncate">Q{i + 1}. {q.type}</span>
            {q.evaluation?.score != null ? (
              <CheckCircle2 size={14} className="text-mint shrink-0" />
            ) : null}
          </button>
        ))}
        <button
          onClick={handleFinish}
          disabled={!allAnswered || finishing}
          className="btn-primary w-full mt-4"
        >
          {finishing ? <Loader2 className="animate-spin" size={16} /> : null}
          Finish interview
        </button>
        {!allAnswered && (
          <p className="text-xs text-slate-400 text-center">Answer every question to finish</p>
        )}
      </aside>

      {/* Active question */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0} className="btn-secondary !p-2 disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActive((a) => Math.min(interview.questions.length - 1, a + 1))}
              disabled={active === interview.questions.length - 1}
              className="btn-secondary !p-2 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <ScoreBadge score={question.evaluation?.score} />
        </div>

        <div className="card p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-accent-dim dark:text-accent mb-3">
            {question.type}
          </p>
          <h2 className="font-display text-xl font-semibold leading-snug">{question.prompt}</h2>
        </div>

        {question.type === "coding" ? (
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-paper-line dark:border-ink-line">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-mono outline-none"
              >
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <Editor
              height="360px"
              language={language}
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
            />
          </div>
        ) : null}

        <div>
          <label className="text-sm font-medium mb-2 block">
            {question.type === "coding" ? "Explain your approach (optional)" : "Your answer"}
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={question.type === "coding" ? 3 : 6}
            className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-transparent px-4 py-3 text-sm focus:border-accent outline-none resize-none"
            placeholder="Type your answer here…"
          />
        </div>

        <button onClick={handleSubmitAnswer} disabled={submitting} className="btn-primary">
          {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          {submitting ? "Evaluating…" : "Submit answer"}
        </button>

        {question.evaluation?.feedback && (
          <div className="card p-6 space-y-4 animate-rise">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">AI feedback</h3>
              <ScoreBadge score={question.evaluation.score} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{question.evaluation.feedback}</p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-mint mb-1">Strengths</p>
                <ul className="space-y-1 text-slate-500 dark:text-slate-400 list-disc list-inside">
                  {question.evaluation.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-medium text-coral mb-1">Improve</p>
                <ul className="space-y-1 text-slate-500 dark:text-slate-400 list-disc list-inside">
                  {question.evaluation.improvements?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;

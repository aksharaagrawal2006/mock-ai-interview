import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, Sparkles } from "lucide-react";
import api from "../lib/api.js";

const NewInterview = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim()) return toast.error("Tell us the role you're preparing for");

    setLoading(true);
    try {
      const { data } = await api.post("/interviews", { role, difficulty, numQuestions });
      toast.success("Interview generated");
      navigate(`/interview/${data.interview._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't generate the interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <div className="flex items-center gap-2 text-accent-dim dark:text-accent mb-3">
        <Sparkles size={18} />
        <span className="font-mono text-xs uppercase tracking-widest">New interview</span>
      </div>
      <h1 className="font-display text-2xl font-semibold mb-8">What are you preparing for?</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Target role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Backend Engineer, Data Scientist"
            className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-transparent px-4 py-2.5 text-sm focus:border-accent outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Difficulty</label>
          <div className="grid grid-cols-3 gap-2">
            {["easy", "medium", "hard"].map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-xl py-2 text-sm font-medium capitalize border transition-colors ${
                  difficulty === d
                    ? "border-accent bg-accent/15 text-accent-dim dark:text-accent"
                    : "border-paper-line dark:border-ink-line hover:bg-paper-soft dark:hover:bg-ink-line"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Number of questions: <span className="font-mono text-accent-dim dark:text-accent">{numQuestions}</span>
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {loading ? "Generating questions…" : "Generate interview"}
        </button>
      </form>
    </div>
  );
};

export default NewInterview;

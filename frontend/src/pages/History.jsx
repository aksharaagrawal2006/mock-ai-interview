import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../lib/api.js";
import ScoreBadge from "../components/ScoreBadge.jsx";
import { SkeletonRow } from "../components/Skeleton.jsx";

const History = () => {
  const [interviews, setInterviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/interviews", {
        params: { page, limit: 8, search: search || undefined, status: status || undefined, difficulty: difficulty || undefined },
      });
      setInterviews(data.interviews);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchHistory(1), 350); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, difficulty]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">Interview history</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role or tag…"
            className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-transparent pl-9 pr-4 py-2.5 text-sm focus:border-accent outline-none"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-paper-line dark:border-ink-line bg-transparent px-3 py-2.5 text-sm">
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In progress</option>
          <option value="abandoned">Abandoned</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-xl border border-paper-line dark:border-ink-line bg-transparent px-3 py-2.5 text-sm">
          <option value="">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : interviews.length === 0 ? (
          <div className="card p-10 text-center text-slate-400 text-sm">
            No interviews match these filters yet.
          </div>
        ) : (
          interviews.map((iv) => (
            <Link
              to={`/interview/${iv._id}`}
              key={iv._id}
              className="card p-4 flex items-center justify-between hover:border-accent/60 transition-colors"
            >
              <div>
                <p className="font-medium">{iv.role}</p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {iv.difficulty} · {new Date(iv.createdAt).toLocaleDateString()} · {iv.status.replace("_", " ")}
                </p>
              </div>
              <ScoreBadge score={iv.overallScore} />
            </Link>
          ))
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => fetchHistory(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="btn-secondary !p-2 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-mono text-slate-400">
            {pagination.page} / {pagination.pages}
          </span>
          <button
            onClick={() => fetchHistory(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="btn-secondary !p-2 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default History;

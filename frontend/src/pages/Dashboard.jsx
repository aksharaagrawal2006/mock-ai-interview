import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Upload, Plus, FileText } from "lucide-react";
import api from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { SkeletonCard } from "../components/Skeleton.jsx";

const Dashboard = () => {
  const { user, refetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/interviews/stats")
      .then(({ data }) => setStats(data))
      .catch(() => toast.error("Couldn't load your stats"))
      .finally(() => setLoading(false));
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      await api.post("/resume", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Resume uploaded — future interviews will use it");
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's how your practice is going.</p>
        </div>
        <Link to="/interview/new" className="btn-primary">
          <Plus size={16} /> New interview
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400 font-mono">Total interviews</p>
            <p className="font-display text-3xl font-semibold mt-2">{stats.summary.totalInterviews}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400 font-mono">Completed</p>
            <p className="font-display text-3xl font-semibold mt-2">{stats.summary.completed}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400 font-mono">Average score</p>
            <p className="font-display text-3xl font-semibold mt-2 text-accent-dim dark:text-accent">
              {stats.summary.avgScore?.toFixed?.(1) || "0.0"}/10
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display font-semibold mb-4">Score trend</h2>
          {!loading && stats?.recentScores?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={[...stats.recentScores].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-color-paper-line, #E4E2D9)" />
                <XAxis dataKey="role" hide />
                <YAxis domain={[0, 10]} width={30} />
                <Tooltip />
                <Line type="monotone" dataKey="overallScore" stroke="#F5B429" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 py-16 text-center">
              Complete an interview to see your score trend.
            </p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold mb-2">Resume</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Upload your resume so questions match your real skills.
          </p>
          {user?.resume?.url ? (
            <a
              href={user.resume.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm p-3 rounded-xl bg-paper-soft dark:bg-ink-line mb-4"
            >
              <FileText size={16} className="text-accent" /> View uploaded resume
            </a>
          ) : null}
          <label className="btn-secondary w-full cursor-pointer">
            <Upload size={16} /> {uploading ? "Uploading…" : "Upload resume"}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {!loading && stats?.byRole?.length > 0 && (
        <div className="card p-6 mt-6">
          <h2 className="font-display font-semibold mb-4">Average score by role</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byRole}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} width={30} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#33D6A6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

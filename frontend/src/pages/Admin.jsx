import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, ShieldCheck, ShieldOff } from "lucide-react";
import api from "../lib/api.js";
import { SkeletonCard, SkeletonRow } from "../components/Skeleton.jsx";

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users", { params: { search: search || undefined, limit: 10 } }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchAll, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await api.patch(`/admin/users/${user._id}/role`, { role: newRole });
      toast.success(`${user.name} is now ${newRole}`);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
    } catch {
      toast.error("Couldn't update role");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">Admin dashboard</h1>

      {loading && !stats ? (
        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : (
        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          {[
            ["Users", stats.userCount],
            ["Interviews", stats.interviewCount],
            ["Completed", stats.completedCount],
            ["Avg score", `${stats.avgScore}/10`],
          ].map(([label, value]) => (
            <div key={label} className="card p-5">
              <p className="text-xs uppercase tracking-wide text-slate-400 font-mono">{label}</p>
              <p className="font-display text-2xl font-semibold mt-2">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold">Users</h2>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="rounded-xl border border-paper-line dark:border-ink-line bg-transparent pl-9 pr-3 py-2 text-sm focus:border-accent outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : (
          users.map((u) => (
            <div key={u._id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} className="w-9 h-9 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
              </div>
              <button
                onClick={() => toggleRole(u)}
                className={`btn-secondary !py-1.5 !px-3 text-xs ${u.role === "admin" ? "text-accent-dim dark:text-accent" : ""}`}
              >
                {u.role === "admin" ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                {u.role}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;

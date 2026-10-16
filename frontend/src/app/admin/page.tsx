"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, getAdminStats, triggerPipeline } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [stats, setStats] = useState<{ total_alerts: number; pending_review: number } | null>(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (token) {
      getAdminStats(token).then(setStats).catch(() => setToken(null));
    }
  }, [token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const t = await adminLogin(username, password);
      sessionStorage.setItem("admin_token", t);
      setToken(t);
    } catch {
      setLoginError("Invalid credentials");
    }
  }

  async function handlePipeline(force: boolean) {
    if (!token) return;
    setPipelineRunning(true);
    setPipelineResult(null);
    try {
      const result = await triggerPipeline(token, force);
      setPipelineResult(
        `✅ Downloaded: ${result.pdfs_downloaded} PDFs | Approved: ${result.rows_approved} rows | Queued: ${result.rows_queued_for_review} | Skipped: ${result.rows_skipped_duplicate}`
      );
      // Refresh stats
      const s = await getAdminStats(token);
      setStats(s);
    } catch (e) {
      setPipelineResult(`Error: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setPipelineRunning(false);
    }
  }

  if (!token) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4">
        <div className="glass p-8 w-full max-w-sm flex flex-col gap-6 fade-up">
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h1 className="text-2xl font-bold gradient-text">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">MedCheck — CDSCO Pipeline Control</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="field-wrap">
              <label className="field-label">Username</label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="field-input"
                autoComplete="username"
              />
            </div>
            <div className="field-wrap">
              <label className="field-label">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                autoComplete="current-password"
              />
            </div>
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
            <button id="btn-admin-login" type="submit" className="btn-primary">Sign In</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-8 safe-pb">
      <div className="w-full max-w-2xl flex flex-col gap-6 fade-up">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
          <button
            onClick={() => { sessionStorage.removeItem("admin_token"); setToken(null); }}
            className="text-sm text-slate-500 hover:text-slate-300 transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5 text-center">
              <div className="text-4xl font-extrabold gradient-text">{stats.total_alerts}</div>
              <div className="text-slate-400 text-sm mt-1">Total Alerts</div>
            </div>
            <div className="glass p-5 text-center">
              <div className={`text-4xl font-extrabold ${stats.pending_review > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {stats.pending_review}
              </div>
              <div className="text-slate-400 text-sm mt-1">Pending Review</div>
            </div>
          </div>
        )}

        {/* Pipeline control */}
        <div className="glass p-6 flex flex-col gap-4">
          <h2 className="font-bold text-slate-200">PDF Pipeline</h2>
          <p className="text-sm text-slate-400">
            Discover and process new CDSCO NSQ/spurious PDFs. Runs automatically daily at 2:00 AM IST.
          </p>
          <div className="flex gap-3">
            <button
              id="btn-run-pipeline"
              onClick={() => handlePipeline(false)}
              disabled={pipelineRunning}
              className="btn-primary flex-1"
            >
              {pipelineRunning ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Running...</>
              ) : "▶ Run Pipeline"}
            </button>
            <button
              id="btn-force-pipeline"
              onClick={() => handlePipeline(true)}
              disabled={pipelineRunning}
              className="btn-primary btn-outline flex-1"
            >
              ⟳ Force Re-run
            </button>
          </div>
          {pipelineResult && (
            <div className="p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-xl text-sm text-emerald-300">
              {pipelineResult}
            </div>
          )}
        </div>

        {/* Review queue link */}
        {stats && stats.pending_review > 0 && (
          <button
            id="btn-review-queue"
            onClick={() => router.push("/admin/review")}
            className="btn-primary"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}
          >
            ⚠ Review Queue ({stats.pending_review} pending)
          </button>
        )}

        <button
          onClick={() => router.push("/admin/review")}
          className="btn-primary btn-outline"
        >
          View All Review Items
        </button>
      </div>
    </main>
  );
}

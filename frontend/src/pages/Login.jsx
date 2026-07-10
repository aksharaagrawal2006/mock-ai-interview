import { Github, Terminal } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

// Simple inline Google "G" mark so we don't pull in a brand asset dependency
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
  </svg>
);

const Login = () => {
  const { loginWithGoogle, loginWithGitHub } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm card p-8 text-center animate-rise">
        <div className="w-11 h-11 mx-auto rounded-xl bg-accent/15 flex items-center justify-center mb-5">
          <Terminal className="text-accent" size={20} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8">
          Sign in to start practicing your next interview.
        </p>

        <div className="space-y-3">
          <button onClick={loginWithGoogle} className="btn-secondary w-full">
            <GoogleIcon /> Continue with Google
          </button>
          <button onClick={loginWithGitHub} className="btn-secondary w-full">
            <Github size={18} /> Continue with GitHub
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-8">
          By continuing you agree to practice honestly and not to hardcode your answers.
        </p>
      </div>
    </div>
  );
};

export default Login;

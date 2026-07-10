import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Brain, LineChart, ShieldCheck } from "lucide-react";

const QUESTIONS = [
  "Q: Explain the difference between == and === in JavaScript_",
  "Q: Design a rate limiter for a public API_",
  "Q: Walk me through how React's reconciliation works_",
  "Q: Write a function to detect a cycle in a linked list_",
];

// Signature element: a typing terminal that cycles through real interview
// questions, echoing the product's core action back at the visitor.
const TerminalHero = () => {
  const [qIndex, setQIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = QUESTIONS[qIndex];
    const speed = deleting ? 20 : 35;

    const timeout = setTimeout(() => {
      if (!deleting && text.length < full.length) {
        setText(full.slice(0, text.length + 1));
      } else if (!deleting && text.length === full.length) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && text.length > 0) {
        setText(full.slice(0, text.length - 1));
      } else {
        setDeleting(false);
        setQIndex((i) => (i + 1) % QUESTIONS.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, qIndex]);

  return (
    <div className="card w-full max-w-xl overflow-hidden shadow-xl shadow-ink/5">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-paper-line dark:border-ink-line">
        <span className="w-2.5 h-2.5 rounded-full bg-coral/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-mint/70" />
        <span className="ml-3 text-xs font-mono text-slate-400">prepline — interview.sh</span>
      </div>
      <div className="p-6 font-mono text-sm md:text-base min-h-[140px] text-slate-700 dark:text-slate-200">
        <p className="text-mint mb-2">$ prepline start --role "Frontend Engineer" --difficulty medium</p>
        <p className="leading-relaxed">
          {text}
          <span className="inline-block w-2 h-4 bg-accent align-middle ml-0.5 animate-blink" />
        </p>
      </div>
    </div>
  );
};

const features = [
  { icon: Brain, title: "AI-generated questions", body: "Every interview is built from scratch for the role, difficulty and skills on your resume." },
  { icon: Code2, title: "Real code editor", body: "Solve coding questions in a full Monaco editor — the same one behind VS Code." },
  { icon: LineChart, title: "Scored feedback", body: "Each answer is graded 0–10 with concrete strengths and gaps, not just a pass/fail." },
  { icon: ShieldCheck, title: "Private by default", body: "Your resume and transcripts are yours — visible only to you and, if enabled, your admin." },
];

const Landing = () => {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-rise">
          <p className="font-mono text-xs tracking-widest text-accent-dim dark:text-accent uppercase mb-4">
            AI mock interview platform
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight text-ink dark:text-paper">
            Practice interviews that actually push back.
          </h1>
          <p className="mt-5 text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            Prepline generates role-specific technical and behavioral questions,
            grades your answers with AI, and tracks your progress over time —
            so the real interview isn't the first hard one.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">
              Start a mock interview <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary">Sign in with GitHub</Link>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <TerminalHero />
        </div>
      </section>

      <section className="border-t border-paper-line dark:border-ink-line bg-paper-soft/60 dark:bg-ink-soft/40">
        <div className="max-w-6xl mx-auto px-6 py-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-6">
              <Icon className="text-accent mb-4" size={22} />
              <h3 className="font-display font-semibold text-ink dark:text-paper mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;

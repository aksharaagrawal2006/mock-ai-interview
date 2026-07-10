const ScoreBadge = ({ score }) => {
  if (score == null) return <span className="text-slate-400 text-sm">—</span>;

  const tone =
    score >= 8 ? "bg-mint/15 text-mint" :
    score >= 5 ? "bg-accent/15 text-accent-dim dark:text-accent" :
    "bg-coral/15 text-coral";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-mono font-medium ${tone}`}>
      {score.toFixed(1)}/10
    </span>
  );
};

export default ScoreBadge;

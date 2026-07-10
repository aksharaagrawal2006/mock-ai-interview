export const SkeletonLine = ({ className = "" }) => (
  <div className={`skeleton h-4 ${className}`} />
);

export const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <SkeletonLine className="w-1/3" />
    <SkeletonLine className="w-2/3 h-7" />
    <SkeletonLine className="w-1/2" />
  </div>
);

export const SkeletonRow = () => (
  <div className="card p-4 flex items-center justify-between">
    <div className="space-y-2 flex-1">
      <SkeletonLine className="w-1/4" />
      <SkeletonLine className="w-1/3" />
    </div>
    <SkeletonLine className="w-16 h-8" />
  </div>
);

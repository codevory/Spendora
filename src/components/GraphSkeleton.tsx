const GraphSkeleton = () => {
  const bars = [28, 58, 42, 76, 49, 64, 36];

  return (
    <div className="chart graph-skeleton min-h-80 rounded-2xl border border-slate-700 bg-slate-900/50 p-3 md:p-4">
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="graph-skeleton-shimmer h-4 w-42 rounded" />
          <div className="graph-skeleton-shimmer h-4 w-18 rounded" />
        </div>

        <div className="graph-skeleton-grid mb-3 flex h-52 items-end justify-between gap-2 rounded-xl border border-slate-700/80 p-3">
          {bars.map((barHeight, idx) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className="graph-skeleton-shimmer w-6 rounded-t"
              style={{ height: `${barHeight}%` }}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="graph-skeleton-shimmer h-3 w-20 rounded-full" />
          <span className="graph-skeleton-shimmer h-3 w-20 rounded-full" />
          <span className="graph-skeleton-shimmer h-3 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default GraphSkeleton;

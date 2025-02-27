export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="flex justify-between mt-3">
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

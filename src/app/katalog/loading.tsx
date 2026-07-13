export default function KatalogLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 animate-pulse space-y-3">
        <div className="h-8 w-48 rounded bg-ct-teal/10" />
        <div className="h-5 w-96 rounded bg-ct-teal/10" />
      </div>
      <div className="mb-8 h-10 rounded-full bg-ct-teal/5 animate-pulse" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-ct-teal/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

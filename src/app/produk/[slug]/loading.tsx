export default function ProdukLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-ct-teal/5" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-ct-teal/10" />
          <div className="h-8 w-64 animate-pulse rounded bg-ct-teal/10" />
          <div className="h-5 w-32 animate-pulse rounded bg-ct-teal/10" />
          <div className="h-12 w-full animate-pulse rounded-full bg-ct-teal/5" />
        </div>
      </div>
    </div>
  );
}

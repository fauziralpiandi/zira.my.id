export default function Loading() {
  return (
    <main>
      <div className="animate-pulse space-y-3 text-left">
        <div className="h-4 w-40 rounded-md bg-neutral-900" />
        <div className="h-8 w-3/4 rounded-md bg-neutral-900" />
        <div className="h-4 w-11/12 rounded-md bg-neutral-900" />
      </div>
      <div className="relative right-1/2 left-1/2 my-8 aspect-2/1 w-screen -translate-x-1/2 animate-pulse bg-neutral-900 md:aspect-21/9 md:max-w-xl md:rounded-lg" />
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded-md bg-neutral-900" />
        <div className="h-4 w-5/6 animate-pulse rounded-md bg-neutral-900" />
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-neutral-900" />
      </div>
    </main>
  );
}

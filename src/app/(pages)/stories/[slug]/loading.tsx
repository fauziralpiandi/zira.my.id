export default function Loading() {
  return (
    <section>
      <div className="animate-pulse text-left">
        <div className="h-4 w-40 rounded-md bg-neutral-900" />
        <div className="mt-3 mb-2.5 h-8 w-3/4 rounded-md bg-neutral-900" />
        <div className="h-4 w-11/12 rounded-md bg-neutral-900" />
      </div>
      <div className="relative right-[50%] left-[50%] my-8 aspect-2/1 w-screen translate-x-[-50%] animate-pulse bg-neutral-900 md:aspect-21/9 md:max-w-xl md:rounded-lg" />
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded-md bg-neutral-900" />
        <div className="h-4 w-5/6 animate-pulse rounded-md bg-neutral-900" />
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-neutral-900" />
      </div>
    </section>
  );
}

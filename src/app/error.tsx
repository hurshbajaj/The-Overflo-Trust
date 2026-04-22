"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="panel mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-3xl">Something went wrong</h2>
      <p className="text-[#563c30]">
        We hit an unexpected issue while loading this page. Please try again.
      </p>
      <button type="button" onClick={reset} className="btn-primary">
        Try again
      </button>
      {error.digest ? <p className="text-xs text-amber-800/80">Reference: {error.digest}</p> : null}
    </section>
  );
}

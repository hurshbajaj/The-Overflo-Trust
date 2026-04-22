"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f0e6] p-6 text-[#231713]">
        <section className="panel mx-auto mt-16 max-w-2xl space-y-4 p-6">
          <h2 className="text-3xl">Unexpected application error</h2>
          <p className="text-[#563c30]">
            The app could not complete this request. Refresh the page or try again in a moment.
          </p>
          <button type="button" onClick={reset} className="btn-primary">
            Reload app
          </button>
          {error.digest ? <p className="text-xs text-amber-800/80">Reference: {error.digest}</p> : null}
        </section>
      </body>
    </html>
  );
}

export default function PublicBusinessLoading() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0px,#f8fafc_340px)]">
      <header className="border-b border-indigo-100/80 bg-white/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </header>

      <main
        className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14"
        aria-busy="true"
        aria-label="Cargando negocio"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <div className="h-6 w-28 animate-pulse rounded-full bg-indigo-200" />
          <div className="mt-5 h-12 w-3/4 animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-4 h-5 w-2/3 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="mt-14">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white/80"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

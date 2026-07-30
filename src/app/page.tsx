import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
        <Link
          className="flex items-center gap-2 font-bold tracking-tight"
          href="/"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-lg text-white">
            T
          </span>
          Turnero
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <a
            className="hidden text-slate-600 hover:text-slate-950 sm:block"
            href="#como-funciona"
          >
            Cómo funciona
          </a>
          <Link
            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-200"
            href="/ingresar"
          >
            Ingresar
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-14 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              Turnos online, sin vueltas
            </p>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Tu negocio, siempre listo para recibir reservas.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Creá tu página de turnos en minutos. Tus clientes eligen un
              horario y vos mantenés toda tu agenda ordenada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                href="/registro"
              >
                Crear mi turnero
              </Link>
              <a
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                href="#como-funciona"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-4 shadow-2xl shadow-indigo-200 sm:p-6">
            <div className="rounded-2xl bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="font-bold text-slate-950">Barbería Pepito</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Elegí el horario que te quede mejor.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Abierto
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-xl bg-slate-100 px-2 py-3 font-semibold text-slate-600">
                  Lun
                  <br />
                  <span className="text-xs font-normal">14</span>
                </div>
                <div className="rounded-xl bg-indigo-600 px-2 py-3 font-semibold text-white">
                  Mar
                  <br />
                  <span className="text-xs font-normal">15</span>
                </div>
                <div className="rounded-xl bg-slate-100 px-2 py-3 font-semibold text-slate-600">
                  Mié
                  <br />
                  <span className="text-xs font-normal">16</span>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <p className="text-sm font-semibold text-slate-800">
                  Horarios disponibles
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm font-medium">
                  <button className="rounded-lg border border-indigo-200 bg-indigo-50 py-2 text-indigo-700">
                    10:00
                  </button>
                  <button className="rounded-lg border border-slate-200 py-2 text-slate-700">
                    11:30
                  </button>
                  <button className="rounded-lg border border-slate-200 py-2 text-slate-700">
                    15:00
                  </button>
                </div>
              </div>
              <button className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white">
                Reservar turno
              </button>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Simple para todos
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              De cero a recibir turnos en tres pasos.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                [
                  "01",
                  "Creá tu negocio",
                  "Elegí el nombre, la descripción y el enlace para compartir.",
                ],
                [
                  "02",
                  "Configurá tu agenda",
                  "Sumá servicios, duración de los turnos y horarios disponibles.",
                ],
                [
                  "03",
                  "Recibí reservas",
                  "Tus clientes reservan solos y vos ves todo desde un solo lugar.",
                ],
              ].map(([number, title, description]) => (
                <article
                  className="rounded-2xl border border-slate-200 p-6"
                  key={number}
                >
                  <p className="text-sm font-bold text-indigo-600">{number}</p>
                  <h3 className="mt-4 text-lg font-bold text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer
        id="ingresar"
        className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"
      >
        <p>© 2026 Turnero. Hecho para organizar mejor tu día.</p>
        <Link
          className="font-medium text-slate-700 hover:text-indigo-600"
          href="/ingresar"
        >
          Ingresar a mi cuenta
        </Link>
      </footer>
    </div>
  );
}

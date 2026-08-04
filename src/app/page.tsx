import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck2,
  Check,
  Clock3,
  LayoutDashboard,
  Link2,
  Scissors,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { auth } from "@/lib/auth";

const FEATURES = [
  {
    icon: Link2,
    title: "Tu página de reservas",
    description:
      "Compartí un enlace propio para que tus clientes reserven desde cualquier dispositivo.",
    tone: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: Clock3,
    title: "Disponibilidad automática",
    description:
      "Definí días, horarios y duración. Turnero calcula los espacios disponibles por vos.",
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: LayoutDashboard,
    title: "Todo en un dashboard",
    description:
      "Consultá tu agenda, gestioná servicios y cancelá turnos desde un panel simple.",
    tone: "bg-orange-100 text-orange-700",
  },
];

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f5f2] text-slate-950">
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link className="flex items-center gap-3 text-lg font-bold tracking-tight" href="/">
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
            T
          </span>
          Turnero
        </Link>

        <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-4">
          <a className="hidden rounded-lg px-3 py-2 text-slate-600 transition hover:bg-white hover:text-slate-950 sm:block" href="#funciones">
            Funciones
          </a>
          <Link className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-white hover:text-slate-950" href="/ingresar">
            Ingresar
          </Link>
          <Link className="rounded-xl bg-[#101525] px-4 py-2.5 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-600" href="/registro">
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:pb-28 lg:pt-20">
          <div className="absolute -left-40 top-8 -z-0 size-96 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm">
              <Sparkles className="size-4" /> Tu agenda, sin complicaciones
            </p>
            <h1 className="mt-6 max-w-2xl text-5xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Más reservas. <span className="text-indigo-600">Menos mensajes.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Creá tu página de turnos, configurá tus servicios y organizá toda tu agenda desde un dashboard moderno.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700" href="/registro">
                Crear mi turnero <ArrowRight className="size-4" />
              </Link>
              <a className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" href="#como-funciona">
                Ver cómo funciona
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-emerald-600" /> Sin instalaciones</span>
              <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-emerald-600" /> Responsive</span>
              <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-emerald-600" /> Configuración simple</span>
            </div>
          </div>

          <DashboardPreview />
        </section>

        <section id="funciones" className="border-y border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Todo lo necesario</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Un sistema simple para trabajar mejor.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">Menos tareas repetitivas para vos y una experiencia clara para tus clientes.</p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-3xl border border-slate-200 bg-[#fafaf9] p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
                    <span className={`grid size-12 place-items-center rounded-2xl ${feature.tone}`}><Icon className="size-5" /></span>
                    <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-10">
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Empezá hoy</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">De cero a recibir turnos en tres pasos.</h2>
              <p className="mt-4 leading-7 text-slate-600">No necesitás conocimientos técnicos. Configurás tu negocio y compartís el enlace.</p>
            </div>

            <div className="space-y-4">
              {[
                ["01", "Creá tu negocio", "Definí su nombre, descripción y enlace público."],
                ["02", "Configurá servicios y horarios", "Indicá precios, duración y días de atención."],
                ["03", "Compartí y recibí reservas", "Tus clientes eligen fecha y hora; vos lo ves en el dashboard."],
              ].map(([number, title, description]) => (
                <article key={number} className="flex gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#101525] text-sm font-bold text-white">{number}</span>
                  <div><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 leading-7 text-slate-600">{description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#101525] px-6 py-12 text-center text-white shadow-2xl sm:px-12 sm:py-16">
            <div className="absolute -right-16 -top-20 size-64 rounded-full border-[38px] border-white/5" />
            <ShieldCheck className="mx-auto size-10 text-indigo-300" />
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Tu próxima reserva puede llegar sin que respondas un mensaje.</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">Creá tu espacio y empezá a organizar tu agenda desde un solo lugar.</p>
            <Link className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5" href="/registro">
              Crear mi cuenta <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Turnero. Reservas simples para tu negocio.</p>
          <div className="flex gap-5"><a href="#funciones" className="hover:text-slate-950">Funciones</a><Link href="/ingresar" className="hover:text-slate-950">Ingresar</Link></div>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative z-10 rounded-[2rem] bg-[#101525] p-3 shadow-2xl shadow-indigo-300/40 sm:p-4 lg:rotate-1">
      <div className="overflow-hidden rounded-[1.4rem] bg-[#f3f2ef] p-4 sm:p-6">
        <div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Panel de administración</p><p className="mt-1 font-bold">Barbería Central</p></div><span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600">Ver página ↗</span></div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="col-span-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 p-5 text-white sm:row-span-2"><p className="text-xs text-indigo-100">Turnos de hoy</p><p className="mt-2 text-4xl font-bold">6</p><div className="mt-8 rounded-xl bg-white/15 p-3"><p className="text-[10px] uppercase text-indigo-100">Próximo</p><div className="mt-1 flex justify-between text-sm font-semibold"><span>Juan Pérez</span><span>10:30</span></div></div></div>
          <PreviewMetric icon={CalendarCheck2} value="18" label="Próximos" tone="bg-orange-100 text-orange-700" />
          <PreviewMetric icon={Scissors} value="5" label="Servicios" tone="bg-indigo-100 text-indigo-700" />
          <PreviewMetric icon={UsersRound} value="24" label="Clientes" tone="bg-emerald-100 text-emerald-700" />
          <PreviewMetric icon={Clock3} value="6" label="Días abiertos" tone="bg-violet-100 text-violet-700" />
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({ icon: Icon, value, label, tone }: { icon: typeof CalendarCheck2; value: string; label: string; tone: string }) {
  return <div className="rounded-2xl bg-white p-3 shadow-sm"><span className={`grid size-8 place-items-center rounded-xl ${tone}`}><Icon className="size-4" /></span><p className="mt-4 text-xl font-bold">{value}</p><p className="text-[11px] text-slate-500">{label}</p></div>;
}

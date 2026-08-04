import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarCheck2, Check, Clock3, LayoutDashboard } from "lucide-react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

const BENEFITS = [
  { icon: CalendarCheck2, text: "Reservas disponibles las 24 horas" },
  { icon: Clock3, text: "Horarios calculados automáticamente" },
  { icon: LayoutDashboard, text: "Toda tu agenda en un solo lugar" },
];

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f2ef] px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:p-0">
      <div className="absolute -left-28 -top-28 size-80 rounded-full bg-indigo-200/50 blur-3xl lg:hidden" />

      <section className="relative z-10 flex items-center justify-center py-8 lg:px-12 lg:py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 text-lg font-bold tracking-tight text-slate-950">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">T</span>
            Turnero
          </Link>

          <div className="mt-10 rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            <p className="mt-3 leading-7 text-slate-600">{description}</p>
            {children}
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
        </div>
      </section>

      <aside className="relative hidden min-h-screen overflow-hidden bg-[#101525] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-80 rounded-full border-[54px] border-white/5" />
        <div className="absolute -bottom-36 -left-28 size-96 rounded-full bg-indigo-600/30 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-indigo-200">
            <Check className="size-4" /> Tu negocio, siempre disponible
          </span>
          <h2 className="mt-8 max-w-xl text-5xl font-bold leading-tight tracking-[-0.04em]">
            Menos tiempo coordinando. Más tiempo para tu negocio.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
            Turnero organiza servicios, disponibilidad y reservas en una experiencia simple para vos y tus clientes.
          </p>
        </div>

        <div className="relative grid gap-3">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <span className="grid size-10 place-items-center rounded-xl bg-indigo-500/20 text-indigo-200"><Icon className="size-5" /></span>
              <p className="font-medium text-slate-100">{text}</p>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}

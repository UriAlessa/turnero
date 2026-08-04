import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock3, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BookingSection } from "@/components/booking/booking-section";

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: {
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      businessHours: {
        orderBy: { dayOfWeek: "asc" },
      },
    },
  });

  if (!business) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-3xl font-bold text-slate-950">
          Negocio no encontrado
        </h1>
        <p className="mt-2 text-slate-600">
          El negocio que buscás no existe o el enlace es incorrecto.
        </p>
        <Button className="mt-6">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0px,#f8fafc_340px)]">
      <header className="border-b border-indigo-100/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-950"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-sm text-white shadow-sm shadow-indigo-200">
              T
            </span>
            Turnero
          </Link>
          <Button variant="outline" size="sm">
            <Link href="/ingresar">Soy el dueño</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
            Reservas online
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {business.name}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
            {business.description ||
              "Reservá tu turno de forma rápida y sencilla."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4 text-indigo-500" /> En pocos minutos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-indigo-500" /> Disponibilidad
              real
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-indigo-500" /> Confirmación
              inmediata
            </span>
          </div>
        </div>

        <BookingSection services={business.services} businessId={business.id} />
      </main>
    </div>
  );
}

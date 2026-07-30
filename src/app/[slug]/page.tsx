import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { BookingSection } from "@/components/booking/booking-section";

const prisma = new PrismaClient();

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: true,
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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-950"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">
              T
            </span>
            Turnero
          </Link>
          <Button variant="outline" size="sm">
            <Link href="/ingresar">Soy el dueño</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            {business.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {business.description ||
              "Reservá tu turno de forma rápida y sencilla."}
          </p>
        </div>

        <BookingSection services={business.services} businessId={business.id} />
      </main>
    </div>
  );
}

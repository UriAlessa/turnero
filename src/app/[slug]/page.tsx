import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";

// 1. Inicializamos el cliente de Prisma (fuera del componente para reutilizar la conexión)
const prisma = new PrismaClient();

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 2. Obtenemos el slug de la URL
  const { slug } = await params;

  // 3. Buscamos el negocio en la base de datos por su slug
  // "include: { services: true }" le dice a Prisma que traiga también los servicios relacionados
  const business = await prisma.business.findUnique({
    where: { slug },
    include: { services: true },
  });

  // 4. Si no encontramos el negocio, mostramos un mensaje de "No encontrado"
  if (!business) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-3xl font-bold text-slate-950">
          Negocio no encontrado
        </h1>
        <p className="mt-2 text-slate-600">
          El negocio que buscás no existe o el enlace es incorrecto.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  // 5. Si lo encontramos, mostramos los datos reales
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
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingresar">Soy el dueño</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="text-center">
          {/* Usamos el nombre real de la base de datos */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            {business.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {business.description ||
              "Reservá tu turno de forma rápida y sencilla."}
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-slate-950">
            Nuestros Servicios
          </h2>

          {/* Si no hay servicios, mostramos un mensaje */}
          {business.services.length === 0 ? (
            <p className="text-slate-500">
              Este negocio aún no tiene servicios configurados.
            </p>
          ) : (
            // Mapeamos los servicios reales de la base de datos
            business.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200"
              >
                <div>
                  <h3 className="font-semibold text-slate-950">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {service.durationMin} minutos • $
                    {service.price.toLocaleString()}
                  </p>
                </div>
                <Button>Reservar</Button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};

type Business = {
  id: string;
  slug: string;
  name: string;
};

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [servicePrice, setServicePrice] = useState("");

  const router = useRouter();

  // 1. Verificar usuario y cargar datos al inicio
  useEffect(() => {
    const initializeDashboard = async () => {
      const storedUser = localStorage.getItem("turnero_user");

      if (!storedUser) {
        router.push("/ingresar");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUserEmail(parsedUser.email);

      // Buscar negocio del usuario
      try {
        const response = await fetch(
          `/api/business?ownerEmail=${parsedUser.email}`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data.business) {
            setBusiness(data.business);

            // Si tiene negocio, cargar servicios
            const servicesResponse = await fetch(
              `/api/service?businessId=${data.business.id}`,
            );
            if (servicesResponse.ok) {
              const servicesData = await servicesResponse.json();
              setServices(servicesData.services);
            }
          }
        }
      } catch (error: unknown) {
        console.error("Error al inicializar dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  // 2. Función para crear el negocio
  const handleCreateBusiness = async (event: FormEvent) => {
    event.preventDefault();
    if (!userEmail) return;

    setIsCreatingBusiness(true);

    try {
      const slug = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const response = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessName,
          description: businessDescription,
          slug: slug,
          ownerEmail: userEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el negocio");
      }

      const data = await response.json();
      setBusiness(data.business);

      toast.success("¡Negocio creado con éxito!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Hubo un error al crear el negocio";
      console.error(error);
      toast.error(errorMessage);
    } finally {
      setIsCreatingBusiness(false);
    }
  };

  // 3. Función para crear un servicio
  const handleCreateService = async (event: FormEvent) => {
    event.preventDefault();
    if (!business) return;

    setIsCreatingService(true);

    try {
      const response = await fetch("/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: serviceName,
          durationMin: serviceDuration,
          price: servicePrice,
          businessId: business.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el servicio");
      }

      toast.success("¡Servicio agregado!");

      setServiceName("");
      setServiceDuration("");
      setServicePrice("");

      // Recargar servicios
      const servicesResponse = await fetch(
        `/api/service?businessId=${business.id}`,
      );
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Hubo un error al crear el servicio";
      console.error(error);
      toast.error(errorMessage);
    } finally {
      setIsCreatingService(false);
    }
  };

  // 4. Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("turnero_user");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Cargando tu panel...</p>
      </div>
    );
  }

  if (!userEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-950"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">
              T
            </span>
            Turnero
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-950">
          ¡Hola de nuevo! 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Sesión iniciada como:{" "}
          <span className="font-semibold text-indigo-600">{userEmail}</span>
        </p>

        {!business ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Configurá tu negocio
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Creá tu perfil público para que los clientes puedan reservar.
            </p>

            <form onSubmit={handleCreateBusiness} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del negocio</Label>
                <Input
                  id="name"
                  placeholder="Ej. Barbería Pepita"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Ej. Los mejores cortes de la ciudad"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isCreatingBusiness}
              >
                {isCreatingBusiness ? "Creando..." : "Crear mi negocio"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h2 className="text-xl font-semibold text-green-800">
                {business.name}
              </h2>
              <p className="mt-2 text-green-700">Tu página pública:</p>
              <a
                href={`/${business.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-mono text-sm font-semibold text-indigo-600 hover:underline"
              >
                turnero.com/{business.slug}
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">
                Agregar servicio
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Definí los servicios que ofrecés.
              </p>

              <form onSubmit={handleCreateService} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Nombre del servicio</Label>
                  <Input
                    id="serviceName"
                    placeholder="Ej. Corte de cabello"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceDuration">Duración (minutos)</Label>
                    <Input
                      id="serviceDuration"
                      type="number"
                      placeholder="Ej. 45"
                      required
                      value={serviceDuration}
                      onChange={(e) => setServiceDuration(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servicePrice">Precio ($)</Label>
                    <Input
                      id="servicePrice"
                      type="number"
                      placeholder="Ej. 5000"
                      required
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isCreatingService}
                >
                  {isCreatingService ? "Agregando..." : "Agregar servicio"}
                </Button>
              </form>
            </div>

            {services.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-950">
                  Tus servicios
                </h2>
                <div className="mt-4 space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {service.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {service.durationMin} min • $
                          {service.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

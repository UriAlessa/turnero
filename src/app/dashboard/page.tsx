"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  isActive: boolean;
};
type Business = {
  id: string;
  slug: string;
  name: string;
  ownerId: string;
};

type BusinessHour = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};
type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  startsAt: string;
  status: string;
  serviceName: string | null;
  serviceDurationMin: number | null;
  servicePrice: number | null;
  service: {
    name: string;
    durationMin: number;
  };
};

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [isSavingHours, setIsSavingHours] = useState(false);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<
    string | null
  >(null);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(
    null,
  );
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceName, setEditServiceName] = useState("");
  const [editServiceDuration, setEditServiceDuration] = useState("");
  const [editServicePrice, setEditServicePrice] = useState("");

  const router = useRouter();

  const fetchServices = async (businessId: string) => {
    try {
      const response = await fetch(`/api/service?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
      }
    } catch (error: unknown) {
      console.error("Error al obtener servicios:", error);
    }
  };

  const fetchBusinessHours = async (businessId: string) => {
    try {
      const response = await fetch(
        `/api/business-hours?businessId=${businessId}`,
      );

      if (!response.ok) {
        throw new Error("No se pudieron obtener los horarios");
      }

      const data = await response.json();
      setBusinessHours(data.hours);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
    }
  };

  const fetchAppointments = async (businessId: string) => {
    try {
      const response = await fetch(
        `/api/appointments?businessId=${businessId}`,
      );

      if (!response.ok) {
        throw new Error("No se pudieron obtener los turnos");
      }

      const data = await response.json();
      setAppointments(data.appointments);
    } catch (error) {
      console.error("Error al obtener turnos:", error);
    }
  };

  const toggleBusinessDay = (dayOfWeek: number) => {
    setBusinessHours((currentHours) => {
      const existingHour = currentHours.find(
        (hour) => hour.dayOfWeek === dayOfWeek,
      );

      if (existingHour) {
        return currentHours.filter((hour) => hour.dayOfWeek !== dayOfWeek);
      }

      return [
        ...currentHours,
        {
          dayOfWeek,
          startTime: "09:00",
          endTime: "18:00",
        },
      ];
    });
  };

  const updateBusinessHour = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setBusinessHours((currentHours) =>
      currentHours.map((hour) =>
        hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour,
      ),
    );
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/business`);
        if (response.ok) {
          const data = await response.json();
          if (data.business) {
            setBusiness(data.business);
            fetchServices(data.business.id);
            fetchBusinessHours(data.business.id);
            fetchAppointments(data.business.id);
          }
        }
      } catch (error: unknown) {
        console.error("Error al buscar negocio:", error);
      }
    };

    if (status === "authenticated") {
      fetchBusiness();
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/ingresar");
    }
  }, [status, router]);

  const handleCreateBusiness = async (event: FormEvent) => {
    event.preventDefault();
    if (!session?.user?.id) return;

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el negocio");
      }

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el servicio");
      }

      toast.success("¡Servicio agregado!");
      setServiceName("");
      setServiceDuration("");
      setServicePrice("");
      fetchServices(business.id);
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

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Cargando tu panel...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const WEEK_DAYS = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 0, label: "Domingo" },
  ];

  const handleSaveBusinessHours = async () => {
    if (!business) return;

    setIsSavingHours(true);

    try {
      const response = await fetch("/api/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          hours: businessHours,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudieron guardar los horarios");
      }

      setBusinessHours(data.hours);
      toast.success("Horarios guardados correctamente");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los horarios";

      toast.error(message);
    } finally {
      setIsSavingHours(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    const shouldCancel = window.confirm(
      "¿Seguro que querés cancelar este turno?",
    );

    if (!shouldCancel) {
      return;
    }

    setCancellingAppointmentId(appointmentId);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo cancelar el turno");
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: "cancelled" }
            : appointment,
        ),
      );

      toast.success("Turno cancelado correctamente");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo cancelar el turno";

      toast.error(message);
    } finally {
      setCancellingAppointmentId(null);
    }
  };

  const handleToggleService = async (service: Service) => {
    setUpdatingServiceId(service.id);

    try {
      const response = await fetch(`/api/service/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !service.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo actualizar el servicio");
      }

      setServices((currentServices) =>
        currentServices.map((currentService) =>
          currentService.id === service.id
            ? { ...currentService, isActive: data.service.isActive }
            : currentService,
        ),
      );

      toast.success(data.message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el servicio";

      toast.error(message);
    } finally {
      setUpdatingServiceId(null);
    }
  };

  const handleStartEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setEditServiceName(service.name);
    setEditServiceDuration(String(service.durationMin));
    setEditServicePrice(String(service.price));
  };

  const handleUpdateService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingServiceId) {
      return;
    }

    const durationMin = Number(editServiceDuration);
    const price = Number(editServicePrice);

    setUpdatingServiceId(editingServiceId);

    try {
      const response = await fetch(`/api/service/${editingServiceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editServiceName,
          durationMin,
          price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo editar el servicio");
      }

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === editingServiceId ? data.service : service,
        ),
      );

      setEditingServiceId(null);
      toast.success("Servicio actualizado correctamente");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo editar el servicio";

      toast.error(message);
    } finally {
      setUpdatingServiceId(null);
    }
  };

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
          <span className="font-semibold text-indigo-600">
            {session.user.email}
          </span>
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
                Próximos turnos
              </h2>

              {appointments.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  Todavía no tenés próximos turnos.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {appointment.clientName}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {appointment.serviceName ?? appointment.service.name}{" "}
                          ·{" "}
                          {appointment.serviceDurationMin ??
                            appointment.service.durationMin}{" "}
                          min
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Tel: {appointment.clientPhone}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-medium text-indigo-600">
                          {format(
                            new Date(appointment.startsAt),
                            "EEEE d 'de' MMMM · HH:mm",
                            { locale: es },
                          )}
                        </p>
                        <p className="mt-1 text-sm capitalize text-slate-500">
                          {appointment.status}
                        </p>
                        {appointment.status !== "cancelled" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            disabled={
                              cancellingAppointmentId === appointment.id
                            }
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                          >
                            {cancellingAppointmentId === appointment.id
                              ? "Cancelando..."
                              : "Cancelar turno"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">
                Horarios de atención
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Elegí los días y horarios en los que recibís reservas.
              </p>

              <div className="mt-6 space-y-3">
                {WEEK_DAYS.map((day) => {
                  const hour = businessHours.find(
                    (item) => item.dayOfWeek === day.value,
                  );

                  return (
                    <div
                      key={day.value}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <label className="flex items-center gap-3 font-medium text-slate-800">
                        <input
                          type="checkbox"
                          checked={Boolean(hour)}
                          onChange={() => toggleBusinessDay(day.value)}
                          className="size-4 accent-indigo-600"
                        />
                        {day.label}
                      </label>

                      {hour ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={hour.startTime}
                            onChange={(event) =>
                              updateBusinessHour(
                                day.value,
                                "startTime",
                                event.target.value,
                              )
                            }
                            className="w-28"
                          />
                          <span className="text-sm text-slate-500">a</span>
                          <Input
                            type="time"
                            value={hour.endTime}
                            onChange={(event) =>
                              updateBusinessHour(
                                day.value,
                                "endTime",
                                event.target.value,
                              )
                            }
                            className="w-28"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">Cerrado</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button
                type="button"
                className="mt-6 w-full"
                onClick={handleSaveBusinessHours}
                disabled={isSavingHours}
              >
                {isSavingHours ? "Guardando..." : "Guardar horarios"}
              </Button>
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
                      {editingServiceId === service.id ? (
                        <form
                          onSubmit={handleUpdateService}
                          className="space-y-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor={`edit-name-${service.id}`}>
                              Nombre
                            </Label>
                            <Input
                              id={`edit-name-${service.id}`}
                              required
                              value={editServiceName}
                              onChange={(event) =>
                                setEditServiceName(event.target.value)
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-duration-${service.id}`}>
                                Duración (minutos)
                              </Label>
                              <Input
                                id={`edit-duration-${service.id}`}
                                type="number"
                                min="1"
                                required
                                value={editServiceDuration}
                                onChange={(event) =>
                                  setEditServiceDuration(event.target.value)
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`edit-price-${service.id}`}>
                                Precio ($)
                              </Label>
                              <Input
                                id={`edit-price-${service.id}`}
                                type="number"
                                min="0"
                                required
                                value={editServicePrice}
                                onChange={(event) =>
                                  setEditServicePrice(event.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              type="submit"
                              size="sm"
                              disabled={updatingServiceId === service.id}
                            >
                              {updatingServiceId === service.id
                                ? "Guardando..."
                                : "Guardar cambios"}
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingServiceId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div>
                            <h3 className="font-semibold text-slate-950">
                              {service.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {service.durationMin} min • $
                              {service.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={
                                service.isActive
                                  ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                                  : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                              }
                            >
                              {service.isActive ? "Activo" : "Inactivo"}
                            </span>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartEditService(service)}
                            >
                              Editar
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={updatingServiceId === service.id}
                              onClick={() => handleToggleService(service)}
                            >
                              {updatingServiceId === service.id
                                ? "Guardando..."
                                : service.isActive
                                  ? "Desactivar"
                                  : "Activar"}
                            </Button>
                          </div>
                        </>
                      )}
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

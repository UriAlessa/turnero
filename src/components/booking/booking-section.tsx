"use client";

import { useState, useEffect, type SyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { es } from "react-day-picker/locale";
import { format } from "date-fns";
import { toast } from "sonner";
type BookingService = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};

type BookingSectionProps = {
  businessId: string;
  services: BookingService[];
};

export function BookingSection({ businessId, services }: BookingSectionProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find(
    (service) => service.id === selectedServiceId,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!selectedServiceId || !selectedDate) {
      return;
    }

    const fetchSlots = async () => {
      const params = new URLSearchParams({
        businessId,
        serviceId: selectedServiceId,
        date: format(selectedDate, "yyyy-MM-dd"),
      });

      const response = await fetch(`/api/availability?${params.toString()}`);
      const data = await response.json();

      setSlots(data.slots ?? []);
    };

    fetchSlots();
  }, [businessId, selectedServiceId, selectedDate]);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();

    if (!selectedService || !selectedDate || !selectedTime) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          serviceId: selectedService.id,
          clientName,
          clientPhone,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "No se pudo reservar el turno");
        return;
      }

      toast.success("¡Tu turno fue reservado!");

      setSlots((currentSlots) =>
        currentSlots.filter((slot) => slot !== selectedTime),
      );
      setSelectedTime(null);
      setClientName("");
      setClientPhone("");
    } catch {
      toast.error("Ocurrió un error al intentar reservar el turno");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold text-slate-950">
        Nuestros servicios
      </h2>

      {services.length === 0 ? (
        <p className="text-slate-500">
          Este negocio aún no tiene servicios configurados.
        </p>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200"
          >
            <div>
              <h3 className="font-semibold text-slate-950">{service.name}</h3>
              <p className="text-sm text-slate-500">
                {service.durationMin} minutos • $
                {service.price.toLocaleString()}
              </p>
            </div>

            <Button onClick={() => setSelectedServiceId(service.id)}>
              Reservar
            </Button>
          </div>
        ))
      )}

      {selectedService && (
        <p className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
          Seleccionaste: <strong>{selectedService.name}</strong>
        </p>
      )}

      {selectedService && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-950">Elegí una fecha</h3>

          <div className="mt-4 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={{ before: today }}
              locale={es}
            />
            {selectedDate && selectedServiceId && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">
                  Elegí un horario
                </h3>

                {slots.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">
                    No hay horarios disponibles para este día.
                  </p>
                ) : (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={selectedTime === slot ? "default" : "outline"}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}

                {selectedTime && (
                  <p className="mt-4 text-sm font-medium text-indigo-600">
                    Horario elegido: {selectedTime}
                  </p>
                )}
              </section>
            )}
            {selectedTime && selectedService && selectedDate && (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-950">
                  Confirmá tu reserva
                </h3>

                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p>
                    <span className="font-medium">Servicio:</span>{" "}
                    {selectedService.name}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span>{" "}
                    {format(selectedDate, "dd/MM/yyyy")}
                  </p>
                  <p>
                    <span className="font-medium">Horario:</span> {selectedTime}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="clientName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Tu nombre
                    </label>
                    <input
                      id="clientName"
                      required
                      value={clientName}
                      onChange={(event) => setClientName(event.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="clientPhone"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Teléfono
                    </label>
                    <input
                      id="clientPhone"
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(event) => setClientPhone(event.target.value)}
                      placeholder="Ej. 11 1234-5678"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Reservando..." : "Confirmar turno"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

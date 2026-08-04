"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  BookingConfirmation,
  type BookingConfirmationData,
} from "@/components/booking/booking-confirmation";
import {
  BookingServiceList,
  type BookingService,
} from "@/components/booking/booking-service-list";
import { BookingReservationForm } from "@/components/booking/booking-reservation-form";
import { BookingAvailability } from "@/components/booking/booking-availability";
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
  const [confirmation, setConfirmation] =
    useState<BookingConfirmationData | null>(null);

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

      const response = await fetch(`/api/availability?${params.toString()}`, {
        cache: "no-store",
      });

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

      setConfirmation({
        code: data.appointment.confirmationCode,
        serviceName: selectedService.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
      });

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

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleNewBooking = () => {
    setConfirmation(null);
    setSelectedServiceId(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setSlots([]);
  };

  if (confirmation) {
    return (
      <BookingConfirmation
        confirmation={confirmation}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <section className="mt-10 space-y-4">
      <BookingServiceList
        services={services}
        onSelectService={handleSelectService}
      />

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

            <Button onClick={() => handleSelectService(service.id)}>
              Reservar
            </Button>
          </div>
        ))
      )}

      {selectedService && (
        <>
          <p className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
            Seleccionaste: <strong>{selectedService.name}</strong>
          </p>

          <BookingAvailability
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            slots={slots}
            today={today}
            onSelectDate={handleSelectDate}
            onSelectTime={setSelectedTime}
          />

          {selectedTime && selectedDate && (
            <BookingReservationForm
              serviceName={selectedService.name}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              clientName={clientName}
              clientPhone={clientPhone}
              isSubmitting={isSubmitting}
              onClientNameChange={setClientName}
              onClientPhoneChange={setClientPhone}
              onSubmit={handleSubmit}
            />
          )}
        </>
      )}
    </section>
  );
}

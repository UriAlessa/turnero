"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
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
import type { BookingStep } from "@/types/booking";

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
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [confirmation, setConfirmation] =
    useState<BookingConfirmationData | null>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");

  const selectedService = services.find(
    (service) => service.id === selectedServiceId,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!selectedServiceId || !selectedDate) {
      return;
    }

    const controller = new AbortController();

    const fetchSlots = async () => {
      try {
        const params = new URLSearchParams({
          businessId,
          serviceId: selectedServiceId,
          date: format(selectedDate, "yyyy-MM-dd"),
        });

        const response = await fetch(`/api/availability?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ?? "No se pudo consultar la disponibilidad",
          );
        }

        setSlots(data.slots ?? []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setSlotsError(
          error instanceof Error
            ? error.message
            : "No se pudo consultar la disponibilidad",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSlots(false);
        }
      }
    };

    fetchSlots();

    return () => controller.abort();
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
    setSelectedDate(undefined);
    setSelectedTime(null);
    setSlots([]);
    setSlotsError(null);
    setCurrentStep("availability");
    setIsLoadingSlots(false);
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSlots([]);
    setSlotsError(null);
    setCurrentStep("availability");
    setIsLoadingSlots(Boolean(date && selectedServiceId));
  };

  const handleNewBooking = () => {
    setCurrentStep("service");
    setConfirmation(null);
    setSelectedServiceId(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setSlots([]);
    setSlotsError(null);
    setIsLoadingSlots(false);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setCurrentStep("reservation");
  };

  const handleBackStep = () => {
    if (currentStep === "availability") {
      setCurrentStep("service");
      setSelectedServiceId(null);
      setSelectedTime(null);
      setSlots([]);
      setSlotsError(null);
      setIsLoadingSlots(false);
      setSelectedDate(undefined);
    } else if (currentStep === "reservation") {
      setCurrentStep("availability");
      setSelectedTime(null);
    }
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
      {currentStep === "service" && (
        <BookingServiceList
          services={services}
          selectedServiceId={selectedServiceId}
          onSelectService={handleSelectService}
        />
      )}

      {currentStep === "availability" && (
        <BookingAvailability
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          slots={slots}
          isLoadingSlots={isLoadingSlots}
          slotsError={slotsError}
          today={today}
          onSelectDate={handleSelectDate}
          onSelectTime={handleSelectTime}
          onBack={handleBackStep}
        />
      )}

      {currentStep === "reservation" &&
        selectedService &&
        selectedTime &&
        selectedDate && (
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
            onBack={handleBackStep}
          />
        )}
    </section>
  );
}

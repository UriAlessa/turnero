import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Appointment } from "@/components/dashboard/appointments-list";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<
    string | null
  >(null);

  const fetchAppointments = useCallback(async (businessId: string) => {
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
  }, []);

  const cancelAppointment = async (appointmentId: string) => {
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

  return {
    appointments,
    cancellingAppointmentId,
    fetchAppointments,
    cancelAppointment,
  };
};

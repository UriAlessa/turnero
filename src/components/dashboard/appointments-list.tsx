import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export type Appointment = {
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

type AppointmentsListProps = {
  appointments: Appointment[];
  cancellingAppointmentId: string | null;
  onCancelAppointment: (appointmentId: string) => void;
};

export const AppointmentsList = ({
  appointments,
  cancellingAppointmentId,
  onCancelAppointment,
}: AppointmentsListProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Próximos turnos</h2>

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
                  {appointment.serviceName ?? appointment.service.name} ·{" "}
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
                    disabled={cancellingAppointmentId === appointment.id}
                    onClick={() => onCancelAppointment(appointment.id)}
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
  );
};

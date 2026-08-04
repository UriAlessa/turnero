import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarX2, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <p className="text-sm font-medium text-slate-500">Agenda</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Próximos turnos
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {appointments.length} {appointments.length === 1 ? "turno" : "turnos"}
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CalendarX2 className="size-6" />
          </span>
          <h3 className="mt-4 font-semibold text-slate-900">
            Tu agenda está libre
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Los próximos turnos aparecerán acá cuando tus clientes reserven.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-6 py-3.5">Fecha y hora</th>
                  <th scope="col" className="px-6 py-3.5">Cliente</th>
                  <th scope="col" className="px-6 py-3.5">Servicio</th>
                  <th scope="col" className="px-6 py-3.5">Estado</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <AppointmentTableRow
                    key={appointment.id}
                    appointment={appointment}
                    isCancelling={cancellingAppointmentId === appointment.id}
                    onCancel={onCancelAppointment}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 bg-slate-100/70 p-3 md:hidden">
            {appointments.map((appointment) => (
              <AppointmentMobileCard
                key={appointment.id}
                appointment={appointment}
                isCancelling={cancellingAppointmentId === appointment.id}
                onCancel={onCancelAppointment}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

type AppointmentRowProps = {
  appointment: Appointment;
  isCancelling: boolean;
  onCancel: (appointmentId: string) => void;
};

function AppointmentTableRow({ appointment, isCancelling, onCancel }: AppointmentRowProps) {
  const startsAt = new Date(appointment.startsAt);
  const serviceName = appointment.serviceName ?? appointment.service.name;
  const duration = appointment.serviceDurationMin ?? appointment.service.durationMin;

  return (
    <tr className="group border-b border-slate-200 transition-colors last:border-b-0 even:bg-slate-50/70 hover:bg-indigo-50/70">
      <td className="whitespace-nowrap px-6 py-5">
        <div className="inline-flex min-w-24 flex-col rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {format(startsAt, "EEE d MMM", { locale: es })}
          </p>
          <p className="mt-1 text-base font-bold text-indigo-600">
            {format(startsAt, "HH:mm")}
          </p>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex min-w-44 items-center gap-3">
          <ClientAvatar name={appointment.clientName} />
          <div>
            <p className="font-semibold text-slate-900">{appointment.clientName}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <Phone className="size-3.5" /> {appointment.clientPhone}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="font-medium text-slate-800">{serviceName}</p>
        <p className="mt-1 text-sm text-slate-500">{duration} min</p>
      </td>
      <td className="px-6 py-5"><AppointmentStatus status={appointment.status} /></td>
      <td className="px-6 py-5 text-right">
        {appointment.status !== "cancelled" ? (
          <Button type="button" variant="outline" size="sm" disabled={isCancelling} onClick={() => onCancel(appointment.id)}>
            {isCancelling ? "Cancelando…" : "Cancelar"}
          </Button>
        ) : <span className="text-sm text-slate-400">Sin acciones</span>}
      </td>
    </tr>
  );
}

function AppointmentMobileCard({ appointment, isCancelling, onCancel }: AppointmentRowProps) {
  const startsAt = new Date(appointment.startsAt);
  const serviceName = appointment.serviceName ?? appointment.service.name;
  const duration = appointment.serviceDurationMin ?? appointment.service.durationMin;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ClientAvatar name={appointment.clientName} />
          <div>
            <h3 className="font-semibold text-slate-900">{appointment.clientName}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{serviceName} · {duration} min</p>
          </div>
        </div>
        <AppointmentStatus status={appointment.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
        <div><p className="text-xs text-slate-500">Fecha</p><p className="mt-1 font-semibold capitalize text-slate-800">{format(startsAt, "EEE d MMM", { locale: es })}</p></div>
        <div><p className="text-xs text-slate-500">Horario</p><p className="mt-1 font-semibold text-indigo-600">{format(startsAt, "HH:mm")}</p></div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-1.5 truncate text-sm text-slate-500"><Phone className="size-3.5 shrink-0" /> {appointment.clientPhone}</p>
        {appointment.status !== "cancelled" && (
          <Button type="button" variant="outline" size="sm" disabled={isCancelling} onClick={() => onCancel(appointment.id)}>
            {isCancelling ? "Cancelando…" : "Cancelar"}
          </Button>
        )}
      </div>
    </article>
  );
}

function ClientAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-indigo-100 font-bold text-indigo-700">
      {initial || <UserRound className="size-4" />}
    </span>
  );
}

function AppointmentStatus({ status }: { status: string }) {
  const isCancelled = status === "cancelled";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize", isCancelled ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700")}>
      <span className={cn("size-1.5 rounded-full", isCancelled ? "bg-rose-500" : "bg-amber-500")} />
      {isCancelled ? "Cancelado" : "Pendiente"}
    </span>
  );
}

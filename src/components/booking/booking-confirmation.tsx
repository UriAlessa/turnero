import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, CalendarDays } from "lucide-react";

export type BookingConfirmationData = {
  code: string;
  serviceName: string;
  date: string;
  time: string;
};

type BookingConfirmationProps = {
  confirmation: BookingConfirmationData;
  onNewBooking: () => void;
};

export const BookingConfirmation = ({
  confirmation,
  onNewBooking,
}: BookingConfirmationProps) => {
  return (
    <section className="mt-10 rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-xl shadow-emerald-100/60 sm:p-8">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
        <Check className="size-7" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
        Reserva confirmada
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-950">
        ¡Tu turno fue reservado!
      </h2>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
        <p className="text-sm text-slate-500">Servicio</p>
        <p className="font-semibold text-slate-950">
          {confirmation.serviceName}
        </p>

        <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarDays className="size-4" /> Fecha y horario
        </p>
        <p className="font-semibold text-slate-950">
          {format(new Date(`${confirmation.date}T12:00:00`), "dd/MM/yyyy")} ·{" "}
          {confirmation.time}
        </p>

        <p className="mt-4 text-sm text-slate-500">Código de confirmación</p>
        <p className="mt-1 break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm font-semibold text-indigo-700">
          {confirmation.code}
        </p>
      </div>

      <p className="mt-5 text-sm text-slate-600">
        Guardá este código por si necesitás consultar tu reserva.
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-6"
        onClick={onNewBooking}
      >
        Reservar otro turno
      </Button>
    </section>
  );
};

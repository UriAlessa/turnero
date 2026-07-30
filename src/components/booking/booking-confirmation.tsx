import { format } from "date-fns";
import { Button } from "@/components/ui/button";

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
    <section className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-6 text-center shadow-sm">
      <p className="text-sm font-semibold text-green-700">RESERVA CONFIRMADA</p>

      <h2 className="mt-2 text-2xl font-bold text-slate-950">
        ¡Tu turno fue reservado!
      </h2>

      <div className="mt-6 rounded-xl bg-white p-5 text-left">
        <p className="text-sm text-slate-500">Servicio</p>
        <p className="font-semibold text-slate-950">
          {confirmation.serviceName}
        </p>

        <p className="mt-4 text-sm text-slate-500">Fecha y horario</p>
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

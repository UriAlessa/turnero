import { format } from "date-fns";
import { type SyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type BookingReservationFormProps = {
  serviceName: string;
  selectedDate: Date;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
  isSubmitting: boolean;
  onClientNameChange: (value: string) => void;
  onClientPhoneChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
  onBack: () => void;
};

export const BookingReservationForm = ({
  serviceName,
  selectedDate,
  selectedTime,
  clientName,
  clientPhone,
  isSubmitting,
  onClientNameChange,
  onClientPhoneChange,
  onSubmit,
  onBack,
}: BookingReservationFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Último paso
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            Confirmá tu reserva
          </h3>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="shrink-0 gap-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Fecha y horario</span>
        </Button>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        <p>
          <span className="font-medium">Servicio:</span> {serviceName}
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
            minLength={2}
            maxLength={100}
            type="text"
            value={clientName}
            onChange={(event) => onClientNameChange(event.target.value)}
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
            onChange={(event) => onClientPhoneChange(event.target.value)}
            placeholder="Ej. 11 1234-5678"
            minLength={6}
            maxLength={30}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Reservando..." : "Confirmar turno"}
        </Button>
      </div>
    </form>
  );
};

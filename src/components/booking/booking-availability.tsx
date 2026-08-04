import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Clock3, LoaderCircle } from "lucide-react";

type BookingAvailabilityProps = {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  slots: string[];
  isLoadingSlots: boolean;
  slotsError: string | null;
  today: Date;
  onSelectDate: (date: Date | undefined) => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
};

export const BookingAvailability = ({
  selectedDate,
  selectedTime,
  slots,
  isLoadingSlots,
  slotsError,
  today,
  onSelectDate,
  onSelectTime,
  onBack,
}: BookingAvailabilityProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm">
            2
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Segundo paso
            </p>
            <h3 className="text-xl font-semibold text-slate-950">
              Elegí fecha y horario
            </h3>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="shrink-0 gap-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Servicio</span>
        </Button>
      </div>

      <div className="mt-6 flex justify-center rounded-xl bg-slate-50 p-2 sm:p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={{ before: today }}
          locale={es}
        />
      </div>

      {selectedDate && (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h4 className="flex items-center gap-2 font-semibold text-slate-950">
            <Clock3 className="size-4 text-indigo-600" /> Horarios disponibles
          </h4>

          {isLoadingSlots ? (
            <div
              className="mt-3 flex items-center gap-3 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700"
              role="status"
              aria-live="polite"
            >
              <LoaderCircle className="size-5 animate-spin" />
              Consultando horarios disponibles…
            </div>
          ) : slotsError ? (
            <p
              className="mt-3 rounded-xl bg-red-50 p-4 text-sm text-red-700"
              role="alert"
            >
              {slotsError}
            </p>
          ) : slots.length === 0 ? (
            <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No hay horarios disponibles para este día.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
              {slots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={selectedTime === slot ? "default" : "outline"}
                  onClick={() => onSelectTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type BookingAvailabilityProps = {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  slots: string[];
  today: Date;
  onSelectDate: (date: Date | undefined) => void;
  onSelectTime: (time: string) => void;
};

export const BookingAvailability = ({
  selectedDate,
  selectedTime,
  slots,
  today,
  onSelectDate,
  onSelectTime,
}: BookingAvailabilityProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-950">Elegí una fecha</h3>

      <div className="mt-4 flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={{ before: today }}
          locale={es}
        />
      </div>

      {selectedDate && (
        <section className="mt-6 border-t border-slate-200 pt-6">
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
                  onClick={() => onSelectTime(slot)}
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
    </div>
  );
};

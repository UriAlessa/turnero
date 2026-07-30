import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type BusinessHour = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type BusinessHoursFormProps = {
  businessHours: BusinessHour[];
  isSaving: boolean;
  onToggleDay: (dayOfWeek: number) => void;
  onUpdateHour: (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string,
  ) => void;
  onSave: () => void;
};

const WEEK_DAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export const BusinessHoursForm = ({
  businessHours,
  isSaving,
  onToggleDay,
  onUpdateHour,
  onSave,
}: BusinessHoursFormProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">
        Horarios de atención
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Elegí los días y horarios en los que recibís reservas.
      </p>

      <div className="mt-6 space-y-3">
        {WEEK_DAYS.map((day) => {
          const hour = businessHours.find(
            (item) => item.dayOfWeek === day.value,
          );

          return (
            <div
              key={day.value}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <label className="flex items-center gap-3 font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={Boolean(hour)}
                  onChange={() => onToggleDay(day.value)}
                  className="size-4 accent-indigo-600"
                />
                {day.label}
              </label>

              {hour ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={hour.startTime}
                    onChange={(event) =>
                      onUpdateHour(day.value, "startTime", event.target.value)
                    }
                    className="w-28"
                  />
                  <span className="text-sm text-slate-500">a</span>
                  <Input
                    type="time"
                    value={hour.endTime}
                    onChange={(event) =>
                      onUpdateHour(day.value, "endTime", event.target.value)
                    }
                    className="w-28"
                  />
                </div>
              ) : (
                <span className="text-sm text-slate-500">Cerrado</span>
              )}
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        className="mt-6 w-full"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Guardando..." : "Guardar horarios"}
      </Button>
    </div>
  );
};

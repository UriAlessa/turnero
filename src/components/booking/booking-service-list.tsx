import { Button } from "@/components/ui/button";
import { Check, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type BookingService = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};

type BookingServiceListProps = {
  services: BookingService[];
  selectedServiceId: string | null;
  onSelectService: (serviceId: string) => void;
};

export const BookingServiceList = ({
  services,
  selectedServiceId,
  onSelectService,
}: BookingServiceListProps) => {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm">
          1
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Primer paso
          </p>
          <h2 className="text-xl font-semibold text-slate-950">
            Elegí un servicio
          </h2>
        </div>
      </div>

      {services.length === 0 ? (
        <p className="text-slate-500">
          Este negocio aún no tiene servicios configurados.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;

            return (
          <div
            key={service.id}
            className={cn(
              "group relative flex flex-col justify-between gap-5 rounded-2xl border bg-white p-5 shadow-sm transition-all",
              isSelected
                ? "border-indigo-500 ring-4 ring-indigo-100"
                : "border-slate-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md",
            )}
          >
            {isSelected && (
              <span className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-indigo-600 text-white">
                <Check className="size-4" />
              </span>
            )}
            <div>
              <h3 className="pr-8 text-lg font-semibold text-slate-950">
                {service.name}
              </h3>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-500">
                <Clock3 className="size-4" /> {service.durationMin} minutos
              </p>
            </div>

            <div className="flex items-end justify-between gap-4">
              <p className="text-xl font-bold tracking-tight text-slate-950">
                ${service.price.toLocaleString()}
              </p>
              <Button
                variant={isSelected ? "default" : "outline"}
                onClick={() => onSelectService(service.id)}
              >
                {isSelected ? "Seleccionado" : "Elegir"}
              </Button>
            </div>
          </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

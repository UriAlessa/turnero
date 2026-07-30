import { Button } from "@/components/ui/button";

export type BookingService = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};

type BookingServiceListProps = {
  services: BookingService[];
  onSelectService: (serviceId: string) => void;
};

export const BookingServiceList = ({
  services,
  onSelectService,
}: BookingServiceListProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-slate-950">
        Nuestros servicios
      </h2>

      {services.length === 0 ? (
        <p className="text-slate-500">
          Este negocio aún no tiene servicios configurados.
        </p>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200"
          >
            <div>
              <h3 className="font-semibold text-slate-950">{service.name}</h3>
              <p className="text-sm text-slate-500">
                {service.durationMin} minutos • $
                {service.price.toLocaleString()}
              </p>
            </div>

            <Button onClick={() => onSelectService(service.id)}>
              Reservar
            </Button>
          </div>
        ))
      )}
    </>
  );
};

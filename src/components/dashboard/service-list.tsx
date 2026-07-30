import { type SyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  isActive: boolean;
};

type ServiceListProps = {
  services: Service[];
  editingServiceId: string | null;
  updatingServiceId: string | null;
  editServiceName: string;
  editServiceDuration: string;
  editServicePrice: string;
  onStartEdit: (service: Service) => void;
  onCancelEdit: () => void;
  onEditNameChange: (value: string) => void;
  onEditDurationChange: (value: string) => void;
  onEditPriceChange: (value: string) => void;
  onUpdateService: (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => void;
  onToggleService: (service: Service) => void;
};

export const ServiceList = ({
  services,
  editingServiceId,
  updatingServiceId,
  editServiceName,
  editServiceDuration,
  editServicePrice,
  onStartEdit,
  onCancelEdit,
  onEditNameChange,
  onEditDurationChange,
  onEditPriceChange,
  onUpdateService,
  onToggleService,
}: ServiceListProps) => {
  if (services.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Tus servicios</h2>

      <div className="mt-4 space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
          >
            {editingServiceId === service.id ? (
              <form
                onSubmit={onUpdateService}
                className="w-full space-y-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4"
              >
                <div className="space-y-2">
                  <Label htmlFor={`edit-name-${service.id}`}>Nombre</Label>
                  <Input
                    id={`edit-name-${service.id}`}
                    required
                    value={editServiceName}
                    onChange={(event) => onEditNameChange(event.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-duration-${service.id}`}>
                      Duración (minutos)
                    </Label>
                    <Input
                      id={`edit-duration-${service.id}`}
                      type="number"
                      min="1"
                      required
                      value={editServiceDuration}
                      onChange={(event) =>
                        onEditDurationChange(event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-price-${service.id}`}>
                      Precio ($)
                    </Label>
                    <Input
                      id={`edit-price-${service.id}`}
                      type="number"
                      min="0"
                      required
                      value={editServicePrice}
                      onChange={(event) =>
                        onEditPriceChange(event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updatingServiceId === service.id}
                  >
                    {updatingServiceId === service.id
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancelEdit}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold text-slate-950">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {service.durationMin} min • $
                    {service.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={
                      service.isActive
                        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                        : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                    }
                  >
                    {service.isActive ? "Activo" : "Inactivo"}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onStartEdit(service)}
                  >
                    Editar
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={updatingServiceId === service.id}
                    onClick={() => onToggleService(service)}
                  >
                    {updatingServiceId === service.id
                      ? "Guardando..."
                      : service.isActive
                        ? "Desactivar"
                        : "Activar"}
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

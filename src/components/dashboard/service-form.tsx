import { type SyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ServiceFormProps = {
  serviceName: string;
  serviceDuration: string;
  servicePrice: string;
  isCreating: boolean;
  onServiceNameChange: (value: string) => void;
  onServiceDurationChange: (value: string) => void;
  onServicePriceChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
};

export const ServiceForm = ({
  serviceName,
  serviceDuration,
  servicePrice,
  isCreating,
  onServiceNameChange,
  onServiceDurationChange,
  onServicePriceChange,
  onSubmit,
}: ServiceFormProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Agregar servicio</h2>
      <p className="mt-1 text-sm text-slate-600">
        Definí los servicios que ofrecés.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceName">Nombre del servicio</Label>
          <Input
            id="serviceName"
            placeholder="Ej. Corte de cabello"
            required
            value={serviceName}
            onChange={(event) => onServiceNameChange(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serviceDuration">Duración (minutos)</Label>
            <Input
              id="serviceDuration"
              type="number"
              placeholder="Ej. 45"
              required
              value={serviceDuration}
              onChange={(event) => onServiceDurationChange(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="servicePrice">Precio ($)</Label>
            <Input
              id="servicePrice"
              type="number"
              placeholder="Ej. 5000"
              required
              value={servicePrice}
              onChange={(event) => onServicePriceChange(event.target.value)}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isCreating}>
          {isCreating ? "Agregando..." : "Agregar servicio"}
        </Button>
      </form>
    </div>
  );
};

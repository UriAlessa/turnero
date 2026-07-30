import { type SyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BusinessSetupFormProps = {
  businessName: string;
  businessDescription: string;
  isCreating: boolean;
  onBusinessNameChange: (value: string) => void;
  onBusinessDescriptionChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
};

export const BusinessSetupForm = ({
  businessName,
  businessDescription,
  isCreating,
  onBusinessNameChange,
  onBusinessDescriptionChange,
  onSubmit,
}: BusinessSetupFormProps) => {
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">
        Configurá tu negocio
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Creá tu perfil público para que los clientes puedan reservar.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del negocio</Label>
          <Input
            id="name"
            placeholder="Ej. Barbería Pepita"
            required
            value={businessName}
            onChange={(event) => onBusinessNameChange(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Input
            id="description"
            placeholder="Ej. Los mejores cortes de la ciudad"
            value={businessDescription}
            onChange={(event) =>
              onBusinessDescriptionChange(event.target.value)
            }
          />
        </div>

        <Button type="submit" className="w-full" disabled={isCreating}>
          {isCreating ? "Creando..." : "Crear mi negocio"}
        </Button>
      </form>
    </div>
  );
};

import { useCallback, useState, type SyntheticEvent } from "react";
import { toast } from "sonner";

export type Business = {
  id: string;
  slug: string;
  name: string;
  ownerId: string;
};

export const useBusiness = () => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await fetch("/api/business");

      if (!response.ok) {
        throw new Error("No se pudo obtener el negocio");
      }

      const data = await response.json();

      if (!data.business) {
        return null;
      }

      setBusiness(data.business);
      return data.business as Business;
    } catch (error) {
      console.error("Error al buscar negocio:", error);
      return null;
    }
  }, []);

  const createBusiness = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    setIsCreatingBusiness(true);

    try {
      const slug = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const response = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: businessName,
          description: businessDescription,
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Error al crear el negocio");
      }

      setBusiness(data.business);
      toast.success("¡Negocio creado con éxito!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Hubo un error al crear el negocio";

      toast.error(message);
    } finally {
      setIsCreatingBusiness(false);
    }
  };

  return {
    business,
    businessName,
    businessDescription,
    isCreatingBusiness,
    setBusinessName,
    setBusinessDescription,
    fetchBusiness,
    createBusiness,
  };
};

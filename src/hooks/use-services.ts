import { useCallback, useState, type SyntheticEvent } from "react";
import { toast } from "sonner";
import type { Service } from "@/components/dashboard/service-list";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(
    null,
  );

  const [serviceName, setServiceName] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [servicePrice, setServicePrice] = useState("");

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceName, setEditServiceName] = useState("");
  const [editServiceDuration, setEditServiceDuration] = useState("");
  const [editServicePrice, setEditServicePrice] = useState("");

  const fetchServices = useCallback(async (businessId: string) => {
    try {
      const response = await fetch(`/api/service?businessId=${businessId}`);

      if (!response.ok) {
        throw new Error("No se pudieron obtener los servicios");
      }

      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
    }
  }, []);

  const createService = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
    businessId: string,
  ) => {
    event.preventDefault();
    setIsCreatingService(true);

    try {
      const response = await fetch("/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: serviceName,
          durationMin: serviceDuration,
          price: servicePrice,
          businessId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Error al crear el servicio");
      }

      toast.success("¡Servicio agregado!");
      setServiceName("");
      setServiceDuration("");
      setServicePrice("");

      await fetchServices(businessId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Hubo un error al crear el servicio";

      toast.error(message);
    } finally {
      setIsCreatingService(false);
    }
  };

  const toggleService = async (service: Service) => {
    setUpdatingServiceId(service.id);

    try {
      const response = await fetch(`/api/service/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !service.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo actualizar el servicio");
      }

      setServices((currentServices) =>
        currentServices.map((currentService) =>
          currentService.id === service.id
            ? { ...currentService, isActive: data.service.isActive }
            : currentService,
        ),
      );

      toast.success(data.message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el servicio";

      toast.error(message);
    } finally {
      setUpdatingServiceId(null);
    }
  };

  const startEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setEditServiceName(service.name);
    setEditServiceDuration(String(service.durationMin));
    setEditServicePrice(String(service.price));
  };

  const cancelEditService = () => {
    setEditingServiceId(null);
  };

  const updateService = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();

    if (!editingServiceId) {
      return;
    }

    setUpdatingServiceId(editingServiceId);

    try {
      const response = await fetch(`/api/service/${editingServiceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editServiceName,
          durationMin: Number(editServiceDuration),
          price: Number(editServicePrice),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo editar el servicio");
      }

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === editingServiceId ? data.service : service,
        ),
      );

      setEditingServiceId(null);
      toast.success("Servicio actualizado correctamente");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo editar el servicio";

      toast.error(message);
    } finally {
      setUpdatingServiceId(null);
    }
  };

  return {
    services,
    isCreatingService,
    updatingServiceId,
    serviceName,
    serviceDuration,
    servicePrice,
    editingServiceId,
    editServiceName,
    editServiceDuration,
    editServicePrice,
    setServiceName,
    setServiceDuration,
    setServicePrice,
    setEditServiceName,
    setEditServiceDuration,
    setEditServicePrice,
    fetchServices,
    createService,
    toggleService,
    startEditService,
    cancelEditService,
    updateService,
  };
};

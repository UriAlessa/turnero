import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { BusinessHour } from "@/components/dashboard/business-hours-form";

export const useBusinessHours = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [isSavingHours, setIsSavingHours] = useState(false);

  const fetchBusinessHours = useCallback(async (businessId: string) => {
    try {
      const response = await fetch(
        `/api/business-hours?businessId=${businessId}`,
      );

      if (!response.ok) {
        throw new Error("No se pudieron obtener los horarios");
      }

      const data = await response.json();
      setBusinessHours(data.hours);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
    }
  }, []);

  const toggleBusinessDay = (dayOfWeek: number) => {
    setBusinessHours((currentHours) => {
      const existingHour = currentHours.find(
        (hour) => hour.dayOfWeek === dayOfWeek,
      );

      if (existingHour) {
        return currentHours.filter((hour) => hour.dayOfWeek !== dayOfWeek);
      }

      return [
        ...currentHours,
        {
          dayOfWeek,
          startTime: "09:00",
          endTime: "18:00",
        },
      ];
    });
  };

  const updateBusinessHour = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setBusinessHours((currentHours) =>
      currentHours.map((hour) =>
        hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour,
      ),
    );
  };

  const saveBusinessHours = async (businessId: string) => {
    setIsSavingHours(true);

    try {
      const response = await fetch("/api/business-hours", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          hours: businessHours,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudieron guardar los horarios");
      }

      setBusinessHours(data.hours);
      toast.success("Horarios guardados correctamente");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los horarios";

      toast.error(message);
    } finally {
      setIsSavingHours(false);
    }
  };

  return {
    businessHours,
    isSavingHours,
    fetchBusinessHours,
    toggleBusinessDay,
    updateBusinessHour,
    saveBusinessHours,
  };
};

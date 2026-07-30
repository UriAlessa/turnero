import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const businessId = searchParams.get("businessId");
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");

    if (!businessId || !serviceId || !date) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios" },
        { status: 400 },
      );
    }

    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 },
      );
    }

    const serviceDuration = service.durationMin;

    const selectedDate = new Date(`${date}T12:00:00Z`);

    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "La fecha no es válida" },
        { status: 400 },
      );
    }

    const dayOfWeek = selectedDate.getUTCDay();

    const businessHours = await prisma.businessHours.findUnique({
      where: {
        businessId_dayOfWeek: {
          businessId,
          dayOfWeek,
        },
      },
    });

    if (!businessHours) {
      return NextResponse.json({ slots: [] });
    }

    const dayStart = new Date(`${date}T00:00:00-03:00`);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        businessId,
        startsAt: {
          gte: dayStart,
          lt: dayEnd,
        },
        status: {
          not: "cancelled",
        },
      },
      include: {
        service: {
          select: {
            durationMin: true,
          },
        },
      },
    });

    const startMinutes = timeToMinutes(businessHours.startTime);
    const endMinutes = timeToMinutes(businessHours.endTime);
    const slots: string[] = [];

    for (
      let slotStart = startMinutes;
      slotStart + serviceDuration <= endMinutes;
      slotStart += serviceDuration
    ) {
      const slot = minutesToTime(slotStart);

      const candidateStart = new Date(`${date}T${slot}:00-03:00`);
      const candidateEnd = new Date(
        candidateStart.getTime() + service.durationMin * 60 * 1000,
      );

      const hasOverlap = appointments.some((appointment) => {
        const appointmentStart = appointment.startsAt;

        const appointmentDuration =
          appointment.serviceDurationMin ?? appointment.service.durationMin;

        const appointmentEnd = new Date(
          appointmentStart.getTime() + appointmentDuration * 60 * 1000,
        );

        return (
          candidateStart < appointmentEnd && candidateEnd > appointmentStart
        );
      });

      if (!hasOverlap) {
        slots.push(slot);
      }
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error al calcular disponibilidad:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const { businessId, serviceId, clientName, clientPhone, date, time } = body;

    if (
      typeof businessId !== "string" ||
      typeof serviceId !== "string" ||
      typeof clientName !== "string" ||
      typeof clientPhone !== "string" ||
      typeof date !== "string" ||
      typeof time !== "string"
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
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
        { error: "El servicio no existe para este negocio" },
        { status: 404 },
      );
    }

    const startsAt = new Date(`${date}T${time}:00-03:00`);

    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.json(
        { error: "La fecha u horario no son válidos" },
        { status: 400 },
      );
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

    const endsAt = new Date(
      startsAt.getTime() + service.durationMin * 60 * 1000,
    );

    const hasOverlap = appointments.some((appointment) => {
      const appointmentDuration =
        appointment.serviceDurationMin ?? appointment.service.durationMin;

      const appointmentEndsAt = new Date(
        appointment.startsAt.getTime() + appointmentDuration * 60 * 1000,
      );

      return startsAt < appointmentEndsAt && endsAt > appointment.startsAt;
    });

    const selectedDate = new Date(`${date}T12:00:00Z`);
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
      return NextResponse.json(
        { error: "El negocio no atiende ese día" },
        { status: 400 },
      );
    }

    const [hours, minutes] = time.split(":").map(Number);
    const requestedStartMinutes = hours * 60 + minutes;

    const [openingHours, openingMinutes] = businessHours.startTime
      .split(":")
      .map(Number);

    const [closingHours, closingMinutes] = businessHours.endTime
      .split(":")
      .map(Number);

    const openingMinutesTotal = openingHours * 60 + openingMinutes;
    const closingMinutesTotal = closingHours * 60 + closingMinutes;
    const requestedEndMinutes = requestedStartMinutes + service.durationMin;

    const isWithinBusinessHours =
      requestedStartMinutes >= openingMinutesTotal &&
      requestedEndMinutes <= closingMinutesTotal &&
      (requestedStartMinutes - openingMinutesTotal) % service.durationMin === 0;

    if (!isWithinBusinessHours) {
      return NextResponse.json(
        { error: "El horario seleccionado no está disponible" },
        { status: 400 },
      );
    }

    if (hasOverlap) {
      return NextResponse.json(
        { error: "Ese horario ya no está disponible" },
        { status: 409 },
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        confirmationCode: crypto.randomUUID(),
        serviceName: service.name,
        serviceDurationMin: service.durationMin,
        servicePrice: service.price,
        startsAt,
        businessId,
        serviceId,
      },
    });

    return NextResponse.json(
      {
        message: "Turno creado correctamente",
        appointment,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ese horario ya fue reservado" },
        { status: 409 },
      );
    }

    console.error("Error al crear turno:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

export const GET = async (request: Request) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Falta el businessId" }, { status: 400 });
  }

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });

  if (!business) {
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 },
    );
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        businessId,
        startsAt: {
          gte: new Date(),
        },
      },
      include: {
        service: {
          select: {
            name: true,
            durationMin: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error al obtener turnos:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

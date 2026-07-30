import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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
      const appointmentEndsAt = new Date(
        appointment.startsAt.getTime() +
          appointment.service.durationMin * 60 * 1000,
      );

      return startsAt < appointmentEndsAt && endsAt > appointment.startsAt;
    });

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

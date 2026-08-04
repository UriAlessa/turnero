import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  intervalsOverlap,
  isWithinBusinessHours,
  parseAppointmentDate,
} from "@/lib/booking-rules";

const MAX_TRANSACTION_ATTEMPTS = 3;

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
        isActive: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "El servicio no existe para este negocio" },
        { status: 404 },
      );
    }

    const startsAt = parseAppointmentDate(date, time);

    if (!startsAt) {
      return NextResponse.json(
        { error: "La fecha u horario no son válidos" },
        { status: 400 },
      );
    }

    if (startsAt <= new Date()) {
      return NextResponse.json(
        { error: "El turno debe ser para una fecha futura" },
        { status: 400 },
      );
    }

    const dayStart = new Date(`${date}T00:00:00-03:00`);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

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

    if (
      !isWithinBusinessHours(
        time,
        service.durationMin,
        businessHours.startTime,
        businessHours.endTime,
      )
    ) {
      return NextResponse.json(
        { error: "El horario seleccionado no está disponible" },
        { status: 400 },
      );
    }

    const normalizedClientName = clientName.trim();
    const normalizedClientPhone = clientPhone.trim();

    if (
      normalizedClientName.length < 2 ||
      normalizedClientName.length > 100 ||
      normalizedClientPhone.length < 6 ||
      normalizedClientPhone.length > 30
    ) {
      return NextResponse.json(
        { error: "El nombre o teléfono no son válidos" },
        { status: 400 },
      );
    }

    let appointment;

    for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
      try {
        appointment = await prisma.$transaction(
          async (tx) => {
            const appointments = await tx.appointment.findMany({
              where: {
                businessId,
                startsAt: { gte: dayStart, lt: dayEnd },
                status: { not: "cancelled" },
              },
              include: { service: { select: { durationMin: true } } },
            });

            const hasOverlap = appointments.some((existingAppointment) =>
              intervalsOverlap(
                startsAt,
                service.durationMin,
                existingAppointment.startsAt,
                existingAppointment.serviceDurationMin ??
                  existingAppointment.service.durationMin,
              ),
            );

            if (hasOverlap) {
              throw new AppointmentConflictError();
            }

            return tx.appointment.create({
              data: {
                clientName: normalizedClientName,
                clientPhone: normalizedClientPhone,
                confirmationCode: crypto.randomUUID(),
                serviceName: service.name,
                serviceDurationMin: service.durationMin,
                servicePrice: service.price,
                startsAt,
                businessId,
                serviceId,
              },
            });
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        break;
      } catch (error) {
        if (error instanceof AppointmentConflictError) {
          return NextResponse.json(
            { error: "Ese horario ya no está disponible" },
            { status: 409 },
          );
        }

        const shouldRetry =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034" &&
          attempt < MAX_TRANSACTION_ATTEMPTS;

        if (!shouldRetry) {
          throw error;
        }
      }
    }

    if (!appointment) {
      return NextResponse.json(
        { error: "Ese horario ya no está disponible" },
        { status: 409 },
      );
    }

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

class AppointmentConflictError extends Error {}

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

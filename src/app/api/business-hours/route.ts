import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Falta el businessId" }, { status: 400 });
  }

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      ownerId: userId,
    },
  });

  if (!business) {
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 },
    );
  }

  try {
    const hours = await prisma.businessHours.findMany({
      where: { businessId },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json({ hours }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener horarios del negocio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

export const PUT = async (request: Request) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { businessId, hours } = body;

  if (!businessId || !Array.isArray(hours)) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 },
    );
  }

  const hasValidHours = hours.every(
    (hour) =>
      Number.isInteger(hour.dayOfWeek) &&
      hour.dayOfWeek >= 0 &&
      hour.dayOfWeek <= 6 &&
      typeof hour.startTime === "string" &&
      typeof hour.endTime === "string" &&
      /^\d{2}:\d{2}$/.test(hour.startTime) &&
      /^\d{2}:\d{2}$/.test(hour.endTime) &&
      hour.startTime < hour.endTime,
  );

  const hasUniqueDays =
    new Set(hours.map((hour) => hour.dayOfWeek)).size === hours.length;

  if (!hasValidHours || !hasUniqueDays) {
    return NextResponse.json(
      { error: "Los horarios enviados no son válidos" },
      { status: 400 },
    );
  }

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      ownerId: userId,
    },
    select: { id: true },
  });

  if (!business) {
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 },
    );
  }

  try {
    const updatedHours = await prisma.$transaction(async (tx) => {
      await tx.businessHours.deleteMany({
        where: { businessId },
      });

      if (hours.length > 0) {
        await tx.businessHours.createMany({
          data: hours.map(
            ({
              dayOfWeek,
              startTime,
              endTime,
            }: {
              dayOfWeek: number;
              startTime: string;
              endTime: string;
            }) => ({
              businessId,
              dayOfWeek,
              startTime,
              endTime,
            }),
          ),
        });
      }

      return tx.businessHours.findMany({
        where: { businessId },
        orderBy: { dayOfWeek: "asc" },
      });
    });

    return NextResponse.json({ hours: updatedHours }, { status: 200 });
  } catch (error) {
    console.error("Error al guardar horarios:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { serviceId } = await params;
  const body = await request.json();

  const { name, durationMin, price, isActive } = body;

  const updateData: {
    name?: string;
    durationMin?: number;
    price?: number;
    isActive?: boolean;
  } = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "El nombre del servicio no es válido" },
        { status: 400 },
      );
    }

    updateData.name = name.trim();
  }

  if (durationMin !== undefined) {
    if (
      typeof durationMin !== "number" ||
      !Number.isInteger(durationMin) ||
      durationMin <= 0
    ) {
      return NextResponse.json(
        { error: "La duración no es válida" },
        { status: 400 },
      );
    }

    updateData.durationMin = durationMin;
  }

  if (price !== undefined) {
    if (typeof price !== "number" || !Number.isInteger(price) || price < 0) {
      return NextResponse.json(
        { error: "El precio no es válido" },
        { status: 400 },
      );
    }

    updateData.price = price;
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "El estado del servicio no es válido" },
        { status: 400 },
      );
    }

    updateData.isActive = isActive;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No hay datos para actualizar" },
      { status: 400 },
    );
  }

  try {
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        business: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!service || service.business.ownerId !== userId) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 },
      );
    }

    const updatedService = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: updateData,
    });

    return NextResponse.json({
      message: "Servicio actualizado correctamente",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error al actualizar servicio:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

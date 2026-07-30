import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// Esta función se ejecuta cuando el frontend hace un POST a /api/service
export const GET = async (request: Request) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Falta el businessId" },
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

    const services = await prisma.service.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.log("Error al obtener servicios: ", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

// POST: Crear un nuevo servicio

export const POST = async (request: Request) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { name, durationMin, price, businessId } = body;

    if (!name || !durationMin || !price || !businessId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
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

    const newService = await prisma.service.create({
      data: {
        name,
        durationMin: parseInt(durationMin),
        price: parseInt(price),
        businessId,
      },
    });

    return NextResponse.json(
      { message: "Servicio creado", service: newService },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno del servidor";
    console.error("Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

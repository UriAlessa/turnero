import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Buscar negocio por ownerId
export const GET = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: userId },
    });

    return NextResponse.json({ business }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno del servidor";
    console.error("Error al buscar negocio:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

// POST: Crear un nuevo negocio
export const POST = async (request: Request) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    const existingBusiness = await prisma.business.findUnique({
      where: { slug },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "Ya existe un negocio con ese nombre. Probá con otro." },
        { status: 409 },
      );
    }

    const newBusiness = await prisma.business.create({
      data: {
        name,
        description,
        slug,
        ownerId: userId,
      },
    });

    return NextResponse.json(
      {
        message: "Negocio creado con éxito",
        business: newBusiness,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno del servidor";
    console.error("Error al crear negocio:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

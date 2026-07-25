import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Esta función se ejecuta cuando el frontend hace un POST a /api/business

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, description, slug, ownerEmail } = body;

    // Validar si faltan datos
    if (!name || !slug || !ownerEmail) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    // Buscar un negocio existente con ese nombre
    const existingBusiness = await prisma.business.findUnique({
      where: { slug },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "Ya existe un negocio con ese nombre. Probá con otro." },
        { status: 400 },
      );
    }

    const newBusiness = await prisma.business.create({
      data: {
        name,
        description,
        slug,
        ownerEmail,
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
    console.error("Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, email, password } = body as Record<string, unknown>;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      (name !== undefined && typeof name !== "string")
    ) {
      return NextResponse.json(
        { error: "Los datos enviados no son válidos" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (
      !EMAIL_PATTERN.test(normalizedEmail) ||
      normalizedEmail.length > 254 ||
      password.length < 8 ||
      password.length > 72 ||
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      return NextResponse.json(
        {
          error:
            "Ingresá un nombre y email válidos, y una contraseña de 8 a 72 caracteres",
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: normalizedName,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Usuario creado con éxito",
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error al registrar usuario:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

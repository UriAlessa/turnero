import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> },
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { appointmentId } = await params;
  const body = await request.json();

  if (body.status !== "cancelled") {
    return NextResponse.json(
      { error: "El estado solicitado no es válido" },
      { status: 400 },
    );
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        business: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!appointment || appointment.business.ownerId !== userId) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 },
      );
    }

    if (appointment.status === "cancelled") {
      return NextResponse.json(
        { error: "El turno ya estaba cancelado" },
        { status: 400 },
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: "cancelled",
      },
    });

    return NextResponse.json({
      message: "Turno cancelado correctamente",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error al cancelar turno:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
};

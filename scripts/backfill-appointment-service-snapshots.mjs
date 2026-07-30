import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const appointments = await prisma.appointment.findMany({
    where: {
      OR: [
        { serviceName: null },
        { serviceDurationMin: null },
        { servicePrice: null },
      ],
    },
    include: {
      service: true,
    },
  });

  for (const appointment of appointments) {
    await prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        serviceName: appointment.service.name,
        serviceDurationMin: appointment.service.durationMin,
        servicePrice: appointment.service.price,
      },
    });
  }

  console.log(
    `Se actualizaron ${appointments.length} turnos con los datos de su servicio.`,
  );
}

main()
  .catch((error) => {
    console.error("Error al completar los snapshots:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

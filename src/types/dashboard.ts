export type Business = {
  id: string;
  slug: string;
  name: string;
  ownerId: string;
};

export type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  isActive: boolean;
};

export type BusinessHour = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  startsAt: string;
  status: string;
  serviceName: string | null;
  serviceDurationMin: number | null;
  servicePrice: number | null;
  service: {
    name: string;
    durationMin: number;
  };
};

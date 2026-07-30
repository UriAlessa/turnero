"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppointmentsList } from "@/components/dashboard/appointments-list";
import { useAppointments } from "@/hooks/use-appointments";
import { BusinessHoursForm } from "@/components/dashboard/business-hours-form";
import { useBusinessHours } from "@/hooks/use-business-hours";
import { ServiceForm } from "@/components/dashboard/service-form";
import { ServiceList } from "@/components/dashboard/service-list";
import { useServices } from "@/hooks/use-services";
import { useBusiness } from "@/hooks/use-business";
import { BusinessSetupForm } from "@/components/dashboard/business-setup-form";
import { BusinessPublicLink } from "@/components/dashboard/business-public-link";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const {
    business,
    businessName,
    businessDescription,
    isCreatingBusiness,
    setBusinessName,
    setBusinessDescription,
    fetchBusiness,
    createBusiness,
  } = useBusiness();

  const {
    businessHours,
    isSavingHours,
    fetchBusinessHours,
    toggleBusinessDay,
    updateBusinessHour,
    saveBusinessHours,
  } = useBusinessHours();

  const {
    appointments,
    cancellingAppointmentId,
    fetchAppointments,
    cancelAppointment,
  } = useAppointments();

  const {
    services,
    isCreatingService,
    updatingServiceId,
    serviceName,
    serviceDuration,
    servicePrice,
    editingServiceId,
    editServiceName,
    editServiceDuration,
    editServicePrice,
    setServiceName,
    setServiceDuration,
    setServicePrice,
    setEditServiceName,
    setEditServiceDuration,
    setEditServicePrice,
    fetchServices,
    createService,
    toggleService,
    startEditService,
    cancelEditService,
    updateService,
  } = useServices();

  const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {
      if (status !== "authenticated") {
        return;
      }

      const currentBusiness = await fetchBusiness();

      if (!currentBusiness) {
        return;
      }

      fetchServices(currentBusiness.id);
      fetchBusinessHours(currentBusiness.id);
      fetchAppointments(currentBusiness.id);
    };

    loadDashboard();
  }, [
    status,
    fetchBusiness,
    fetchServices,
    fetchBusinessHours,
    fetchAppointments,
  ]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/ingresar");
    }
  }, [status, router]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Cargando tu panel...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-950"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">
              T
            </span>
            Turnero
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-950">
          ¡Hola de nuevo! 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Sesión iniciada como:{" "}
          <span className="font-semibold text-indigo-600">
            {session.user.email}
          </span>
        </p>

        {!business ? (
          <BusinessSetupForm
            businessName={businessName}
            businessDescription={businessDescription}
            isCreating={isCreatingBusiness}
            onBusinessNameChange={setBusinessName}
            onBusinessDescriptionChange={setBusinessDescription}
            onSubmit={createBusiness}
          />
        ) : (
          <div className="mt-8 space-y-6">
            <BusinessPublicLink name={business.name} slug={business.slug} />

            <AppointmentsList
              appointments={appointments}
              cancellingAppointmentId={cancellingAppointmentId}
              onCancelAppointment={cancelAppointment}
            />

            <BusinessHoursForm
              businessHours={businessHours}
              isSaving={isSavingHours}
              onToggleDay={toggleBusinessDay}
              onUpdateHour={updateBusinessHour}
              onSave={() => saveBusinessHours(business.id)}
            />

            <ServiceForm
              serviceName={serviceName}
              serviceDuration={serviceDuration}
              servicePrice={servicePrice}
              isCreating={isCreatingService}
              onServiceNameChange={setServiceName}
              onServiceDurationChange={setServiceDuration}
              onServicePriceChange={setServicePrice}
              onSubmit={(event) => createService(event, business.id)}
            />

            <ServiceList
              services={services}
              editingServiceId={editingServiceId}
              updatingServiceId={updatingServiceId}
              editServiceName={editServiceName}
              editServiceDuration={editServiceDuration}
              editServicePrice={editServicePrice}
              onEditNameChange={setEditServiceName}
              onEditDurationChange={setEditServiceDuration}
              onEditPriceChange={setEditServicePrice}
              onStartEdit={startEditService}
              onCancelEdit={cancelEditService}
              onUpdateService={updateService}
              onToggleService={toggleService}
            />
          </div>
        )}
      </main>
    </div>
  );
}

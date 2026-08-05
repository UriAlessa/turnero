"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  Clock3,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Scissors,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { AppointmentsList } from "@/components/dashboard/appointments-list";
import { BusinessHoursForm } from "@/components/dashboard/business-hours-form";
import { ServiceForm } from "@/components/dashboard/service-form";
import { ServiceList } from "@/components/dashboard/service-list";
import { BusinessSetupForm } from "@/components/dashboard/business-setup-form";
import { useAppointments } from "@/hooks/use-appointments";
import { useBusinessHours } from "@/hooks/use-business-hours";
import { useServices } from "@/hooks/use-services";
import { useBusiness } from "@/hooks/use-business";
import { cn } from "@/lib/utils";

type DashboardTab = "overview" | "appointments" | "services" | "hours";

const DASHBOARD_TABS: Array<{
  id: DashboardTab;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard },
  { id: "appointments", label: "Turnos", icon: CalendarDays },
  { id: "services", label: "Servicios", icon: Scissors },
  { id: "hours", label: "Horarios", icon: Clock3 },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const router = useRouter();

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

  useEffect(() => {
    const loadDashboard = async () => {
      if (status !== "authenticated") return;

      const currentBusiness = await fetchBusiness();

      if (currentBusiness) {
        await Promise.all([
          fetchServices(currentBusiness.id),
          fetchBusinessHours(currentBusiness.id),
          fetchAppointments(currentBusiness.id),
        ]);
      }

      setIsLoadingDashboard(false);
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
    if (status === "unauthenticated") router.push("/ingresar");
  }, [status, router]);

  if (status === "loading" || (status === "authenticated" && isLoadingDashboard)) {
    return <DashboardLoader />;
  }

  if (!session?.user) return null;

  const activeServices = services.filter((service) => service.isActive).length;
  const todayKey = new Date().toDateString();
  const activeAppointments = appointments.filter(
    (appointment) => appointment.status !== "cancelled",
  );
  const todayAppointments = activeAppointments.filter(
    (appointment) => new Date(appointment.startsAt).toDateString() === todayKey,
  );
  const nextAppointment = activeAppointments[0];
  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-slate-950 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden min-h-screen flex-col bg-[#101525] px-4 py-6 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Link href="/" className="flex items-center gap-3 px-3 text-lg font-bold">
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-950/30">T</span>
          Turnero
        </Link>

        <DashboardNavigation activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="truncate text-sm font-semibold">{business?.name ?? "Tu negocio"}</p>
            <p className="mt-1 truncate text-xs text-slate-400">{session.user.email}</p>
          </div>
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
            <LogOut className="size-5" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-black/5 bg-[#f3f2ef]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Panel de administración</p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{business?.name ?? "Configurá tu negocio"}</h1>
            </div>
            <div className="flex items-center gap-2">
              {business && (
                <a
                  href={`/${business.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "hidden bg-white sm:inline-flex",
                  )}
                >
                  Ver página <ExternalLink className="size-4" />
                </a>
              )}
              <Button variant="outline" size="icon" className="bg-white lg:hidden" onClick={handleLogout}>
                <LogOut className="size-4" /><span className="sr-only">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="overflow-x-auto border-b border-black/5 px-4 py-3 lg:hidden">
          <div className="flex min-w-max gap-2">
            {DASHBOARD_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition", activeTab === tab.id ? "bg-[#101525] text-white" : "bg-white text-slate-600")}>
                  <Icon className="size-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {!business ? (
            <BusinessSetupForm businessName={businessName} businessDescription={businessDescription} isCreating={isCreatingBusiness} onBusinessNameChange={setBusinessName} onBusinessDescriptionChange={setBusinessDescription} onSubmit={createBusiness} />
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewGrid businessSlug={business.slug} appointments={appointments} todayCount={todayAppointments.length} nextAppointment={nextAppointment} activeServices={activeServices} totalServices={services.length} openDays={businessHours.length} cancellingAppointmentId={cancellingAppointmentId} onCancelAppointment={cancelAppointment} onNavigate={setActiveTab} />
              )}

              {activeTab === "appointments" && <AppointmentsList appointments={appointments} cancellingAppointmentId={cancellingAppointmentId} onCancelAppointment={cancelAppointment} />}

              {activeTab === "services" && (
                <div className="grid gap-6 xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.4fr)] xl:items-start">
                  <ServiceForm serviceName={serviceName} serviceDuration={serviceDuration} servicePrice={servicePrice} isCreating={isCreatingService} onServiceNameChange={setServiceName} onServiceDurationChange={setServiceDuration} onServicePriceChange={setServicePrice} onSubmit={(event) => createService(event, business.id)} />
                  <ServiceList services={services} editingServiceId={editingServiceId} updatingServiceId={updatingServiceId} editServiceName={editServiceName} editServiceDuration={editServiceDuration} editServicePrice={editServicePrice} onEditNameChange={setEditServiceName} onEditDurationChange={setEditServiceDuration} onEditPriceChange={setEditServicePrice} onStartEdit={startEditService} onCancelEdit={cancelEditService} onUpdateService={updateService} onToggleService={toggleService} />
                </div>
              )}

              {activeTab === "hours" && (
                <div className="mx-auto max-w-3xl">
                  <BusinessHoursForm businessHours={businessHours} isSaving={isSavingHours} onToggleDay={toggleBusinessDay} onUpdateHour={updateBusinessHour} onSave={() => saveBusinessHours(business.id)} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardNavigation({ activeTab, onChange }: { activeTab: DashboardTab; onChange: (tab: DashboardTab) => void }) {
  return (
    <nav className="mt-12 space-y-2" aria-label="Navegación del panel">
      {DASHBOARD_TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <button key={tab.id} type="button" onClick={() => onChange(tab.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition", activeTab === tab.id ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:bg-white/5 hover:text-white")}>
            <Icon className="size-5" /> {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

type OverviewGridProps = {
  businessSlug: string;
  appointments: Parameters<typeof AppointmentsList>[0]["appointments"];
  todayCount: number;
  nextAppointment: Parameters<typeof AppointmentsList>[0]["appointments"][number] | undefined;
  activeServices: number;
  totalServices: number;
  openDays: number;
  cancellingAppointmentId: string | null;
  onCancelAppointment: (id: string) => void;
  onNavigate: (tab: DashboardTab) => void;
};

function OverviewGrid({ businessSlug, appointments, todayCount, nextAppointment, activeServices, totalServices, openDays, cancellingAppointmentId, onCancelAppointment, onNavigate }: OverviewGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
      <button type="button" onClick={() => onNavigate("appointments")} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-6 text-left text-white shadow-xl shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 md:col-span-2 xl:col-span-5 xl:row-span-2 xl:p-8">
        <div className="absolute -right-14 -top-14 size-48 rounded-full border-[28px] border-white/10" />
        <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-indigo-100">Turnos de hoy</p><ArrowUpRight className="size-5 text-white/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" /></div>
        <p className="mt-3 text-6xl font-bold tracking-tight">{todayCount}</p>
        <div className="mt-12 rounded-2xl bg-white/15 p-4 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">Próximo turno</p>
          {nextAppointment ? (
            <div className="mt-2 flex items-end justify-between gap-4">
              <div><p className="font-semibold">{nextAppointment.clientName}</p><p className="mt-1 text-sm text-indigo-100">{nextAppointment.serviceName ?? nextAppointment.service.name}</p></div>
              <p className="text-2xl font-bold">{new Date(nextAppointment.startsAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          ) : <p className="mt-2 text-sm text-indigo-100">No hay turnos próximos.</p>}
        </div>
      </button>

      <MetricCard icon={CalendarCheck2} label="Próximos" value={appointments.filter((item) => item.status !== "cancelled").length} detail="turnos agendados" className="xl:col-span-3" tone="peach" onClick={() => onNavigate("appointments")} />
      <MetricCard icon={Scissors} label="Servicios" value={activeServices} detail={`${totalServices} configurados`} className="xl:col-span-4" tone="blue" onClick={() => onNavigate("services")} />
      <MetricCard icon={Clock3} label="Días abiertos" value={openDays} detail="por semana" className="xl:col-span-3" tone="green" onClick={() => onNavigate("hours")} />

      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 xl:col-span-4">
        <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-500">Tu espacio online</p><h2 className="mt-1 text-xl font-bold">Página de reservas</h2></div><span className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white"><ArrowUpRight className="size-5" /></span></div>
        <p className="mt-6 truncate rounded-xl bg-slate-100 px-4 py-3 font-mono text-sm text-slate-600">turnero.com/{businessSlug}</p>
        <a href={`/${businessSlug}`} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700">Abrir página pública →</a>
      </section>

      <div className="md:col-span-2 xl:col-span-8">
        <AppointmentsList appointments={appointments.slice(0, 5)} cancellingAppointmentId={cancellingAppointmentId} onCancelAppointment={onCancelAppointment} compact />
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, className, tone, onClick }: { icon: typeof CalendarCheck2; label: string; value: number; detail: string; className?: string; tone: "peach" | "blue" | "green"; onClick: () => void }) {
  const tones = { peach: "bg-[#ffe1d6] text-[#9d351d]", blue: "bg-[#dfe8ff] text-[#29499b]", green: "bg-[#dcf5e7] text-[#1f7047]" };
  return (
    <button type="button" onClick={onClick} className={cn("group rounded-3xl border border-black/5 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200", className)}>
      <div className="flex items-start justify-between gap-3"><div className={cn("grid size-11 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110", tones[tone])}><Icon className="size-5" /></div><ArrowUpRight className="size-5 text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600" /></div>
      <p className="mt-6 text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-1 flex items-end gap-2"><p className="text-4xl font-bold tracking-tight">{value}</p><p className="pb-1 text-sm text-slate-500">{detail}</p></div>
    </button>
  );
}

function DashboardLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f2ef]">
      <div className="text-center"><div className="mx-auto size-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" /><p className="mt-4 text-sm font-medium text-slate-600">Preparando tu panel…</p></div>
    </div>
  );
}

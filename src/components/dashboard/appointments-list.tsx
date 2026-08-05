"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowDownAZ,
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Search,
  UserRound,
} from "lucide-react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

type AppointmentsListProps = {
  appointments: Appointment[];
  cancellingAppointmentId: string | null;
  onCancelAppointment: (appointmentId: string) => void;
  compact?: boolean;
};

const appointmentTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
  },
});

const columnHelper = createColumnHelper<
  typeof appointmentTableFeatures,
  Appointment
>();

const appointmentColumns = columnHelper.columns([
  columnHelper.accessor("startsAt", {
    header: "Fecha y hora",
  }),
  columnHelper.accessor("clientName", {
    header: "Cliente",
  }),
  columnHelper.accessor("clientPhone", {
    header: "Teléfono",
  }),
  columnHelper.accessor(
    (appointment) => appointment.serviceName ?? appointment.service.name,
    {
      id: "service",
      header: "Servicio",
    },
  ),
  columnHelper.accessor("status", {
    header: "Estado",
    filterFn: "equalsString",
  }),
]);

const statusFilters = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Cancelados", value: "cancelled" },
] as const;

export const AppointmentsList = ({
  appointments,
  cancellingAppointmentId,
  onCancelAppointment,
  compact = false,
}: AppointmentsListProps) => {
  const table = useTable({
    features: appointmentTableFeatures,
    columns: appointmentColumns,
    data: appointments,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: compact ? 5 : 10,
      },
      sorting: [{ id: "startsAt", desc: false }],
    },
  });

  const rows = table.getRowModel().rows;
  const filteredAppointments = table.getFilteredRowModel().rows.length;
  const statusFilter =
    (table.getColumn("status")?.getFilterValue() as string | undefined) ??
    "all";
  const hasActiveFilters = Boolean(table.state.globalFilter) || statusFilter !== "all";

  return (
    <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <p className="text-sm font-medium text-slate-500">Agenda</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Próximos turnos
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {filteredAppointments} {filteredAppointments === 1 ? "turno" : "turnos"}
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CalendarX2 className="size-6" />
          </span>
          <h3 className="mt-4 font-semibold text-slate-900">
            Tu agenda está libre
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Los próximos turnos aparecerán acá cuando tus clientes reserven.
          </p>
        </div>
      ) : (
        <>
          {!compact && (
            <AppointmentTableToolbar
              searchValue={String(table.state.globalFilter ?? "")}
              statusValue={statusFilter}
              isDateSorted={Boolean(table.getColumn("startsAt")?.getIsSorted())}
              onSearchChange={(value) => {
                table.setGlobalFilter(value);
                table.setPageIndex(0);
              }}
              onStatusChange={(value) => {
                table
                  .getColumn("status")
                  ?.setFilterValue(value === "all" ? undefined : value);
                table.setPageIndex(0);
              }}
              onToggleDateSort={() =>
                table.getColumn("startsAt")?.toggleSorting()
              }
            />
          )}

          {rows.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                <Search className="size-6" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">
                No encontramos turnos
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Probá con otra búsqueda o cambiá el filtro de estado.
              </p>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    table.resetGlobalFilter();
                    table.getColumn("status")?.setFilterValue(undefined);
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-6 py-3.5">Fecha y hora</th>
                  <th scope="col" className="px-6 py-3.5">Cliente</th>
                  <th scope="col" className="px-6 py-3.5">Servicio</th>
                  <th scope="col" className="px-6 py-3.5">Estado</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ original: appointment }) => (
                  <AppointmentTableRow
                    key={appointment.id}
                    appointment={appointment}
                    isCancelling={cancellingAppointmentId === appointment.id}
                    onCancel={onCancelAppointment}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 bg-slate-100/70 p-3 md:hidden">
            {rows.map(({ original: appointment }) => (
              <AppointmentMobileCard
                key={appointment.id}
                appointment={appointment}
                isCancelling={cancellingAppointmentId === appointment.id}
                onCancel={onCancelAppointment}
              />
            ))}
          </div>
            </>
          )}

          {!compact && filteredAppointments > 0 && (
            <AppointmentTablePagination table={table} total={filteredAppointments} />
          )}
        </>
      )}
    </section>
  );
};

type AppointmentTableToolbarProps = {
  searchValue: string;
  statusValue: string;
  isDateSorted: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onToggleDateSort: () => void;
};

function AppointmentTableToolbar({
  searchValue,
  statusValue,
  isDateSorted,
  onSearchChange,
  onStatusChange,
  onToggleDateSort,
}: AppointmentTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/40 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <label className="relative block w-full lg:max-w-sm">
        <span className="sr-only">Buscar turnos</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar cliente, teléfono o servicio"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex rounded-xl border border-slate-200 bg-white p-1">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              className={cn(
                "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:flex-none",
                statusValue === filter.value
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
              )}
              aria-pressed={statusValue === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onToggleDateSort}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition",
            isDateSorted
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          <ArrowDownAZ className="size-4" />
          Ordenar por fecha
        </button>
      </div>
    </div>
  );
}

type AppointmentTableInstance = ReturnType<typeof useTable<
  typeof appointmentTableFeatures,
  Appointment
>>;

function AppointmentTablePagination({
  table,
  total,
}: {
  table: AppointmentTableInstance;
  total: number;
}) {
  const { pageIndex, pageSize } = table.state.pagination;
  const firstResult = pageIndex * pageSize + 1;
  const lastResult = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center justify-between gap-4 sm:justify-start">
        <p className="text-sm text-slate-500">
          Mostrando <span className="font-semibold text-slate-700">{firstResult}–{lastResult}</span> de{" "}
          <span className="font-semibold text-slate-700">{total}</span>
        </p>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          Por página
          <select
            value={pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="text-sm font-medium text-slate-600">
          Página {pageIndex + 1} de {Math.max(table.getPageCount(), 1)}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Página siguiente"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

type AppointmentRowProps = {
  appointment: Appointment;
  isCancelling: boolean;
  onCancel: (appointmentId: string) => void;
};

function AppointmentTableRow({ appointment, isCancelling, onCancel }: AppointmentRowProps) {
  const startsAt = new Date(appointment.startsAt);
  const serviceName = appointment.serviceName ?? appointment.service.name;
  const duration = appointment.serviceDurationMin ?? appointment.service.durationMin;

  return (
    <tr className="group border-b border-slate-200 transition-colors last:border-b-0 even:bg-slate-50/70 hover:bg-indigo-50/70">
      <td className="whitespace-nowrap px-6 py-5">
        <div className="inline-flex min-w-24 flex-col rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {format(startsAt, "EEE d MMM", { locale: es })}
          </p>
          <p className="mt-1 text-base font-bold text-indigo-600">
            {format(startsAt, "HH:mm")}
          </p>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex min-w-44 items-center gap-3">
          <ClientAvatar name={appointment.clientName} />
          <div>
            <p className="font-semibold text-slate-900">{appointment.clientName}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <Phone className="size-3.5" /> {appointment.clientPhone}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="font-medium text-slate-800">{serviceName}</p>
        <p className="mt-1 text-sm text-slate-500">{duration} min</p>
      </td>
      <td className="px-6 py-5"><AppointmentStatus status={appointment.status} /></td>
      <td className="px-6 py-5 text-right">
        {appointment.status !== "cancelled" ? (
          <Button type="button" variant="outline" size="sm" disabled={isCancelling} onClick={() => onCancel(appointment.id)}>
            {isCancelling ? "Cancelando…" : "Cancelar"}
          </Button>
        ) : <span className="text-sm text-slate-400">Sin acciones</span>}
      </td>
    </tr>
  );
}

function AppointmentMobileCard({ appointment, isCancelling, onCancel }: AppointmentRowProps) {
  const startsAt = new Date(appointment.startsAt);
  const serviceName = appointment.serviceName ?? appointment.service.name;
  const duration = appointment.serviceDurationMin ?? appointment.service.durationMin;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ClientAvatar name={appointment.clientName} />
          <div>
            <h3 className="font-semibold text-slate-900">{appointment.clientName}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{serviceName} · {duration} min</p>
          </div>
        </div>
        <AppointmentStatus status={appointment.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
        <div><p className="text-xs text-slate-500">Fecha</p><p className="mt-1 font-semibold capitalize text-slate-800">{format(startsAt, "EEE d MMM", { locale: es })}</p></div>
        <div><p className="text-xs text-slate-500">Horario</p><p className="mt-1 font-semibold text-indigo-600">{format(startsAt, "HH:mm")}</p></div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-1.5 truncate text-sm text-slate-500"><Phone className="size-3.5 shrink-0" /> {appointment.clientPhone}</p>
        {appointment.status !== "cancelled" && (
          <Button type="button" variant="outline" size="sm" disabled={isCancelling} onClick={() => onCancel(appointment.id)}>
            {isCancelling ? "Cancelando…" : "Cancelar"}
          </Button>
        )}
      </div>
    </article>
  );
}

function ClientAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-indigo-100 font-bold text-indigo-700">
      {initial || <UserRound className="size-4" />}
    </span>
  );
}

function AppointmentStatus({ status }: { status: string }) {
  const isCancelled = status === "cancelled";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize", isCancelled ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700")}>
      <span className={cn("size-1.5 rounded-full", isCancelled ? "bg-rose-500" : "bg-amber-500")} />
      {isCancelled ? "Cancelado" : "Pendiente"}
    </span>
  );
}

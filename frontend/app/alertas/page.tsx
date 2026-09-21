import type { Metadata } from "next";
import { AlertsTable, type AlertRow } from "@/components/alerts-table";
import { PageHeader } from "@/components/ui";
import { alerts, assetById, userById } from "@/lib/mock-data";
import { alertPriority } from "@/lib/risk";

export const metadata: Metadata = { title: "Alertas" };

export default function AlertsPage() {
  const rows: AlertRow[] = alerts.map((a) => {
    const { score, factors } = alertPriority(a);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      severity: a.severity,
      status: a.status,
      createdAt: a.createdAt,
      priority: score,
      factors,
      assets: a.assetIds.map((id) => assetById(id)?.name ?? id),
      userName: a.userId ? userById(a.userId)?.name : undefined,
      incidentId: a.incidentId,
    };
  });

  return (
    <>
      <PageHeader
        title="Alertas"
        description="Ordenadas por prioridad, no solo por severidad: se considera qué tan crítico es el activo afectado y quién está involucrado."
      />
      <AlertsTable rows={rows} />
    </>
  );
}

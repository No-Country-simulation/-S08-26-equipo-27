import Link from "next/link";
import { EventTrendChart, RiskGauge } from "@/components/charts";
import { Card, PageHeader, RiskMeter, SeverityBadge, StatusBadge } from "@/components/ui";
import { formatDateTime, timeAgo } from "@/lib/format";
import {
  alerts,
  assetById,
  assets,
  eventTrend,
  incidents,
  users,
  vulnerabilities,
} from "@/lib/mock-data";
import {
  SEVERITY_ORDER,
  alertPriority,
  assetRisk,
  dashboardSummary,
  isAlertActive,
  isIncidentActive,
  isVulnOverdue,
  organizationRisk,
  userRisk,
} from "@/lib/risk";

export default function DashboardPage() {
  const summary = dashboardSummary();
  const risk = organizationRisk();

  const activeIncidents = incidents
    .filter(isIncidentActive)
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));

  const topAlerts = alerts
    .filter(isAlertActive)
    .map((alert) => ({ alert, priority: alertPriority(alert).score }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  const riskyAssets = assets
    .map((asset) => ({ asset, ...assetRisk(asset) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const suspiciousUsers = users
    .map((user) => ({ user, ...userRisk(user) }))
    .filter((u) => u.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const overdueVulns = vulnerabilities.filter(isVulnOverdue).sort((a, b) => b.cvss - a.cvss);

  const kpis = [
    { label: "Incidentes activos", value: summary.activeIncidents, sub: `${summary.criticalIncidents} crítico(s)`, href: "/incidentes", hot: summary.criticalIncidents > 0 },
    { label: "Alertas por atender", value: summary.activeAlerts, sub: `${summary.criticalAlerts} crítica(s)`, href: "/alertas", hot: summary.criticalAlerts > 0 },
    { label: "Vulnerabilidades abiertas", value: summary.openVulns, sub: `${summary.overdueVulns} vencida(s)`, href: "/vulnerabilidades", hot: summary.overdueVulns > 0 },
    { label: "Usuarios sospechosos", value: summary.suspiciousUsers, sub: "riesgo alto o crítico", href: "/usuarios", hot: summary.suspiciousUsers > 0 },
  ];

  return (
    <>
      <PageHeader
        title="Panel general"
        description="Estado de seguridad de la organización: qué está pasando, qué tan grave es y qué atender primero."
      />

      {summary.criticalIncidents > 0 && (
        <Link
          href={`/incidentes/${activeIncidents[0].id}`}
          className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm hover:bg-red-500/15"
        >
          <span className="font-semibold text-red-300">Atención inmediata</span>
          <span className="text-red-100">{activeIncidents[0].title}</span>
          <span className="text-red-300/80 sm:ml-auto">Abierto {timeAgo(activeIncidents[0].openedAt)} · Ver incidente →</span>
        </Link>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Card title="Exposición global">
          <div className="px-4 py-5">
            <RiskGauge score={risk.score} />
            <p className="mt-3 text-center text-xs text-slate-500">
              Combina el riesgo de los activos más críticos, las alertas activas y las vulnerabilidades vencidas.
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {kpis.map((k) => (
            <Link
              key={k.label}
              href={k.href}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-slate-600"
            >
              <p className="text-xs text-slate-400">{k.label}</p>
              <p className={`mt-2 text-3xl font-semibold tabular-nums ${k.hot ? "text-red-400" : "text-white"}`}>{k.value}</p>
              <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
            </Link>
          ))}
          <Card className="col-span-2 xl:col-span-4" title="Eventos en las últimas 24 h">
            <div className="px-4 py-3">
              <EventTrendChart data={eventTrend} />
              <p className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-slate-600" /> Total</span>
                <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-orange-500" /> Sospechosos</span>
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card
          title="Qué atender primero"
          action={<Link href="/alertas" className="text-xs text-emerald-400 hover:underline">Ver todas</Link>}
        >
          <ol className="divide-y divide-slate-800">
            {topAlerts.map(({ alert, priority }, idx) => (
              <li key={alert.id} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-100">{alert.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <SeverityBadge severity={alert.severity} />
                    <span>{timeAgo(alert.createdAt)}</span>
                    {alert.assetIds[0] && <span>· {assetById(alert.assetIds[0])?.name}</span>}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Prioridad</p>
                  <RiskMeter score={priority} />
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card
          title="Incidentes activos"
          action={<Link href="/incidentes" className="text-xs text-emerald-400 hover:underline">Ver todos</Link>}
        >
          <ul className="divide-y divide-slate-800">
            {activeIncidents.map((i) => (
              <li key={i.id}>
                <Link href={`/incidentes/${i.id}`} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/40">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-100">{i.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {i.id} · {i.assignee} · desde {formatDateTime(i.openedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <SeverityBadge severity={i.severity} />
                    <StatusBadge status={i.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Activos con mayor riesgo"
          action={<Link href="/activos" className="text-xs text-emerald-400 hover:underline">Ver activos</Link>}
        >
          <ul className="divide-y divide-slate-800">
            {riskyAssets.map(({ asset, score, openVulns, activeAlerts }) => (
              <li key={asset.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm text-slate-100">{asset.name}</p>
                  <p className="text-xs text-slate-500">
                    Criticidad {asset.criticality}/5 · {openVulns} vulnerab. · {activeAlerts} alerta(s)
                  </p>
                </div>
                <RiskMeter score={score} />
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid gap-4">
          <Card
            title="Usuarios con comportamiento sospechoso"
            action={<Link href="/usuarios" className="text-xs text-emerald-400 hover:underline">Ver usuarios</Link>}
          >
            <ul className="divide-y divide-slate-800">
              {suspiciousUsers.map(({ user, score, reasons }) => (
                <li key={user.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-100">
                      {user.name}
                      {user.privileged && <span className="ml-2 text-xs text-amber-300">privilegiada</span>}
                    </p>
                    <p className="truncate text-xs text-slate-500">{reasons[0]}</p>
                  </div>
                  <RiskMeter score={score} />
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Vulnerabilidades vencidas"
            action={<Link href="/vulnerabilidades" className="text-xs text-emerald-400 hover:underline">Ver seguimiento</Link>}
          >
            <ul className="divide-y divide-slate-800">
              {overdueVulns.slice(0, 3).map((v) => (
                <li key={v.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-100">{v.title}</p>
                    <p className="text-xs text-slate-500">
                      {v.cve} · {assetById(v.assetId)?.name} · venció {formatDateTime(v.dueDate)}
                    </p>
                  </div>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-200">CVSS {v.cvss}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

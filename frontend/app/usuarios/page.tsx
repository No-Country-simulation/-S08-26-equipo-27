import type { Metadata } from "next";
import { PageHeader, RiskMeter, Td, Th } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { users } from "@/lib/mock-data";
import { userRisk } from "@/lib/risk";

export const metadata: Metadata = { title: "Usuarios" };

export default function UsersPage() {
  const rows = users.map((user) => ({ user, ...userRisk(user) })).sort((a, b) => b.score - a.score);

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="Comportamiento de las cuentas, ordenado por riesgo. Las cuentas privilegiadas y los accesos desde dispositivos desconocidos suman puntaje cuando hay alertas activas."
      />
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full min-w-[860px]">
          <thead className="border-b border-slate-800">
            <tr>
              <Th>Usuario</Th>
              <Th>Área</Th>
              <Th>Último acceso</Th>
              <Th>Motivos</Th>
              <Th>Riesgo</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map(({ user, score, reasons }) => (
              <tr key={user.id} className="hover:bg-slate-800/40">
                <Td>
                  <p className="font-medium text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500">
                    {user.email}
                    {user.privileged && <span className="ml-2 text-amber-300">privilegiada</span>}
                  </p>
                </Td>
                <Td>{user.department}</Td>
                <Td>
                  <p className="whitespace-nowrap">{formatDateTime(user.lastLoginAt)}</p>
                  <p className="text-xs text-slate-500">
                    {user.lastLoginLocation}
                    {!user.knownDevice && <span className="text-orange-300"> · dispositivo desconocido</span>}
                  </p>
                </Td>
                <Td className="max-w-sm">
                  {reasons.length === 0 ? (
                    <span className="text-slate-600">Sin alertas activas</span>
                  ) : (
                    <ul className="list-inside list-disc space-y-0.5 text-xs">
                      {reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                </Td>
                <Td>
                  <RiskMeter score={score} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

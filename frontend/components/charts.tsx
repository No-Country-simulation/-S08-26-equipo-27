import { riskColors } from "./ui";
import { riskLevel } from "@/lib/risk";

const gaugeStroke = { critico: "#ef4444", alto: "#f97316", medio: "#fbbf24", bajo: "#10b981" };

/** Medidor semicircular del riesgo global (0-100). */
export function RiskGauge({ score }: { score: number }) {
  const level = riskLevel(score);
  const r = 80;
  const arc = Math.PI * r; // longitud del semicírculo
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-full max-w-64" role="img" aria-label={`Riesgo global ${score} de 100, nivel ${riskColors[level].label}`}>
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke={gaugeStroke[level]}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * arc} ${arc}`}
        />
        <text x="100" y="92" textAnchor="middle" className="fill-white text-4xl font-semibold" fontSize="38">
          {score}
        </text>
      </svg>
      <p className={`-mt-1 text-sm font-semibold ${riskColors[level].text}`}>Riesgo {riskColors[level].label.toLowerCase()}</p>
    </div>
  );
}

/** Eventos por hora, con la porción sospechosa resaltada. */
export function EventTrendChart({ data }: { data: { hour: string; total: number; suspicious: number }[] }) {
  const w = 640;
  const h = 180;
  const padX = 8;
  const padBottom = 22;
  const max = Math.max(...data.map((d) => d.total));
  const slot = (w - padX * 2) / data.length;
  const barW = slot * 0.62;
  const scale = (h - padBottom - 6) / max;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Eventos por hora en las últimas 24 horas">
      {data.map((d, i) => {
        const x = padX + i * slot + (slot - barW) / 2;
        const totalH = d.total * scale;
        const suspH = d.suspicious * scale * 4; // ampliada para que se vea sobre el total
        const baseY = h - padBottom;
        return (
          <g key={d.hour}>
            <title>{`${d.hour} — ${d.total} eventos, ${d.suspicious} sospechosos`}</title>
            <rect x={x} y={baseY - totalH} width={barW} height={totalH} rx="2" fill="#334155" />
            {d.suspicious > 0 && (
              <rect x={x} y={baseY - Math.min(suspH, totalH)} width={barW} height={Math.min(suspH, totalH)} rx="2" fill="#f97316" />
            )}
            {i % 4 === 0 && (
              <text x={x + barW / 2} y={h - 6} textAnchor="middle" fontSize="10" fill="#64748b">
                {d.hour}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

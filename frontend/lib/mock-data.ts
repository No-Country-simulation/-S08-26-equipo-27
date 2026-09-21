import type {
  Alert,
  Asset,
  Incident,
  SecurityEvent,
  User,
  Vulnerability,
} from "./types";

/**
 * Datos de ejemplo para el MVP. Se reemplazan por llamadas al backend
 * manteniendo los mismos tipos (ver lib/types.ts).
 *
 * "Ahora" es fijo para que el render sea determinista (sin desajustes de
 * hidratación) y la demo cuente siempre la misma historia.
 */
export const NOW = "2026-09-21T14:00:00Z";

const at = (day: number, hh: number, mm = 0) =>
  `2026-09-${String(day).padStart(2, "0")}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00Z`;

export const assets: Asset[] = [
  { id: "A-01", name: "srv-prod-01", type: "servidor", criticality: 5, environment: "produccion", owner: "Infraestructura", ip: "10.0.1.10" },
  { id: "A-02", name: "db-clientes", type: "base_de_datos", criticality: 5, environment: "produccion", owner: "Datos", ip: "10.0.2.20" },
  { id: "A-03", name: "db-finanzas", type: "base_de_datos", criticality: 5, environment: "produccion", owner: "Finanzas IT", ip: "10.0.2.21" },
  { id: "A-04", name: "portal-clientes", type: "aplicacion_web", criticality: 4, environment: "produccion", owner: "Desarrollo", ip: "10.0.3.5" },
  { id: "A-05", name: "api-pagos", type: "api", criticality: 5, environment: "produccion", owner: "Desarrollo", ip: "10.0.3.8" },
  { id: "A-06", name: "aws-s3-backups", type: "cloud", criticality: 4, environment: "produccion", owner: "Infraestructura", ip: "—" },
  { id: "A-07", name: "fw-perimetral", type: "red", criticality: 4, environment: "produccion", owner: "Redes", ip: "10.0.0.1" },
  { id: "A-08", name: "vpn-gateway", type: "red", criticality: 4, environment: "produccion", owner: "Redes", ip: "10.0.0.2" },
  { id: "A-09", name: "nb-admin-rlopez", type: "endpoint", criticality: 3, environment: "corporativo", owner: "Soporte TI", ip: "10.0.10.44" },
  { id: "A-10", name: "pc-contabilidad-03", type: "endpoint", criticality: 2, environment: "corporativo", owner: "Soporte TI", ip: "10.0.10.63" },
  { id: "A-11", name: "erp-interno", type: "aplicacion_web", criticality: 3, environment: "corporativo", owner: "Sistemas", ip: "10.0.4.12" },
  { id: "A-12", name: "srv-staging-02", type: "servidor", criticality: 2, environment: "staging", owner: "Desarrollo", ip: "10.0.5.7" },
];

export const users: User[] = [
  { id: "U-01", name: "Ricardo López", email: "rlopez@cybershield.demo", department: "Infraestructura", privileged: true, lastLoginAt: at(21, 12, 52), lastLoginLocation: "Bucarest, Rumania", knownDevice: false },
  { id: "U-02", name: "Camila Fernández", email: "cfernandez@cybershield.demo", department: "Finanzas", privileged: false, lastLoginAt: at(21, 9, 4), lastLoginLocation: "Buenos Aires, Argentina", knownDevice: true },
  { id: "U-03", name: "Diego Sosa", email: "dsosa@cybershield.demo", department: "Ventas", privileged: false, lastLoginAt: at(21, 8, 31), lastLoginLocation: "Córdoba, Argentina", knownDevice: true },
  { id: "U-04", name: "Lucía Méndez", email: "lmendez@cybershield.demo", department: "RRHH", privileged: false, lastLoginAt: at(21, 9, 47), lastLoginLocation: "Buenos Aires, Argentina", knownDevice: true },
  { id: "U-05", name: "Andrés Pardo", email: "apardo@cybershield.demo", department: "DevOps", privileged: true, lastLoginAt: at(21, 10, 15), lastLoginLocation: "Rosario, Argentina", knownDevice: true },
  { id: "U-06", name: "Sofía Ruiz", email: "sruiz@cybershield.demo", department: "Soporte", privileged: false, lastLoginAt: at(20, 17, 22), lastLoginLocation: "Mendoza, Argentina", knownDevice: true },
  { id: "U-07", name: "Tomás Herrera", email: "therrera@cybershield.demo", department: "Contabilidad", privileged: false, lastLoginAt: at(21, 11, 38), lastLoginLocation: "Buenos Aires, Argentina", knownDevice: true },
  { id: "U-08", name: "Valentina Cruz", email: "vcruz@cybershield.demo", department: "Legal", privileged: false, lastLoginAt: at(21, 8, 55), lastLoginLocation: "Buenos Aires, Argentina", knownDevice: true },
  { id: "U-09", name: "svc-backup", email: "svc-backup@cybershield.demo", department: "Cuenta de servicio", privileged: true, lastLoginAt: at(21, 3, 0), lastLoginLocation: "Interna", knownDevice: true },
  { id: "U-10", name: "Marcos Gil", email: "mgil@cybershield.demo", department: "Ventas", privileged: false, lastLoginAt: at(21, 13, 20), lastLoginLocation: "Salta, Argentina", knownDevice: false },
];

export const events: SecurityEvent[] = [
  // Cadena de ataque sobre la cuenta privilegiada de Ricardo López (INC-1001)
  { id: "EV-0001", timestamp: at(21, 12, 41), source: "IAM", type: "Inicio de sesión fallido", severity: "media", description: "6 intentos de acceso fallidos consecutivos sobre la cuenta rlopez.", ip: "185.220.101.4", location: "Bucarest, Rumania", userId: "U-01", assetId: "A-08" },
  { id: "EV-0002", timestamp: at(21, 12, 46), source: "IAM", type: "Inicio de sesión fallido", severity: "alta", description: "8 intentos adicionales fallidos. Total: 14 intentos en 5 minutos.", ip: "185.220.101.4", location: "Bucarest, Rumania", userId: "U-01", assetId: "A-08" },
  { id: "EV-0003", timestamp: at(21, 12, 52), source: "IAM", type: "Inicio de sesión exitoso", severity: "alta", description: "Acceso exitoso a la cuenta rlopez desde un dispositivo no registrado.", ip: "185.220.101.4", location: "Bucarest, Rumania", userId: "U-01", assetId: "A-08" },
  { id: "EV-0004", timestamp: at(21, 13, 5), source: "IAM", type: "Cambio de permisos", severity: "critica", description: "La cuenta rlopez se asignó el rol db_admin sobre db-clientes.", ip: "185.220.101.4", location: "Bucarest, Rumania", userId: "U-01", assetId: "A-02" },
  { id: "EV-0005", timestamp: at(21, 13, 18), source: "Base de datos", type: "Consulta masiva", severity: "critica", description: "Exportación de ~480.000 registros de la tabla clientes_pii.", ip: "185.220.101.4", location: "Bucarest, Rumania", userId: "U-01", assetId: "A-02" },
  { id: "EV-0006", timestamp: at(21, 13, 31), source: "Firewall", type: "Transferencia saliente anómala", severity: "critica", description: "2,3 GB enviados hacia una IP externa no catalogada.", ip: "185.220.101.4", location: "Bucarest, Rumania", assetId: "A-07" },

  // Ransomware en equipo de contabilidad (INC-1002)
  { id: "EV-0007", timestamp: at(21, 11, 52), source: "EDR", type: "Cifrado masivo de archivos", severity: "alta", description: "Proceso desconocido cifró 1.240 archivos en 3 minutos.", userId: "U-07", assetId: "A-10" },
  { id: "EV-0008", timestamp: at(21, 11, 55), source: "Antivirus", type: "Malware detectado", severity: "alta", description: "Firma compatible con familia de ransomware detectada en la carpeta Descargas.", userId: "U-07", assetId: "A-10" },

  // Escaneo de puertos (INC-1003)
  { id: "EV-0009", timestamp: at(21, 10, 12), source: "Firewall", type: "Escaneo de puertos", severity: "media", description: "Barrido de 1.024 puertos sobre vpn-gateway.", ip: "45.155.205.233", location: "Moscú, Rusia", assetId: "A-08" },
  { id: "EV-0010", timestamp: at(21, 10, 19), source: "Firewall", type: "Escaneo de puertos", severity: "media", description: "Mismo origen escanea fw-perimetral.", ip: "45.155.205.233", location: "Moscú, Rusia", assetId: "A-07" },

  // Actividad rutinaria y ruido de baja prioridad
  { id: "EV-0021", timestamp: at(21, 13, 40), source: "IAM", type: "Inicio de sesión fallido", severity: "baja", description: "1 intento de acceso incorrecto (contraseña errónea).", ip: "190.12.44.8", location: "Salta, Argentina", userId: "U-10", assetId: "A-11" },
  { id: "EV-0011", timestamp: at(21, 13, 20), source: "IAM", type: "Inicio de sesión exitoso", severity: "media", description: "Acceso desde un dispositivo no registrado.", ip: "190.12.44.8", location: "Salta, Argentina", userId: "U-10", assetId: "A-11" },
  { id: "EV-0012", timestamp: at(21, 9, 4), source: "IAM", type: "Cambio de contraseña", severity: "baja", description: "Cambio de contraseña realizado por el usuario.", userId: "U-02" },
  { id: "EV-0013", timestamp: at(21, 8, 31), source: "IAM", type: "Inicio de sesión exitoso", severity: "baja", description: "Acceso habitual desde dispositivo conocido.", userId: "U-03", assetId: "A-11" },
  { id: "EV-0014", timestamp: at(21, 9, 47), source: "Antivirus", type: "Correo de phishing reportado", severity: "baja", description: "La usuaria reportó un correo sospechoso; bloqueado en la pasarela.", userId: "U-04" },
  { id: "EV-0015", timestamp: at(21, 10, 15), source: "Cloud", type: "Cambio de configuración", severity: "media", description: "Se modificó la política del bucket aws-s3-backups (lectura pública deshabilitada).", userId: "U-05", assetId: "A-06" },
  { id: "EV-0016", timestamp: at(21, 3, 0), source: "IAM", type: "Inicio de sesión exitoso", severity: "baja", description: "Ejecución programada de backup.", userId: "U-09", assetId: "A-06" },
  { id: "EV-0017", timestamp: at(21, 6, 40), source: "Aplicación", type: "Error de autorización", severity: "baja", description: "12 respuestas 403 en api-pagos desde un mismo cliente.", ip: "200.45.19.77", location: "Buenos Aires, Argentina", assetId: "A-05" },
  { id: "EV-0018", timestamp: at(20, 17, 22), source: "IAM", type: "Inicio de sesión exitoso", severity: "baja", description: "Acceso habitual.", userId: "U-06" },
  { id: "EV-0019", timestamp: at(20, 22, 10), source: "Cloud", type: "Nueva clave de acceso creada", severity: "media", description: "Se generó una clave de acceso para svc-backup fuera del horario habitual.", userId: "U-09", assetId: "A-06" },
  { id: "EV-0020", timestamp: at(21, 7, 5), source: "Firewall", type: "Conexión bloqueada", severity: "baja", description: "Tráfico hacia dominio en lista negra bloqueado.", assetId: "A-09" },
];

export const alerts: Alert[] = [
  { id: "AL-2001", title: "Cuenta privilegiada: fuerza bruta seguida de acceso exitoso", severity: "critica", status: "en_investigacion", rule: "Múltiples fallos + login exitoso desde dispositivo desconocido", createdAt: at(21, 12, 53), description: "14 intentos fallidos sobre rlopez seguidos de un acceso exitoso desde Rumania con un dispositivo no registrado.", assetIds: ["A-08", "A-09"], userId: "U-01", incidentId: "INC-1001" },
  { id: "AL-2002", title: "Escalada de privilegios sobre base de datos de clientes", severity: "critica", status: "en_investigacion", rule: "Cambio de permisos por cuenta con actividad sospechosa", createdAt: at(21, 13, 6), description: "rlopez se asignó el rol db_admin en db-clientes 13 minutos después de un acceso anómalo.", assetIds: ["A-02"], userId: "U-01", incidentId: "INC-1001" },
  { id: "AL-2003", title: "Posible exfiltración de datos sensibles", severity: "critica", status: "nueva", rule: "Consulta masiva + transferencia saliente", createdAt: at(21, 13, 32), description: "Exportación de ~480.000 registros y 2,3 GB enviados a una IP externa no catalogada.", assetIds: ["A-02", "A-07"], userId: "U-01", incidentId: "INC-1001" },
  { id: "AL-2004", title: "Cifrado masivo de archivos en equipo de contabilidad", severity: "alta", status: "en_investigacion", rule: "Comportamiento de ransomware (EDR)", createdAt: at(21, 11, 53), description: "1.240 archivos cifrados en 3 minutos en pc-contabilidad-03.", assetIds: ["A-10"], userId: "U-07", incidentId: "INC-1002" },
  { id: "AL-2005", title: "Malware detectado en pc-contabilidad-03", severity: "alta", status: "resuelta", rule: "Firma de antivirus", createdAt: at(21, 11, 55), description: "Ejecutable en Descargas compatible con familia de ransomware. Equipo aislado.", assetIds: ["A-10"], userId: "U-07", incidentId: "INC-1002" },
  { id: "AL-2006", title: "Escaneo de puertos desde IP externa", severity: "media", status: "nueva", rule: "Escaneo horizontal / vertical", createdAt: at(21, 10, 20), description: "Un mismo origen escaneó vpn-gateway y fw-perimetral en 7 minutos.", assetIds: ["A-08", "A-07"], incidentId: "INC-1003" },
  { id: "AL-2007", title: "Acceso desde dispositivo no registrado", severity: "media", status: "nueva", rule: "Dispositivo desconocido", createdAt: at(21, 13, 21), description: "Marcos Gil accedió al ERP desde un dispositivo que no figura en el inventario.", assetIds: ["A-11"], userId: "U-10" },
  { id: "AL-2008", title: "Clave de acceso creada fuera de horario para cuenta de servicio", severity: "media", status: "en_investigacion", rule: "Actividad fuera de horario en cuenta privilegiada", createdAt: at(20, 22, 11), description: "Se generó una clave nueva para svc-backup a las 22:10.", assetIds: ["A-06"], userId: "U-09" },
  { id: "AL-2009", title: "Cambio de política en bucket de backups", severity: "media", status: "resuelta", rule: "Cambio de configuración en activo crítico", createdAt: at(21, 10, 16), description: "Andrés Pardo deshabilitó la lectura pública. Cambio validado como correcto.", assetIds: ["A-06"], userId: "U-05" },
  { id: "AL-2010", title: "Ráfaga de errores 403 en API de pagos", severity: "baja", status: "nueva", rule: "Errores de autorización repetidos", createdAt: at(21, 6, 41), description: "12 respuestas 403 desde una misma IP en 2 minutos.", assetIds: ["A-05"] },
  { id: "AL-2011", title: "Intento de acceso incorrecto", severity: "baja", status: "falso_positivo", rule: "Fallo de autenticación", createdAt: at(21, 13, 41), description: "Un único intento fallido, seguido de acceso correcto.", assetIds: ["A-11"], userId: "U-10" },
  { id: "AL-2012", title: "Correo de phishing reportado", severity: "baja", status: "resuelta", rule: "Reporte de usuario", createdAt: at(21, 9, 48), description: "Correo bloqueado en la pasarela; sin interacción del usuario.", assetIds: [], userId: "U-04", incidentId: "INC-1005" },
  { id: "AL-2013", title: "Tráfico hacia dominio en lista negra", severity: "baja", status: "resuelta", rule: "Reputación de dominio", createdAt: at(21, 7, 6), description: "Conexión bloqueada por el firewall en nb-admin-rlopez.", assetIds: ["A-09"] },
  { id: "AL-2014", title: "Credenciales de svc-backup expuestas en repositorio", severity: "alta", status: "resuelta", rule: "Filtración de credenciales", createdAt: at(19, 15, 2), description: "Se detectó un secreto de svc-backup en un repositorio interno.", assetIds: ["A-06"], userId: "U-09", incidentId: "INC-1004" },
];

export const incidents: Incident[] = [
  {
    id: "INC-1001",
    title: "Posible compromiso de cuenta privilegiada con exfiltración de datos de clientes",
    severity: "critica",
    status: "abierto",
    assignee: "Laura Benítez",
    openedAt: at(21, 12, 53),
    summary:
      "La cuenta privilegiada rlopez sufrió 14 intentos de acceso fallidos desde Rumania, seguidos de un acceso exitoso desde un dispositivo desconocido. Luego se asignó permisos de administrador sobre db-clientes, exportó ~480.000 registros y se detectó una transferencia saliente de 2,3 GB hacia una IP externa.",
    assetIds: ["A-08", "A-09", "A-02", "A-07"],
    userIds: ["U-01"],
    alertIds: ["AL-2001", "AL-2002", "AL-2003"],
    timeline: [
      { at: at(21, 12, 41), kind: "evento", text: "6 intentos de acceso fallidos sobre rlopez desde 185.220.101.4 (Rumania).", actor: "IAM" },
      { at: at(21, 12, 46), kind: "evento", text: "8 intentos fallidos adicionales. Total: 14 en 5 minutos.", actor: "IAM" },
      { at: at(21, 12, 52), kind: "evento", text: "Acceso exitoso desde un dispositivo no registrado.", actor: "IAM" },
      { at: at(21, 12, 53), kind: "deteccion", text: "CyberShield genera la alerta AL-2001 (crítica) y abre el incidente.", actor: "CyberShield" },
      { at: at(21, 13, 5), kind: "evento", text: "rlopez se asigna el rol db_admin sobre db-clientes.", actor: "IAM" },
      { at: at(21, 13, 18), kind: "evento", text: "Exportación de ~480.000 registros de clientes_pii.", actor: "Base de datos" },
      { at: at(21, 13, 31), kind: "evento", text: "2,3 GB enviados a una IP externa no catalogada.", actor: "Firewall" },
      { at: at(21, 13, 45), kind: "accion", text: "Se toma el incidente y se inicia la investigación.", actor: "Laura Benítez" },
    ],
    recommendedActions: [
      "Suspender la cuenta rlopez y revocar todas sus sesiones activas.",
      "Revocar el rol db_admin asignado sobre db-clientes.",
      "Bloquear la IP 185.220.101.4 y el destino de la transferencia en el firewall.",
      "Contactar a Ricardo López por un canal alternativo para confirmar si reconoce la actividad.",
      "Evaluar la notificación por filtración de datos personales (~480.000 clientes).",
      "Rotar credenciales y claves con acceso a db-clientes.",
    ],
  },
  {
    id: "INC-1002",
    title: "Ransomware en equipo de contabilidad",
    severity: "alta",
    status: "en_contencion",
    assignee: "Martín Aguirre",
    openedAt: at(21, 11, 53),
    summary:
      "El EDR detectó cifrado masivo de archivos en pc-contabilidad-03 tras la ejecución de un archivo descargado. El equipo fue aislado de la red y no hay evidencia de propagación.",
    assetIds: ["A-10"],
    userIds: ["U-07"],
    alertIds: ["AL-2004", "AL-2005"],
    timeline: [
      { at: at(21, 11, 52), kind: "evento", text: "1.240 archivos cifrados en 3 minutos.", actor: "EDR" },
      { at: at(21, 11, 53), kind: "deteccion", text: "Alerta AL-2004 generada automáticamente.", actor: "CyberShield" },
      { at: at(21, 11, 55), kind: "evento", text: "El antivirus identifica un ejecutable de la familia ransomware.", actor: "Antivirus" },
      { at: at(21, 12, 5), kind: "accion", text: "Equipo aislado de la red desde el EDR.", actor: "Martín Aguirre" },
      { at: at(21, 12, 40), kind: "accion", text: "Se confirma que no hubo movimiento lateral hacia otros equipos.", actor: "Martín Aguirre" },
    ],
    recommendedActions: [
      "Restaurar el equipo desde una imagen limpia y recuperar archivos desde backup.",
      "Revisar el origen de la descarga y bloquear el dominio en el proxy.",
      "Reforzar la capacitación de phishing en el área de Contabilidad.",
    ],
  },
  {
    id: "INC-1003",
    title: "Reconocimiento sobre VPN y firewall perimetral",
    severity: "media",
    status: "abierto",
    assignee: "Sin asignar",
    openedAt: at(21, 10, 20),
    summary:
      "Un mismo origen externo (45.155.205.233) escaneó puertos de vpn-gateway y fw-perimetral. Puede ser una fase previa a un intento de intrusión.",
    assetIds: ["A-08", "A-07"],
    userIds: [],
    alertIds: ["AL-2006"],
    timeline: [
      { at: at(21, 10, 12), kind: "evento", text: "Barrido de 1.024 puertos sobre vpn-gateway.", actor: "Firewall" },
      { at: at(21, 10, 19), kind: "evento", text: "El mismo origen escanea fw-perimetral.", actor: "Firewall" },
      { at: at(21, 10, 20), kind: "deteccion", text: "Alerta AL-2006 generada.", actor: "CyberShield" },
    ],
    recommendedActions: [
      "Bloquear la IP 45.155.205.233 en el firewall.",
      "Verificar que vpn-gateway tenga aplicado el último parche.",
      "Monitorear intentos de autenticación posteriores contra la VPN.",
    ],
  },
  {
    id: "INC-1004",
    title: "Credenciales de cuenta de servicio expuestas",
    severity: "alta",
    status: "resuelto",
    assignee: "Laura Benítez",
    openedAt: at(19, 15, 2),
    resolvedAt: at(20, 11, 30),
    summary:
      "Se detectó un secreto de svc-backup en un repositorio interno. Se rotó la credencial y se confirmó que no fue utilizada por terceros.",
    assetIds: ["A-06"],
    userIds: ["U-09"],
    alertIds: ["AL-2014"],
    timeline: [
      { at: at(19, 15, 2), kind: "deteccion", text: "Se detecta un secreto expuesto en un repositorio.", actor: "CyberShield" },
      { at: at(19, 16, 10), kind: "accion", text: "Se revoca la credencial comprometida.", actor: "Laura Benítez" },
      { at: at(20, 11, 30), kind: "accion", text: "Se verifica en los logs que no hubo uso externo. Incidente cerrado.", actor: "Laura Benítez" },
    ],
    recommendedActions: ["Habilitar escaneo de secretos en los repositorios."],
  },
  {
    id: "INC-1005",
    title: "Campaña de phishing dirigida a RRHH",
    severity: "baja",
    status: "resuelto",
    assignee: "Martín Aguirre",
    openedAt: at(21, 9, 48),
    resolvedAt: at(21, 10, 30),
    summary:
      "Correo de phishing reportado por una usuaria. Fue bloqueado en la pasarela y no hubo interacción con el enlace.",
    assetIds: [],
    userIds: ["U-04"],
    alertIds: ["AL-2012"],
    timeline: [
      { at: at(21, 9, 47), kind: "evento", text: "La usuaria reporta un correo sospechoso.", actor: "Lucía Méndez" },
      { at: at(21, 10, 30), kind: "accion", text: "Remitente bloqueado y correo eliminado de los buzones.", actor: "Martín Aguirre" },
    ],
    recommendedActions: [],
  },
];

export const vulnerabilities: Vulnerability[] = [
  { id: "VU-3001", cve: "CVE-2026-1187", title: "Ejecución remota de código en gateway VPN", cvss: 9.8, severity: "critica", assetId: "A-08", detectedAt: at(14, 9), dueDate: at(21, 9), status: "abierta", assignee: "Redes", reappeared: false },
  { id: "VU-3002", cve: "CVE-2026-0932", title: "Inyección SQL en portal de clientes", cvss: 9.1, severity: "critica", assetId: "A-04", detectedAt: at(10, 11), dueDate: at(24, 11), status: "en_progreso", assignee: "Desarrollo", reappeared: false },
  { id: "VU-3003", cve: "CVE-2025-8841", title: "Cifrado débil en conexiones a la base de datos", cvss: 7.5, severity: "alta", assetId: "A-02", detectedAt: at(5, 10), dueDate: at(19, 10), status: "abierta", assignee: "Datos", reappeared: true },
  { id: "VU-3004", cve: "CVE-2026-0410", title: "Deserialización insegura en API de pagos", cvss: 8.8, severity: "alta", assetId: "A-05", detectedAt: at(12, 15), dueDate: at(26, 15), status: "en_progreso", assignee: "Desarrollo", reappeared: false },
  { id: "VU-3005", cve: "CVE-2025-7720", title: "Kernel de Linux desactualizado (escalada de privilegios local)", cvss: 7.8, severity: "alta", assetId: "A-01", detectedAt: at(3, 8), dueDate: at(17, 8), status: "abierta", assignee: "Infraestructura", reappeared: false },
  { id: "VU-3006", cve: "CVE-2026-0217", title: "Autenticación sin MFA en consola de administración", cvss: 6.5, severity: "media", assetId: "A-03", detectedAt: at(8, 9), dueDate: at(29, 9), status: "abierta", assignee: "Finanzas IT", reappeared: false },
  { id: "VU-3007", cve: "CVE-2025-6603", title: "Cross-site scripting en ERP", cvss: 6.1, severity: "media", assetId: "A-11", detectedAt: at(1, 10), dueDate: at(30, 10), status: "en_progreso", assignee: "Sistemas", reappeared: false },
  { id: "VU-3008", cve: "CVE-2025-5518", title: "Servicio SSH con algoritmos obsoletos", cvss: 5.3, severity: "media", assetId: "A-12", detectedAt: at(2, 14), dueDate: at(30, 14), status: "abierta", assignee: "Desarrollo", reappeared: false },
  { id: "VU-3009", cve: "CVE-2026-0098", title: "Navegador desactualizado en estación de trabajo", cvss: 4.3, severity: "baja", assetId: "A-10", detectedAt: at(15, 9), dueDate: at(29, 9), status: "abierta", assignee: "Soporte TI", reappeared: false },
  { id: "VU-3010", cve: "CVE-2025-9034", title: "Bucket con lectura pública habilitada", cvss: 8.2, severity: "alta", assetId: "A-06", detectedAt: at(9, 9), dueDate: at(16, 9), resolvedAt: at(21, 10, 15), status: "resuelta", assignee: "Infraestructura", reappeared: false },
  { id: "VU-3011", cve: "CVE-2025-7301", title: "Certificado TLS próximo a vencer", cvss: 3.7, severity: "baja", assetId: "A-04", detectedAt: at(6, 9), dueDate: at(20, 9), resolvedAt: at(18, 12), status: "resuelta", assignee: "Desarrollo", reappeared: false },
  { id: "VU-3012", cve: "CVE-2025-4470", title: "Firmware de firewall desactualizado", cvss: 7.2, severity: "alta", assetId: "A-07", detectedAt: at(4, 10), dueDate: at(18, 10), resolvedAt: at(17, 16), status: "resuelta", assignee: "Redes", reappeared: false },
];

/** Cantidad de eventos por hora en las últimas 24 h (para el gráfico del panel). */
export const eventTrend: { hour: string; total: number; suspicious: number }[] = (() => {
  const total = [118, 126, 112, 84, 62, 48, 40, 36, 33, 30, 28, 27, 35, 31, 36, 52, 78, 104, 126, 138, 132, 129, 141, 60];
  const suspicious = [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 4, 5, 9, 14, 2];
  return total.map((t, i) => {
    // 24 puntos: desde las 15:00 del día anterior hasta las 14:00 de hoy.
    const h = (15 + i) % 24;
    return { hour: `${String(h).padStart(2, "0")}:00`, total: t, suspicious: suspicious[i] };
  });
})();

export const assetById = (id: string) => assets.find((a) => a.id === id);
export const userById = (id: string) => users.find((u) => u.id === id);
export const alertById = (id: string) => alerts.find((a) => a.id === id);
export const incidentById = (id: string) => incidents.find((i) => i.id === id);

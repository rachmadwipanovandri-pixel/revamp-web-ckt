import "server-only";
import { createSign } from "node:crypto";
import type { SheetTarget } from "./webhook";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

/** User-facing configuration error — surfaced verbatim to the admin. */
export class SheetSetupError extends Error {}

function saConfig(): { email: string; privateKey: string } | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { client_email?: string; private_key?: string };
      if (parsed.client_email && parsed.private_key) {
        return { email: parsed.client_email, privateKey: parsed.private_key };
      }
    } catch {
      // fall through to the pair form
    }
  }
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  if (email && privateKey) return { email, privateKey };
  return null;
}

/** The address teams must share their sheet with (shown in the admin). */
export function sheetServiceAccountEmail(): string | null {
  return saConfig()?.email ?? null;
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

/** Signed RS256 JWT for the service account (exported for tests). */
export function buildServiceAccountJwt(email: string, privateKey: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: email,
      scope: SCOPES,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(privateKey).toString("base64url");
  return `${header}.${claims}.${signature}`;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  const config = saConfig();
  if (!config) {
    throw new SheetSetupError(
      "Server belum punya akses Google. Isi GOOGLE_SERVICE_ACCOUNT_JSON di .env (JSON key service account) lalu restart server.",
    );
  }
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }
  const jwt = buildServiceAccountJwt(config.email, config.privateKey);
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  }).catch(() => null);
  if (!response?.ok) {
    throw new SheetSetupError(
      `Google menolak kredensial service account (HTTP ${response?.status ?? "network"}). Cek GOOGLE_SERVICE_ACCOUNT_JSON.`,
    );
  }
  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) {
    throw new SheetSetupError("Respons token Google tidak valid.");
  }
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return tokenCache.token;
}

async function apiFetch(path: string, token: string, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

/** Quoted A1 range for a tab title, e.g. `'Sheet 1'!A1`. */
function rangeFor(sheetTitle: string): string {
  const quoted = `'${sheetTitle.replace(/'/g, "''")}'`;
  return `${quoted}!A1`;
}

/**
 * Appends one row (plus a header row when the sheet is still empty) to the
 * tab the team's link points at.
 */
export async function appendSheetRow(
  target: SheetTarget,
  header: string[],
  row: string[],
): Promise<void> {
  const token = await accessToken();

  const metaResponse = await apiFetch(
    `/${encodeURIComponent(target.spreadsheetId)}?fields=sheets.properties`,
    token,
  );
  if (!metaResponse.ok) {
    if (metaResponse.status === 404) {
      throw new SheetSetupError(
        "Sheet tidak ditemukan — pastikan link-nya benar dan sheet sudah dibagikan (Editor) ke email service account.",
      );
    }
    if (metaResponse.status === 403) {
      throw new SheetSetupError(
        "Akses ditolak — bagikan sheet ke email service account sebagai Editor (Bagikan → tambah email).",
      );
    }
    throw new SheetSetupError(
      `Google Sheets API menolak (HTTP ${metaResponse.status}).`,
    );
  }
  const meta = (await metaResponse.json()) as {
    sheets?: { properties?: { sheetId?: number; title?: string } }[];
  };
  const sheets = meta.sheets ?? [];
  const active =
    (target.gid !== null
      ? sheets.find((s) => s.properties?.sheetId === target.gid)
      : undefined) ?? sheets[0];
  const sheetTitle = active?.properties?.title;
  if (!sheetTitle) {
    throw new SheetSetupError("Sheet tidak punya tab yang bisa ditulis.");
  }

  const range = rangeFor(sheetTitle);
  const rangePath = encodeURIComponent(range);

  let needsHeader = false;
  const peek = await apiFetch(
    `/${encodeURIComponent(target.spreadsheetId)}/values/${rangePath}?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE`,
    token,
  );
  if (peek.ok) {
    const peekData = (await peek.json()) as { values?: unknown[][] };
    const firstRow = peekData.values?.[0];
    needsHeader = !firstRow || firstRow.every((cell) => String(cell).trim() === "");
  }

  const values = needsHeader ? [header, row] : [row];
  const append = await apiFetch(
    `/${encodeURIComponent(target.spreadsheetId)}/values/${rangePath}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ values, majorDimension: "ROWS" }),
    },
  );
  if (!append.ok) {
    throw new SheetSetupError(
      `Gagal menulis ke sheet (HTTP ${append.status}).`,
    );
  }
}

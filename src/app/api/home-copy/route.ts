import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const LOCALE = "id";
const MESSAGES_PATH = join(process.cwd(), "messages", `${LOCALE}.json`);

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Namespaces the wireframe editor may rewrite (homepage `/` + redesign `/new`). */
const NAMESPACES = ["home", "agentic"] as const;
type Namespace = (typeof NAMESPACES)[number];

function readMessages(): Record<string, Json> {
  return JSON.parse(readFileSync(MESSAGES_PATH, "utf8")) as Record<
    string,
    Json
  >;
}

function isPlainObject(value: unknown): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Deep-merge only string leaves; ignore unknown/non-string noise. */
function mergeStrings(
  target: Record<string, Json>,
  patch: Record<string, Json>,
): Record<string, Json> {
  const out: Record<string, Json> = { ...target };
  for (const [key, value] of Object.entries(patch)) {
    if (typeof value === "string") {
      out[key] = value;
    } else if (isPlainObject(value) && isPlainObject(out[key])) {
      out[key] = mergeStrings(out[key] as Record<string, Json>, value);
    } else if (isPlainObject(value)) {
      out[key] = mergeStrings({}, value);
    }
  }
  return out;
}

export async function GET() {
  const messages = readMessages();
  const payload: Record<string, Json> = { locale: LOCALE };
  for (const ns of NAMESPACES) {
    const value = messages[ns];
    if (!isPlainObject(value)) {
      return NextResponse.json(
        { error: `${ns} namespace missing` },
        { status: 500 },
      );
    }
    payload[ns] = value;
  }
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isPlainObject(body)) {
    return NextResponse.json(
      { error: "Body must be an object" },
      { status: 400 },
    );
  }

  const patches: Partial<Record<Namespace, Record<string, Json>>> = {};
  for (const ns of NAMESPACES) {
    const patch = body[ns];
    if (patch === undefined) continue;
    if (!isPlainObject(patch)) {
      return NextResponse.json(
        { error: `Body.${ns} must be an object` },
        { status: 400 },
      );
    }
    patches[ns] = patch;
  }

  if (Object.keys(patches).length === 0) {
    return NextResponse.json(
      { error: `Body must include at least one of: ${NAMESPACES.join(", ")}` },
      { status: 400 },
    );
  }

  const messages = readMessages();
  const touched: Namespace[] = [];
  for (const ns of NAMESPACES) {
    const patch = patches[ns];
    if (!patch) continue;
    if (!isPlainObject(messages[ns])) {
      return NextResponse.json(
        { error: `${ns} namespace missing` },
        { status: 500 },
      );
    }
    messages[ns] = mergeStrings(messages[ns] as Record<string, Json>, patch);
    touched.push(ns);
  }

  writeFileSync(MESSAGES_PATH, `${JSON.stringify(messages, null, 2)}\n`, "utf8");

  // Statically rendered pages — bust them so the next visit rebuilds.
  revalidatePath("/", "layout");
  revalidatePath("/new", "page");

  return NextResponse.json({
    ok: true,
    locale: LOCALE,
    saved: touched,
    savedAt: Date.now(),
  });
}

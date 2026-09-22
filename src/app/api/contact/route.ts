import { NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  whatsapp: string;
}

function isValidPayload(body: unknown): body is ContactPayload {
  if (typeof body !== "object" || body === null) return false;
  const { name, email, whatsapp } = body as Record<string, unknown>;
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    typeof email === "string" &&
    email.trim().length > 0 &&
    typeof whatsapp === "string" &&
    whatsapp.trim().length > 0
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const webhookUrl = process.env.CONTACT_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Contact webhook is not configured" },
      { status: 500 },
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp,
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to reach the contact webhook" },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}

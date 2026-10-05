import { NextResponse } from "next/server";
import {
  leadDisplayName,
  leadPhoneDisplay,
  parseLead,
} from "@/lib/contact-sales.server";

/**
 * Lead endpoint for /contact-sales.
 *
 * Forwards to the Google Apps Script web app in CONTACT_SALES_WEBHOOK_URL,
 * which appends the enquiry to a sheet AND emails it (see
 * scripts/contact-sales-apps-script.gs). Env falls back to the generic
 * CONTACT_SHEET_WEBHOOK_URL so a site with only the contact-form webhook
 * configured still logs the lead rather than 500-ing.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = parseLead(body);

  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Invalid payload", field: parsed.field },
      { status: 400 },
    );
  }

  const { lead } = parsed;
  const webhookUrl =
    process.env.CONTACT_SALES_WEBHOOK_URL ??
    process.env.CONTACT_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Contact webhook is not configured" },
      { status: 500 },
    );
  }

  // Flat fields rather than a nested object: the Apps Script reads them with
  // e.body.field, and a nested lead{} would need getPayload() gymnastics on a
  // runtime that fails the request on any unexpected key.
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "contact-sales",
      email: lead.email,
      companySize: lead.companySize,
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company,
      countryCode: lead.countryCode,
      phone: lead.phone,
      locale: lead.locale,
      page: lead.page,
      name: leadDisplayName(lead),
      phoneDisplay: leadPhoneDisplay(lead),
      submittedAt: new Date().toISOString(),
      // Where the notification goes. The script prefers its own hardcoded
      // recipient and only reads this when that one is left blank, so a
      // misconfigured env var cannot silently redirect sales leads.
      notifyEmail: process.env.CONTACT_SALES_NOTIFY_EMAIL ?? "",
    }),
  }).catch(() => null);

  if (!response) {
    return NextResponse.json(
      { error: "Could not reach the contact webhook" },
      { status: 502 },
    );
  }
  if (!response.ok) {
    return NextResponse.json(
      { error: "Contact webhook rejected the submission" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

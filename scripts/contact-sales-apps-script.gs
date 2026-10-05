/**
 * Contact Sales — Apps Script receiver for /api/contact-sales.
 *
 * Does two things with every submission:
 *   1. Appends a row to the lead sheet.
 *   2. Emails the enquiry to the sales inbox.
 *
 * ── Setup ────────────────────────────────────────────────────────────────
 * 1. In the lead Google Sheet: Extensions > Apps Script > paste this file.
 * 2. Fill in SHEET_ID (the spreadsheet id: the long string between
 *    /d/ and /edit in the sheet URL) and RECIPIENT below.
 * 3. Deploy > New deployment > type "Web app", Execute as "Me",
 *    Who has access "Anyone". Copy the .../exec URL.
 * 4. Put it in .env as CONTACT_SALES_WEBHOOK_URL, then redeploy the site.
 *
 * Set the sheet's first row to the header names below — the script appends
 * positionally, so the column order must match COLUMN_HEADERS exactly.
 */

/** The lead sheet. Leave blank to skip sheet logging and only send email. */
var SHEET_ID = "";

/** Primary tab index of the sheet above. 0 = first tab. */
var SHEET_GID = 0;

/**
 * Where enquiries are emailed. Hardcoded on purpose: the script's own value
 * wins over whatever the site sends, so a stale or wrong env var cannot
 * silently redirect sales leads somewhere nobody reads.
 */
var RECIPIENT = "rachmadwipa.novandri@cekat.ai";

/**
 * Where the "reply" goes. Defaults to the visitor's own address, which is what
 * sales wants — hitting Reply answers the lead. App passwords are not an issue:
 * Apps Script sends as the script owner, never as the visitor.
 */
var REPLY_TO_SENDER = true;

var COLUMN_HEADERS = [
  "Waktu",
  "Nama Depan",
  "Nama Belakang",
  "Email",
  "Telepon",
  "Negara",
  "Perusahaan",
  "Jumlah Karyawan",
  "Halaman",
  "Bahasa",
];

function doPost(e) {
  var data = parseBody(e);

  if (!data.email || !data.company || !data.firstName || !data.lastName) {
    // 400 tells the site the submission was malformed, so the visitor sees a
    // retry instead of a false success.
    return json({ ok: false, error: "missing required fields" }, 400);
  }

  var results = {};

  try {
    appendRow(data);
    results.sheet = "ok";
  } catch (err) {
    results.sheet = "error: " + err.message;
  }

  try {
    MailApp.sendEmail({
      to: RECIPIENT,
      subject: buildSubject(data),
      body: buildBody(data),
      htmlBody: buildHtml(data),
      replyTo: REPLY_TO_SENDER ? data.email : "",
    });
    results.email = "ok";
  } catch (err) {
    results.email = "error: " + err.message;
  }

  // The lead is never silently dropped: if the email failed but the sheet row
  // landed, the enquiry is still recorded, so 200 is the honest answer.
  return json({ ok: true, results: results });
}

function doGet() {
  return json({
    ok: true,
    service: "contact-sales",
    recipient: RECIPIENT,
    sheetConfigured: SHEET_ID !== "",
  });
}

function parseBody(e) {
  if (!e || !e.postData) return {};
  var raw = e.postData.contents;
  try {
    return JSON.parse(raw);
  } catch (err) {
    // form-encoded fallback, in case the endpoint is ever called from a plain
    // <form> POST rather than JSON.
    return parseQuery(raw);
  }
}

function parseQuery(raw) {
  var out = {};
  raw.split("&").forEach(function (pair) {
    if (!pair) return;
    var bits = pair.split("=");
    out[decodeURIComponent(bits[0])] = decodeURIComponent(
      (bits[1] || "").replace(/\+/g, " "),
    );
  });
  return out;
}

function appendRow(data) {
  if (SHEET_ID === "") return;

  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetById(SHEET_GID);
  if (!sheet) throw new Error("Sheet tab " + SHEET_GID + " not found");

  // Write the header once, on the first submission, so a brand new sheet is
  // immediately readable without a manual step.
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, COLUMN_HEADERS.length).setValues([COLUMN_HEADERS]);
  }

  var phone =
    data.phoneDisplay || (data.countryCode || "") + (data.phone || "");
  sheet
    .getRange(sheet.getLastRow() + 1, 1, 1, COLUMN_HEADERS.length)
    .setValues([
      [
        data.submittedAt || new Date().toISOString(),
        data.firstName || "",
        data.lastName || "",
        data.email || "",
        phone || "",
        data.countryCode || "",
        data.company || "",
        data.companySize || "",
        data.page || "",
        data.locale || "",
      ],
    ]);
}

function buildSubject(data) {
  return (
    "[Cekat.AI] Permintaan sales — " +
    (data.firstName || "") +
    " " +
    (data.lastName || "") +
    " · " +
    (data.company || "")
  );
}

function buildBody(data) {
  return [
    "Permintaan baru dari halaman Contact Sales.",
    "",
    "Nama      : " + (data.firstName || "") + " " + (data.lastName || ""),
    "Email     : " + (data.email || ""),
    "Perusahaan : " + (data.company || ""),
    "Telepon   : " +
      (data.phoneDisplay ||
        (data.countryCode || "") + (data.phone || "") ||
        "-"),
    "Negara    : " + (data.countryCode || "-"),
    "Karyawan  : " + (data.companySize || "-"),
    "Halaman   : " + (data.page || "-"),
    "Bahasa    : " + (data.locale || "-"),
    "Waktu     : " + (data.submittedAt || new Date().toISOString()),
    "",
    "Balas email ini untuk menghubungi pemohon.",
  ].join("\n");
}

function buildHtml(data) {
  var rows = [
    ["Nama", (data.firstName || "") + " " + (data.lastName || "")],
    ["Email", data.email || ""],
    ["Perusahaan", data.company || ""],
    [
      "Telepon",
      data.phoneDisplay || (data.countryCode || "") + (data.phone || "") || "-",
    ],
    ["Negara", data.countryCode || "-"],
    ["Jumlah karyawan", data.companySize || "-"],
    ["Halaman asal", data.page || "-"],
    ["Bahasa", data.locale || "-"],
    ["Waktu", data.submittedAt || new Date().toISOString()],
  ];

  var trs = rows
    .map(function (row) {
      return (
        "<tr>" +
        '<td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">' +
        escapeHtml(row[0]) +
        "</td>" +
        '<td style="padding:6px 0;color:#101828;font-weight:600">' +
        escapeHtml(row[1]) +
        "</td>" +
        "</tr>"
      );
    })
    .join("");

  return (
    '<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">' +
    '<p style="font-size:15px;color:#101828;margin:0 0 4px">Permintaan sales baru</p>' +
    '<p style="font-size:13px;color:#64748b;margin:0 0 16px">Dari halaman Contact Sales Cekat.AI.</p>' +
    '<table style="border-collapse:collapse;font-size:14px">' +
    trs +
    "</table>" +
    '<p style="font-size:12px;color:#94a3b8;margin:20px 0 0">Balas email ini untuk menghubungi pemohon.</p>' +
    "</div>"
  );
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(payload, code) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setCode(
    code || 200,
  );
}

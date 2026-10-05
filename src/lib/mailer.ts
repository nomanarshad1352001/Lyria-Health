/**
 * ─────────────────────────────────────────────────────────────────────────
 * TRANSACTIONAL EMAIL — STUB TRANSPORT (no SMTP in this demo build)
 * ─────────────────────────────────────────────────────────────────────────
 * Real delivery is a one-line swap: implement `deliver()` with Resend /
 * Postmark / SES, called from `/api/waitlist`. The stub keeps an in-memory
 * outbox (surfaced at /mailbox in the demo) and logs to the server console.
 *
 * In production every send should include the `List-Unsubscribe` and
 * `List-Unsubscribe-Post` headers (one-click unsubscribe, RFC 8058) —
 * note where they go in `deliver()`.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { consent, site } from "@/content/copy";

export interface OutboxEntry {
  id: string;
  to: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
  createdAt: string;
  kind: "confirmation" | "launch-update" | "notification";
}

const globalKey = "__lyria_mail_outbox__";
const g = globalThis as unknown as Record<string, OutboxEntry[]>;
if (!g[globalKey]) g[globalKey] = [];
const outbox = g[globalKey];

export function getOutbox(): OutboxEntry[] {
  return outbox;
}

export async function deliver(entry: OutboxEntry): Promise<void> {
  // PRODUCTION: swap this body for your provider, e.g. Resend:
  //   await resend.emails.send({
  //     from: `Lyria Health <${site.emailHello}>`,
  //     to: entry.to, subject: entry.subject, html: entry.html, text: entry.text,
  //     headers: { "List-Unsubscribe": `<${unsubscribeUrl}>`,
  //                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  //   });
  outbox.unshift(entry);
  if (outbox.length > 50) outbox.pop();
  console.log(`[mail:stub] → ${entry.to} — “${entry.subject}”`);
}

/* ── Email templates ─────────────────────────────────────────────────── */

function shell(title: string, inner: string): string {
  return `<!doctype html>
<html lang="en-GB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#f3efe6;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3efe6;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0c2920;border-radius:20px;overflow:hidden;">
        <tr><td style="padding:36px 40px 8px;">
          <p style="margin:0;color:#c6a367;font-family:Arial,sans-serif;font-size:12px;letter-spacing:.22em;text-transform:uppercase;">${site.name}</p>
        </td></tr>
        ${inner}
        <tr><td style="padding:28px 40px 36px;border-top:1px solid rgba(243,239,230,.14);">
          <p style="margin:0;color:#8faf9d;font-family:Arial,sans-serif;font-size:11px;line-height:1.7;">
            ${site.company} · ${site.domain}<br>
            You're receiving this because you asked to join our waiting list (consent wording ${consent.version}).<br>
            ${site.name} is not yet CQC-registered and provides a waiting list only — no medical services or advice.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function buildConfirmationEmail(input: {
  name: string;
  confirmUrl: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string } {
  const first = input.name.split(" ")[0] ?? input.name;
  const subject = `One click to confirm your place — ${site.name}`;
  const inner = `
    <tr><td style="padding:8px 40px 0;">
      <h1 style="margin:0;color:#f3efe6;font-size:34px;line-height:1.15;font-weight:400;">Nearly there, ${first}.</h1>
      <p style="color:#dde7de;font-family:Arial,sans-serif;font-size:15px;line-height:1.75;margin:20px 0 8px;">
        Confirm your email to hold your place on the ${site.name} waiting list. This double opt-in step
        proves this address is yours — your place is only reserved once you confirm.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 10px;"><tr>
        <td style="background:#f3efe6;border-radius:999px;">
          <a href="${input.confirmUrl}" style="display:inline-block;padding:16px 34px;color:#0c2920;font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;">Confirm my place →</a>
        </td>
      </tr></table>
      <p style="color:#8faf9d;font-family:Arial,sans-serif;font-size:12.5px;line-height:1.7;margin:22px 0 0;">
        Button not working? Paste this into your browser:<br>
        <a href="${input.confirmUrl}" style="color:#c6a367;word-break:break-all;">${input.confirmUrl}</a>
      </p>
      <p style="color:#8faf9d;font-family:Arial,sans-serif;font-size:12.5px;line-height:1.7;margin:18px 0 0;">
        Not you? <a href="${input.unsubscribeUrl}" style="color:#f3efe6;">Unsubscribe instantly</a> — no login, one click.
      </p>
    </td></tr>`;
  const text = `Hi ${first},\n\nConfirm your email to hold your place on the ${site.name} waiting list:\n${input.confirmUrl}\n\nNot you? Unsubscribe: ${input.unsubscribeUrl}\n\n${site.company} — waiting list only; not yet CQC-registered.`;
  return { subject, html: shell(subject, inner), text };
}

export function buildLaunchUpdateEmail(): { subject: string } {
  return { subject: `Lyria Health is ready — your founding invite` };
}

# Lyria Health — DNS & email records (lyriahealth.co.uk)

Records to configure at your DNS provider. Hosting and transactional email
are separated so marketing mail never shares a reputation with the site.

## 1. Hosting

| Type | Name | Value | Notes |
| ---- | ---- | ----- | ----- |
| `A` | `@` | Hosting provider's anycast IP (e.g. Vercel `76.76.21.21`) | Apex domain |
| `CNAME` | `www` | `cname.vercel-dns.com.` (or provider equivalent) | Redirect `www` → apex at the host |

Set `NEXT_PUBLIC_SITE_URL=https://lyriahealth.co.uk` in the environment; the
site uses `metadataBase` and request `origin` for all absolute URLs (confirm,
unsubscribe), so no hard-coded domains exist in the code.

## 2. Transactional email (double opt-in, unsubscribe)

Recommended: Resend or Postmark on a **subdomain**, e.g. `mail.lyriahealth.co.uk`.

| Type | Name | Value |
| ---- | ---- | ----- |
| `TXT` | `@` (or `mail`) | `v=spf1 include:spf.resend.net ~all` — from your provider |
| `CNAME` | provider-supplied DKIM selector(s) | provider-supplied DKIM keys |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@lyriahealth.co.uk; fo=1` |
| `MX` | `@` | Your inbox provider's MX records (for `hello@`, `privacy@`) |

**Production switches:**

- `EMAIL_TRANSPORT=live` — moves `/api/waitlist` from the stub outbox to real
  delivery (see `src/lib/mailer.ts → deliver()`). Also removes the `/mailbox`
  preview links from API responses (they're only emitted while stubbed).
- Real sends must include `List-Unsubscribe` and
  `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers (RFC 8058) —
  marked in `deliver()`.
- `EXPORT_TOKEN=<secret>` — locks `GET /api/waitlist/export` behind
  `Authorization: Bearer <token>` (timing-safe comparison already implemented).
- `LOG_SALT=<random>` — salts the consent-log IP hash.

## 3. Receiving mail (hello@, privacy@)

Use a hosted mailbox (Google Workspace / Fastmail / Proton). Add its `MX`,
`SPF` merge, and DKIM records as supplied. `privacy@lyriahealth.co.uk` is
published as the data-protection contact in the Privacy Notice and footer.

## 4. Launch checklist

- [ ] Domain on host + HTTPS forced
- [ ] SPF / DKIM / DMARC verified and passing (`p=quarantine` → `p=reject`)
- [ ] `EMAIL_TRANSPORT=live` with provider API key in env (never in code)
- [ ] `/mailbox` decommissioned (it is demo-only and `Disallow`ed in robots.txt)
- [ ] `EXPORT_TOKEN` + `LOG_SALT` set
- [ ] Swap the in-memory store for the Drizzle adapter (same interface, see
      `src/lib/store.ts`) — no API route or UI changes required

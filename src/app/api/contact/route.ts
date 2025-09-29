import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // Edge değil

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name = "", email = "", message = "" } = await req.json();

    // if the fields empty
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // from .env
    const fromName = process.env.FROM_NAME || "Portfolio";
    const fromEmail = process.env.FROM_EMAIL || "fromportfolio@resend.dev";
    const toEmail = process.env.TO_EMAIL || "turbofullstack.dev10@gmail.com ";


    const escapeHtml = (s: string) =>
      s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

    const contactEmailHtml = (params: { name: string; email: string; message: string; fromName?: string }) => {
      const name = escapeHtml(params.name || "");
      const email = escapeHtml(params.email || "");
      const message = escapeHtml(params.message || "");
      const fromName = escapeHtml(params.fromName || "Portfolio");

      return `<!doctype html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New message from ${name}</title>
</head>
<body style="margin:0; padding:0; background-color:#f6f9fc;">
  <!-- Preheader (inbox preview) -->
  <div style="display:none;opacity:0;color:transparent;visibility:hidden;height:0;width:0;overflow:hidden;">
    New contact message from ${name}
  </div>

  <table role="presentation" width="100%" style="border-collapse:collapse;background:#f6f9fc;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;">
          <tr>
            <td style="padding:24px 24px 12px 24px;">
              <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:20px;line-height:1.4;color:#111827;">
                New message from ${name}
              </h1>
              <p style="margin:6px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;color:#6b7280;">
                You usually reply within 24 hours.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 24px 16px 24px;">
              <table role="presentation" width="100%" style="border-collapse:collapse;margin:8px 0 0;">
                <tr>
                  <td style="width:80px;font:14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#6b7280;">Name</td>
                  <td style="font:16px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">${name}</td>
                </tr>
                <tr>
                  <td style="width:80px;font:14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#6b7280;">Email</td>
                  <td style="font:16px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
                    <a href="mailto:${email}" style="color:#4f46e5;text-decoration:none;">${email}</a>
                  </td>
                </tr>
              </table>

              <div style="margin-top:12px;padding:16px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa;">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#111827;white-space:pre-wrap;">
                  ${message}
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 24px 24px 24px;">
              <p style="margin:0;font:12px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#6b7280;">
                Reply directly to this email to reach ${name}, or click
                <a href="mailto:${email}" style="color:#4f46e5;text-decoration:none;">here</a>.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0;font:12px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#9ca3af;">
          Sent via ${fromName}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
    };

    //resend mail integration
    const res = await resend.emails.send({
      from: fromName,// from : user user@gmail.com
      to: toEmail,                        // my personal email address
      subject: `New message from ${name}`, // title of the mail
      html: contactEmailHtml({ name, email, message, fromName }),
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (res.error) throw res.error
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg =
     process.env.NODE_ENV === "development"
        ? (e instanceof Error ? e.message : String(e))
        : "Failed to send";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

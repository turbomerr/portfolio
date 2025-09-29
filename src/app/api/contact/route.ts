import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // Edge değil

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name = "", email = "", message = "" } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const fromName = process.env.FROM_NAME || "Portfolio";
    const fromEmail = process.env.FROM_EMAIL || "fromportfolio@resend.dev";
    const toEmail = process.env.TO_EMAIL || "turbofullstack.dev10@gmail.com ";

    const { error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject: `New message from ${name}`,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${String(message).replace(/\n/g, "<br/>")}</p>
      `,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg =
      process.env.NODE_ENV === "development" ? String(e?.message || e) : "Failed to send";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

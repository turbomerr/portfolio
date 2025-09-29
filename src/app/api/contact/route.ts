// app/api/contact/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const nodemailer = (await import("nodemailer")).default;

    const { name = "", email = "", message = "" } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,              // e.g. sandbox.smtp.mailtrap.io
      port: Number(process.env.MAILTRAP_PORT ?? 2525),
      secure: false,                                // 2525/587 -> false
      auth: {
        user: process.env.MAILTRAP_USER!,
        pass: process.env.MAILTRAP_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio" <no-reply@example.test>`,
      to: process.env.TO_EMAIL ?? "hello@example.com", // Mailtrap inbox'ta yine düşer
      replyTo: `${name} <${email}>`,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p>${String(message).replace(/\n/g, "<br/>")}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? "Failed") }, { status: 500 });
  }
}

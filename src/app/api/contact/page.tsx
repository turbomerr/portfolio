"use client";

import { useState } from "react";

const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<{ok?: boolean; error?: string} | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInfo(null);

    if (!name.trim() || !isEmail(email) || !message.trim()) {
      setInfo({ error: "Lütfen tüm alanları geçerli doldurun." });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Gönderim başarısız.");
      setInfo({ ok: true });
      setName(""); setEmail(""); setMessage("");
    } catch (err: any) {
      setInfo({ error: err?.message || "Bir hata oluştu." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">İletişim</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="ornek@eposta.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="w-full rounded-lg border px-3 py-2"
          rows={6}
          placeholder="Mesajınız..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {submitting ? "Gönderiliyor..." : "Gönder"}
        </button>

        {info?.ok && <p className="text-green-700 text-sm">Mesaj gönderildi!</p>}
        {info?.error && <p className="text-red-700 text-sm">{info.error}</p>}
      </form>
    </main>
  );
}

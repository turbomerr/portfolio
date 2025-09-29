// components/ContactSection.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Status = "idle" | "ok" | "error";

export default function ContactSection() {
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot (bot doldurursa sessizce başarı gösterip bırak)
    if (String(fd.get("company") || "").trim().length > 0) {
      setStatus("ok");
      form.reset();
      return;
    }

    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      return;
    }

    try {
      setSending(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok || data?.ok !== true) throw new Error(data?.error || "Failed");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Send a message</CardTitle>
          <CardDescription>I usually reply within 24 hours.</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleContactSubmit}
            className="space-y-4"
            aria-busy={sending}
            noValidate
          >
            {/* Honeypot — ekranda görünmez, botlar görebilsin */}
            <div className="absolute -left-[9999px] top-auto">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                disabled={sending}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                required
                disabled={sending}
                autoComplete="email"
                pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="How can I help?"
                className="min-h-[120px]"
                required
                disabled={sending}
              />
            </div>

            <Button type="submit" disabled={sending} aria-disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </Button>

            <div className="min-h-5">
              {status === "ok" && (
                <p className="text-green-600 text-sm mt-2" role="status" aria-live="polite">
                  Message sent ✅
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-sm mt-2" role="status" aria-live="assertive">
                  Something went wrong ❌
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

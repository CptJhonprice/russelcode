"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedGrid from "@/components/ui/AnimatedGrid";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactScene() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");
  const [errMsg,  setErrMsg]  = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _trap: "", // honeypot — always empty from real users
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? data.error ?? "Bir hata oluştu.");
      setStatus("success");
      setName(""); setEmail(""); setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--color-border-strong)",
    color: "var(--fg)",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    fontWeight: 300,
    padding: "12px 0",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      aria-labelledby="contact-heading"
      style={{ background: "var(--bg)" }}
    >
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatedGrid opacity={0.04} color="var(--color-accent)" cellSize={80} drift />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, var(--color-accent-glow) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 130% 130% at 50% 50%, transparent 30%, rgba(var(--vignette-rgb),0.5) 100%)" }} />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--color-border-subtle)" }} aria-hidden="true" />

      <div className="relative z-10 flex-1 flex items-center justify-center px-5 md:px-10 py-28 md:py-40">
        <div className="w-full max-w-xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex justify-center mb-10"
          >
            <SectionLabel index="//06" title="CONTACT" />
          </motion.div>

          <motion.h2
            id="contact-heading"
            className="t-headline mb-4 text-center"
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.08, ease: [0.16,1,0.3,1] }}
          >
            Build with
            <br />
            <em className="not-italic" style={{ color: "rgba(74,130,168,0.55)" }}>RussellCode.</em>
          </motion.h2>

          <motion.p
            className="t-body text-center mx-auto mb-12"
            style={{ maxWidth: "38ch" }}
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
          >
            Proje fikrinizi paylaşın, sizinle iletişime geçelim.
          </motion.p>

          {/* ── Form ── */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.22, ease: [0.16,1,0.3,1] }}
            noValidate
          >
            {/* Honeypot — hidden from users, visible to bots */}
            <input
              type="text"
              name="_trap"
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              style={{ display: "none" }}
              readOnly
            />

            <div className="flex flex-col gap-8 mb-10">
              {/* Name */}
              <div className="relative">
                <label className="t-label block mb-2" style={{ color: "var(--fg-sub)", fontSize: "0.48rem", letterSpacing: "0.28em" }}>
                  İSİM
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Adınız Soyadınız"
                  style={{ ...inputStyle, cursor: "none" }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = "#4a82a8")}
                  onBlur={e  => (e.currentTarget.style.borderBottomColor = "var(--color-border-strong)")}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label className="t-label block mb-2" style={{ color: "var(--fg-sub)", fontSize: "0.48rem", letterSpacing: "0.28em" }}>
                  E-POSTA
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="ornek@sirket.com"
                  style={{ ...inputStyle, cursor: "none" }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = "#4a82a8")}
                  onBlur={e  => (e.currentTarget.style.borderBottomColor = "var(--color-border-strong)")}
                />
              </div>

              {/* Message */}
              <div className="relative">
                <label className="t-label block mb-2" style={{ color: "var(--fg-sub)", fontSize: "0.48rem", letterSpacing: "0.28em" }}>
                  MESAJ
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  minLength={10}
                  rows={4}
                  placeholder="Projenizi kısaca anlatın..."
                  style={{ ...inputStyle, resize: "none", cursor: "none" }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = "#4a82a8")}
                  onBlur={e  => (e.currentTarget.style.borderBottomColor = "var(--color-border-strong)")}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="group w-full flex items-center justify-center gap-4 min-h-[52px] t-label transition-colors"
              style={{
                border: "1px solid var(--color-border-strong)",
                color: status === "sending" ? "var(--color-border-strong)" : "var(--fg)",
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                background: "transparent",
                cursor: status === "sending" ? "wait" : "none",
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={e => { if (status !== "sending") (e.currentTarget as HTMLButtonElement).style.borderColor = "#4a82a8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border-strong)"; }}
            >
              {status === "sending" ? "GÖNDERİLİYOR..." : "PROJEYİ BAŞLAT"}
              {status !== "sending" && (
                <span className="block h-px" style={{ width: 16, background: "var(--color-accent)", transition: "width 0.2s ease" }} />
              )}
            </button>

            {/* Feedback messages */}
            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="t-label mt-5 text-center"
                style={{ color: "#4a82a8", fontSize: "0.52rem", letterSpacing: "0.2em" }}
              >
                ✓ Mesajınız alındı — en kısa sürede dönüş yapacağız.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="t-label mt-5 text-center"
                style={{ color: "#c06060", fontSize: "0.52rem", letterSpacing: "0.16em" }}
              >
                {errMsg}
              </motion.p>
            )}
          </motion.form>

          {/* Decorative rule */}
          <div className="flex items-center gap-5 mt-16 opacity-[0.15]" aria-hidden="true">
            <div className="flex-1 h-px" style={{ background: "var(--color-border-default)" }} />
            <span className="t-label" style={{ fontSize: "0.5rem", letterSpacing: "0.3em" }}>RC</span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border-default)" }} />
          </div>
        </div>
      </div>

      <footer
        className="relative z-10 px-5 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>RUSSELLCODE</span>
        <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>© {new Date().getFullYear()} — ALL RIGHTS RESERVED</span>
        <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>SOFTWARE BUILT WITH REASON.</span>
      </footer>
    </section>
  );
}

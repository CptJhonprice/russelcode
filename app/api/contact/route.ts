import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; ts: number }>();
const RATE_WINDOW = 60_000; // 1 minute
const MAX_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.ts > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count++;
  if (entry.count > MAX_PER_WINDOW) return true;
  return false;
}

export async function POST(req: NextRequest) {
  // ── Rate limit ─────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen bir dakika bekleyin." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const { name, email, message, _trap } = body;

  // ── Honeypot — botlar bu alanı doldurur, gerçek kullanıcılar doldurmaz ──
  if (_trap) {
    // Bota sahte başarı döndür, gerçekten gönderme
    return NextResponse.json({ ok: true });
  }

  // ── Validation ─────────────────────────────────────────────────
  if (
    typeof name !== "string" || name.trim().length < 2 ||
    typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" || message.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "Lütfen tüm alanları doğru doldurun." },
      { status: 400 }
    );
  }

  const safeName    = name.trim().slice(0, 120);
  const safeEmail   = email.trim().slice(0, 254);
  const safeMessage = message.trim().slice(0, 3000);

  // ── Send via Resend ────────────────────────────────────────────
  try {
    // Lazy init — env var only available at runtime, not build time
    const resend = new Resend(process.env.RESEND_API_KEY);

    // TO: RESEND_TO_EMAIL env var ile override edilebilir.
    // Domain doğrulaması sonrası "destek@russellcode.com" kullan.
    // Geçici olarak Resend hesabına kayıtlı gmail adresi kullanılıyor.
    const toEmail = process.env.RESEND_TO_EMAIL ?? "gunaayozer@gmail.com";

    await resend.emails.send({
      from: "RussellCode İletişim <onboarding@resend.dev>",
      to:   toEmail,
      replyTo: safeEmail,
      subject: `Yeni proje talebi — ${safeName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;color:#1a1a1a;line-height:1.6;">
          <div style="background:#070709;padding:24px 28px;border-bottom:2px solid #4a82a8;">
            <span style="font-size:11px;letter-spacing:0.22em;color:#4a82a8;font-family:monospace;">
              RUSSELLCODE — YENİ PROJE TALEBİ
            </span>
          </div>
          <div style="padding:28px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;font-size:12px;color:#888;width:80px;">İsim</td>
                <td style="padding:8px 0;font-size:15px;font-weight:600;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:12px;color:#888;">E-posta</td>
                <td style="padding:8px 0;font-size:15px;">${safeEmail}</td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
            <p style="font-size:12px;color:#888;margin-bottom:8px;">Mesaj</p>
            <div style="background:#f8f8f8;padding:16px;border-left:3px solid #4a82a8;font-size:14px;white-space:pre-wrap;">
${safeMessage}
            </div>
          </div>
          <div style="background:#f4f4f4;padding:14px 28px;">
            <span style="font-size:11px;color:#bbb;font-family:monospace;">
              russellcode.com iletişim formu · ${new Date().toLocaleString("tr-TR")}
            </span>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[contact] Resend error:", msg);
    return NextResponse.json(
      { error: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.", detail: msg },
      { status: 500 }
    );
  }
}

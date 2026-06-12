@AGENTS.md

# RussellCode — Proje Rehberi

## Proje Nedir?
RussellCode, bir yazılım stüdyosunun kurumsal tanıtım sitesidir. Sinematik, scroll-driven bir hikaye anlatımı deneyimi sunar. Ziyaretçi sayfayı kaydırdıkça her section bir sahne gibi açılır — felsefe, süreç, ürünler sırayla anlatılır.

**Canlı URL:** https://www.russellcode.com  
**GitHub:** https://github.com/CptJhonprice/russelcode  
**Deploy:** Vercel (otomatik, `main` branch'e push = deploy)

---

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 + inline CSS tokens |
| Animasyon | GSAP 3 + ScrollTrigger |
| Smooth scroll | Lenis (`@studio-freight/lenis`) |
| 3D / WebGL | Three.js + `@react-three/fiber` + `@react-three/drei` |
| 3D sahneler | Spline (`@splinetool/react-spline`) |
| Motion | Framer Motion |
| E-posta | Resend API (`/api/contact` route) |
| Font | Gloock (display), InstrumentSans (body), JetBrainsMono (mono) |

---

## Tasarım Sistemi

### Renk Tokenları (`app/globals.css`)
```css
--bg: #070709          /* Ana arka plan */
--fg: #e2dfd9          /* Ana metin */
--fg-sub: #7a7672      /* İkincil metin */
--fg-muted: #3a3a42    /* Soluk metin — karanlık bg'de KULLANMA */
--accent: #4a82a8      /* Mavi aksent */
--accent-glow: rgba(74,130,168,0.14)
--border: #0e0e12
--border-mid: #181820
--border-strong: #242430
```

> ⚠️ `var(--fg-muted)` (#3a3a42) karanlık arka planda görünmez.
> Karanlık section'larda ikincil metin için `rgba(74,130,168,0.55)` kullan.

### Semantic Aliases
`--color-surface-base`, `--color-text-primary`, `--color-accent` vb.  
→ Tüm aliaslar `globals.css` içinde tanımlı.

### Tipografi Sınıfları
```
.t-display   → Gloock, clamp(3.8rem, 11vw, 12rem) — hero başlıklar
.t-headline  → InstrumentSans, clamp(2.4rem, 6vw, 6.5rem) — section başlıklar
.t-scene     → InstrumentSans, clamp(1.9rem, 4.2vw, 4.8rem) — sticky copy
.t-label     → JetBrainsMono, 0.6rem, tracking wide — etiketler
.t-body      → InstrumentSans, clamp(0.9rem, 1.1vw, 1rem) — paragraflar
.t-mono      → JetBrainsMono, 0.65rem — teknik detaylar
```

### `cn()` utility
```ts
import { cn } from "@/lib/utils"; // clsx + tailwind-merge
```

---

## Scroll Storytelling Mimarisi

Sitenin temel UX'i **scroll-driven sahneler**dir. Her büyük section sticky bir panel oluşturur ve ScrollTrigger ile içerik kaydırma ilerledikçe değişir.

### Pattern:
```tsx
// 500vh yükseklik → ScrollTrigger pin → scrub animasyon
<div ref={outerRef} style={{ height: "500vh" }}>
  <div ref={stickyRef} className="h-screen sticky top-0">
    {/* İçerik GSAP ile scrub'a göre değişir */}
  </div>
</div>
```

### GSAP + Lenis Entegrasyonu (`lib/lenis.ts`)
```ts
// ZORUNLU: Lenis ve GSAP aynı RAF loop'u paylaşmalı
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```
> ⚠️ Bağımsız `requestAnimationFrame` kullanma — scroll sync bozulur.

---

## Section Haritası

```
/ (tek sayfa)
├── HeroScene          #hero    — Spline robot + "Software built with reason."
├── PhilosophyScene    #philosophy — 4 felsefe cümlesi, scroll ile değişir
├── ProcessScene       #process — 5 adım (Idea→Scale), sticky scroll-story
├── ProductsScene      #products — Lamp efekti + 3 ürün kartı
├── CapabilitiesScene  #capabilities — Yetenek listesi
└── ContactScene       #contact — Form (Resend ile)
```

### Her Section'ın Görevi:
- **HeroScene** — İlk izlenim. Spline Nexbot robotu interaktif arka plan. Başlık scroll ile fade-out.
- **PhilosophyScene** — `400vh` sticky. 4 felsefe cümlesi sırayla açılır. Three.js morphing sphere.
- **ProcessScene** — `500vh` sticky. 5 süreç adımı. Desktop'ta sağda büyük ghost sayı (01-05), mobile'da gizli. Three.js constellation arka plan.
- **ProductsScene** — Aceternity Lamp efekti başlığın üstünde. 3 ürün kartı (NesiVar, Raftan, WisePlates). `LampContainer` içinde heading.
- **CapabilitiesScene** — Static section. Sol: heading sticky, sağ: liste.
- **ContactScene** — İletişim formu. Resend API. Honeypot spam koruması.

---

## Önemli Komponentler

### `components/layout/Layout.tsx`
- `CustomCursor` her zaman render edilir (z-index 10001, EnterScreen'in üstünde)
- `body.overflow = "hidden"` EnterScreen açıkken
- Lenis sadece `ready === true` olduğunda başlar

### `components/ui/EnterScreen.tsx`
- Site yüklenene kadar giriş ekranı gösterir
- Three.js constellation arka plan (`EnterGL`)
- RUSSELLCODE metni scramble animasyonuyla açılır (Gloock, clamp 2.4rem→9vw→9rem)
- Dönen SVG ring button
- `sceneLoaded` → Spline hazır olduğunda `notifySceneLoaded()` ile tetiklenir

### `context/AssetsContext.tsx`
```tsx
// SplineHero yüklenince bunu çağırır → EnterScreen kapanır
const { notifySceneLoaded } = useAssets();
```

### `components/ui/LampContainer.tsx`
- Aceternity UI Lamp, Tailwind v4 için adapte edildi
- `conic-gradient()` inline (bg-gradient-conic Tailwind v4'te yok)
- Accent: `#4a82a8`, BG: `#070709`
- Mobile: `min-h-[50vh]`, Desktop: `min-h-[60vh]`

### `components/three/EnterGL.tsx`
- Constellation: 260 node + aralarında çizgiler + mouse parallax

### `lib/ambient-sound.ts`
- Saf Web Audio API ile okyanus sesi (dosya yok)
- 4 katman: swell (BPF + LFO), sub rumble, mid wash, spray

---

## API

### `POST /api/contact`
```ts
body: { name, email, message, _trap }
// _trap: honeypot — boş olmalı (bot koruması)
```
- `RESEND_API_KEY` env var gerekli
- `RESEND_FROM_EMAIL` → gönderen (ör. `destek@russellcode.com`)
- `RESEND_TO_EMAIL` → alıcı (ör. `destek@russellcode.com`)
- Rate limit: 5 istek / 5 dakika (IP başına)

---

## Deployment

```bash
git add -A
git commit -m "feat: ..."
git push origin master:main   # Vercel otomatik deploy alır
```

> ⚠️ Local branch: `master` → Remote branch: `main`

### Vercel Env Vars (gerekli):
| Key | Değer |
|---|---|
| `RESEND_API_KEY` | Resend dashboard'dan alınan `re_...` key |
| `RESEND_FROM_EMAIL` | `destek@russellcode.com` |
| `RESEND_TO_EMAIL` | `destek@russellcode.com` |

---

## Cursor
- Custom cursor: dot (7px) + ring (14px), z-index 10001/10000
- `cursor: none` tüm HTML + button/a elementlerinde
- Mobile'da otomatik devre dışı (`@media max-width: 767px`)

## Mobile Notları
- Ghost sayılar (`hidden md:flex`) — mobile'da gizli
- Ticker, EnterScreen, section padding'ler mobile için ayarlandı
- Lenis scroll lock EnterScreen açıkken aktif
- Spline: mobile'da dokunmatik çalışır ama ağır olabilir

---

## Ürünler (Products Section)
| Ürün | Kategori | Açıklama |
|---|---|---|
| NesiVar | AI — Mobile | AI destekli araç analiz platformu |
| Raftan | AI — Health | Gıda etiketi analiz uygulaması |
| WisePlates | Platform — B2B | Diyetisyenler için CRM |

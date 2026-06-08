# RussellCode — Proje İlerleme Kaydı

Son güncelleme: 2026-06-08  
Commit: `5ac5f76` — "Build RussellCode cinematic website from scratch"

---

## Proje Özeti

**RussellCode** için premium, sinematik, scroll-driven bir yazılım stüdyosu websitesi.  
Referans: hashgraphvc.com, inkwell.tech (tasarım kopyalanmadı, sadece etkileşim mantığı alındı)

**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · Framer Motion · React Three Fiber · Three.js · Web Audio API

---

## Dosya Yapısı

```
app/
  globals.css          — Design token sistemi, font tanımları, tipografi scale
  layout.tsx           — Inter → Gloock+InstrumentSans+JetBrainsMono
  page.tsx             — 6 section + Ticker birleştirmesi

components/
  layout/
    Layout.tsx         — Lenis init, CustomCursor, NoiseOverlay, ProgressIndicator, SoundToggle
  sections/
    HeroScene.tsx      — Fullscreen, Three.js HeroGL, Gloock serif başlık, GSAP parallax
    PhilosophyScene.tsx — 400vh sticky, 4 state cross-fade, Three.js PhilosophyGL
    ProcessScene.tsx   — 500vh sticky, 5 adım timeline + glowing node, Three.js ProcessGL
    ProductsScene.tsx  — 3 ürün kartı, AmbientField background
    CapabilitiesScene.tsx — Framer Motion stagger list, sticky left heading
    ContactScene.tsx   — Minimal CTA, mailto link, animated grid, footer
  three/
    HeroGL.tsx         — 3000 particle cloud + wireframe icosahedron + orbiting octahedron
    PhilosophyGL.tsx   — Sine-displaced morphing sphere + torus ring + particle halo
    ProcessGL.tsx      — 22-node network graph, LineSegments, PulseRing animasyonları
    AmbientField.tsx   — 350 particle hafif arka plan (Products/Contact için)
  ui/
    AnimatedGrid.tsx   — Canvas çizgi grid, intersection dot'lar, ResizeObserver
    CustomCursor.tsx   — Dot (mix-blend-mode: difference) + lag'li ring, link hover expand
    NoiseOverlay.tsx   — Canvas film grain (overlay blend, 0.028 opacity)
    ProductCard.tsx    — Magnetic 3D tilt, cursor spotlight, corner brackets, EXPLORE cue
    ProgressIndicator.tsx — Sağ taraf dikey scroll rail + glowing dot + section labels
    SectionLabel.tsx   — //01..//06 mono font etiketler
    SoundToggle.tsx    — Web Audio toggle, equaliser bar animasyonu
    Ticker.tsx         — Marquee/scrolling teknik etiket şeridi
    VideoScene.tsx     — Video + AnimatedGrid fallback (video dosyaları henüz yok)

lib/
  lenis.ts             — Smooth scroll singleton (duration: 1.4, wheelMultiplier: 0.9)
  ambient-sound.ts     — Web Audio API synth: 42Hz sub-bass + octave + filtered noise + LFO

public/
  fonts/               — Skill'den kopyalandı (ui-styling canvas-fonts)
    Gloock-Regular.ttf
    InstrumentSans-Regular.ttf
    InstrumentSans-Bold.ttf
    JetBrainsMono-Regular.ttf
    JetBrainsMono-Bold.ttf
  videos/              — BOŞALTI. Gerçek videolar için:
    hero.webm
    philosophy.webm
    process.webm
    products.webm
```

---

## Kurulu Paketler

```json
"dependencies": {
  "@react-three/drei": "latest",
  "@react-three/fiber": "latest",
  "@studio-freight/lenis": "^1.0.42",
  "framer-motion": "^12.x",
  "gsap": "^3.15.0",
  "next": "16.2.7",
  "react": "19.x",
  "three": "latest"
}
```

---

## Design Token Sistemi (globals.css)

```css
:root {
  --bg:            #070709;    /* Ana arka plan */
  --bg-raised:     #0c0c10;    /* Kart arka planı */
  --bg-overlay:    #111116;    /* Hover arka planı */
  --fg:            #e2dfd9;    /* Ana metin (12.4:1 kontrast) */
  --fg-sub:        #7a7672;    /* İkincil metin (4.7:1) */
  --fg-muted:      #3a3a42;    /* Soluk metin */
  --fg-ghost:      #1c1c22;    /* Footer metin */
  --accent:        #4a82a8;    /* Mavi vurgu */
  --accent-dim:    #1e3040;    /* Vurgu koyu */
  --accent-glow:   rgba(74,130,168,0.14);
  --border:        #0e0e12;
  --border-mid:    #181820;
  --border-strong: #242430;

  --font-display: "Gloock", serif;         /* Editorial başlıklar */
  --font-body:    "InstrumentSans", sans;  /* Genel metin */
  --font-mono:    "JetBrainsMono", mono;   /* Teknik etiketler */
}
```

**Tipografi sınıfları:**
- `.t-display` — Gloock serif, clamp(3.8rem → 12rem), line-height 0.86
- `.t-headline` — InstrumentSans, clamp(2.4rem → 6.5rem), weight 300
- `.t-scene` — InstrumentSans, clamp(1.9rem → 4.8rem) — sticky scene metinleri
- `.t-label` — JetBrainsMono, 0.6rem, tracking 0.18em, uppercase
- `.t-body` — InstrumentSans, clamp(0.9rem → 1rem), line-height 1.75
- `.t-mono` — JetBrainsMono, 0.65rem

---

## Section Detayları

### Hero (//01)
- **Yükseklik:** 100vh
- **Layout:** Alt-sol köşede büyük başlık + sağ-alt köşede dikey SCROLL indicator
- **WebGL:** HeroGL — particle cloud (3000), wireframe icosahedron sağda döner
- **Animasyon:** GSAP: opacity+y entrance stagger, scroll parallax (scale+fade)
- **Font:** Gloock serif `t-display` — "Software / built with / reason."

### Philosophy (//02)  
- **Yükseklik:** 400vh (sticky 100vh)
- **4 state:** Logic before noise → Systems before screens → Products before promises → Software built with reason
- **State değişimi:** GSAP cross-fade (fade-out-up → fade-in-up), sağda progress rail
- **WebGL:** PhilosophyGL — sine-displaced morphing sphere, torus orbit, particle halo
- **Sub caption:** Her state için açıklayıcı alt metin

### Process (//03)
- **Yükseklik:** 500vh (sticky 100vh)
- **5 adım:** Idea → Prototype → Product → Launch → Scale
- **Timeline:** Horizontal track, scrubing node, fill animasyonu
- **Copy:** GSAP cross-fade ile dinamik adım kopyası
- **WebGL:** ProcessGL — 22 node network graph, 5 process node'da PulseRing

### Products (//04)
- **3 ürün:** NesiVar (AI Vehicle), Raftan (AI Food), WisePlates (Dietitian CRM)
- **Kart:** Magnetic 3D tilt (Framer Motion spring), cursor spotlight, corner brackets
- **Hover:** EXPLORE arrow, border renk değişimi, index accent rengi

### Capabilities (//05)
- **8 yetenek:** Mobile Apps, AI Systems, Backend Infrastructure...
- **Layout:** Sticky sol heading + sağda stagger list
- **Animasyon:** Framer Motion whileInView, 50ms stagger, ease-out

### Contact (//06)
- **CTA:** `mailto:hello@russellcode.com` → START A PROJECT butonu
- **Arka plan:** AnimatedGrid + radial bloom + vignette
- **Footer:** RUSSELLCODE | © 2026 | SOFTWARE BUILT WITH REASON

---

## UI Chrome Detayları

### CustomCursor
- `cursor: none` globally (CSS)
- Dot: 7px, beyaz, `mix-blend-mode: difference`
- Ring: 36px, accent rengi border, GSAP lag (`duration: 0.55, ease: power3.out`)
- Link hover: ring 2.4x büyür, dot kaybolur

### Ticker
- Hero ile Philosophy arasında
- Marquee animasyonu: 28 saniye döngü
- İçerik: "AI-Native Products · Mobile Applications · Backend Systems..."
- Hover'da pause

### ProgressIndicator
- Sağ taraf, orta-dikey, desktop'ta görünür
- 60px scroll sonrası fade-in
- Aktif section label (//01, //02...) üstte
- Dikey rail + glowing dot scroll ile kayıyor
- 6 section dot altta

### SoundToggle
- Sağ üst köşe, fixed
- Web Audio API: 42Hz sub-bass + 84Hz octave + 300Hz filtered noise + LFO
- Açılışta 2.5s fade-in, kapanışta 1.5s fade-out
- 5 equaliser bar: staggered height animation

### NoiseOverlay
- 256×256 canvas tile, her 4 frame yeniden çizilir
- opacity: 0.028, mix-blend-mode: overlay

---

## Video Placeholder Sistemi

`VideoScene.tsx` component'i:
1. Verilen `src` yolunu dener
2. Video yüklenemezse: AnimatedGrid + radial bloom fallback gösterir
3. Overlay her zaman üstte

**Video eklemek için:**
```
public/videos/hero.webm      → HeroScene
public/videos/philosophy.webm → PhilosophyScene
public/videos/process.webm   → ProcessScene
```
Her bölümde `<VideoScene src="/videos/hero.webm" />` ile kullanılır.  
Şu an Three.js WebGL kullanıldığı için VideoScene bölümlerde aktif değil.

---

## Skill Kullanımı

### ui-styling skill (canvas-fonts)
Kopyalanan fontlar: `Gloock`, `InstrumentSans`, `JetBrainsMono`  
Kaynak: `.claude/skills/ui-styling/canvas-fonts/`

### ui-ux-pro-max skill (SKILL.md guidelines — scripts boştu, manuel uygulandı)
- WCAG 4.5:1 kontrast
- Touch target ≥44px  
- Animation: 150-300ms, transform/opacity only
- Skip link, ARIA landmarks, focus-visible
- Reduced-motion desteği
- Tabular nums

---

## Deploy

```bash
vercel --prod
# veya
npm run build && npm start
```

Env var gerekmez. Statik export (`○`).

---

## Yapılacaklar / Sonraki Adımlar

- [ ] Gerçek cinematic video dosyaları ekle (`public/videos/*.webm`)
- [ ] `hello@russellcode.com` adresini gerçek e-postayla değiştir
- [ ] Mobile test — özellikle sticky scroll bölümleri
- [ ] OG image ekle (social sharing için)
- [ ] Analytics ekle (Vercel Analytics veya Plausible)
- [ ] NesiVar, Raftan, WisePlates için gerçek link/showcase URL
- [ ] `ui-ux-pro-max` skill script'leri kurulursa design system generator çalıştır

export type Lang = "en" | "tr";

// English is the source shape; Turkish must match it (enforced by the Dict type).
const en = {
  nav: {
    intro: "INTRO",
    philosophy: "PHILOSOPHY",
    process: "PROCESS",
    products: "PRODUCTS",
    capabilities: "CAPABILITIES",
    contact: "CONTACT",
  },
  hero: {
    title: ["Software", "built with", "reason."],
    studio: "SOFTWARE STUDIO — EST. 2026",
    subtitle:
      "RussellCode designs and builds AI‑native products, mobile apps, and scalable software systems.",
    scroll: "SCROLL",
  },
  ticker: [
    "AI-Native Products",
    "Mobile Applications",
    "Backend Systems",
    "Product Strategy",
    "Scalable Architecture",
    "Automation & APIs",
    "Software Built with Reason",
  ],
  philosophy: {
    states: [
      { text: "Logic before noise.", sub: "Clarity is the foundation of every system we build." },
      { text: "Systems before screens.", sub: "Architecture precedes interface. Structure precedes style." },
      { text: "Products before promises.", sub: "We ship working software, not decks or prototypes." },
      { text: "Software built with reason.", sub: "Every line of code has a purpose. Every feature has a reason." },
    ],
  },
  process: {
    steps: [
      { label: "Idea", sub: "Discovery & Direction", copy: "We shape raw product ideas into clear technical direction.", detail: "Market research, scope definition, tech stack decisions." },
      { label: "Prototype", sub: "Validate Fast", copy: "We build fast, focused prototypes to validate the core experience.", detail: "Interactive wireframes, UX flows, rapid iteration cycles." },
      { label: "Product", sub: "Build & Craft", copy: "We turn validated flows into real mobile and web applications.", detail: "Full-stack development, design system, CI/CD pipeline." },
      { label: "Launch", sub: "Ship to Users", copy: "We prepare the product for users, stores, analytics, and production.", detail: "App store publishing, monitoring, onboarding, growth hooks." },
      { label: "Scale", sub: "Grow & Evolve", copy: "We improve architecture, automation, performance, and growth systems.", detail: "Infra scaling, A/B testing, feature velocity, data pipelines." },
    ],
  },
  products: {
    headingPre: "Products we've built ",
    headingEm: "and shipped.",
    sub: "Real products in the market, built end-to-end by RussellCode.",
    items: [
      { tagline: "AI-powered vehicle insight platform.", description: "Intelligent vehicle analysis powered by AI. Identify issues, track service history, and make informed decisions about any vehicle.", tag: "AI — MOBILE" },
      { tagline: "AI food and label analysis.", description: "Scan any food label and get instant AI-powered nutritional insights, allergen detection, and personalized health scoring.", tag: "AI — HEALTH" },
      { tagline: "CRM and client management for dietitians.", description: "A full-stack practice management platform for nutrition professionals. Track clients, plans, progress, and billing in one place.", tag: "PLATFORM — B2B" },
    ],
  },
  capabilities: {
    headingPre: "What we",
    headingEm: "build.",
    sub: "Full-spectrum software execution — from product conception to production infrastructure and growth systems.",
    items: [
      { name: "Mobile Apps", note: "iOS & Android" },
      { name: "AI Systems", note: "LLM pipelines, agents" },
      { name: "Backend Infrastructure", note: "APIs, databases, cloud" },
      { name: "Product Strategy", note: "Roadmap, prioritisation" },
      { name: "Automation", note: "Workflows, jobs, triggers" },
      { name: "API Integrations", note: "Third-party connectivity" },
      { name: "Store Deployment", note: "App Store, Play Store" },
      { name: "Scalable Architecture", note: "Performance, reliability" },
    ],
  },
  contact: {
    headingPre: "Build with",
    headingEm: "RussellCode.",
    subtitle: "Share your project idea and we'll get in touch.",
    name: "NAME",
    email: "E-MAIL",
    message: "MESSAGE",
    namePh: "Your full name",
    emailPh: "you@company.com",
    messagePh: "Tell us about your project...",
    submit: "START A PROJECT",
    sending: "SENDING...",
    success: "✓ Your message has been received — we'll get back to you shortly.",
  },
  enter: {
    enterSite: "ENTER SITE",
    studio: "SOFTWARE STUDIO",
    preparing: "PREPARING EXPERIENCE",
    tagline: "SOFTWARE BUILT WITH REASON.",
  },
  footer: {
    rights: "ALL RIGHTS RESERVED",
    tagline: "SOFTWARE BUILT WITH REASON.",
  },
};

export type Dict = typeof en;

const tr: Dict = {
  nav: {
    intro: "GİRİŞ",
    philosophy: "FELSEFE",
    process: "SÜREÇ",
    products: "ÜRÜNLER",
    capabilities: "YETENEKLER",
    contact: "İLETİŞİM",
  },
  hero: {
    title: ["Akılla", "inşa edilen", "yazılım."],
    studio: "YAZILIM STÜDYOSU — KURULUŞ 2026",
    subtitle:
      "RussellCode; yapay zekâ odaklı ürünler, mobil uygulamalar ve ölçeklenebilir yazılım sistemleri tasarlar ve geliştirir.",
    scroll: "KAYDIR",
  },
  ticker: [
    "Yapay Zekâ Odaklı Ürünler",
    "Mobil Uygulamalar",
    "Backend Sistemleri",
    "Ürün Stratejisi",
    "Ölçeklenebilir Mimari",
    "Otomasyon & API'ler",
    "Akılla İnşa Edilen Yazılım",
  ],
  philosophy: {
    states: [
      { text: "Gürültüden önce mantık.", sub: "Netlik, inşa ettiğimiz her sistemin temelidir." },
      { text: "Ekranlardan önce sistemler.", sub: "Mimari arayüzden, yapı stilden önce gelir." },
      { text: "Vaatlerden önce ürünler.", sub: "Sunum ya da prototip değil, çalışan yazılım teslim ederiz." },
      { text: "Akılla inşa edilen yazılım.", sub: "Her kod satırının bir amacı, her özelliğin bir nedeni vardır." },
    ],
  },
  process: {
    steps: [
      { label: "Fikir", sub: "Keşif & Yön", copy: "Ham ürün fikirlerini net bir teknik yöne dönüştürürüz.", detail: "Pazar araştırması, kapsam tanımı, teknoloji seçimi." },
      { label: "Prototip", sub: "Hızlı Doğrula", copy: "Temel deneyimi doğrulamak için hızlı, odaklı prototipler kurarız.", detail: "Etkileşimli taslaklar, UX akışları, hızlı iterasyon döngüleri." },
      { label: "Ürün", sub: "İnşa & Ustalık", copy: "Doğrulanmış akışları gerçek mobil ve web uygulamalarına dönüştürürüz.", detail: "Full-stack geliştirme, tasarım sistemi, CI/CD hattı." },
      { label: "Lansman", sub: "Kullanıcıya Sun", copy: "Ürünü kullanıcılar, mağazalar, analitik ve prodüksiyon için hazırlarız.", detail: "Mağaza yayını, izleme, onboarding, büyüme kancaları." },
      { label: "Ölçekle", sub: "Büyü & Geliş", copy: "Mimariyi, otomasyonu, performansı ve büyüme sistemlerini geliştiririz.", detail: "Altyapı ölçekleme, A/B testleri, özellik hızı, veri hatları." },
    ],
  },
  products: {
    headingPre: "Geliştirdiğimiz ve ",
    headingEm: "yayına aldığımız ürünler.",
    sub: "RussellCode tarafından uçtan uca geliştirilen, piyasadaki gerçek ürünler.",
    items: [
      { tagline: "Yapay zekâ destekli araç analiz platformu.", description: "Yapay zekâ destekli akıllı araç analizi. Sorunları tespit edin, servis geçmişini takip edin ve her araç hakkında bilinçli kararlar verin.", tag: "AI — MOBİL" },
      { tagline: "Yapay zekâ ile gıda ve etiket analizi.", description: "Herhangi bir gıda etiketini tarayın; anında yapay zekâ destekli besin analizi, alerjen tespiti ve kişiselleştirilmiş sağlık puanı alın.", tag: "AI — SAĞLIK" },
      { tagline: "Diyetisyenler için CRM ve danışan yönetimi.", description: "Beslenme uzmanları için uçtan uca uygulama yönetim platformu. Danışanları, planları, ilerlemeyi ve faturalamayı tek yerde takip edin.", tag: "PLATFORM — B2B" },
    ],
  },
  capabilities: {
    headingPre: "Neler",
    headingEm: "geliştiriyoruz.",
    sub: "Uçtan uca yazılım yürütme — ürün fikrinden prodüksiyon altyapısına ve büyüme sistemlerine kadar.",
    items: [
      { name: "Mobil Uygulamalar", note: "iOS & Android" },
      { name: "Yapay Zekâ Sistemleri", note: "LLM hatları, ajanlar" },
      { name: "Backend Altyapısı", note: "API'ler, veritabanları, bulut" },
      { name: "Ürün Stratejisi", note: "Yol haritası, önceliklendirme" },
      { name: "Otomasyon", note: "İş akışları, görevler, tetikleyiciler" },
      { name: "API Entegrasyonları", note: "Üçüncü taraf bağlantılar" },
      { name: "Mağaza Yayını", note: "App Store, Play Store" },
      { name: "Ölçeklenebilir Mimari", note: "Performans, güvenilirlik" },
    ],
  },
  contact: {
    headingPre: "Birlikte inşa edelim",
    headingEm: "RussellCode.",
    subtitle: "Proje fikrinizi paylaşın, sizinle iletişime geçelim.",
    name: "İSİM",
    email: "E-POSTA",
    message: "MESAJ",
    namePh: "Adınız Soyadınız",
    emailPh: "ornek@sirket.com",
    messagePh: "Projenizi kısaca anlatın...",
    submit: "PROJEYİ BAŞLAT",
    sending: "GÖNDERİLİYOR...",
    success: "✓ Mesajınız alındı — en kısa sürede dönüş yapacağız.",
  },
  enter: {
    enterSite: "SİTEYE GİR",
    studio: "YAZILIM STÜDYOSU",
    preparing: "DENEYİM HAZIRLANIYOR",
    tagline: "AKILLA İNŞA EDİLEN YAZILIM.",
  },
  footer: {
    rights: "TÜM HAKLARI SAKLIDIR",
    tagline: "AKILLA İNŞA EDİLEN YAZILIM.",
  },
};

export const translations: Record<Lang, Dict> = { en, tr };

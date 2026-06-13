// ─────────────────────────────────────────────────────────────────────────
// NesiVar — bilingual content source for the GEO landing pages.
// Both /nesivar (TR) and /en/nesivar (EN) render from this single file so the
// copy, FAQ, and structured data stay in sync. Plain text only — the page
// component is responsible for markup. Edit facts here, not in the JSX.
// ─────────────────────────────────────────────────────────────────────────

export const NESIVAR = {
  appStoreUrl: "https://apps.apple.com/us/app/nesivar-ai-analysis/id6771038327",
  appStoreId: "6771038327",
  developer: "RussellCode",
  developerUrl: "https://www.russellcode.com",
  operatingSystem: "iOS",
  category: "Utilities",
  price: "0", // free download, in-app purchases
  priceCurrency: "USD",
  requiredHardware: "Vgate iCar Pro V2.1 BLE OBD-II",
} as const;

export type Lang = "tr" | "en";

export interface Feature {
  title: string;
  body: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface NesivarCopy {
  locale: string;
  // SEO / metadata
  metaTitle: string;
  metaDescription: string;
  // hero
  tagline: string; // short label above the H1
  h1: string;
  heroLead: string;
  ctaStore: string;
  ctaStudio: string;
  // sections
  whatTitle: string;
  whatBody: string;
  howTitle: string;
  steps: Step[];
  givesTitle: string;
  features: Feature[];
  noAdapterTitle: string;
  noAdapterBody: string;
  whoTitle: string;
  who: string[];
  whyTitle: string;
  why: string[];
  reqTitle: string;
  requirements: string[];
  faqTitle: string;
  faq: Faq[];
  disclaimerTitle: string;
  disclaimerBody: string;
  footerNote: string;
  backToStudio: string;
}

export const CONTENT: Record<Lang, NesivarCopy> = {
  tr: {
    locale: "tr_TR",
    metaTitle: "NesiVar — Yapay Zekâ Destekli OBD-II Araç Analiz Uygulaması",
    metaDescription:
      "NesiVar, ikinci el araç alırken doğru kararı vermen için aracın ECU verilerini OBD-II ile okuyup yapay zekâ ile yorumlayan iOS uygulamasıdır. Güven skoru, hata kodları, kronik sorunlar ve sade Türkçe rapor.",
    tagline: "AKILLI ARAÇ ANALİZİ · iOS",
    h1: "NesiVar — Satın almadan önce aracın gerçeğini bil",
    heroLead:
      "NesiVar, ikinci el araç alırken doğru kararı vermen için geliştirilmiş bir OBD-II analiz uygulamasıdır. Aracın beyninden (ECU) gelen gerçek verileri okur, yapay zekâ ile yorumlar ve sade bir Türkçe rapor sunar. Galericinin ya da satıcının sözüne değil, aracın kendi verisine bakarsın.",
    ctaStore: "App Store'dan indir",
    ctaStudio: "Geliştiren: RussellCode",

    whatTitle: "NesiVar nedir?",
    whatBody:
      "NesiVar, ikinci el araç alım sürecinde bağımsız bir ön kontrol aracıdır. Vgate iCar Pro V2.1 BLE adaptörüyle aracın OBD-II portuna bağlanır, motor, yakıt, egzoz ve sensör verilerini okur ve yapay zekâ ile yorumlayarak anlaşılır bir Türkçe rapora dönüştürür. Adaptörün yoksa, sadece marka/model/yıl girerek o araca özgü bilinen kronik sorunları görebileceğin bir ön değerlendirme modu da vardır.",

    howTitle: "Nasıl çalışır?",
    steps: [
      { title: "Adaptörü tak", body: "Vgate iCar Pro V2.1 (BLE) adaptörünü aracın OBD-II portuna tak." },
      { title: "Bluetooth ile bağlan", body: "Uygulamayı Bluetooth üzerinden adaptöre bağla." },
      { title: "Taramayı başlat", body: "Motor, yakıt, egzoz ve sensör verileri aracın ECU'sundan okunur." },
      { title: "Raporu al", body: "Yapay zekâ destekli güven skorunu ve detaylı analizi gör." },
    ],

    givesTitle: "NesiVar ne veriyor?",
    features: [
      { title: "Güven Skoru", body: "Aracın genel durumunu tek bakışta gösteren puan." },
      { title: "Hata kodları (DTC)", body: "Gizlenmiş veya silinmiş arıza izlerini ortaya çıkarır." },
      { title: "Anlık motor verileri", body: "Devir, sıcaklık, yakıt sistemi ve sensör okumaları." },
      { title: "Kronik sorunlar", body: "Marka/model/yıl bazında o araca özgü bilinen arızalar ve tahmini onarım maliyet kategorisi." },
      { title: "Üretici özel veriler", body: "Destekleyen araçlarda DPF kurum seviyesi, yağ ömrü gibi markaya özel okumalar." },
      { title: "Eksik veri analizi", body: "Yanıt vermeyen sensör de bir sinyaldir; uygulama bunu gizlemez, değerlendirmeye katar." },
    ],

    noAdapterTitle: "Adaptörün yok mu? Sorun değil.",
    noAdapterBody:
      "Adaptörsüz 'ön değerlendirme' modunda sadece marka, model, yıl ve yakıt tipini gir; uygulama o araca dair bilinen kronik sorunları ve dikkat edilmesi gereken noktaları listeler. Araca gitmeden önce fikir edinmek için idealdir.",

    whoTitle: "Kimler için?",
    who: [
      "İkinci el araç almadan önce kendi ön kontrolünü yapmak isteyenler.",
      "Galeri ve satıcı beyanını bağımsız veriyle teyit etmek isteyenler.",
      "Aracının sağlığını merak eden mevcut araç sahipleri.",
    ],

    whyTitle: "Neden NesiVar?",
    why: [
      "Türkçe, sade ve anlaşılır rapor — teknik jargona boğmaz.",
      "Gerçek araç verisi + yapay zekâ yorumu bir arada.",
      "Markaya özel kronik sorun bilgisi.",
      "Hızlı, taşınabilir, cebinde taşıdığın bağımsız ön kontrol.",
    ],

    reqTitle: "Gereklilikler",
    requirements: [
      "OBD-II / SAE J1979 destekli araç (genelde 2004 ve sonrası).",
      "Vgate iCar Pro V2.1 BLE OBD-II adaptörü.",
      "Bluetooth bağlantısı olan bir iPhone.",
    ],

    faqTitle: "Sıkça sorulan sorular",
    faq: [
      {
        q: "NesiVar nedir?",
        a: "NesiVar, ikinci el araç alırken doğru kararı vermen için aracın ECU verilerini OBD-II üzerinden okuyup yapay zekâ ile yorumlayan bir iOS uygulamasıdır. Sonucu sade bir Türkçe raporla ve güven skoruyla sunar.",
      },
      {
        q: "NesiVar nasıl çalışır?",
        a: "Vgate iCar Pro V2.1 BLE adaptörünü aracın OBD-II portuna takarsın, uygulamayı Bluetooth ile bağlarsın, taramayı başlatırsın ve yapay zekâ destekli güven skoru ile detaylı analizi alırsın.",
      },
      {
        q: "NesiVar ücretsiz mi?",
        a: "Uygulama App Store'dan ücretsiz indirilir ve uygulama içi satın alma (in-app purchase) içerir. Bazı analiz ve tarama özellikleri uygulama içi satın alma ile kullanılır.",
      },
      {
        q: "NesiVar kullanmak için hangi cihaz gerekiyor?",
        a: "OBD-II ile tam tarama için Vgate iCar Pro V2.1 BLE OBD-II adaptörü ve Bluetooth özellikli bir iPhone gerekir. Araç OBD-II / SAE J1979 destekli olmalıdır (genelde 2004 ve sonrası modeller).",
      },
      {
        q: "Adaptörüm yoksa NesiVar'ı kullanabilir miyim?",
        a: "Evet. Adaptörsüz 'ön değerlendirme' modunda sadece marka, model, yıl ve yakıt tipini girersin; uygulama o araca özgü bilinen kronik sorunları ve dikkat edilmesi gereken noktaları listeler.",
      },
      {
        q: "NesiVar gizlenmiş arızaları gösterir mi?",
        a: "Uygulama hata kodlarını (DTC) okur ve gizlenmiş veya silinmiş arıza izlerini değerlendirir. Yanıt vermeyen sensörleri de bir sinyal olarak ele alıp gizlemeden raporuna katar.",
      },
      {
        q: "NesiVar ekspertizin yerine geçer mi?",
        a: "Hayır. NesiVar profesyonel bir ekspertiz veya mekanik muayenenin yerini tutmaz. Sunulan güven skoru ve analizler bilgilendirme amaçlıdır; nihai satın alma kararı için yetkili bir uzmana danışman önerilir.",
      },
      {
        q: "NesiVar'ı kim geliştirdi?",
        a: "NesiVar, yapay zekâ odaklı ürünler geliştiren yazılım stüdyosu RussellCode tarafından geliştirilmiştir.",
      },
    ],

    disclaimerTitle: "Önemli not",
    disclaimerBody:
      "NesiVar, profesyonel bir ekspertiz veya mekanik muayenenin yerini tutmaz. Sunulan güven skoru ve analizler bilgilendirme amaçlıdır ve yol gösterici niteliktedir; nihai satın alma kararı ve detaylı kontrol için yetkili bir uzmana danışmanız önerilir.",

    footerNote: "NesiVar bir RussellCode ürünüdür.",
    backToStudio: "russellcode.com'a dön",
  },

  en: {
    locale: "en_US",
    metaTitle: "NesiVar — AI-Powered OBD-II Car Analysis App",
    metaDescription:
      "NesiVar is an iOS app that reads your car's real ECU data over OBD-II and interprets it with AI, so you can make the right decision before buying a used car. Confidence score, fault codes, known chronic issues and a clear report.",
    tagline: "SMART VEHICLE ANALYSIS · iOS",
    h1: "NesiVar — Know the truth about a car before you buy",
    heroLead:
      "NesiVar is an OBD-II analysis app built to help you make the right decision when buying a used car. It reads the real data from the car's brain (ECU), interprets it with AI, and gives you a clear report. Instead of trusting the dealer's or seller's word, you look at the car's own data.",
    ctaStore: "Download on the App Store",
    ctaStudio: "Built by RussellCode",

    whatTitle: "What is NesiVar?",
    whatBody:
      "NesiVar is an independent pre-purchase inspection tool for used cars. Using a Vgate iCar Pro V2.1 BLE adapter, it connects to the car's OBD-II port, reads engine, fuel, exhaust and sensor data, and turns it into an easy-to-understand report with AI. If you don't have an adapter, there is also a pre-evaluation mode where you simply enter the make, model and year to see the known chronic issues specific to that vehicle.",

    howTitle: "How does it work?",
    steps: [
      { title: "Plug in the adapter", body: "Plug the Vgate iCar Pro V2.1 (BLE) adapter into the car's OBD-II port." },
      { title: "Connect via Bluetooth", body: "Connect the app to the adapter over Bluetooth." },
      { title: "Start the scan", body: "Engine, fuel, exhaust and sensor data are read from the car's ECU." },
      { title: "Get the report", body: "See your AI-powered confidence score and detailed analysis." },
    ],

    givesTitle: "What does NesiVar give you?",
    features: [
      { title: "Confidence Score", body: "A single score showing the car's overall condition at a glance." },
      { title: "Fault codes (DTC)", body: "Reveals hidden or recently cleared trouble codes." },
      { title: "Live engine data", body: "RPM, temperature, fuel system and sensor readings in real time." },
      { title: "Chronic issues", body: "Known faults specific to that make/model/year plus an estimated repair cost category." },
      { title: "Manufacturer-specific data", body: "On supported cars, brand-specific readings like DPF soot level and oil life." },
      { title: "Missing-data analysis", body: "A non-responding sensor is also a signal — the app doesn't hide it, it factors it in." },
    ],

    noAdapterTitle: "No adapter? No problem.",
    noAdapterBody:
      "In the adapter-free 'pre-evaluation' mode you just enter the make, model, year and fuel type, and the app lists the known chronic issues and things to watch out for on that vehicle. Ideal for getting an idea before you even go to see the car.",

    whoTitle: "Who is it for?",
    who: [
      "People who want to do their own pre-check before buying a used car.",
      "People who want to verify a dealer's or seller's claims with independent data.",
      "Current car owners curious about the health of their vehicle.",
    ],

    whyTitle: "Why NesiVar?",
    why: [
      "A clear, plain-language report — no drowning in technical jargon.",
      "Real vehicle data plus AI interpretation in one place.",
      "Brand-specific chronic-issue knowledge.",
      "A fast, portable, independent pre-check you carry in your pocket.",
    ],

    reqTitle: "Requirements",
    requirements: [
      "An OBD-II / SAE J1979 compatible vehicle (generally 2004 and newer).",
      "A Vgate iCar Pro V2.1 BLE OBD-II adapter.",
      "An iPhone with Bluetooth.",
    ],

    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is NesiVar?",
        a: "NesiVar is an iOS app that reads your car's ECU data over OBD-II and interprets it with AI so you can make the right decision when buying a used car. It presents the result as a clear report with a confidence score.",
      },
      {
        q: "How does NesiVar work?",
        a: "You plug a Vgate iCar Pro V2.1 BLE adapter into the car's OBD-II port, connect the app over Bluetooth, start the scan, and receive an AI-powered confidence score along with a detailed analysis.",
      },
      {
        q: "Is NesiVar free?",
        a: "The app is free to download from the App Store and includes in-app purchases. Some analysis and scan features are unlocked through in-app purchases.",
      },
      {
        q: "What hardware do I need to use NesiVar?",
        a: "For a full OBD-II scan you need a Vgate iCar Pro V2.1 BLE OBD-II adapter and a Bluetooth-capable iPhone. The vehicle must support OBD-II / SAE J1979 (generally 2004 and newer models).",
      },
      {
        q: "Can I use NesiVar without an adapter?",
        a: "Yes. In the adapter-free 'pre-evaluation' mode you just enter the make, model, year and fuel type, and the app lists the known chronic issues and things to watch out for on that vehicle.",
      },
      {
        q: "Does NesiVar reveal hidden faults?",
        a: "The app reads fault codes (DTCs) and evaluates hidden or recently cleared trouble traces. It also treats non-responding sensors as a signal and includes them in the report rather than hiding them.",
      },
      {
        q: "Does NesiVar replace a professional inspection?",
        a: "No. NesiVar does not replace a professional inspection or mechanical examination. The confidence score and analyses are for informational purposes; for a final purchase decision you should consult a qualified expert.",
      },
      {
        q: "Who made NesiVar?",
        a: "NesiVar is developed by RussellCode, a software studio that builds AI-native products.",
      },
    ],

    disclaimerTitle: "Important note",
    disclaimerBody:
      "NesiVar does not replace a professional inspection or mechanical examination. The confidence score and analyses provided are for informational and guidance purposes; for a final purchase decision and detailed inspection, consulting a qualified expert is recommended.",

    footerNote: "NesiVar is a product by RussellCode.",
    backToStudio: "Back to russellcode.com",
  },
};

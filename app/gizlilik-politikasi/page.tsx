import type { Metadata } from "next";

const SITE = "https://www.russellcode.com";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | NesiVar?",
  description:
    "NesiVar? (RussellCode) gizlilik politikası. Uygulamanın hangi verileri işlediği, kişisel veri toplanmadığı ve haklarınız hakkında bilgi.",
  alternates: { canonical: `${SITE}/gizlilik-politikasi` },
  robots: { index: true, follow: true },
};

const UPDATED = "14 Haziran 2026";

export default function PrivacyPolicyPage() {
  return (
    <main
      className="nv-scope"
      style={{ cursor: "auto", background: "var(--bg)", color: "var(--fg)", minHeight: "100dvh" }}
    >
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "clamp(2.5rem, 6vw, 5rem) 1.25rem 5rem" }}>
        <p className="t-label" style={{ color: "var(--accent)", letterSpacing: "0.18em", marginBottom: "0.75rem" }}>
          RUSSELLCODE
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            lineHeight: 1.1,
            margin: "0 0 0.75rem",
          }}
        >
          Gizlilik Politikası
        </h1>
        <p style={{ color: "var(--fg-sub)", margin: "0 0 2.5rem" }}>
          NesiVar? — Son güncelleme: {UPDATED}
        </p>

        <Section title="1. Genel Bakış">
          <p style={p}>
            Bu gizlilik politikası, RussellCode (&quot;biz&quot;) tarafından geliştirilen NesiVar? – AI Analysis
            (&quot;Uygulama&quot;) için geçerlidir. Uygulamayı kullanırken hangi verilerin işlendiğini, bu verilerin
            nasıl kullanıldığını ve haklarınızı açıklar. Uygulamayı kullanarak bu politikayı kabul etmiş olursunuz.
          </p>
        </Section>

        <Section title="2. Topladığımız Veriler">
          <p style={p}>
            NesiVar? sizi kişisel olarak tanımlayan bir veri <strong>toplamaz</strong>. Hesap oluşturmanızı istemez;
            ad, e-posta, telefon, konum veya reklam tanımlayıcısı gibi kişisel verileri toplamaz, saklamaz veya
            satmaz.
          </p>
          <p style={p}>
            Uygulama, yalnızca siz bir tarama başlattığınızda OBD-II adaptörü aracılığıyla aracınızın elektronik
            kontrol ünitesinden (ECU) <strong>teknik araç verilerini</strong> okur. Bunlar; hata kodları (DTC),
            motor devri, sıcaklık, yakıt sistemi ve sensör değerleri gibi araç durumu bilgileridir ve kişisel veri
            değildir. Adaptörsüz &quot;ön değerlendirme&quot; modunda yalnızca girdiğiniz marka, model, yıl ve yakıt
            tipi bilgisi kullanılır.
          </p>
        </Section>

        <Section title="3. Verilerin İşlenmesi ve Yapay Zekâ">
          <p style={p}>
            Okunan teknik araç verileri, anlaşılır bir analiz ve güven skoru üretmek amacıyla yapay zekâ ile
            yorumlanır. Bu işlem sırasında araç teknik verileri analiz hizmetine iletilebilir; bu veriler kimliğinizle
            ilişkilendirilmez ve pazarlama amacıyla kullanılmaz. Analiz sonuçları cihazınızda gösterilir.
          </p>
        </Section>

        <Section title="4. Uygulama İçi Satın Alımlar">
          <p style={p}>
            Uygulama, uygulama içi satın alımlar (in-app purchase) içerir. Ödeme işlemleri tamamen Apple App Store
            (veya ilgili mağaza) tarafından yürütülür; RussellCode kart bilgilerinize veya ödeme ayrıntılarınıza
            erişmez. Satın alma verilerinin işlenmesi ilgili mağazanın gizlilik politikasına tabidir.
          </p>
        </Section>

        <Section title="5. Üçüncü Taraf Hizmetleri">
          <p style={p}>
            Uygulama; analiz işlevi için yapay zekâ sağlayıcısı ve uygulama içi satın alımlar için mağaza altyapısı
            gibi üçüncü taraf hizmetlerinden yararlanabilir. Bu sağlayıcılarla yalnızca hizmetin sunulması için
            gereken teknik veriler paylaşılır.
          </p>
        </Section>

        <Section title="6. Veri Saklama">
          <p style={p}>
            Tarama geçmişiniz, varsa, yalnızca cihazınızda saklanır. Uygulamayı silmeniz halinde cihazınızdaki bu
            veriler de kaldırılır.
          </p>
        </Section>

        <Section title="7. Çocukların Gizliliği">
          <p style={p}>
            Uygulama 13 yaş altındaki çocuklara yönelik değildir ve bilerek çocuklardan kişisel veri toplamaz.
          </p>
        </Section>

        <Section title="8. Haklarınız">
          <p style={p}>
            Kişisel veri toplamadığımız için saklanan bir kişisel veriniz bulunmamaktadır. Yine de gizlilikle ilgili
            herhangi bir sorunuz veya talebiniz olursa bizimle iletişime geçebilirsiniz.
          </p>
        </Section>

        <Section title="9. Önemli Not">
          <p style={p}>
            NesiVar?, profesyonel bir ekspertiz veya mekanik muayenenin yerini tutmaz. Sunulan güven skoru ve
            analizler bilgilendirme amaçlıdır.
          </p>
        </Section>

        <Section title="10. Değişiklikler">
          <p style={p}>
            Bu gizlilik politikası zaman zaman güncellenebilir. Güncellemeler bu sayfada yayımlanır ve yukarıdaki
            &quot;Son güncelleme&quot; tarihi değiştirilir.
          </p>
        </Section>

        <Section title="11. İletişim">
          <p style={p}>
            Gizlilik politikası veya veri işleme hakkında sorularınız için:{" "}
            <a href="mailto:destek@russellcode.com" style={{ color: "var(--accent)" }}>
              destek@russellcode.com
            </a>
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
          fontWeight: 600,
          margin: "0 0 0.75rem",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const p: React.CSSProperties = {
  fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
  lineHeight: 1.7,
  color: "var(--fg)",
  margin: "0 0 0.9rem",
};

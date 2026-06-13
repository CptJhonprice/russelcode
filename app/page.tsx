import Layout from "@/components/layout/Layout";
import HeroScene from "@/components/sections/HeroScene";
import Ticker from "@/components/ui/Ticker";
import PhilosophyScene from "@/components/sections/PhilosophyScene";
import ProcessScene from "@/components/sections/ProcessScene";
import ProductsScene from "@/components/sections/ProductsScene";
import CapabilitiesScene from "@/components/sections/CapabilitiesScene";
import ScannerCardStream from "@/components/ui/ScannerCardStream";
import ContactScene from "@/components/sections/ContactScene";

export default function Home() {
  return (
    <Layout>
      <HeroScene />
      <Ticker />
      <PhilosophyScene />
      <ProcessScene />
      <ProductsScene />
      <CapabilitiesScene />
      <ContactScene />
      <ScannerCardStream />
    </Layout>
  );
}

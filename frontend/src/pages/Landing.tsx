import Navbar from "@/components/landing/Navbar";


import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/Workflow";
import Platform from "@/components/landing/Platform";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";


import Hero from "@/components/landing/Hero";

export default function Landing() {

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <Hero />

        <Features />
        <Workflow />
        <Platform />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

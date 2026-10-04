import Navbar from "@/components/landing/Navbar";
import Spline from "@splinetool/react-spline";
import Hero from "@/components/landing/Hero";

import Footer from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
      <Spline
          scene="/spline/landing-scene.splinecode"
          style={{ width: '100%', height: '100vh' }}
        />
        <Hero/>
      </main>

      <Footer />
    </div>
  );
}

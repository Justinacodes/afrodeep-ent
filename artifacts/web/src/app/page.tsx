import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Details } from "@/components/sections/Details";
import { Gallery } from "@/components/sections/Gallery";
import { Tickets } from "@/components/sections/Tickets";
import { Footer } from "@/components/sections/Footer";
import { PaymentSuccessBanner } from "@/components/PaymentSuccessBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <PaymentSuccessBanner />
      <Navbar />
      <Hero />
      <Details />
      <Gallery />
      <Tickets />
      <Footer />
    </main>
  );
}

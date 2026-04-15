import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import ContactModalWrapper from "@/components/ContactModalWrapper";
import EventModalWrapper from "@/components/EventModalWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <ContactModalWrapper />
      <EventModalWrapper />
      <Hero />
      <About />
      <Team />
      <Partners />
      <Testimonials />
      <Contact />
    </main>
  );
}

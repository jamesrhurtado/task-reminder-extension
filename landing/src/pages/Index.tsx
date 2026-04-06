import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import Privacy from "@/components/landing/Privacy";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14">
        <Hero />
        <Problem />
        <HowItWorks />
        <Benefits />
        <Privacy />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
};

export default Index;

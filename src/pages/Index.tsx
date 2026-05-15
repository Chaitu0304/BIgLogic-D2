import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { WhoItsFor } from "@/components/landing/WhoItsFor";
import Faq from "@/components/landing/Faq";
import { WhyBigLogic } from "@/components/landing/WhyBigLogic";
import { TrustSecurity } from "@/components/landing/TrustSecurity";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { Navigate } from "react-router-dom";

const Index = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <WhoItsFor />
      <WhyBigLogic />
      <TrustSecurity />
      <Faq />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;

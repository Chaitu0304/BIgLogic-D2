import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { OfferTransformation } from "@/components/landing/OfferTransformation";
import { Services } from "@/components/landing/Services";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { WhoItsFor } from "@/components/landing/WhoItsFor";
import { WhyBigLogic } from "@/components/landing/WhyBigLogic";
import { TrustSecurity } from "@/components/landing/TrustSecurity";
import Faq from "@/components/landing/Faq";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { Navigate } from "react-router-dom";

const Index = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="theme-landeros min-h-screen bg-[#FCFBFE] antialiased relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <OfferTransformation />
      <Services />
      <HowItWorks />
      <RoiCalculator />
      <Pricing />
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

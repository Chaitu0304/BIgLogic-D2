import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./landing/Navbar";
import { Footer } from "./landing/Footer";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-20 relative overflow-hidden bg-background">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Insurance Draw Scheduler</h1>
            <p className="text-muted-foreground">Professional workflow automation for insurance draws</p>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
            {children}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthLayout;

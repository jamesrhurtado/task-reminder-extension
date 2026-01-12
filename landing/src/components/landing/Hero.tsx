import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Chrome, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light/50 to-transparent pointer-events-none" />
      
      <div className="container-narrow relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            Free Chrome Extension
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Open websites with intention.
            <br />
            <span className="text-primary">Leave without distraction.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            You don't need to block social media — you just need a reminder of why you opened it.
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="cta" size="xl">
              <Chrome className="w-5 h-5" />
              Add to Chrome — It's Free
            </Button>
            <Button variant="hero" size="lg">
              <Play className="w-4 h-4" />
              See how it works
            </Button>
          </motion.div>
        </motion.div>

        {/* Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 relative"
        >
          <div className="card-elevated p-2 md:p-3 glow-effect">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-secondary rounded-lg px-4 py-1.5 text-sm text-muted-foreground w-64 text-center">
                  youtube.com
                </div>
              </div>
            </div>
            
            {/* Task banner */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium opacity-80">Your task:</span>
                <span className="font-semibold">Watch the React tutorial for hooks</span>
              </div>
              <button className="text-sm bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1 rounded-lg transition-colors">
                Mark as done
              </button>
            </div>
            
            {/* Content area */}
            <div className="bg-secondary/30 p-8 min-h-[200px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <Play className="w-6 h-6" />
                </div>
                <p className="text-sm">Your focused browsing experience</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

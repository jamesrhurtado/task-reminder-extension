import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Chrome, Sparkles } from "lucide-react";

const FinalCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Take back your attention.
          </h2>
          
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Start browsing with intention. It's free and takes less than 30 seconds to install.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button variant="cta" size="xl" className="mb-4">
              <Chrome className="w-5 h-5" />
              Install Focus Task on Chrome
            </Button>
            <p className="text-sm text-muted-foreground">
              Free forever • No account needed • 2-click install
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;

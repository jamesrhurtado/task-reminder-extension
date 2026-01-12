import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, UserX, HardDrive, Lock } from "lucide-react";

const features = [
  { icon: UserX, text: "No accounts required" },
  { icon: Shield, text: "No tracking" },
  { icon: HardDrive, text: "Tasks stored locally" },
  { icon: Lock, text: "Your data stays in your browser" },
];

const Privacy = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-primary-light/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Privacy-first by design
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            We built Focus Task to protect your attention, not collect your data.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 shadow-sm"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-foreground text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Privacy;

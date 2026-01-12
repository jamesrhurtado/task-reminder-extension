import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const nots = [
  "No website blocking",
  "No timers",
  "No pressure",
  "No guilt",
];

const positives = [
  "Awareness of your intentions",
  "Control over your attention",
  "Mindful browsing habits",
  "Peace of mind",
];

const Benefits = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-secondary/50">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why people love it
          </h2>
          <p className="text-muted-foreground text-lg">
            A different approach to digital wellbeing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* What it's NOT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="card-elevated p-6 md:p-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </div>
              What Focus Task is NOT
            </h3>
            <ul className="space-y-4">
              {nots.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-muted-foreground">
                  <X className="w-4 h-4 text-muted-foreground/60" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* What it IS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="card-elevated p-6 md:p-8 border-primary/20"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              What you get instead
            </h3>
            <ul className="space-y-4">
              {positives.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground font-medium">
                  <Check className="w-4 h-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const scenarios = [
  {
    start: "You open YouTube for a specific tutorial…",
    end: "The sidebar recommends something interesting. You click. And again. The tutorial? Never watched.",
    platform: "YouTube",
  },
  {
    start: "You open LinkedIn to reply to a message…",
    end: "You see an interesting post, start scrolling, an hour passes — and you never replied.",
    platform: "LinkedIn",
  },
];

const Problem = () => {
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
            Sound familiar?
          </h2>
          <p className="text-muted-foreground text-lg">
            It happens to all of us. Every. Single. Day.
          </p>
        </motion.div>

        <div className="space-y-6">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="card-elevated p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <p className="text-foreground font-medium flex-1">
                  {scenario.start}
                </p>
                <div className="hidden md:block text-primary text-2xl">→</div>
                <p className="text-muted-foreground flex-1 italic">
                  {scenario.end}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-primary-light border border-primary/20 rounded-2xl p-6 md:p-8">
            <p className="text-foreground text-lg md:text-xl leading-relaxed">
              Feeds, reels, and recommendations pull your attention.
              <br />
              <span className="text-primary font-medium">You forget why you opened the site.</span>
              <br />
              <span className="text-muted-foreground">Minutes turn into hours.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;

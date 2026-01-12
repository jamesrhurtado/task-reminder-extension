import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, PenLine, Eye, CheckCircle, Settings, ListPlus } from "lucide-react";

const autoPromptSteps = [
  {
    icon: Settings,
    title: "Set up your list",
    description: "Add domains like linkedin.com, instagram.com, youtube.com to your auto-prompt list.",
  },
  {
    icon: Globe,
    title: "Visit a saved site",
    description: "A modal automatically asks what you're here to do.",
  },
  {
    icon: Eye,
    title: "Stay on track",
    description: "Your task floats in the corner as you browse.",
  },
  {
    icon: CheckCircle,
    title: "Complete & move on",
    description: "Click 'Complete' when done, or close the tab.",
  },
];

const manualSteps = [
  {
    icon: Globe,
    title: "Visit any website",
    description: "Works on any site, anytime you want to stay focused.",
  },
  {
    icon: PenLine,
    title: "Click & set your task",
    description: "Click the extension icon and type what you're here to do.",
  },
  {
    icon: Eye,
    title: "Floating reminder",
    description: "A small widget shows your task while you browse.",
  },
  {
    icon: CheckCircle,
    title: "Mark complete",
    description: "Click 'Complete' when done, or navigate away.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const renderSteps = (steps: typeof autoPromptSteps, startDelay: number) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: startDelay + index * 0.1, duration: 0.5 }}
          className="relative"
        >
          {index < steps.length - 1 && (
            <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
          )}
          
          <div className="text-center">
            <div className="relative inline-block mb-5">
              <div className="w-16 h-16 rounded-2xl bg-primary-light border border-primary/20 flex items-center justify-center mx-auto">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>
            </div>
            <h4 className="text-base font-semibold text-foreground mb-2">
              {step.title}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section ref={ref} className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your browser remembers <span className="text-primary">your intention</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A gentle nudge, not a block. Two simple modes to fit your workflow.
          </p>
        </motion.div>

        {/* Auto-Prompt Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ListPlus className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Auto-Prompt Mode</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Recommended</span>
          </div>
          {renderSteps(autoPromptSteps, 0.3)}
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-md mx-auto mb-16">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm font-medium">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Manual Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <PenLine className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Manual Mode</h3>
          </div>
          {renderSteps(manualSteps, 0.5)}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

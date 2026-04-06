import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-background/90 backdrop-blur-sm border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">LI</span>
          </div>
          <span className="font-semibold text-foreground text-sm">Locked In</span>
        </div>

        <Button variant="cta" size="sm" asChild>
          <a
            href="https://github.com/jamesrhurtado/task-reminder-extension"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;

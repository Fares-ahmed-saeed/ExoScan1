
import { Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for fixed header height
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="relative">
              <Telescope className="w-8 h-8 text-accent animate-pulse-star" />
              <div className="absolute inset-0 bg-stellar-gradient opacity-50 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                ExoScan
              </h1>
              <p className="text-xs text-muted-foreground">AI Exoplanet Detection</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-accent transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('analysis')}
              className="text-foreground hover:text-accent transition-colors"
            >
              Analysis
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-accent transition-colors"
            >
              About Project
            </button>
            <Button 
              variant="outline" 
              className="border-accent/30 hover:bg-accent/10"
              onClick={() => scrollToSection('analysis')}
            >
              Start Analysis
            </Button>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;

import { Home, Search, Info, Play } from "lucide-react";

const BottomNavigation = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/20">
      <div className="flex items-center justify-around py-3 px-2">
        <button 
          onClick={() => scrollToSection('home')}
          className="flex flex-col items-center space-y-2 p-3 min-w-[60px] bg-accent/20 rounded-xl text-accent transition-all duration-200"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button 
          onClick={() => scrollToSection('analysis')}
          className="flex flex-col items-center space-y-2 p-3 min-w-[60px] text-muted-foreground hover:text-accent transition-all duration-200"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-medium">Analysis</span>
        </button>
        <button 
          onClick={() => scrollToSection('analysis')}
          className="flex flex-col items-center space-y-2 p-3 min-w-[60px] text-muted-foreground hover:text-accent transition-all duration-200"
        >
          <Play className="w-6 h-6" />
          <span className="text-xs font-medium">Start</span>
        </button>
        <button 
          onClick={() => scrollToSection('about')}
          className="flex flex-col items-center space-y-2 p-3 min-w-[60px] text-muted-foreground hover:text-accent transition-all duration-200"
        >
          <Info className="w-6 h-6" />
          <span className="text-xs font-medium">About</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;

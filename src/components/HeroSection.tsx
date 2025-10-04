import { Button } from "@/components/ui/button";
import { Upload, BarChart3, Sparkles } from "lucide-react";

const HeroSection = () => {
  const scrollToAnalysis = () => {
    const element = document.getElementById('analysis');
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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full animate-pulse-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Orbiting Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-20">
          <div className="relative w-full h-full animate-orbit">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-planet rounded-full transform -translate-x-1/2 glow-planet"></div>
          </div>
        </div>
        
        <div className="absolute top-3/4 right-1/4 w-24 h-24 opacity-30">
          <div className="relative w-full h-full animate-orbit" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-stellar rounded-full transform -translate-x-1/2 glow-star"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Main Title */}
          <div className="mb-8 animate-float">
            <h1 className="hero-title mb-4 text-4xl md:text-6xl">
              Discover Exoplanets
            </h1>
            <h2 className="hero-title text-3xl md:text-3xl">
              Powered by Artificial Intelligence
            </h2>
          </div>

          {/* Subtitle */}
          <p className="hero-subtitle mx-auto mb-12 leading-relaxed px-4">
            ExoScan is an advanced platform that uses artificial intelligence to analyze space telescope data 
            and discover exoplanets through stellar light curve analysis
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="btn-cosmic text-lg px-8 py-6 group"
              onClick={scrollToAnalysis}
            >
              <Upload className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Start Analysis Now
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-accent/30 hover:bg-accent/10 group"
            >
              <BarChart3 className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              View Previous Results
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
            <div className="card-feature p-6 text-center group">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Data Upload</h3>
              <p className="text-muted-foreground">
                Upload light curve files from TESS and Kepler telescopes with ease
              </p>
            </div>

            <div className="card-feature p-6 text-center group">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Smart Analysis</h3>
              <p className="text-muted-foreground">
                Advanced algorithms analyze data and detect planet transit patterns
              </p>
            </div>

            <div className="card-feature p-6 text-center group">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Visual Results</h3>
              <p className="text-muted-foreground">
                Interactive charts showing the probability of exoplanet existence
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent/50 rounded-full p-1">
          <div className="w-1 h-3 bg-accent rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

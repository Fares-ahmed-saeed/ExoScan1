

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Telescope, Brain, TrendingUp, Globe } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <Telescope className="w-8 h-8" />,
      title: "Telescope Data",
      description: "Supports data from TESS, Kepler telescopes and other space observatories",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Advanced AI",
      description: "Machine learning algorithms trained on thousands of real light curves",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "High Accuracy",
      description: "Accuracy rate exceeding 95% in detecting exoplanet transit signals",
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Easy Interface",
      description: "Intuitive design that makes astronomy accessible to everyone",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title mb-6">
            About ExoScan
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              ExoScan is a leading platform that combines the power of artificial intelligence with modern astronomy to discover exoplanets. 
              We transform complex data into exciting discoveries!
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Using deep learning techniques, we analyze stellar light curves to search for subtle dips 
              that indicate a planet transiting in front of its host star - the primary method for discovering exoplanets.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-feature group h-full">
              <CardContent className="p-6 text-center h-full flex flex-col">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={feature.color}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-accent">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it Works */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-accent">How does ExoScan work?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-accent to-transparent hidden md:block transform -translate-y-1/2"></div>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-accent">Upload Data</h4>
              <p className="text-muted-foreground">
                Upload the light curve file of the star to be analyzed from TESS or Kepler data
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-accent to-transparent hidden md:block transform -translate-y-1/2"></div>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-accent">Smart Analysis</h4>
              <p className="text-muted-foreground">
                AI algorithms analyze the data and search for planet transit patterns
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-accent">Results</h4>
              <p className="text-muted-foreground">
                Get a detailed report showing the probability of exoplanets with charts
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-20 bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-border/30">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:animate-pulse">+5000</div>
              <p className="text-muted-foreground">Light curves analyzed</p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:animate-pulse">96%</div>
              <p className="text-muted-foreground">Accuracy rate</p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:animate-pulse">+200</div>
              <p className="text-muted-foreground">Planets discovered</p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:animate-pulse">24/7</div>
              <p className="text-muted-foreground">Always available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


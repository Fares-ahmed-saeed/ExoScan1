// import { useState } from "react";
// import Header from "@/components/Header";
// import HeroSection from "@/components/HeroSection";
// import AnalysisSection from "@/components/AnalysisSection";
// import Dashboard from "@/components/Dashboard";
// import AboutSection from "@/components/AboutSection";
// import CustomCursor from "@/components/CustomCursor";
// import KidsMode from "@/components/KidsMode";
// import BottomNavigation from "@/components/BottomNavigation";


// type AnalysisResult = {
//   planetDetected: boolean;
//   confidence: number;
//   transitDepth: string;
//   period: string;
// };

// const Index = () => {
//   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [fileName, setFileName] = useState<string>('');
//   const [isKidsMode, setIsKidsMode] = useState(false);

//   const handleAnalysisComplete = (result: AnalysisResult, file: string) => {
//     setAnalysisResult(result);
//     setFileName(file);
//     setIsAnalyzing(false);
//   };

//   const handleAnalysisStart = () => {
//     setIsAnalyzing(true);
//   };

//   const handleAnalysisReset = () => {
//     setAnalysisResult(null);
//     setIsAnalyzing(false);
//     setFileName('');
//   };

//   if (isKidsMode) {
//     return (
//       <>
//         <CustomCursor />
//         <KidsMode />
//       </>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background pb-20 md:pb-0">
//       <CustomCursor />
//       <Header />
//       <main>
//         <HeroSection />
//         <AnalysisSection 
//           onAnalysisComplete={handleAnalysisComplete}
//           onAnalysisStart={handleAnalysisStart}
//           onAnalysisReset={handleAnalysisReset}
//         />
//         <Dashboard 
//           result={analysisResult}
//           isLoading={isAnalyzing}
//           fileName={fileName}
//         />
//         <AboutSection />
//       </main>
      
//       {/* Footer */}
//       <footer className="border-t border-border/30 bg-card/20 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">
//             <div className="flex items-center justify-center space-x-3 mb-4">
//               <div className="w-8 h-8 bg-cosmic-gradient rounded-full flex items-center justify-center">
//                 <span className="text-white font-bold">E</span>
//               </div>
//               <span className="text-xl font-bold text-accent">ExoScan</span>
//             </div>
//             <p className="text-muted-foreground text-sm">
//              AI-Powered Exoplanet Discovery Platform
//             </p>
//           </div>
//         </div>
//       </footer>

//       <BottomNavigation />
//     </div>
//   );
// };

// export default Index;





import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AnalysisSection from "@/components/AnalysisSection";
import Dashboard from "@/components/Dashboard";
import AboutSection from "@/components/AboutSection";
import CustomCursor from "@/components/CustomCursor";
import KidsMode from "@/components/KidsMode";
import BottomNavigation from "@/components/BottomNavigation";
import type { AnalysisResult } from "@/types/analysis";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [isKidsMode, setIsKidsMode] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResult, file: string) => {
    setAnalysisResult(result);
    setFileName(file);
    setIsAnalyzing(false);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisReset = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setFileName('');
  };

  if (isKidsMode) {
    return (
      <>
        <CustomCursor />
        <KidsMode />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <CustomCursor />
      <Header />
      <main>
        <HeroSection />
        <AnalysisSection 
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisStart={handleAnalysisStart}
          onAnalysisReset={handleAnalysisReset}
        />
        <Dashboard 
          result={analysisResult}
          isLoading={isAnalyzing}
          fileName={fileName}
        />
        <AboutSection />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-cosmic-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-xl font-bold text-accent">ExoScan</span>
            </div>
            <p className="text-muted-foreground text-sm">
                 AI-Powered Exoplanet Discovery Platform
            </p>
          </div>
        </div>
      </footer>

      <BottomNavigation />
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Rocket, Smile, RotateCcw } from "lucide-react";

const KidsMode = () => {
  const [currentGame, setCurrentGame] = useState<'menu' | 'match' | 'count' | 'fly'>('menu');
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<any>({});

  // Planet matching game
  const planets = ['🪐', '🌍', '🌕', '⭐', '☄️', '🌙'];
  const [matchCards, setMatchCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  // Star counting game
  const [starCount, setStarCount] = useState(0);
  const [targetCount, setTargetCount] = useState(5);

  // Rocket flying game
  const [rocketPosition, setRocketPosition] = useState(50);

  const initMatchGame = () => {
    const shuffled = [...planets, ...planets].sort(() => Math.random() - 0.5);
    setMatchCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
  };

  const initCountGame = () => {
    setStarCount(0);
    setTargetCount(Math.floor(Math.random() * 8) + 3);
  };

  const initFlyGame = () => {
    setRocketPosition(50);
  };

  useEffect(() => {
    if (currentGame === 'match') initMatchGame();
    if (currentGame === 'count') initCountGame();
    if (currentGame === 'fly') initFlyGame();
  }, [currentGame]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setTimeout(() => {
        if (matchCards[newFlipped[0]] === matchCards[newFlipped[1]]) {
          setMatchedPairs(prev => [...prev, ...newFlipped]);
          setScore(prev => prev + 10);
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  const GameMenu = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-accent animate-bounce">🚀 مرحباً في عالم الفضاء! 🌟</h1>
        <p className="text-xl text-muted-foreground">اختر لعبتك المفضلة واستكشف الكواكب!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="card-cosmic p-6 cursor-pointer hover:scale-105 transition-transform" 
              onClick={() => setCurrentGame('match')}>
          <div className="text-center space-y-4">
            <div className="text-6xl">🪐</div>
            <h3 className="text-2xl font-bold text-accent">مطابقة الكواكب</h3>
            <p className="text-muted-foreground">اعثر على الأزواج المتشابهة!</p>
          </div>
        </Card>

        <Card className="card-cosmic p-6 cursor-pointer hover:scale-105 transition-transform" 
              onClick={() => setCurrentGame('count')}>
          <div className="text-center space-y-4">
            <div className="text-6xl">⭐</div>
            <h3 className="text-2xl font-bold text-accent">عد النجوم</h3>
            <p className="text-muted-foreground">كم نجمة تستطيع العد؟</p>
          </div>
        </Card>

        <Card className="card-cosmic p-6 cursor-pointer hover:scale-105 transition-transform" 
              onClick={() => setCurrentGame('fly')}>
          <div className="text-center space-y-4">
            <div className="text-6xl">🚀</div>
            <h3 className="text-2xl font-bold text-accent">طيران الصاروخ</h3>
            <p className="text-muted-foreground">حرك الصاروخ في الفضاء!</p>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-center space-x-4 text-2xl">
        <span>النقاط: </span>
        <span className="font-bold text-accent">{score}</span>
        <span>🏆</span>
      </div>
    </div>
  );

  const MatchGame = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => setCurrentGame('menu')} variant="outline" size="sm">
          العودة للقائمة
        </Button>
        <h2 className="text-3xl font-bold text-accent">🪐 مطابقة الكواكب</h2>
        <Button onClick={initMatchGame} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {matchCards.map((planet, index) => (
          <Card
            key={index}
            className={`aspect-square flex items-center justify-center text-4xl cursor-pointer transition-all
              ${flippedCards.includes(index) || matchedPairs.includes(index) 
                ? 'bg-accent/20 scale-105' 
                : 'bg-card hover:bg-accent/10'
              }`}
            onClick={() => handleCardClick(index)}
          >
            {flippedCards.includes(index) || matchedPairs.includes(index) ? planet : '❓'}
          </Card>
        ))}
      </div>

      {matchedPairs.length === matchCards.length && (
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🎉</div>
          <p className="text-2xl font-bold text-accent">أحسنت! لقد فزت!</p>
        </div>
      )}
    </div>
  );

  const CountGame = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => setCurrentGame('menu')} variant="outline" size="sm">
          العودة للقائمة
        </Button>
        <h2 className="text-3xl font-bold text-accent">⭐ عد النجوم</h2>
        <Button onClick={initCountGame} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xl">اضغط على النجوم حتى تصل للرقم: <span className="font-bold text-accent">{targetCount}</span></p>
      
      <div className="space-y-4">
        <div className="text-6xl">
          {Array.from({ length: starCount }).map((_, i) => (
            <span key={i} className="inline-block animate-pulse-star mx-1">⭐</span>
          ))}
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => setStarCount(Math.max(0, starCount - 1))}
            disabled={starCount === 0}
            size="lg"
          >
            ➖
          </Button>
          <span className="flex items-center text-2xl font-bold">{starCount}</span>
          <Button 
            onClick={() => setStarCount(starCount + 1)}
            size="lg"
          >
            ➕
          </Button>
        </div>

        {starCount === targetCount && (
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">🎉</div>
            <p className="text-2xl font-bold text-accent">رائع! العدد صحيح!</p>
            <Button onClick={() => {
              setScore(prev => prev + 15);
              initCountGame();
            }} className="btn-stellar">
              جولة جديدة
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const FlyGame = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => setCurrentGame('menu')} variant="outline" size="sm">
          العودة للقائمة
        </Button>
        <h2 className="text-3xl font-bold text-accent">🚀 طيران الصاروخ</h2>
        <Button onClick={initFlyGame} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-purple-900 to-blue-900 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-stars opacity-50"></div>
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 text-4xl"
          style={{ left: `${rocketPosition}%` }}
        >
          🚀
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => setRocketPosition(Math.max(5, rocketPosition - 10))}
          size="lg"
        >
          ⬅️ يسار
        </Button>
        <Button 
          onClick={() => setRocketPosition(Math.min(90, rocketPosition + 10))}
          size="lg"
        >
          يمين ➡️
        </Button>
      </div>

      <Button 
        onClick={() => {
          setScore(prev => prev + 5);
          // Add some celebration
        }}
        className="btn-stellar"
      >
        هبوط آمن! 🛸
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto py-8">
        {currentGame === 'menu' && <GameMenu />}
        {currentGame === 'match' && <MatchGame />}
        {currentGame === 'count' && <CountGame />}
        {currentGame === 'fly' && <FlyGame />}
      </div>
    </div>
  );
};

export default KidsMode;
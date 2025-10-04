
import { useEffect, useState } from 'react';

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
};

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const handleClick = (e: MouseEvent) => {
      const colors = [
        'hsl(var(--accent))',
        'hsl(var(--primary))',
        'hsl(var(--exo-star))',
        'hsl(var(--exo-planet))'
      ];

      const newBubbles: Bubble[] = [];
      const bubbleCount = Math.random() * 5 + 3; // 3-8 bubbles

      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: Date.now() + i,
          x: e.clientX + (Math.random() - 0.5) * 100,
          y: e.clientY + (Math.random() - 0.5) * 100,
          size: Math.random() * 20 + 5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      setBubbles(prev => [...prev, ...newBubbles]);

      // Remove bubbles after animation
      setTimeout(() => {
        setBubbles(prev => prev.filter(bubble => !newBubbles.includes(bubble)));
      }, 1000);
    };

    // Add mouse move listener
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('click', handleClick);

    // Add hover listeners for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea, select');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('click', handleClick);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed w-5 h-5 pointer-events-none z-[9999] transition-transform duration-100 ease-out animate-cursor-glow"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          background: 'radial-gradient(circle, hsl(var(--accent)) 30%, transparent 40%)',
          borderRadius: '50%',
          boxShadow: '0 0 20px hsl(var(--accent) / 0.6)'
        }}
      />
      
      {/* Interactive cursor for hover states */}
      {isHovering && (
        <div
          className="fixed w-8 h-8 pointer-events-none z-[9998] transition-all duration-150 ease-out"
          style={{
            left: mousePosition.x - 16,
            top: mousePosition.y - 16,
            background: 'radial-gradient(circle, hsl(var(--primary)) 20%, hsl(var(--accent)) 40%, transparent 60%)',
            borderRadius: '50%',
            boxShadow: '0 0 30px hsl(var(--primary) / 0.8)',
            transform: 'scale(1.2)'
          }}
        />
      )}

      {/* Click bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="fixed pointer-events-none z-[9997] animate-bubble-float"
          style={{
            left: bubble.x - bubble.size / 2,
            top: bubble.y - bubble.size / 2,
            width: bubble.size,
            height: bubble.size,
            background: `radial-gradient(circle, ${bubble.color} 20%, transparent 70%)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${bubble.size}px ${bubble.color}40`,
            animation: 'bubble-float 1s ease-out forwards'
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;

import { useState, useEffect } from "react";
import { Bot, Zap, Sparkles } from "lucide-react";

interface HummAILogoProps {
  className?: string;
}

export function HummAILogo({ className = "" }: HummAILogoProps) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [showFusion, setShowFusion] = useState(false);

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);

    // Show fusion effect
    const fusionTimer = setTimeout(() => {
      setShowFusion(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(fusionTimer);
    };
  }, []);

  return (
    <div className={`relative flex items-center space-x-3 ${className}`}>
      {/* Logo Icon Container */}
      <div className="relative">
        {/* Main Bot Icon */}
        <div
          className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md transition-all duration-1000 ${
            isAnimated ? 'rotate-0 scale-100' : 'rotate-12 scale-95'
          } ${showFusion ? 'shadow-blue-500/25 shadow-lg humm-ai-fusion' : ''}`}
        >
          <Bot className="text-white h-5 w-5" />
        </div>

        {/* AI Energy Particles */}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transition-all duration-1000 delay-300 ${
            isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          } ${showFusion ? 'animate-pulse' : ''}`}
        >
          <Zap className="text-white h-2 w-2" />
        </div>

        {/* Fusion Sparkles */}
        {showFusion && (
          <>
            <Sparkles className="absolute -top-2 left-1/2 h-3 w-3 text-cyan-400 animate-ping" />
            <Sparkles className="absolute top-1/2 -right-2 h-2 w-2 text-blue-300 animate-ping animation-delay-500" />
            <Sparkles className="absolute -bottom-1 left-1 h-2 w-2 text-yellow-300 animate-ping animation-delay-1000" />
          </>
        )}
      </div>

      {/* Text Logo */}
      <div className="flex flex-col relative">
        {/* Background Glow Effect */}
        {showFusion && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-lg rounded-lg -m-1" />
        )}

        <div className="flex items-baseline relative z-10">
          {/* "Humm" - Traditional with subtle transformation */}
          <span
            className={`text-xl font-semibold transition-all duration-800 ${
              isAnimated
                ? `tracking-normal ${showFusion ? 'text-white' : 'text-white'}`
                : 'tracking-wider text-slate-400'
            }`}
          >
            Humm
          </span>

          {/* Fusion Bridge */}
          <span
            className={`mx-0.5 transition-all duration-500 delay-800 ${
              showFusion ? 'opacity-100 text-cyan-300' : 'opacity-0'
            }`}
          >
            ×
          </span>

          {/* "AI" - Modern Tech with enhanced glow */}
          <span
            className={`text-xl font-bold transition-all duration-1000 delay-500 ${
              isAnimated
                ? `opacity-100 transform translate-x-0 ${
                    showFusion
                      ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent animate-pulse'
                      : 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'
                  }`
                : 'opacity-0 transform translate-x-4'
            }`}
          >
            AI
          </span>
        </div>

        {/* Enhanced Subtitle */}
        <p
          className={`text-xs transition-all duration-1200 delay-700 relative z-10 ${
            isAnimated
              ? `opacity-100 transform translate-y-0 ${
                  showFusion ? 'text-slate-200' : 'text-slate-300'
                }`
              : 'opacity-0 transform translate-y-2'
          }`}
        >
          {showFusion ? 'AI-Powered Leadership' : 'Tech Leadership Platform'}
        </p>
      </div>

      {/* Enhanced Connection Energy Flow */}
      <div
        className={`absolute top-5 left-11 w-12 h-0.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 transform origin-left transition-all duration-1000 delay-200 ${
          isAnimated ? 'scale-x-100 opacity-60' : 'scale-x-0 opacity-0'
        } ${showFusion ? 'animate-pulse shadow-cyan-400/50 shadow-sm' : ''}`}
      />

      {/* Subtle background energy field */}
      {showFusion && (
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 to-transparent rounded-2xl scale-150 animate-pulse" />
      )}
    </div>
  );
}
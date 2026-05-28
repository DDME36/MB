import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Video, 
  ArrowUpRight
} from 'lucide-react';

// Custom SVG Outline Icons for Brand Channels (Since Lucide v1.x removed brand icons)
function Facebook({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Instagram({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Youtube({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
      <polygon points="10 15 15 12 10 9" />
    </svg>
  );
}

function Soundcloud({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 15a1 1 0 0 0 1 1h18a3 3 0 0 0 0-6h-.86a6 6 0 0 0-11.4 0H8a4 4 0 0 0-4 4" />
      <path d="M6 16v-4" />
      <path d="M9 16v-6" />
      <path d="M12 16V9" />
      <path d="M15 16v-6" />
      <path d="M18 16v-4" />
    </svg>
  );
}



// PC Specifications Database
const PC_SPECS = [
  { label: "CPU", value: "Intel(R) Core(TM) i5-10400F CPU @ 2.90GHz" },
  { label: "GPU", value: "NVIDIA GeForce RTX 2070 SUPER (8 GB)" },
  { label: "RAM", value: "16.0 GB" },
  { label: "SSD", value: "1.5TB WD_BLACK SN770" }
];

// Remote Figma Fallback Mock Models
const FALLBACK_MODELS = [
  "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png", // Page 1: Cyber Netrunner
  "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png", // Page 2: Forest Guard
  "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png"  // Page 3: Cosmic Valkyrie
];

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Mascot Images state pointing to local files inside public folder
  const [mascotImages, setMascotImages] = useState([
    "/mascot_page1.png", // Local asset for Page 1
    "/mascot_page2.png", // Local asset for Page 2
    "/mascot_page3.png"  // Local asset for Page 3
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup loop ambient music with responsive auto-start on interaction (Strict-Mode safe)
  useEffect(() => {
    // Load local background music from public/music.mp3 (simply drop your MP3 file there!)
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.3; // Low ambient sound level
    audioRef.current = audio;

    let isCleanedUp = false;

    const enableAudioOnInteraction = () => {
      if (isCleanedUp) return;
      audio.play()
        .then(() => {
          if (!isCleanedUp) {
            setAudioPlaying(true);
            cleanupListeners();
          } else {
            audio.pause();
            audio.src = "";
          }
        })
        .catch(() => {
          // Keep waiting for user gesture
        });
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', enableAudioOnInteraction);
      window.removeEventListener('keydown', enableAudioOnInteraction);
      window.removeEventListener('touchstart', enableAudioOnInteraction);
      window.removeEventListener('wheel', enableAudioOnInteraction);
    };

    // Register interaction listeners immediately to capture user gesture
    window.addEventListener('click', enableAudioOnInteraction);
    window.addEventListener('keydown', enableAudioOnInteraction);
    window.addEventListener('touchstart', enableAudioOnInteraction);
    window.addEventListener('wheel', enableAudioOnInteraction);

    // Try playing immediately (some browser configurations/actions allow it)
    audio.play()
      .then(() => {
        if (!isCleanedUp) {
          setAudioPlaying(true);
          cleanupListeners();
        } else {
          audio.pause();
          audio.src = "";
        }
      })
      .catch(() => {
        // Autoplay blocked, wait for user gesture via registered listeners
      });

    return () => {
      isCleanedUp = true;
      audio.pause();
      audio.src = ""; // Completely unload audio from browser memory to prevent overlap
      audioRef.current = null;
      cleanupListeners();
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch(err => console.log("Failed to play audio:", err));
    }
  };

  // Track mouse coordinates normalized between -1 and 1 for 3D parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Preload fallback images for seamless crossfades
  useEffect(() => {
    FALLBACK_MODELS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight || 1);
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const currentScrollY = target.scrollTop;
    const currentViewportHeight = target.clientHeight || 1;

    setScrollY(currentScrollY);
    setViewportHeight(currentViewportHeight);
  };

  const progress = scrollY / viewportHeight;

  let activeIndex = 0;
  if (progress < 0.5) activeIndex = 0;
  else if (progress < 1.5) activeIndex = 1;
  else activeIndex = 2; // Page 03 (Specs)

  const scrollToSection = (idx: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: idx * viewportHeight,
        behavior: 'smooth'
      });
    }
    setMenuOpen(false);
  };

  // Switch to remote fallback image if local PNG is not present
  const handleImageError = (index: number) => {
    setMascotImages((prev) => {
      const updated = [...prev];
      updated[index] = FALLBACK_MODELS[index];
      return updated;
    });
  };

  // Helper function for linear interpolation
  const interpolate = (start: number, end: number, ratio: number) => {
    return start + (end - start) * ratio;
  };

  // Crossfade and Slide positioning for 3 DIFFERENT models
  const getModelStyle = (idx: number) => {
    const isActive = activeIndex === idx;

    // Add subtle parallax offset on desktop when active
    const parallaxX = !isMobile && isActive ? mousePos.x * 12 : 0;
    const parallaxY = !isMobile && isActive ? mousePos.y * 12 : 0;
    const rotateOffset = !isMobile && isActive ? mousePos.x * 1.5 : 0;

    if (isMobile) {
      // Mobile positioning — higher opacity so mascot is clearly visible
      if (isActive) {
        return {
          opacity: 0.68,
          transform: 'translate3d(0, 2vh, 0) scale(0.88) rotate(0deg)',
          filter: 'blur(0px) drop-shadow(0 10px 25px rgba(0,0,0,0.6))',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease, filter 0.8s ease',
          willChange: 'transform, opacity',
        };
      }
      const isPast = idx < activeIndex;
      return {
        opacity: 0,
        transform: isPast
          ? 'translate3d(-15vw, 10vh, 0) scale(0.72) rotate(-10deg)'
          : 'translate3d(15vw, -10vh, 0) scale(0.72) rotate(10deg)',
        filter: 'blur(12px)',
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease, filter 0.8s ease',
        willChange: 'transform, opacity',
      };
    } else {
      // Desktop: Alternating slide paths!
      if (idx === 0) {
        // Model 1: Page 1 Active (Right Side)
        if (isActive) {
          return {
            opacity: 1,
            transform: `translate3d(calc(22vw + ${parallaxX}px), ${parallaxY}px, 0) scale(1) rotate(${rotateOffset}deg)`,
            filter: 'blur(0px) drop-shadow(0 25px 60px rgba(0,0,0,0.85))',
            transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.9s ease, filter 0.9s ease',
          };
        }
        // Inactive: slide-out upwards to the right and blur
        return {
          opacity: 0,
          transform: 'translate3d(32vw, -12vh, 0) scale(0.82) rotate(15deg)',
          filter: 'blur(20px)',
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease, filter 0.9s ease',
        };
      }

      if (idx === 1) {
        // Model 2: Page 2 Active (Left Side)
        if (isActive) {
          return {
            opacity: 1,
            transform: `translate3d(calc(-24vw + ${parallaxX}px), ${parallaxY}px, 0) scale(1.1) rotate(${rotateOffset - 5}deg)`,
            filter: 'blur(0px) drop-shadow(0 0 35px rgba(255, 59, 48, 0.25))',
            transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.9s ease, filter 0.9s ease',
          };
        }
        // Inactive: slide-out left/up if past, or left/down if future
        const isPast = activeIndex > 1;
        return {
          opacity: 0,
          transform: isPast 
            ? 'translate3d(-32vw, -12vh, 0) scale(0.82) rotate(-15deg)'
            : 'translate3d(-32vw, 12vh, 0) scale(0.82) rotate(15deg)',
          filter: 'blur(20px)',
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease, filter 0.9s ease',
        };
      }

      // Model 3: Page 3 Active (Right Side)
      if (isActive) {
        return {
          opacity: 1,
          transform: `translate3d(calc(22vw + ${parallaxX}px), calc(-2vh + ${parallaxY}px), 0) scale(0.98) rotate(${rotateOffset + 5}deg)`,
          filter: 'blur(0px) brightness(1.22) contrast(1.08) drop-shadow(0 25px 60px rgba(0,0,0,0.85))',
          transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.9s ease, filter 0.9s ease',
        };
      }
      // Inactive: slide-out downwards and blur
      return {
        opacity: 0,
        transform: 'translate3d(16vw, 12vh, 0) scale(0.82) rotate(-15deg)',
        filter: 'blur(20px)',
        transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease, filter 0.9s ease',
      };
    }
  };

  // Glow morph style shifts colors and position dynamically
  const getGlowMorphStyle = () => {
    let glowColor = 'rgba(255, 59, 48, 0.32)'; // Default Crimson for Page 1

    if (isMobile) {
      if (activeIndex === 1) glowColor = 'rgba(107, 191, 122, 0.26)'; // Green for Page 2
      else if (activeIndex === 2) glowColor = 'rgba(230, 0, 0, 0.32)'; // Deep Ruby for Page 3

      return {
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
        className: 'fixed bottom-[8%] w-[450px] h-[450px] rounded-full blur-[45px] pointer-events-none opacity-80 left-1/2 -translate-x-1/2'
      };
    }

    // Desktop glow center & color shift!
    let leftOffset = '75%';
    if (progress <= 1) {
      const ratio = Math.max(0, Math.min(1, progress));
      leftOffset = `${interpolate(75, 25, ratio)}%`; // Shifts Right (75%) to Left (25%)
      
      // Interpolate color from Red (255, 59, 48) to Green (107, 191, 122)
      const r = Math.round(interpolate(255, 107, ratio));
      const g = Math.round(interpolate(59, 191, ratio));
      const b = Math.round(interpolate(48, 122, ratio));
      glowColor = `rgba(${r}, ${g}, ${b}, 0.32)`;
    } else {
      const ratio = Math.max(0, Math.min(1, progress - 1));
      leftOffset = `${interpolate(25, 75, ratio)}%`; // Shifts Left (25%) back to Right (75%)
      
      // Interpolate color from Green (107, 191, 122) to Deep Ruby (230, 0, 0)
      const r = Math.round(interpolate(107, 230, ratio));
      const g = Math.round(interpolate(191, 0, ratio));
      const b = Math.round(interpolate(122, 0, ratio));
      glowColor = `rgba(${r}, ${g}, ${b}, 0.32)`;
    }

    return {
      background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
      style: {
        left: leftOffset,
        transform: 'translate3d(-50%, 0, 0)',
        transition: 'left 0.15s cubic-bezier(0.16, 1, 0.3, 1), background 0.8s ease',
      },
      className: 'fixed bottom-[8%] w-[680px] h-[680px] rounded-full blur-[45px] pointer-events-none opacity-85'
    };
  };

  const glowConfig = getGlowMorphStyle();

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none font-sans text-white">
      
      {/* 1. CINEMATIC BACKGROUND VIDEO (FIXED SIBLING) */}
      <video
        key="bg-video"
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 select-none pointer-events-none opacity-80"
      >
        {/* Local downloaded video from public folder (e.g. Wuthering Waves Jue Dragon) */}
        <source src="/wuthering_waves_dragon.mp4" type="video/mp4" />
        {/* Fallback original cinematic video */}
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4" type="video/mp4" />
      </video>

      {/* 2. BOTTOM BLUR OVERLAY WITH CSS GRADIENT MASK (FIXED SIBLING) */}
      <div 
        style={{
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 55%)',
          maskImage: 'linear-gradient(to top, black 0%, transparent 55%)',
          zIndex: 1,
        }}
        className="fixed inset-0 backdrop-blur-xl pointer-events-none"
      />

      {/* 3. DYNAMIC RED/GREEN COLOR BACKDROP HALO (FIXED SIBLING) */}
      <div
        style={{ 
          background: glowConfig.background, 
          ...glowConfig.style,
          zIndex: 2 
        }}
        className={glowConfig.className}
      />

      {/* 4. FIXED MORPHING MODEL DISPLAY STAGE (FIXED SIBLING) */}
      <div className="fixed inset-0 z-3 w-full h-screen pointer-events-none flex items-center justify-center">
        <div className="w-full h-full max-w-7xl mx-auto animate-bobbing flex items-end justify-center relative px-6">
          
          {/* Circular Holographic containment field behind mascot in Page 02 (Linktree Portal) */}
          <div 
            style={{
              opacity: progress > 0.4 && progress < 1.6 && !isMobile ? 0.35 : 0,
              transform: 'translate3d(-24vw, -20vh, 0) scale(0.95)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute bottom-[2%] w-[420px] h-[420px] rounded-full border-2 border-dashed border-[#ff3b30] shadow-[0_0_50px_rgba(255,59,48,0.2)]"
          />

          {mascotImages.map((src, idx) => (
            <img
              key={`mascot-fig-${idx}`}
              src={src}
              alt={`Mightybit Mascot ${idx + 1}`}
              draggable={false}
              style={getModelStyle(idx)}
              onError={() => handleImageError(idx)}
              className="absolute h-[60%] sm:h-[70%] lg:h-[80%] max-w-[80%] lg:max-w-[85%] object-contain object-bottom select-none bottom-[12%] sm:bottom-[10%]"
            />
          ))}
        </div>
      </div>

      {/* 5. FIXED NAVIGATION BAR (FIXED SIBLING) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 md:py-6 bg-gradient-to-b from-black/85 to-transparent backdrop-blur-xs">
        {/* Logo */}
        <div 
          onClick={() => scrollToSection(0)}
          className="text-base sm:text-lg md:text-xl font-black tracking-[0.25em] cursor-pointer text-white hover:opacity-90 animate-blur-fade-up uppercase"
        >
          MIGHTY<span className="text-[#ff3b30] drop-shadow-[0_0_8px_rgba(255,59,48,0.6)]">BIT</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollToSection(0)}
            className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeIndex === 0 
                ? 'text-[#ff3b30] drop-shadow-[0_0_5px_rgba(255,59,48,0.5)] scale-[1.05]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            {activeIndex === 0 && <span className="text-[#ff3b30] mr-1.5 animate-pulse">•</span>}ABOUT
          </button>
          <button
            onClick={() => scrollToSection(1)}
            className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeIndex === 1 
                ? 'text-[#ff3b30] drop-shadow-[0_0_5px_rgba(255,59,48,0.5)] scale-[1.05]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            {activeIndex === 1 && <span className="text-[#ff3b30] mr-1.5 animate-pulse">•</span>}PORTAL
          </button>
          <button
            onClick={() => scrollToSection(2)}
            className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeIndex === 2 
                ? 'text-[#ff3b30] drop-shadow-[0_0_5px_rgba(255,59,48,0.5)] scale-[1.05]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            {activeIndex === 2 && <span className="text-[#ff3b30] mr-1.5 animate-pulse">•</span>}SYSTEM RIG
          </button>
        </div>

        {/* Right Action button */}
        <div className="flex items-center gap-3">
          {/* Ambient Audio Controller */}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2.5 rounded-full px-4 py-2.5 liquid-glass text-white/95 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:scale-[1.05] hover:bg-white/12 transition-all duration-150"
            title="Toggle background ambient music"
          >
            {/* Cyber Sound Wave Visualizer Animation */}
            <div className="flex items-end gap-[2px] h-[12px] w-[12px] mb-[1px]">
              <span className={`w-[2px] bg-[#ff3b30] rounded-full transition-all duration-300 ${audioPlaying ? 'animate-audio-bar-1' : 'h-[3px]'}`} />
              <span className={`w-[2px] bg-[#ff3b30] rounded-full transition-all duration-300 ${audioPlaying ? 'animate-audio-bar-2' : 'h-[6px]'}`} />
              <span className={`w-[2px] bg-[#ff3b30] rounded-full transition-all duration-300 ${audioPlaying ? 'animate-audio-bar-3' : 'h-[4px]'}`} />
            </div>
            <span className="hidden sm:inline text-[10px] tracking-widest">{audioPlaying ? "SOUND ON" : "SOUND OFF"}</span>
          </button>

          <button
            onClick={() => scrollToSection(1)}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 liquid-glass text-white/95 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:scale-[1.05] hover:bg-white/12 transition-all duration-150"
          >
            <Search className="w-[18px] h-[18px] text-[#ff3b30]" strokeWidth={2.25} />
            Connect
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full liquid-glass text-white/95 cursor-pointer hover:scale-[1.05] transition-all duration-150"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Menu 
                className={`absolute w-5 h-5 transition-all duration-500 ease-out ${
                  menuOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
                }`} 
                strokeWidth={2.25} 
              />
              <X 
                className={`absolute w-5 h-5 transition-all duration-500 ease-out ${
                  menuOpen ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-50'
                }`} 
                strokeWidth={2.25} 
              />
            </div>
          </button>
        </div>
      </nav>

      {/* 6. MOBILE MENU DROPDOWN (FIXED SIBLING) */}
      <div
        className={`fixed left-0 right-0 top-[72px] z-45 bg-black/96 backdrop-blur-xl border-b border-red-500/10 shadow-2xl transition-all duration-500 ease-out px-6 py-5 flex flex-col gap-2 lg:hidden ${
          menuOpen 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className={`py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider text-left transition-all duration-200 ${
            activeIndex === 0 
              ? 'bg-red-500/10 text-[#ff3b30] border-l-2 border-[#ff3b30]' 
              : 'text-white/75 hover:text-white hover:bg-white/5'
          }`}
        >
          {activeIndex === 0 && <span className="text-[#ff3b30] mr-1.5">•</span>} ABOUT
        </button>
        <button
          onClick={() => scrollToSection(1)}
          className={`py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider text-left transition-all duration-200 ${
            activeIndex === 1 
              ? 'bg-red-500/10 text-[#ff3b30] border-l-2 border-[#ff3b30]' 
              : 'text-white/75 hover:text-white hover:bg-white/5'
          }`}
        >
          {activeIndex === 1 && <span className="text-[#ff3b30] mr-1.5">•</span>} PORTAL
        </button>
        <button
          onClick={() => scrollToSection(2)}
          className={`py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider text-left transition-all duration-200 ${
            activeIndex === 2 
              ? 'bg-red-500/10 text-[#ff3b30] border-l-2 border-[#ff3b30]' 
              : 'text-white/75 hover:text-white hover:bg-white/5'
          }`}
        >
          {activeIndex === 2 && <span className="text-[#ff3b30] mr-1.5">•</span>} SYSTEM RIG
        </button>
      </div>



      {/* ==========================================
         8. SCROLL-SNAP NARRATIVE CONTAINER (ABSOLUTE VIEWPORT OVERLAY)
         ========================================== */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth z-10"
      >
        
        {/* ==========================================
           PAGE 01: INTRODUCTION // ABOUT (h-screen)
           ========================================== */}
        <section className="relative w-full h-screen flex items-center snap-start snap-always px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden max-w-7xl mx-auto justify-start">
          {/* Giant display watermark scroll-number — smaller on mobile to avoid text overlap */}
          <div 
            className={`font-display text-[9rem] sm:text-[18rem] md:text-[26rem] absolute top-[10vh] leading-none z-1 text-outline-red select-none pointer-events-none -left-2 sm:left-6 opacity-60 sm:opacity-100 ${
              activeIndex === 0 ? 'text-outline-red-active' : ''
            }`}
          >
            01
          </div>

          {/* Foreground Intro Text Block — higher z-index and slightly raised on mobile so mascot stays behind */}
          <div className="relative z-10 max-w-2xl text-left pl-2 sm:pl-6 md:pl-10 lg:pr-28 pointer-events-auto mt-[-4vh] sm:mt-0">
            {/* Cyber badge */}
            <div className="inline-flex items-center gap-2 rounded-md px-3 py-1 bg-red-500/10 border border-red-500/25 text-[#ff3b30] text-[10px] sm:text-xs font-mono font-black tracking-widest mb-3 sm:mb-4 shadow-[0_0_15px_rgba(255,59,48,0.1)] uppercase animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30]" />
              CORE SYSTEM ONLINE
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-2 sm:mb-3 text-white uppercase font-sans">
              MIGHTYBIT
              <span className="block mt-1 bg-gradient-to-r from-[#ff3b30] via-[#ff5252] to-[#ff4b2b] bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_10px_rgba(255,59,48,0.25)]">
                ABOUT DOME
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base font-bold uppercase tracking-widest text-[#ff5252]/90 mb-3 sm:mb-5 pl-1 font-sans">
              &gt; สวัสดีครับ ผมชื่อโดม
            </p>

            {/* Narrative text — hidden on very small screens to keep layout clean */}
            <p className="hidden sm:block text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-xl font-medium">
              สิ่งที่คิดอยู่บ่อยๆ คือ เล่นเกมแพ้ตลอด... เป็นที่เกมหรือเป็นที่กูเนี่ย? <br />
              และผมชอบสีแดงเป็นชีวิตจิตใจ เพราะแม่สอนไว้ตั้งแต่เด็กว่า <br />
              <span className="text-[#ff3b30] font-extrabold drop-shadow-[0_0_8px_rgba(255,59,48,0.4)]">&quot;จะถูกจะแพง ก็แดงไว้ก่อน!&quot;</span>
            </p>
            {/* Short version for tiny screens */}
            <p className="sm:hidden text-xs text-white/75 mb-5 leading-relaxed max-w-[260px] font-medium">
              เล่นเกมแพ้ตลอด... <span className="text-[#ff3b30] font-extrabold">&quot;จะถูกจะแพง ก็แดงไว้ก่อน!&quot;</span>
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center pl-1">
              <button 
                onClick={() => scrollToSection(1)}
                className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#ff3b30] to-[#ff5252] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full px-6 sm:px-9 py-2.5 sm:py-3.5 cursor-pointer hover:shadow-[0_0_25px_rgba(255,59,48,0.6)] hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
              >
                <Play className="w-[14px] h-[14px] fill-white" strokeWidth={2.2} />
                Connect Portal
              </button>
              
              <button 
                onClick={() => scrollToSection(2)}
                className="flex items-center justify-center rounded-full px-5 sm:px-8 py-2.5 sm:py-3.5 liquid-glass text-white border border-[#ff3b30]/30 text-xs sm:text-sm font-semibold uppercase tracking-wider cursor-pointer hover:scale-[1.03] active:scale-[0.97] hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(255,59,48,0.3)] transition-all duration-150"
              >
                Check Rig Specs
              </button>
            </div>
          </div>

          {/* PULSING SCROLL DOWN INDICATOR — safe area aware */}
          <div 
            onClick={() => scrollToSection(1)}
            className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-[50%] -translate-x-[50%] z-20 flex flex-col items-center gap-1 cursor-pointer select-none"
          >
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-white/40">SCROLL DOWN</span>
            <ChevronDown className="w-4 h-4 text-red-500/80 animate-double-pulse" strokeWidth={2.5} />
          </div>
        </section>

        {/* ==========================================
           PAGE 02: PORTAL // LINKTREE (h-screen)
           ========================================== */}
        {/* PAGE 02: PORTAL — flex layout, cards scroll on small screens */}
        <section className="relative w-full h-screen flex items-center snap-start snap-always px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden max-w-7xl mx-auto justify-end">
          {/* Giant display watermark — smaller on mobile */}
          <div 
            className={`font-display text-[9rem] sm:text-[18rem] md:text-[26rem] absolute top-[10vh] leading-none z-1 text-outline-red select-none pointer-events-none -right-2 sm:right-6 opacity-60 sm:opacity-100 ${
              activeIndex === 1 ? 'text-outline-red-active' : ''
            }`}
          >
            02
          </div>

          {/* Right Pane: cards panel — scrollable on mobile if needed */}
          <div className="relative z-10 w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left pr-0 lg:pr-6 pointer-events-auto max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain scrollbar-hide py-2">
            
            {/* Header Title */}
            <div className="mb-4 lg:mb-8">
              <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
                CONNECT <span className="text-[#ff3b30] drop-shadow-[0_0_8px_rgba(255,59,48,0.4)]">PORTAL</span>
              </h2>
              <p className="hidden sm:block text-xs sm:text-sm text-white/80 leading-relaxed mt-3 max-w-md mx-auto lg:mx-0 font-medium">
                ช่องทางการติดตามโซเชียลมีเดีย อัปเดตผลงานวิดีโอ ไลฟ์สไตล์ และผลงานเพลงของผมได้จากที่นี่เลยครับ!
              </p>
            </div>

            {/* Card grid — compact on mobile, 2-col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 w-full">
              
              {/* YouTube Card */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 sm:p-5 rounded-xl liquid-glass hover-glow-red hover-glow-red-youtube no-underline text-white cursor-pointer active:scale-[0.97] active:bg-white/8 transition-transform duration-150"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black/65 border border-[#ff0000]/40 rounded-lg text-[#ff0000] shadow-[0_0_12px_rgba(255,0,0,0.25)]">
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-black tracking-widest uppercase text-sm text-white font-sans">YouTube</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/50" strokeWidth={2.25} />
              </a>

              {/* TikTok Card */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 sm:p-5 rounded-xl liquid-glass hover-glow-red hover-glow-red-tiktok no-underline text-white cursor-pointer active:scale-[0.97] active:bg-white/8 transition-transform duration-150"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black/65 border border-[#00f2fe]/40 rounded-lg text-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.2)]">
                    <Video className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                  </div>
                  <span className="font-black tracking-widest uppercase text-sm text-white font-sans">TikTok</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/50" strokeWidth={2.25} />
              </a>

              {/* Instagram Card */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 sm:p-5 rounded-xl liquid-glass hover-glow-red hover-glow-red-instagram no-underline text-white cursor-pointer active:scale-[0.97] active:bg-white/8 transition-transform duration-150"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black/65 border border-[#e4405f]/40 rounded-lg text-[#e4405f] shadow-[0_0_12px_rgba(228,64,95,0.2)]">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-black tracking-widest uppercase text-sm text-white font-sans">Instagram</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/50" strokeWidth={2.25} />
              </a>

              {/* Facebook Card */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 sm:p-5 rounded-xl liquid-glass hover-glow-red hover-glow-red-facebook no-underline text-white cursor-pointer active:scale-[0.97] active:bg-white/8 transition-transform duration-150"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black/65 border border-[#1877f2]/40 rounded-lg text-[#1877f2] shadow-[0_0_12px_rgba(24,119,242,0.2)]">
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-black tracking-widest uppercase text-sm text-white font-sans">Facebook</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/50" strokeWidth={2.25} />
              </a>

              {/* SoundCloud Card — full width */}
              <a
                href="https://soundcloud.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 sm:p-5 rounded-xl liquid-glass hover-glow-red hover-glow-red-soundcloud no-underline text-white cursor-pointer active:scale-[0.97] active:bg-white/8 transition-transform duration-150 col-span-1 sm:col-span-2"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black/65 border border-[#ff5500]/40 rounded-lg text-[#ff5500] shadow-[0_0_12px_rgba(255,85,0,0.2)]">
                    <Soundcloud className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-black tracking-widest uppercase text-sm text-white font-sans">SoundCloud</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/50" strokeWidth={2.25} />
              </a>
            </div>
          </div>

          {/* PULSING SCROLL DOWN INDICATOR — safe area aware */}
          <div 
            onClick={() => scrollToSection(2)}
            className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-[50%] -translate-x-[50%] z-20 flex flex-col items-center gap-1 cursor-pointer select-none"
          >
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-white/40">SCROLL DOWN</span>
            <ChevronDown className="w-4 h-4 text-red-500/80 animate-double-pulse" strokeWidth={2.5} />
          </div>
        </section>

        {/* ==========================================
           PAGE 03: STREAMING RIG // SPECS (h-screen)
           ========================================== */}
        <section 
          id="specs-section"
          className="relative w-full h-screen flex flex-col justify-between snap-start snap-always px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden bg-gradient-to-b from-black/60 via-[#0c0101]/80 to-black/85 border-t border-red-500/10"
        >
          {/* Giant display watermark — smaller on mobile */}
          <div 
            className={`font-display text-[9rem] sm:text-[18rem] md:text-[26rem] absolute top-[10vh] leading-none z-0 select-none pointer-events-none -left-2 sm:left-6 opacity-60 sm:opacity-100 transition-all duration-500 ${
              activeIndex === 2 ? 'text-outline-red-darkbg-active text-outline-red-darkbg' : 'text-outline-red-darkbg'
            }`}
          >
            03
          </div>

          {/* Top spacer */}
          <div className="h-[72px] sm:h-[88px]" />

          {/* Core Split-Pane Layout — scrollable on mobile */}
          <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 py-2 lg:py-4 overflow-y-auto overscroll-contain scrollbar-hide">
            
            {/* Left Pane: PC Specs Table */}
            <div className="relative z-10 w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left pr-0 lg:pr-6 pointer-events-auto">
              
              {/* Header Title */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none font-sans">
                  MIGHTYBIT <span className="text-[#ff3b30] block lg:inline lg:mt-0 mt-1 drop-shadow-[0_0_8px_rgba(255,59,48,0.4)]">SYSTEM RIG</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mt-2 sm:mt-3 max-w-md mx-auto lg:mx-0 font-medium">
                  สเปคคอมกากๆ ของผม เอาไว้ใช้ทำงานทั่วไปกับเล่นเกมไปวันๆ ครับ
                </p>
              </div>

              {/* Specifications List */}
              <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-sm">
                {PC_SPECS.map((spec, index) => (
                  <div 
                    key={`spec-row-${index}`}
                    className="flex flex-row justify-between items-center py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-lg border border-red-500/10 bg-red-500/5 active:bg-red-500/10 hover:bg-red-500/10 transition-all duration-150 group"
                  >
                    <span className="font-extrabold text-[#ff3b30] min-w-[70px] sm:min-w-[110px] uppercase tracking-wider group-hover:scale-[1.02] transition-transform text-left">
                      &gt; {spec.label}:
                    </span>
                    <span className="text-white text-right sm:text-left font-semibold text-[11px] sm:text-sm">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Plan — desktop: right pane | mobile: shown below specs as compact strip */}
            <div className="relative z-10 w-full lg:w-[45%] lg:flex-col lg:items-end lg:text-right lg:pr-6 lg:self-center">
              {/* Desktop version */}
              <div className="hidden lg:flex flex-col items-end">
                <h3 className="text-xl font-black uppercase tracking-wider text-[#ff3b30] drop-shadow-[0_0_8px_rgba(255,59,48,0.5)] mb-3">
                  UPGRADE PLAN
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md mb-5 font-medium">
                  คอมสเปคนี้มีแผนกำลังจะเปลี่ยนเร็วๆ นี้ครับ... <br />
                  แต่แรมดันเสือกแพงขึ้นอีก ชิบหายเลยทีนี้ ไม่มีตังแล้วครับ! <br /><br />
                  สเปคคอมกากแต่จอคอมโหด 180Hz <br />
                  ดันเฟรมไม่ถึงกระตุกตามาก แต่ถ้าถึงเมื่อไหร่ <br />
                  บอกเลย God Father วงการเกมเลยแหละ!
                </p>
                <button 
                  onClick={() => scrollToSection(0)}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-[#ff3b30]/30 hover:border-[#ff3b30] text-xs text-white font-bold tracking-widest transition-all duration-150 cursor-pointer"
                >
                  BACK TO TOP
                </button>
              </div>

              {/* Mobile version — compact horizontal strip */}
              <div className="lg:hidden mt-3 p-3 rounded-xl border border-red-500/10 bg-red-500/5">
                <p className="text-[11px] text-white/70 leading-relaxed font-medium text-center">
                  <span className="text-[#ff3b30] font-bold">UPGRADE PLAN:</span>{' '}
                  แรมแพง ไม่มีตัง! 180Hz โหดแต่เฟรมไม่ถึง — ถ้าถึงเมื่อไหร่{' '}
                  <span className="text-[#ff3b30] font-bold">God Father วงการเกม!</span>
                </p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <footer className="w-full max-w-7xl mx-auto py-4 sm:py-6 border-t border-red-500/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <div className="text-center sm:text-left">
              <div className="text-xs font-black uppercase tracking-[0.25em] mb-1 text-white">
                MIGHTY<span className="text-[#ff3b30]">BIT</span>
              </div>
              <p className="text-[8px] text-white/45 uppercase tracking-widest pl-0.5">&copy; 2026 MIGHTYBIT MEDIA GROUP. ALL RIGHTS RESERVED.</p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <a href="#" className="text-[10px] text-white/60 hover:text-white active:text-white transition-colors duration-200 no-underline font-semibold uppercase tracking-wider">PRIVACY POLICY</a>
              <a href="#" className="text-[10px] text-white/60 hover:text-white active:text-white transition-colors duration-200 no-underline font-semibold uppercase tracking-wider">TERMS OF SERVICE</a>
            </div>
          </footer>
        </section>

      </div>

    </div>
  );
}

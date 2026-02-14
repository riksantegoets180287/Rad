
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Wheel from './components/Wheel';
import AdminPanel from './components/AdminPanel';
import { INITIAL_TOPICS, SPIN_DURATION } from './constants';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const App: React.FC = () => {
  const [topics, setTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('summa_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Audio Refs
  const spinAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);

  // Secret sequence state
  const keySequence = useRef<number[]>([]);
  const lastKeyTime = useRef<number>(0);

  useEffect(() => {
    // Ticking sound for spinning
    spinAudio.current = new Audio('https://www.soundjay.com/buttons/button-20.mp3'); 
    spinAudio.current.loop = true;
    
    // Happy/Tada sound for winning
    winAudio.current = new Audio('https://www.soundjay.com/misc/sounds/tada-fanfare-02.mp3');
    
    // Pre-load sounds
    spinAudio.current.load();
    winAudio.current.load();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const now = Date.now();
    if (now - lastKeyTime.current > 5000) {
      keySequence.current = [];
    }
    
    if (e.key === '9') {
      keySequence.current.push(now);
      lastKeyTime.current = now;
      
      if (keySequence.current.length === 7) {
        setIsAdminOpen(true);
        keySequence.current = [];
      }
    } else {
      keySequence.current = [];
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setSelectedTopic(null);
    setShowResult(false);
    setIsSpinning(true);

    // Ensure audio plays
    if (spinAudio.current) {
      spinAudio.current.currentTime = 0;
      spinAudio.current.play().catch(e => console.error("Audio error:", e));
    }

    const numTopics = topics.length;
    const segmentSize = 360 / numTopics;
    
    // Pick winner index
    const winnerIndex = Math.floor(Math.random() * numTopics);
    const winnerTopic = topics[winnerIndex];

    // Calculate rotation
    const extraSpins = 10 * 360; 
    const currentRotationBase = Math.ceil(rotation / 360) * 360;
    
    // Indicator is at 270 degrees. Put the middle of the segment at the indicator.
    const targetBaseRotation = 270 - (winnerIndex + 0.5) * segmentSize;
    const finalRotation = currentRotationBase + extraSpins + targetBaseRotation;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      if (spinAudio.current) {
        spinAudio.current.pause();
      }
      if (winAudio.current) {
        winAudio.current.currentTime = 0;
        winAudio.current.play().catch(e => console.error("Win audio error:", e));
      }
      
      setSelectedTopic(winnerTopic);
      setShowResult(true);
      
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#20126E', '#19E196', '#FFC800']
      });
    }, SPIN_DURATION);
  };

  return (
    <div className="fixed inset-0 bg-summaGray flex flex-col items-center justify-center p-0 overflow-hidden select-none">
      
      {/* Background Wheel - Visual core */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <div className="w-[90vw] h-[90vw] max-w-[85vh] max-h-[85vh]">
          <Wheel topics={topics} rotation={rotation} isSpinning={isSpinning} />
        </div>
      </div>

      {/* Start Overlay - Centered Pop-up over the wheel */}
      {!isSpinning && !showResult && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-summaIndigo/20 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white/95 w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center border-4 border-summaIndigo transform scale-100 hover:scale-[1.02] transition-transform">
            <h1 className="text-4xl md:text-5xl font-black text-summaIndigo mb-3 tracking-tight">
              Presentatie Rad
            </h1>
            <p className="text-lg text-summaIndigo/80 font-medium mb-10">
              Draai aan het rad en ontdek jouw onderwerp.
            </p>
            <button
              onClick={spinWheel}
              className="w-full py-6 bg-summaYellow text-summaIndigo font-black rounded-3xl text-3xl shadow-xl shadow-summaYellow/30 hover:bg-yellow-400 hover:shadow-yellow-300/50 transition-all active:scale-95 uppercase tracking-tighter"
            >
              DRAAI NU!
            </button>
          </div>
        </div>
      )}

      {/* Result Popup Modal */}
      {showResult && selectedTopic && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-summaIndigo/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-12 text-center transform animate-in zoom-in slide-in-from-bottom-20 duration-500 border-[10px] border-summaAqua">
            <div className="mb-10">
              <p className="text-summaIndigo/60 font-semibold text-2xl mb-4">Jouw onderwerp is:</p>
              <h2 className="text-6xl md:text-8xl font-black text-summaIndigo leading-tight tracking-tight">
                {selectedTopic}
              </h2>
            </div>
            
            <button
              onClick={() => setShowResult(false)}
              className="w-full py-6 bg-summaIndigo text-white font-black rounded-[2rem] hover:bg-indigo-900 transition-all text-3xl shadow-2xl shadow-summaIndigo/40"
            >
              Nog een keer!
            </button>
          </div>
        </div>
      )}

      {/* Admin Panel Overlay */}
      {isAdminOpen && (
        <AdminPanel
          topics={topics}
          setTopics={setTopics}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Subtle branding hint */}
      <div className="fixed bottom-4 right-6 opacity-30 text-[12px] text-summaIndigo font-bold uppercase tracking-widest z-0">
        Summa College
      </div>
    </div>
  );
};

export default App;

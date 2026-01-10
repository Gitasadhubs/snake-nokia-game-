
import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  onDirection: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onPause: () => void;
  onSelect: () => void;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, onDirection, onPause, onSelect }) => {
  return (
    <div className="relative w-[340px] h-[640px] bg-[#2c3e50] rounded-[60px] border-8 border-[#34495e] shadow-2xl flex flex-col items-center p-8 select-none">
      {/* Nokia Branding */}
      <div className="text-[#95a5a6] text-xl font-bold tracking-widest mb-4 italic opacity-80">NOKIA</div>
      
      {/* Screen Area */}
      <div className="w-full bg-[#1a1a1a] rounded-xl p-4 shadow-inner border-2 border-[#16a085]/30">
        {children}
      </div>

      {/* Navigation Buttons Area */}
      <div className="flex-1 w-full mt-8 flex flex-col items-center justify-start gap-4">
        
        {/* Main Function Buttons */}
        <div className="flex justify-between w-full px-4 mb-2">
            <button 
                onClick={onSelect}
                className="w-16 h-10 bg-[#34495e] border-b-4 border-[#2c3e50] rounded-full hover:brightness-125 active:border-b-0 active:translate-y-1 transition-all"
            />
            <button 
                onClick={onPause}
                className="w-16 h-10 bg-[#34495e] border-b-4 border-[#2c3e50] rounded-full hover:brightness-125 active:border-b-0 active:translate-y-1 transition-all"
            />
        </div>

        {/* D-Pad (Classic Grid Layout) */}
        <div className="grid grid-cols-3 gap-3">
          <div />
          <button 
            onClick={() => onDirection('UP')}
            className="w-16 h-12 bg-[#ecf0f1]/10 rounded-xl flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white text-xl"
          >
            ▲
          </button>
          <div />
          
          <button 
            onClick={() => onDirection('LEFT')}
            className="w-16 h-12 bg-[#ecf0f1]/10 rounded-xl flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white text-xl"
          >
            ◀
          </button>
          <button 
            onClick={() => onDirection('DOWN')}
            className="w-16 h-12 bg-[#ecf0f1]/10 rounded-xl flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white text-xl"
          >
            ▼
          </button>
          <button 
            onClick={() => onDirection('RIGHT')}
            className="w-16 h-12 bg-[#ecf0f1]/10 rounded-xl flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white text-xl"
          >
            ▶
          </button>
        </div>

        {/* T9 Keyboard Aesthetics */}
        <div className="grid grid-cols-3 gap-2 mt-4 opacity-50">
          {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(key => (
            <div key={key} className="w-14 h-8 bg-black/20 rounded-lg flex items-center justify-center text-[10px] text-white">
                {key}
            </div>
          ))}
        </div>
      </div>
      
      {/* Speaker Grill */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#1a1a1a] rounded-full opacity-50" />
    </div>
  );
};

export default PhoneFrame;

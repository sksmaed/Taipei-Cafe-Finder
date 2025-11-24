
import React from 'react';
import { Icon } from './Icon';

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-brand-dark mb-12 overflow-hidden">
        {/* Background Image with Parallax-like feel */}
        <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop" 
                alt="Cafe Background" 
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl px-4 text-center">
            <p className="text-white/80 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 animate-fade-in-up">Discover Your Space</p>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 shadow-black drop-shadow-lg animate-fade-in-up delay-100">
                Taipei Cafe Finder
            </h1>
            
            <div className="relative group max-w-xl mx-auto animate-fade-in-up delay-200">
                <input
                    type="text"
                    placeholder="Search by cafe name, location, or vibe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-4 px-6 pl-12 text-base md:text-lg bg-white/95 backdrop-blur-sm border-2 border-transparent rounded-full focus:outline-none focus:border-brand-accent focus:bg-white text-brand-dark placeholder-gray-400 font-light tracking-wide shadow-xl transition-all duration-300"
                />
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brand-accent transition-colors">
                    <Icon name="search" className="w-5 h-5" />
                </div>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-white/70 text-xs tracking-wider font-light animate-fade-in-up delay-300">
                 <span className="flex items-center gap-1"><Icon name="bolt" className="w-3 h-3" /> Power Outlets</span>
                 <span className="flex items-center gap-1"><Icon name="users" className="w-3 h-3" /> Seat Availability</span>
                 <span className="flex items-center gap-1"><Icon name="sun" className="w-3 h-3" /> Good Lighting</span>
            </div>
        </div>
    </div>
  );
};

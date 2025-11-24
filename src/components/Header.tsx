
import React from 'react';

export const Header: React.FC = () => (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-brand-border transition-all duration-300">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark tracking-widest uppercase">Taipei Cafe Finder</h1>
            <div className="h-px w-16 bg-brand-accent mt-3 mb-2"></div>
            <p className="text-xs md:text-sm text-gray-400 font-light tracking-[0.2em] uppercase">Curated Spaces for You</p>
        </div>
    </header>
);

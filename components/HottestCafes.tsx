
import React from 'react';
import { Cafe } from '../types';
import { CafeCard } from './CafeCard';

const calculateHotness = (cafe: Cafe): number => {
    return cafe.averageRating * (1 + cafe.reviewGrowth);
};

interface HottestCafesProps {
    cafes: Cafe[];
    onSelectCafe: (cafe: Cafe) => void;
    favorites: number[];
    onToggleFavorite: (e: React.MouseEvent, cafeId: number) => void;
}

export const HottestCafes: React.FC<HottestCafesProps> = ({ cafes, onSelectCafe, favorites, onToggleFavorite }) => {
    
    const sortedCafes = [...cafes]
        .sort((a, b) => calculateHotness(b) - calculateHotness(a))
        .slice(0, 5);

    if (sortedCafes.length === 0) return null;

    return (
        <section className="mb-20 pt-8">
            <div className="text-center mb-12">
                <p className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-3">Monthly Selection</p>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-brand-dark tracking-wide mb-2">Editor's Picks</h2>
            </div>
            
            <div className="flex overflow-x-auto space-x-8 pb-10 -mx-4 px-4 md:px-0 scrollbar-hide snap-x">
                {sortedCafes.map(cafe => (
                    <div key={cafe.id} className="flex-shrink-0 w-80 md:w-96 snap-center">
                        <CafeCard 
                            cafe={cafe} 
                            onSelect={onSelectCafe} 
                            isFavorite={favorites.includes(cafe.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

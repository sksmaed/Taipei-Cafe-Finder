
import React from 'react';
import { Cafe } from '../types';
import { Icon } from './Icon';

interface CafeCardProps {
  cafe: Cafe;
  onSelect: (cafe: Cafe) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, cafeId: number) => void;
}

const SeatInfoDisplay: React.FC<{ icon: string; label: string; available: number; total: number; color: string }> = ({ icon, label, available, total, color }) => (
    <div className="flex items-center text-xs tracking-wide text-gray-500">
        <Icon name={icon} className={`h-3.5 w-3.5 mr-2 ${color}`} />
        <span className="font-light">{label}</span>
        <span className="mx-1.5 text-gray-300 font-light">|</span>
        <span className="font-medium text-brand-dark">{available}</span>
    </div>
);


export const CafeCard: React.FC<CafeCardProps> = ({ cafe, onSelect, isFavorite, onToggleFavorite }) => {
  return (
    <div 
        className="group bg-white rounded-none md:rounded-sm border border-transparent hover:border-brand-border/50 shadow-none hover:shadow-2xl transition-all duration-700 cursor-pointer flex flex-col h-full overflow-hidden relative"
        onClick={() => onSelect(cafe)}
    >
        {onToggleFavorite && (
            <button 
                onClick={(e) => onToggleFavorite(e, cafe.id)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none"
            >
                <Icon 
                    name="heart" 
                    className={`h-6 w-6 drop-shadow-md transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white hover:text-red-200'}`} 
                />
            </button>
        )}

        <div className="relative overflow-hidden h-64 aspect-[4/3]">
            <img 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out grayscale-[20%] group-hover:grayscale-0" 
                src={cafe.imageUrl} 
                alt={cafe.name} 
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                <p className="text-white text-xs font-light tracking-widest uppercase">{cafe.hours}</p>
            </div>
        </div>
        <div className="p-6 flex flex-col flex-grow bg-white relative z-10">
            <div className="mb-4">
                <div className="flex justify-between items-start">
                     <h3 className="text-xl font-serif font-medium text-brand-dark mb-1 group-hover:text-brand-accent transition-colors duration-500 pr-4">{cafe.name}</h3>
                </div>
                <div className="w-8 h-px bg-brand-accent group-hover:w-full transition-all duration-700 ease-in-out opacity-50"></div>
            </div>
            
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-6 line-clamp-2 flex-grow">{cafe.description}</p>
            
            <div className="space-y-3 pt-5 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <SeatInfoDisplay 
                        icon="users" 
                        label="Seats" 
                        available={cafe.seats.total.available} 
                        total={cafe.seats.total.total}
                        color="text-gray-400"
                    />
                    <SeatInfoDisplay 
                        icon="bolt" 
                        label="Power" 
                        available={cafe.seats.outlet.available} 
                        total={cafe.seats.outlet.total}
                        color="text-brand-accent"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

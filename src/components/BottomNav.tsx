
import React from 'react';
import { Icon } from './Icon';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'search', icon: 'home', label: 'Home' },
        { id: 'articles', icon: 'document-text', label: 'Journal' },
        { id: 'member', icon: 'user', label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border h-20 z-40 flex justify-around items-center pb-2 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="flex flex-col items-center justify-center w-full h-full group"
                >
                    <div className={`p-1.5 rounded-full transition-all duration-300 mb-1 ${activeTab === item.id ? 'bg-brand-secondary text-brand-dark transform -translate-y-1' : 'text-gray-400 group-hover:text-brand-accent'}`}>
                        <Icon name={item.icon} className="h-6 w-6" strokeWidth={activeTab === item.id ? 2 : 1.5} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${activeTab === item.id ? 'text-brand-dark font-bold' : 'text-gray-400 font-light'}`}>
                        {item.label}
                    </span>
                </button>
            ))}
        </nav>
    );
};

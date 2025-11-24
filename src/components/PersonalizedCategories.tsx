
import React from 'react';

const categories = [
    { id: 'all', name: 'All', emoji: '' },
    { id: '貓派', name: 'Cats', emoji: '🐱' },
    { id: '書蟲', name: 'Reading', emoji: '📚' },
    { id: '社畜', name: 'Work', emoji: '💻' },
    { id: '黃光派', name: 'Warm Light', emoji: '💡' },
    { id: '復古咖', name: 'Retro', emoji: '🕰️' },
    { id: '潮流咖', name: 'Trendy', emoji: '✨' },
    { id: '科技感', name: 'Modern', emoji: '🤖' },
    { id: '特殊動物', name: 'Exotic', emoji: '🦜' },
];

interface PersonalizedCategoriesProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export const PersonalizedCategories: React.FC<PersonalizedCategoriesProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <section className="mb-16">
             <div className="flex items-center justify-center mb-8">
                <h2 className="text-lg font-serif italic text-gray-500 tracking-wider">Filter by Atmosphere</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`px-6 py-2.5 rounded-sm text-xs font-medium tracking-[0.15em] uppercase transition-all duration-500 ease-out
                            ${
                                selectedCategory === cat.id
                                ? 'bg-brand-dark text-white border border-brand-dark shadow-lg'
                                : 'bg-transparent text-gray-500 border border-gray-200 hover:border-brand-accent hover:text-brand-accent'
                            }`}
                        aria-pressed={selectedCategory === cat.id}
                    >
                        {cat.emoji && <span className="mr-2 opacity-80 text-sm">{cat.emoji}</span>}
                        {cat.name}
                    </button>
                ))}
            </div>
        </section>
    );
};

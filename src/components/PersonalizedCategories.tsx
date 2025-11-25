import React, { useState } from 'react';
import { Category } from '../types';

interface PersonalizedCategoriesProps {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export const PersonalizedCategories: React.FC<PersonalizedCategoriesProps> = ({
    categories,
    setCategories,
    selectedCategory,
    onSelectCategory,
}) => {

    const [isEditing, setIsEditing] = useState(false);

    const addCategory = () => {
        setCategories(prev => [
            ...prev,
            { id: Date.now().toString(), name: "New Category", emoji: "✨" }
        ]);
    };

    const updateCategory = (id: string, key: keyof Category, value: string) => {
        setCategories(prev =>
            prev.map(cat =>
                cat.id === id ? { ...cat, [key]: value } : cat
            )
        );
    };

    const deleteCategory = (id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    return (
        <section className="mb-16">
            
            {/* Header */}
            <div className="flex items-center justify-center mb-8 relative">
                <h2 className="text-lg font-serif italic text-gray-500 tracking-wider">
                    Filter by Atmosphere
                </h2>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute right-0 text-xs text-gray-400 underline hover:text-brand-accent transition-colors"
                >
                    {isEditing ? "Done" : "Edit"}
                </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
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
                        {cat.emoji && (
                            <span className="mr-2 opacity-80 text-sm">{cat.emoji}</span>
                        )}
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Inline Editor */}
            {isEditing && (
                <div className="bg-white border border-gray-200 shadow-sm p-6 max-w-lg mx-auto rounded-sm">
                    <h3 className="text-sm uppercase text-gray-500 tracking-widest mb-4">
                        Edit Categories
                    </h3>

                    <div className="space-y-3">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-3">
                                
                                <input
                                    value={cat.emoji}
                                    onChange={e => updateCategory(cat.id, "emoji", e.target.value)}
                                    className="w-12 text-center border border-gray-300 px-2 py-1 rounded-sm"
                                />

                                <input
                                    value={cat.name}
                                    onChange={e => updateCategory(cat.id, "name", e.target.value)}
                                    className="flex-1 border border-gray-300 px-3 py-1 rounded-sm"
                                />

                                <button
                                    onClick={() => deleteCategory(cat.id)}
                                    className="text-red-400 text-xs uppercase tracking-wider hover:text-red-600"
                                >
                                    Delete
                                </button>

                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addCategory}
                        className="mt-5 text-xs uppercase tracking-wider text-brand-dark border border-brand-dark px-3 py-1 rounded-sm hover:bg-brand-dark hover:text-white transition-colors"
                    >
                        ＋ Add Category
                    </button>
                </div>
            )}
        </section>
    );
};

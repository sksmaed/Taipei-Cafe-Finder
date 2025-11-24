
import React, { useState, useEffect } from 'react';
import { CafeCard } from './components/CafeCard';
import { CafeDetailModal } from './components/CafeDetailModal';
import { Chatbot } from './components/Chatbot';
import { mockCafes } from './services/mockData';
import { Cafe } from './types';
import { HottestCafes } from './components/HottestCafes';
import { PersonalizedCategories } from './components/PersonalizedCategories';
import { Header } from './components/Header';
import { ArticleView } from './components/ArticleView';
import { MemberView } from './components/MemberView';
import { BottomNav } from './components/BottomNav';
import { Hero } from './components/Hero';

const App: React.FC = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('search');
  
  // State for favorites
  const [favorites, setFavorites] = useState<number[]>(() => {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setCafes(mockCafes);
  }, []);
  
  useEffect(() => {
    let results = cafes;

    if (selectedCategory !== 'all') {
      results = results.filter(cafe => cafe.tags.includes(selectedCategory));
    }

    if (searchTerm) {
        results = results.filter(cafe =>
            cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cafe.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    setFilteredCafes(results);
  }, [searchTerm, selectedCategory, cafes]);

  const handleSelectCafe = (cafe: Cafe) => {
    setSelectedCafe(cafe);
  };

  const handleCloseModal = () => {
    setSelectedCafe(null);
  };

  const toggleFavorite = (e: React.MouseEvent, cafeId: number) => {
      e.stopPropagation();
      setFavorites(prev => {
          const newFavs = prev.includes(cafeId) 
              ? prev.filter(id => id !== cafeId)
              : [...prev, cafeId];
          localStorage.setItem('favorites', JSON.stringify(newFavs));
          return newFavs;
      });
  };
  
  const isFiltering = searchTerm !== '' || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-brand-secondary font-sans text-brand-primary selection:bg-brand-accent/30 selection:text-brand-dark pb-24">
      <Header />
      
      <main>
        {activeTab === 'search' && (
            <>
                {/* Hero Section with Search */}
                <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <div className="container mx-auto px-4 max-w-7xl animate-fade-in relative z-10 -mt-20 md:-mt-24">
                     {/* Categories - Overlapping the hero slightly or just below */}
                    <div className="bg-white rounded-sm shadow-xl p-6 md:p-8 mb-12 border border-gray-100">
                        <PersonalizedCategories 
                            selectedCategory={selectedCategory} 
                            onSelectCategory={setSelectedCategory} 
                        />
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-7xl animate-fade-in">
                    
                    {/* Show Hottest Cafes ONLY if not actively searching/filtering */}
                    {!isFiltering && (
                        <div className="mb-16">
                             <HottestCafes 
                                cafes={cafes} 
                                onSelectCafe={handleSelectCafe} 
                                favorites={favorites}
                                onToggleFavorite={toggleFavorite}
                            />
                        </div>
                    )}

                    {/* Main Grid Section Title */}
                    <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-8">
                        <div>
                             <h2 className="text-2xl md:text-3xl font-serif font-medium text-brand-dark">
                                {isFiltering ? 'Search Results' : 'Explore All'}
                             </h2>
                             {isFiltering && <p className="text-gray-400 text-sm mt-1">Found {filteredCafes.length} matches based on your criteria</p>}
                        </div>
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest hidden md:block">
                            {filteredCafes.length} Locations
                        </span>
                    </div>

                    {/* The Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {filteredCafes.map(cafe => (
                            <CafeCard 
                                key={cafe.id} 
                                cafe={cafe} 
                                onSelect={handleSelectCafe}
                                isFavorite={favorites.includes(cafe.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                    
                    {filteredCafes.length === 0 && (
                        <div className="text-center col-span-full py-24 bg-white/50 rounded-sm border border-dashed border-gray-300">
                            <p className="text-xl font-serif italic text-gray-400 mb-2">No cafes found matching your criteria.</p>
                            <button 
                                onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}
                                className="text-brand-accent text-sm font-bold uppercase tracking-widest hover:text-brand-dark transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </>
        )}

        {activeTab === 'articles' && <ArticleView />}
        {activeTab === 'member' && (
            <MemberView 
                favoritedCafes={cafes.filter(c => favorites.includes(c.id))} 
                onSelectCafe={handleSelectCafe}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
            />
        )}

      </main>
      
      {activeTab === 'search' && (
        <footer className="border-t border-brand-border py-8 mt-12 bg-white">
            <div className="container mx-auto px-4 text-center text-gray-400 text-xs tracking-widest uppercase">
                &copy; {new Date().getFullYear()} Taipei Cafe Finder. All rights reserved.
            </div>
        </footer>
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {selectedCafe && (
          <CafeDetailModal 
            cafe={selectedCafe} 
            onClose={handleCloseModal} 
            isFavorite={favorites.includes(selectedCafe.id)}
            onToggleFavorite={(e) => toggleFavorite(e, selectedCafe.id)}
          />
      )}
      <Chatbot cafes={cafes} onSelectCafe={handleSelectCafe} />
    </div>
  );
};

export default App;

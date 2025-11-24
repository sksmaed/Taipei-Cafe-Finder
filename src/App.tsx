
import React, { useState, useEffect } from 'react';
import { CafeCard } from './components/CafeCard';
import { CafeDetailModal } from './components/CafeDetailModal';
import { Chatbot } from './components/Chatbot';
import { mockCafes } from './services/mockData';
import { Cafe } from './types';
import { HottestCafes } from './components/HottestCafes';
import { PersonalizedCategories } from './components/PersonalizedCategories';
import { Icon } from './components/Icon';

const Header = () => (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-brand-border transition-all duration-300">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark tracking-widest uppercase">Taipei Cafe Finder</h1>
            <div className="h-px w-16 bg-brand-accent mt-3 mb-2"></div>
            <p className="text-xs md:text-sm text-gray-400 font-light tracking-[0.2em] uppercase">Curated Spaces for You</p>
        </div>
    </header>
);

const ArticleView = () => (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in">
        <div className="text-center mb-16">
            <p className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-3">Read & Explore</p>
            <h2 className="text-4xl font-serif font-medium text-brand-dark tracking-wide">The Coffee Journal</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
                { id: 1, title: "The Best Beans of 2024", excerpt: "Discover the top-rated coffee beans that are taking Taipei by storm this year.", img: "https://picsum.photos/seed/article1/600/400" },
                { id: 2, title: "Hidden Alleys of Zhongshan", excerpt: "A guide to the quietest, most atmospheric cafes tucked away in Zhongshan district.", img: "https://picsum.photos/seed/article2/600/400" },
                { id: 3, title: "Mastering the Pour Over", excerpt: "Tips from local baristas on how to perfect your home brewing technique.", img: "https://picsum.photos/seed/article3/600/400" },
                { id: 4, title: "Work Friendly Spaces", excerpt: "Our top picks for cafes with the best wifi and ergonomics for remote workers.", img: "https://picsum.photos/seed/article4/600/400" },
                { id: 5, title: "Late Night Brews", excerpt: "Where to find the best coffee after midnight in Taipei.", img: "https://picsum.photos/seed/article5/600/400" },
            ].map(article => (
                <div key={article.id} className="group cursor-pointer">
                    <div className="overflow-hidden h-64 mb-6">
                        <img src={article.img} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <h3 className="text-xl font-serif font-medium text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">{article.title}</h3>
                    <p className="text-gray-500 font-light text-sm leading-relaxed">{article.excerpt}</p>
                    <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-brand-accent">
                        <span>Read Article</span>
                        <Icon name="paper-airplane" className="h-3 w-3 ml-2" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

interface MemberViewProps {
    favoritedCafes: Cafe[];
    onSelectCafe: (cafe: Cafe) => void;
    favorites: number[];
    onToggleFavorite: (e: React.MouseEvent, id: number) => void;
}

const MemberView: React.FC<MemberViewProps> = ({ favoritedCafes, onSelectCafe, favorites, onToggleFavorite }) => (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
        <div className="bg-white border border-gray-100 shadow-xl p-8 md:p-12 mb-12">
            <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                    <Icon name="user" className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-brand-dark mb-2">Alex Chen</h2>
                <p className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-8">Gold Member</p>
                
                <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-8 mb-8">
                    <div>
                        <p className="text-2xl font-serif text-brand-dark mb-1">12</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Reviews</p>
                    </div>
                    <div className="border-x border-gray-100">
                        <p className="text-2xl font-serif text-brand-dark mb-1">{favoritedCafes.length}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Favorites</p>
                    </div>
                    <div>
                        <p className="text-2xl font-serif text-brand-dark mb-1">8</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Orders</p>
                    </div>
                </div>
            </div>

            <div className="text-left">
                <h3 className="text-lg font-serif font-medium text-brand-dark mb-6 border-b border-gray-100 pb-2">My Collection</h3>
                {favoritedCafes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {favoritedCafes.map(cafe => (
                            <CafeCard 
                                key={cafe.id} 
                                cafe={cafe} 
                                onSelect={onSelectCafe} 
                                isFavorite={true} 
                                onToggleFavorite={onToggleFavorite} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 mb-8 border border-dashed border-gray-200 bg-brand-secondary/20">
                        <Icon name="heart" className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-400 text-sm">You haven't added any cafes to your collection yet.</p>
                    </div>
                )}

                <div className="space-y-2">
                    {['Account Settings', 'Membership Benefits', 'Order History', 'Help & Support'].map((item, idx) => (
                        <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-brand-secondary/50 transition-colors border border-transparent hover:border-gray-100 group rounded-sm">
                            <span className="font-serif text-brand-dark group-hover:text-brand-accent transition-colors">{item}</span>
                            <Icon name="paper-airplane" className="h-4 w-4 text-gray-300 group-hover:text-brand-accent" />
                        </button>
                    ))}
                </div>
            </div>
            
             <div className="text-center mt-12">
                <button className="text-xs text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Sign Out</button>
             </div>
        </div>
    </div>
);

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
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
  
  return (
    <div className="min-h-screen bg-brand-secondary font-sans text-brand-primary selection:bg-brand-accent/30 selection:text-brand-dark pb-24">
      <Header />
      
      <main>
        {activeTab === 'search' && (
            <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in">
                <HottestCafes 
                    cafes={cafes} 
                    onSelectCafe={handleSelectCafe} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                />

                <section className="mb-20">
                    <div className="flex items-center mb-10 justify-center">
                        <div className="h-px bg-gray-300 w-12 md:w-24 opacity-50"></div>
                        <h2 className="text-2xl font-serif font-medium text-brand-dark mx-6 tracking-widest uppercase">Xinyi District</h2>
                        <div className="h-px bg-gray-300 w-12 md:w-24 opacity-50"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {cafes.filter(c => c.address.includes('信義區')).slice(0, 3).map(cafe => (
                            <CafeCard 
                                key={cafe.id} 
                                cafe={cafe} 
                                onSelect={handleSelectCafe}
                                isFavorite={favorites.includes(cafe.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                </section>

                <PersonalizedCategories 
                    selectedCategory={selectedCategory} 
                    onSelectCategory={setSelectedCategory} 
                />
                
                <div className="mb-12 max-w-xl mx-auto">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search by name or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3 px-8 text-base bg-white border border-brand-border rounded-full focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300 shadow-sm group-hover:shadow-md placeholder-gray-400 font-light tracking-wide"
                        />
                         <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Icon name="search" className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                    <div className="text-center col-span-full py-24">
                        <p className="text-xl font-serif italic text-gray-400">No cafes found matching your criteria.</p>
                    </div>
                )}
            </div>
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

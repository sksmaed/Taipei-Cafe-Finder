
// import React from 'react';
// import { Cafe } from '../types';
// import { CafeCard } from './CafeCard';
// import { Icon } from './Icon';

// interface MemberViewProps {
//     favoritedCafes: Cafe[];
//     onSelectCafe: (cafe: Cafe) => void;
//     favorites: number[];
//     onToggleFavorite: (e: React.MouseEvent, id: number) => void;
// }

// export const MemberView: React.FC<MemberViewProps> = ({ favoritedCafes, onSelectCafe, favorites, onToggleFavorite }) => (
//     <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
//         <div className="bg-white border border-gray-100 shadow-xl p-8 md:p-12 mb-12">
//             <div className="text-center">
//                 <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
//                     <Icon name="user" className="h-12 w-12 text-gray-400" />
//                 </div>
//                 <h2 className="text-3xl font-serif font-medium text-brand-dark mb-2">Alex Chen</h2>
//                 <p className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-8">Gold Member</p>
                
//                 <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-8 mb-8">
//                     <div>
//                         <p className="text-2xl font-serif text-brand-dark mb-1">12</p>
//                         <p className="text-[10px] text-gray-400 uppercase tracking-widest">Reviews</p>
//                     </div>
//                     <div className="border-x border-gray-100">
//                         <p className="text-2xl font-serif text-brand-dark mb-1">{favoritedCafes.length}</p>
//                         <p className="text-[10px] text-gray-400 uppercase tracking-widest">Favorites</p>
//                     </div>
//                     <div>
//                         <p className="text-2xl font-serif text-brand-dark mb-1">8</p>
//                         <p className="text-[10px] text-gray-400 uppercase tracking-widest">Orders</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="text-left">
//                 <h3 className="text-lg font-serif font-medium text-brand-dark mb-6 border-b border-gray-100 pb-2">My Collection</h3>
//                 {favoritedCafes.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//                         {favoritedCafes.map(cafe => (
//                             <CafeCard 
//                                 key={cafe.id} 
//                                 cafe={cafe} 
//                                 onSelect={onSelectCafe} 
//                                 isFavorite={true} 
//                                 onToggleFavorite={onToggleFavorite} 
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 mb-8 border border-dashed border-gray-200 bg-brand-secondary/20">
//                         <Icon name="heart" className="h-8 w-8 mx-auto text-gray-300 mb-2" />
//                         <p className="text-gray-400 text-sm">You haven't added any cafes to your collection yet.</p>
//                     </div>
//                 )}

//                 <div className="space-y-2">
//                     {['Account Settings', 'Membership Benefits', 'Order History', 'Help & Support'].map((item, idx) => (
//                         <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-brand-secondary/50 transition-colors border border-transparent hover:border-gray-100 group rounded-sm">
//                             <span className="font-serif text-brand-dark group-hover:text-brand-accent transition-colors">{item}</span>
//                             <Icon name="paper-airplane" className="h-4 w-4 text-gray-300 group-hover:text-brand-accent" />
//                         </button>
//                     ))}
//                 </div>
//             </div>
            
//              <div className="text-center mt-12">
//                 <button className="text-xs text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Sign Out</button>
//              </div>
//         </div>
//     </div>
// );
import React from 'react';

const [categories, setCategories] = React.useState([
    { id: 'all', name: 'All', emoji: '' },
    { id: '貓派', name: 'Cats', emoji: '🐱' },
    { id: '書蟲', name: 'Reading', emoji: '📚' },
    { id: '社畜', name: 'Work', emoji: '💻' },
    { id: '黃光派', name: 'Warm Light', emoji: '💡' },
    { id: '復古咖', name: 'Retro', emoji: '🕰️' },
    { id: '潮流咖', name: 'Trendy', emoji: '✨' },
    { id: '科技感', name: 'Modern', emoji: '🤖' },
    { id: '特殊動物', name: 'Exotic', emoji: '🦜' },
]);

interface PersonalizedCategoriesProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export const PersonalizedCategories: React.FC<PersonalizedCategoriesProps> = ({ selectedCategory, onSelectCategory }) => {
    const addCategory = () => {
        setCategories([...categories, { id: Date.now().toString(), name: 'New', emoji: '' }]);
    };

    const updateCategory = (id: string, field: string, value: string) => {
        setCategories(categories.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

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

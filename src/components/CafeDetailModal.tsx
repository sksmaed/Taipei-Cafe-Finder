
import React, { useState } from 'react';
import { Cafe, CartItem, MenuItem, Review } from '../types';
import { Icon } from './Icon';
import { ReviewGenerator } from './ReviewGenerator';

interface CafeDetailModalProps {
  cafe: Cafe;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const SeatDetail: React.FC<{ icon: string; label: string; available: number; total: number; }> = ({ icon, label, available, total }) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-brand-secondary/30 border border-transparent hover:border-brand-accent/20 transition-all duration-300">
    <Icon name={icon} className="h-5 w-5 text-gray-400 mb-2" />
    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</span>
    <div className="flex items-baseline">
        <span className={`text-xl font-serif font-medium ${available > 0 ? 'text-brand-dark' : 'text-gray-300'}`}>{available}</span>
        <span className="text-xs text-gray-400 ml-1">/ {total}</span>
    </div>
  </div>
);

export const CafeDetailModal: React.FC<CafeDetailModalProps> = ({ cafe, onClose, isFavorite, onToggleFavorite }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [localReviews, setLocalReviews] = useState<Review[]>(cafe.reviews);
  const [showPayment, setShowPayment] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.menuItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.menuItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(cartItem => cartItem.menuItem.id === itemId);
        if (existingItem && existingItem.quantity > 1) {
            return prevCart.map(cartItem =>
                cartItem.menuItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
            );
        }
        return prevCart.filter(cartItem => cartItem.menuItem.id !== itemId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  };
  
  const handleNewReview = (reviewText: string) => {
    const newReview: Review = {
        id: Date.now(),
        author: "AI Connoisseur",
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        comment: reviewText
    };
    setLocalReviews(prev => [newReview, ...prev]);
  };

  const handleCheckout = () => {
    if(cart.length > 0) setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setCart([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-brand-primary/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 md:p-6" onClick={onClose}>
      
      {/* Main Container */}
      <div 
        className="bg-white w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden relative" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Left Side: Image Banner */}
        <div className="w-full md:w-5/12 h-48 md:h-full relative shrink-0">
             <img src={cafe.imageUrl} alt={cafe.name} className="absolute inset-0 w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-black/10"></div>
             
             {/* Mobile Close Button Overlay */}
             <button onClick={onClose} className="md:hidden absolute top-4 right-4 bg-black/30 text-white rounded-full p-2 backdrop-blur-md">
                <Icon name="x" className="h-5 w-5" />
            </button>
        </div>

        {/* Right Side: Content Scroll Area */}
        <div className="w-full md:w-7/12 flex flex-col h-full bg-white relative">
            
            {/* Sticky Header inside Content Area */}
            <div className="absolute top-4 right-4 z-10 hidden md:block">
                <button onClick={onClose} className="text-gray-400 hover:text-brand-dark transition-colors p-2 bg-white/50 rounded-full hover:bg-gray-100">
                    <Icon name="x" className="h-6 w-6" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 md:p-10">
                    
                    {/* Header Section */}
                    <div className="mb-8 pr-8">
                        <div className="flex flex-col gap-2 mb-3">
                            <div className="flex justify-between items-start">
                                <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-dark leading-tight">{cafe.name}</h2>
                                <button 
                                    onClick={onToggleFavorite}
                                    className={`group flex items-center justify-center p-2 rounded-full transition-all duration-300 md:hidden border ${isFavorite ? 'border-red-100 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400'}`}
                                >
                                    <Icon name="heart" className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                            <p className="text-brand-accent text-sm font-bold tracking-widest uppercase">{cafe.address}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-light border-b border-gray-100 pb-6">
                            <span className="flex items-center"><Icon name="clock" className="h-4 w-4 mr-1.5" />{cafe.hours}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                             <button 
                                onClick={onToggleFavorite}
                                className={`hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-brand-accent'}`}
                            >
                                <Icon name="heart" className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                                {isFavorite ? 'Saved to Collection' : 'Save to Collection'}
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                        <SeatDetail icon="users" label="Total Seats" available={cafe.seats.total.available} total={cafe.seats.total.total} />
                        <SeatDetail icon="bolt" label="Outlets" available={cafe.seats.outlet.available} total={cafe.seats.outlet.total} />
                        <SeatDetail icon="sun" label="Window" available={cafe.seats.window.available} total={cafe.seats.window.total} />
                        <SeatDetail icon="snowflake" label="No AC" available={cafe.seats.noAc.available} total={cafe.seats.noAc.total} />
                    </div>

                    {/* Description */}
                    <div className="mb-12">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-4">About</h3>
                        <p className="text-gray-600 font-light leading-relaxed text-justify">{cafe.description}</p>
                    </div>

                    {/* Menu Section */}
                    <div className="mb-12">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2">Menu Highlights</h3>
                        <div className="grid gap-4">
                            {cafe.menu.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 hover:border-gray-100 hover:shadow-sm transition-all group bg-white">
                                    <div className="flex-1 pr-4">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <h4 className="font-serif text-lg text-brand-dark">{item.name}</h4>
                                            <span className="text-xs text-gray-400 font-light border border-gray-100 px-1.5 py-0.5 rounded">{item.category}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-light line-clamp-1">{item.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-brand-dark">NT$ {item.price}</span>
                                        <button 
                                            onClick={() => addToCart(item)} 
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-secondary text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
                                        >
                                            <Icon name="plus" className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2">Guest Reviews</h3>
                        <div className="space-y-6">
                            {localReviews.map(review => (
                                <div key={review.id} className="bg-brand-secondary/20 p-5 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-serif text-sm font-bold text-brand-dark">{review.author}</span>
                                        <div className="flex text-brand-accent text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm font-light italic">"{review.comment}"</p>
                                </div>
                            ))}
                            <ReviewGenerator cafeName={cafe.name} onNewReview={handleNewReview} />
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Cart Footer */}
            {cart.length > 0 && (
                <div className="border-t border-gray-100 bg-white p-4 md:px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Total Order</span>
                            <span className="text-2xl font-serif text-brand-dark font-medium">NT$ {getTotalPrice()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex text-right flex-col text-xs text-gray-500 mr-2">
                                <span>{cart.reduce((acc, item) => acc + item.quantity, 0)} items</span>
                            </div>
                            <button 
                                onClick={handleCheckout} 
                                className="bg-brand-dark text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-accent transition-colors shadow-lg shadow-brand-dark/20"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Payment Modal Overlay */}
      {showPayment && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl z-[60] flex justify-center items-center" onClick={() => setShowPayment(false)}>
            <div className="bg-white p-12 w-full max-w-md text-center border border-brand-border shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-gray-400 hover:text-brand-dark">
                    <Icon name="x" className="h-5 w-5" />
                </button>
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                     <Icon name="bolt" className="h-8 w-8 text-brand-accent" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-2 text-brand-dark">Complete Order</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-10">Secure Mock Transaction</p>
                
                <div className="py-6 border-y border-gray-100 mb-8 bg-brand-secondary/20 -mx-12 px-12">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Items</span>
                        <span className="text-sm font-medium">{cart.length}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-sm text-gray-500 mb-1">Total</span>
                        <span className="text-3xl font-serif text-brand-dark">NT$ {getTotalPrice()}</span>
                    </div>
                </div>
                
                <button onClick={handlePaymentSuccess} className="w-full bg-brand-dark text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-accent transition-colors duration-500 mb-4 shadow-lg">
                    Confirm Payment
                </button>
                <p className="text-[10px] text-gray-300">This is a demo application. No real payment will be processed.</p>
            </div>
        </div>
      )}
    </div>
  );
};


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
  <div className="flex flex-col items-center p-4 transition-colors duration-300 group hover:bg-brand-secondary/30 rounded-sm">
    <Icon name={icon} className="h-5 w-5 text-gray-400 group-hover:text-brand-accent mb-2 transition-colors" />
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-serif text-brand-dark">{available}<span className="text-xs font-sans text-gray-300 font-light mx-1">/</span><span className="text-sm text-gray-400">{total}</span></p>
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
    <div className="fixed inset-0 bg-brand-primary/60 backdrop-blur-sm z-50 flex justify-center items-center p-0 md:p-8" onClick={onClose}>
      <div className="bg-white w-full h-full md:h-auto md:max-w-6xl md:max-h-[90vh] overflow-y-auto md:rounded-sm shadow-2xl flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        
        {/* Left Side: Image & Hero */}
        <div className="w-full md:w-5/12 relative min-h-[250px] md:min-h-full">
             <img src={cafe.imageUrl} alt={cafe.name} className="absolute inset-0 w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/20"></div>
             <button onClick={onClose} className="absolute top-6 right-6 md:left-6 md:right-auto bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors backdrop-blur-md border border-white/30">
                <Icon name="x" className="h-5 w-5" />
            </button>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white overflow-y-auto">
            
            <div className="mb-8 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-2 gap-4">
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-dark">{cafe.name}</h2>
                    <button 
                        onClick={onToggleFavorite}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isFavorite ? 'border-red-100 bg-red-50 text-red-500' : 'border-gray-200 hover:border-brand-accent text-gray-400 hover:text-brand-accent'}`}
                    >
                        <Icon name="heart" className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        <span className="text-xs font-bold uppercase tracking-widest">{isFavorite ? 'Saved' : 'Save'}</span>
                    </button>
                </div>
                
                <p className="text-brand-accent text-sm font-light tracking-widest uppercase mb-4">{cafe.address}</p>
                <div className="inline-block border-y border-gray-100 py-1 px-4">
                    <p className="text-xs text-gray-500 tracking-wider">{cafe.hours}</p>
                </div>
            </div>

            <p className="text-gray-600 font-light leading-relaxed mb-10 text-justify">{cafe.description}</p>

            {/* Seating Info */}
            <div className="mb-12">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-gray-100 divide-x divide-gray-100">
                    <SeatDetail icon="users" label="Capacity" available={cafe.seats.total.available} total={cafe.seats.total.total} />
                    <SeatDetail icon="bolt" label="Power" available={cafe.seats.outlet.available} total={cafe.seats.outlet.total} />
                    <SeatDetail icon="sun" label="View" available={cafe.seats.window.available} total={cafe.seats.window.total} />
                    <SeatDetail icon="snowflake" label="Comfort" available={cafe.seats.noAc.available} total={cafe.seats.noAc.total} />
                </div>
            </div>

            {/* Two Columns for Menu and Reviews */}
            <div className="grid lg:grid-cols-2 gap-12">
                
                {/* Menu */}
                <section>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 pb-2 border-b border-gray-200">Selection</h3>
                    <div className="space-y-6">
                        {cafe.menu.map(item => (
                            <div key={item.id} className="group flex items-start justify-between">
                                <div className="flex-1 pr-4">
                                    <h4 className="font-serif text-base text-brand-dark group-hover:text-brand-accent transition-colors">{item.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1 font-light">{item.description}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-sm text-gray-600 mb-2">NT$ {item.price}</p>
                                    <button onClick={() => addToCart(item)} className="text-gray-300 hover:text-brand-dark transition">
                                        <Icon name="plus" className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                     {/* Cart Mini-view */}
                     {cart.length > 0 && (
                        <div className="mt-10 bg-brand-secondary p-6 border border-brand-border/50">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Order Summary</h4>
                            <div className="space-y-3 mb-6">
                                {cart.map(cartItem => (
                                    <div key={cartItem.menuItem.id} className="flex justify-between items-center text-sm">
                                        <span className="font-serif text-gray-700">{cartItem.menuItem.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400">x{cartItem.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                                <p className="text-lg font-serif text-brand-dark">Total: NT$ {getTotalPrice()}</p>
                                <button onClick={handleCheckout} className="text-xs font-bold uppercase tracking-widest text-brand-accent hover:text-brand-dark transition-colors">
                                    Proceed
                                </button>
                            </div>
                        </div>
                     )}
                </section>

                {/* Reviews */}
                <section>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 pb-2 border-b border-gray-200">Reviews</h3>
                    <div className="space-y-8">
                        {localReviews.slice(0, 3).map(review => (
                            <div key={review.id}>
                                <div className="flex items-center mb-2 justify-between">
                                    <p className="font-serif text-sm text-brand-dark italic">{review.author}</p>
                                    <div className="flex text-brand-accent text-[10px]">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-500 font-light text-xs leading-relaxed">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                    <ReviewGenerator cafeName={cafe.name} onNewReview={handleNewReview} />
                </section>
            </div>
        </div>
      </div>

      {showPayment && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl z-[60] flex justify-center items-center" onClick={() => setShowPayment(false)}>
            <div className="bg-white p-12 w-full max-w-md text-center border border-brand-border shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-12 border-2 border-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
                     <Icon name="bolt" className="h-5 w-5 text-brand-accent" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-2 text-brand-dark">Payment</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-10">Secure Mock Transaction</p>
                
                <div className="py-8 border-y border-gray-100 mb-8">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Total Amount</p>
                    <p className="text-4xl font-serif text-brand-dark">NT$ {getTotalPrice()}</p>
                </div>
                
                <div className="space-y-4">
                    <button onClick={handlePaymentSuccess} className="w-full bg-brand-dark text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-accent transition-colors duration-500">
                        Confirm Payment
                    </button>
                    <button onClick={() => setShowPayment(false)} className="text-gray-400 text-xs uppercase tracking-widest hover:text-brand-dark transition">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

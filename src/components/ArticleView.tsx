
import React from 'react';
import { Icon } from './Icon';

export const ArticleView: React.FC = () => (
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

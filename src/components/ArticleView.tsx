import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { getArticles } from '../services/api';
import { Article } from '../types';

export const ArticleView: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                setArticles(data);
            } catch (error) {
                console.error('Failed to load articles', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const getExcerpt = (content: string | null) => {
        if (!content) return '';
        return content.length > 100 ? content.substring(0, 100) + '...' : content;
    };

    // Deterministic image based on ID to keep UI consistent
    const getImageUrl = (id: number) => `https://picsum.photos/seed/article${id}/600/400`;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
            </div>
        );
    }

    if (selectedArticle) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
                <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-8 hover:opacity-80 transition-opacity"
                >
                    <Icon name="arrow-left" className="h-4 w-4 mr-2" />
                    Back to Journal
                </button>

                <article className="bg-white p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-8 text-center">
                        <p className="text-gray-400 text-xs tracking-widest uppercase mb-4">
                            {new Date(selectedArticle.created_at).toLocaleDateString()}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-serif font-medium text-brand-dark mb-8 leading-tight">
                            {selectedArticle.title}
                        </h1>
                        <div className="w-full h-64 md:h-96 overflow-hidden mb-8">
                            <img
                                src={getImageUrl(selectedArticle.id)}
                                alt={selectedArticle.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="prose prose-stone mx-auto max-w-none font-light leading-relaxed text-gray-600">
                        {selectedArticle.content?.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-4">{paragraph}</p>
                        ))}
                    </div>
                </article>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in">
            <div className="text-center mb-16">
                <p className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-3">Read & Explore</p>
                <h2 className="text-4xl font-serif font-medium text-brand-dark tracking-wide">The Coffee Journal</h2>
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 font-serif italic">No articles found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {articles.map(article => (
                        <div key={article.id} className="group cursor-pointer" onClick={() => setSelectedArticle(article)}>
                            <div className="overflow-hidden h-64 mb-6">
                                <img
                                    src={getImageUrl(article.id)}
                                    alt={article.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>
                            <h3 className="text-xl font-serif font-medium text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-gray-500 font-light text-sm leading-relaxed">
                                {getExcerpt(article.content)}
                            </p>
                            <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-brand-accent">
                                <span>Read Article</span>
                                <Icon name="paper-airplane" className="h-3 w-3 ml-2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

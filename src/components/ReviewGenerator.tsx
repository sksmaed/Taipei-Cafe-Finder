
import React, { useState } from 'react';
import { generateCafeReview } from '../services/geminiService';
import { Icon } from './Icon';

interface ReviewGeneratorProps {
  cafeName: string;
  onNewReview: (review: string) => void;
}

export const ReviewGenerator: React.FC<ReviewGeneratorProps> = ({ cafeName, onNewReview }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newReviewText = await generateCafeReview(cafeName);
      onNewReview(newReviewText);
    } catch (err) {
      setError('Failed to generate review.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
      <button
        onClick={handleGenerateReview}
        disabled={isLoading}
        className="group inline-flex items-center justify-center w-full py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 hover:border-brand-accent hover:text-brand-accent transition-all duration-500 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="animate-pulse">Consulting AI...</span>
        ) : (
          <>
            <Icon name="sparkles" className="h-3 w-3 mr-2 text-brand-accent/70 group-hover:text-brand-accent" />
            <span>Generate Insight</span>
          </>
        )}
      </button>
      {error && <p className="text-red-400 mt-2 text-[10px] tracking-wide uppercase">{error}</p>}
    </div>
  );
};

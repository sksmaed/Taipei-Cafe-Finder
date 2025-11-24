
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
      setError('評論生成失敗，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 text-center">
      <button
        onClick={handleGenerateReview}
        disabled={isLoading}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-300 disabled:bg-gray-400"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </>
        ) : (
          <>
            <Icon name="sparkles" className="h-5 w-5 mr-2" />
            產生新的 AI 評論
          </>
        )}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

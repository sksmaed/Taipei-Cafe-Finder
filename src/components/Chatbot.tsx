
import React, { useState, useRef, useEffect } from 'react';
import { Cafe, ChatMessage } from '../types';
import { findCafesByNeeds } from '../services/geminiService';
import { Icon } from './Icon';

interface ChatbotProps {
    cafes: Cafe[];
    onSelectCafe: (cafe: Cafe) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ cafes, onSelectCafe }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setMessages([
                {
                    id: Date.now(),
                    sender: 'assistant',
                    text: 'Greetings. How may I assist you in finding the perfect ambiance today?',
                }
            ]);
        }
    }, [isOpen, messages.length]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const newUserMessage: ChatMessage = {
            id: Date.now(),
            sender: 'user',
            text: trimmedInput,
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const recommendedIds = await findCafesByNeeds(trimmedInput, cafes);
            const recommendedCafes = recommendedIds
                .map(id => cafes.find(cafe => cafe.id === id))
                .filter((cafe): cafe is Cafe => cafe !== undefined);

            let assistantText: string;
            if (recommendedCafes.length > 0) {
                assistantText = `I have curated ${recommendedCafes.length} selections for you:`;
            } else {
                assistantText = "I was unable to find a perfect match in our collection. Perhaps you could refine your request?";
            }
            
            const newAssistantMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: 'assistant',
                text: assistantText,
                recommendations: recommendedCafes,
            };
            setMessages(prev => [...prev, newAssistantMessage]);

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: 'assistant',
                text: 'My apologies, I am momentarily unavailable. Please try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-8 bg-brand-dark text-white rounded-full p-4 shadow-2xl hover:bg-brand-accent transition-all duration-500 z-50 focus:outline-none group"
                aria-label="Open Concierge"
            >
                {isOpen ? 
                    <Icon name="x" className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" /> : 
                    <Icon name="chat-bubble-left-right" className="h-6 w-6" />
                }
            </button>

            {isOpen && (
                <div className="fixed bottom-44 right-8 w-80 md:w-96 h-[500px] bg-white rounded-sm shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100">
                    <header className="bg-white p-5 border-b border-gray-100 text-center">
                        <h3 className="font-serif font-medium text-brand-dark tracking-wide">Concierge</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1">Personalized Assistance</p>
                    </header>
                    <div className="flex-1 p-6 overflow-y-auto bg-brand-secondary/30">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex mb-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-sm px-5 py-4 max-w-[90%] text-sm leading-relaxed font-light ${
                                    msg.sender === 'user' 
                                    ? 'bg-brand-dark text-white' 
                                    : 'bg-white border border-gray-100 text-gray-600 shadow-sm'
                                }`}>
                                    <p>{msg.text}</p>
                                    {msg.recommendations && msg.recommendations.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            {msg.recommendations.map(cafe => (
                                                <div 
                                                    key={cafe.id} 
                                                    className="flex items-center gap-3 p-2 bg-brand-secondary/50 border border-transparent hover:border-brand-accent/30 cursor-pointer transition-colors"
                                                    onClick={() => onSelectCafe(cafe)}
                                                >
                                                    <img src={cafe.imageUrl} alt={cafe.name} className="w-12 h-12 object-cover grayscale-[30%]" />
                                                    <div className="overflow-hidden">
                                                        <p className="font-serif font-medium text-brand-dark truncate text-sm">{cafe.name}</p>
                                                        <p className="text-[10px] text-gray-400 truncate uppercase tracking-wide">{cafe.address}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                           <div className="flex justify-start mb-4">
                                <div className="rounded-sm px-5 py-4 bg-white border border-gray-100 shadow-sm">
                                    <div className="flex items-center space-x-1">
                                        <span className="h-1 w-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-1 w-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-1 w-1 bg-gray-300 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Tell us your preferences..."
                            className="w-full px-4 py-3 bg-brand-secondary/30 text-sm focus:bg-white focus:ring-1 focus:ring-brand-accent focus:outline-none transition-colors font-light"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading} className="text-brand-dark hover:text-brand-accent disabled:text-gray-300 transition-colors p-2">
                            <Icon name="paper-airplane" className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};


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
                    text: '你好！我是你的咖啡廳小幫手，告訴我你今天想去什麼樣的咖啡廳吧！',
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
                assistantText = `根據你的需求，我推薦這 ${recommendedCafes.length} 間咖啡廳給你參考看看：`;
            } else {
                assistantText = "抱歉，我找不到完全符合你需求的咖啡廳。也許可以試著放寬一些條件再問我一次？";
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
                text: '抱歉，我現在有點忙碌，請稍後再試一次。',
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
                className="fixed bottom-6 right-6 bg-brand-primary text-white rounded-full p-4 shadow-lg hover:bg-brand-dark transition-transform transform hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                aria-label="打開咖啡廳小幫手"
            >
                {isOpen ? <Icon name="x" className="h-8 w-8" /> : <Icon name="chat-bubble-left-right" className="h-8 w-8" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-full max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200/50">
                    <header className="bg-brand-primary p-4 text-white font-bold text-lg text-center">
                        咖啡廳小幫手
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto bg-brand-secondary/30">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-xl p-3 max-w-xs ${msg.sender === 'user' ? 'bg-brand-accent text-brand-dark' : 'bg-white'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    {msg.recommendations && msg.recommendations.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {msg.recommendations.map(cafe => (
                                                <div 
                                                    key={cafe.id} 
                                                    className="flex items-center gap-3 p-2 bg-brand-light rounded-lg cursor-pointer hover:bg-brand-accent/20"
                                                    onClick={() => onSelectCafe(cafe)}
                                                >
                                                    <img src={cafe.imageUrl} alt={cafe.name} className="w-12 h-12 rounded-md object-cover" />
                                                    <div>
                                                        <p className="font-bold text-brand-dark">{cafe.name}</p>
                                                        <p className="text-xs text-gray-500">{cafe.address}</p>
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
                                <div className="rounded-xl p-3 max-w-xs bg-white">
                                    <div className="flex items-center space-x-1">
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="輸入你的需求..."
                            className="w-full p-2 border rounded-full focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading} className="bg-brand-primary text-white p-3 rounded-full hover:bg-brand-dark disabled:bg-gray-400">
                            <Icon name="paper-airplane" className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

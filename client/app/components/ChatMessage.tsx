import React from 'react';

interface ChatMessageProps {
    message: string;
    sender: 'user' | 'agent';
}

export function ChatMessage({ message, sender }: ChatMessageProps) {
    const isUser = sender === 'user';
    return (
        <div className={`p-4 rounded-md ${isUser ? 'bg-blue-500 text-white self-end right-0' : 'bg-gray-300 text-black self-start'} my-2 w-3/4`}>
            {message}
        </div>
    );
}
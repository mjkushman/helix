import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="flex items-center p-4 border-t border-gray-300">
            <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                }}
            />
            <button
                className="ml-4 p-2 bg-blue-500 text-white rounded-lg"
                onClick={handleSendMessage}
            >
                Send
            </button>
        </div>
    );
}
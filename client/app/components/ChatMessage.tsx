interface ChatMessageProps {
    content: string;
    role: 'assistant' | 'user';
}

export function ChatMessage({ content, role }: ChatMessageProps) {
    const isUser = role === 'user';
    return (
        <div className={`p-2 rounded-md ${isUser ? 'bg-blue-500 text-white self-end right-0' : 'bg-gray-300 text-black self-start'} my-1 w-3/4 text-xs`}>
            {content}
        </div>
    );
}
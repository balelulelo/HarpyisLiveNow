import { useEffect, useRef } from 'react'

export default function ChatFeed({ messages, username }) {
    const bottomRef = useRef(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const renderMessage = (msg) => {
        switch (msg.type) {
            case 'system':
                return (
                    <div key={msg.id} className="px-4 py-1.5">
                        <span className="text-gray-500 text-xs">{msg.content}</span>
                    </div>
                )

            case 'harpy':
            case 'broadcast':
                return (
                    <div key={msg.id} className="px-4 py-1.5 hover:bg-white/5 transition-colors">
                        <span className="font-semibold text-purple-400 text-sm">{msg.sender || 'Harpy'}</span>
                        <span className="text-gray-200 text-sm ml-2">{msg.content}</span>
                    </div>
                )

            case 'chat':
                // chat messages from broadcast format: "username: message"
                const colonIndex = msg.content.indexOf(':')
                if (colonIndex > 0) {
                    const chatSender = msg.content.slice(0, colonIndex).trim()
                    const chatContent = msg.content.slice(colonIndex + 1).trim()
                    const isMe = chatSender === username
                    return (
                        <div key={msg.id} className="px-4 py-1.5 hover:bg-white/5 transition-colors">
                            <span className={`font-semibold text-sm ${isMe ? 'text-green-400' : 'text-blue-400'}`}>
                                {chatSender}
                            </span>
                            <span className="text-gray-200 text-sm ml-2">{chatContent}</span>
                        </div>
                    )
                }
                return (
                    <div key={msg.id} className="px-4 py-1.5 hover:bg-white/5 transition-colors">
                        <span className="text-gray-200 text-sm">{msg.content}</span>
                    </div>
                )

            case 'event-gift':
                return (
                    <div key={msg.id} className="px-4 py-2 bg-yellow-500/10 border-l-2 border-yellow-500">
                        <span className="text-yellow-300 text-sm font-medium">{msg.content}</span>
                    </div>
                )

            case 'event-donate':
                return (
                    <div key={msg.id} className="px-4 py-2 bg-green-500/10 border-l-2 border-green-500">
                        <span className="text-green-300 text-sm font-medium">{msg.content}</span>
                    </div>
                )

            case 'event-subscribe':
                return (
                    <div key={msg.id} className="px-4 py-2 bg-purple-500/10 border-l-2 border-purple-500">
                        <span className="text-purple-300 text-sm font-medium">{msg.content}</span>
                    </div>
                )

            case 'event-like':
                return (
                    <div key={msg.id} className="px-4 py-1.5">
                        <span className="text-pink-400 text-xs">{msg.content}</span>
                    </div>
                )

            case 'error':
                return (
                    <div key={msg.id} className="px-4 py-1.5">
                        <span className="text-red-400 text-xs">⚠ {msg.content}</span>
                    </div>
                )

            default:
                return (
                    <div key={msg.id} className="px-4 py-1.5">
                        <span className="text-gray-400 text-sm">{msg.content}</span>
                    </div>
                )
        }
    }

    return (
        <div className="flex-1 overflow-y-auto chat-scrollbar bg-[#0e0e1a]">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-600 text-sm">Welcome to the chat!</p>
                </div>
            ) : (
                messages.map(renderMessage)
            )}
            <div ref={bottomRef} />
        </div>
    )
}
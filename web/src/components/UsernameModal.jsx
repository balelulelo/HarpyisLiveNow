import { useState } from 'react'

export default function UsernameModal({ onSubmit }) {
    const [inputValue, setInputValue] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const trimmed = inputValue.trim()
        if (trimmed) {
            onSubmit(trimmed)
        }
    }

    return (
        <div className="h-screen bg-[#0e0e1a] flex items-center justify-center">
            <div className="bg-[#1a1a2e] rounded-2xl p-8 w-full max-w-md border border-[#2a2a4a] shadow-2xl">
                {/* Stream branding */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">Live Now</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Harpy's Stream</h1>
                    <p className="text-gray-400 text-sm">Enter a username to join the chat</p>
                </div>

                {/* Username input */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Your username..."
                        maxLength={20}
                        autoFocus
                        className="w-full bg-[#0e0e1a] text-white px-4 py-3 rounded-lg border border-[#3a3a5a] 
                                   focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 
                                   placeholder-gray-500 text-lg mb-4"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 
                                   disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg 
                                   transition-colors duration-200 text-lg"
                    >
                        Join Stream
                    </button>
                </form>

                {/* Footer hint */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    You can chat, send gifts, donate, subscribe, and more!
                </p>
            </div>
        </div>
    )
}
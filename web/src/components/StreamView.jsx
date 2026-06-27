import { useState, useEffect } from 'react'

export default function StreamView({ latestBroadcast }) {
    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    // Typewriter effect for Harpy's commentary
    useEffect(() => {
        if (!latestBroadcast) return

        setIsTyping(true)
        setDisplayText('')
        let index = 0
        const interval = setInterval(() => {
            if (index < latestBroadcast.length) {
                setDisplayText(latestBroadcast.slice(0, index + 1))
                index++
            } else {
                clearInterval(interval)
                setIsTyping(false)
            }
        }, 30)

        return () => clearInterval(interval)
    }, [latestBroadcast])

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#12121f] relative overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

            {/* Harpy's avatar area */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-8">
                {/* Avatar circle — replace with actual image later */}
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 
                                flex items-center justify-center shadow-2xl shadow-purple-500/20
                                border-4 border-purple-400/30">
                    <span className="text-7xl">🎮</span>
                </div>

                {/* Harpy's name */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Harpy</h2>
                    <div className="flex items-center gap-2 justify-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-400 text-xs font-medium uppercase tracking-wider">Streaming</span>
                    </div>
                </div>
            </div>

            {/* Subtitle area — Harpy's commentary */}
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl px-6 py-4 max-w-2xl mx-auto min-h-[60px]
                                border border-white/5">
                    {displayText ? (
                        <p className="text-white text-lg text-center leading-relaxed">
                            {displayText}
                            {isTyping && <span className="text-purple-400 animate-pulse">|</span>}
                        </p>
                    ) : (
                        <div className="flex items-center justify-center gap-1">
                            <span className="typing-dot w-2 h-2 rounded-full bg-gray-500" />
                            <span className="typing-dot w-2 h-2 rounded-full bg-gray-500" />
                            <span className="typing-dot w-2 h-2 rounded-full bg-gray-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
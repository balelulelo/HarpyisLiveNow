import { useState } from 'react'

export default function InteractionBar({ onSend, onGift, onDonate, onSubscribe, onLike, username }) {
    const [inputValue, setInputValue] = useState('')
    const [showDonateModal, setShowDonateModal] = useState(false)
    const [donateAmount, setDonateAmount] = useState('5000')
    const [donateMessage, setDonateMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const trimmed = inputValue.trim()
        if (trimmed) {
            onSend(trimmed)
            setInputValue('')
        }
    }

    const handleDonateSubmit = () => {
        const amount = parseInt(donateAmount) || 5000
        const message = donateMessage.trim() || 'Keep up the great stream!'
        onDonate(amount, message)
        setShowDonateModal(false)
        setDonateAmount('5000')
        setDonateMessage('')
    }

    return (
        <div className="bg-[#1a1a2e] border-t border-[#2a2a4a]">
            {/* Action buttons */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2a2a4a]">
                <button
                    onClick={() => onGift(1000)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 
                               text-yellow-400 rounded-lg text-xs font-medium transition-colors"
                    title="Send a small gift (1,000)"
                >
                    🎁 Gift
                </button>
                <button
                    onClick={() => onGift(100000)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 
                               text-orange-400 rounded-lg text-xs font-medium transition-colors"
                    title="Send a big gift (100,000)"
                >
                    💎 Super Gift
                </button>
                <button
                    onClick={() => setShowDonateModal(!showDonateModal)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 
                               text-green-400 rounded-lg text-xs font-medium transition-colors"
                    title="Donate with a message"
                >
                    💰 Donate
                </button>
                <button
                    onClick={onSubscribe}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 
                               text-purple-400 rounded-lg text-xs font-medium transition-colors"
                    title="Subscribe"
                >
                    ⭐ Sub
                </button>
                <button
                    onClick={onLike}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 
                               text-pink-400 rounded-lg text-xs font-medium transition-colors"
                    title="Like the stream"
                >
                    ❤️
                </button>
            </div>

            {/* Donate modal */}
            {showDonateModal && (
                <div className="px-3 py-3 bg-[#12121f] border-b border-[#2a2a4a]">
                    <div className="flex gap-2 mb-2">
                        <input
                            type="number"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.value)}
                            placeholder="Amount"
                            className="w-24 bg-[#0e0e1a] text-white px-3 py-2 rounded-lg border border-[#3a3a5a] 
                                       focus:border-green-500 focus:outline-none text-sm"
                        />
                        <input
                            type="text"
                            value={donateMessage}
                            onChange={(e) => setDonateMessage(e.target.value)}
                            placeholder="Your message..."
                            maxLength={100}
                            className="flex-1 bg-[#0e0e1a] text-white px-3 py-2 rounded-lg border border-[#3a3a5a] 
                                       focus:border-green-500 focus:outline-none text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDonateSubmit}
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg 
                                       text-sm font-medium transition-colors"
                        >
                            Send Donation
                        </button>
                        <button
                            onClick={() => setShowDonateModal(false)}
                            className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded-lg 
                                       text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="flex gap-2 p-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Send a message..."
                    maxLength={200}
                    className="flex-1 bg-[#0e0e1a] text-white px-4 py-2.5 rounded-lg border border-[#3a3a5a] 
                               focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 
                               placeholder-gray-500 text-sm"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed 
                               text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                    Chat
                </button>
            </form>
        </div>
    )
}
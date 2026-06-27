import { useState, useEffect, useRef, useCallback } from 'react'
import UsernameModal from './components/UsernameModal'
import StreamView from './components/StreamView'
import ChatFeed from './components/ChatFeed'
import InteractionBar from './components/InteractionBar'
import AlertOverlay from './components/AlertOverlay'

const WS_URL = 'ws://localhost:8765'

export default function App() {
    // connection and auth state
    const [isConnected, setIsConnected] = useState(false)
    const [username, setUsername] = useState(null)
    const [streamTitle, setStreamTitle] = useState('')

    // chat and display state
    const [messages, setMessages] = useState([])
    const [alerts, setAlerts] = useState([])
    const [latestBroadcast, setLatestBroadcast] = useState('')
    const [viewerCount, setViewerCount] = useState(0)

    // websocket ref (persists across renders)
    const wsRef = useRef(null)
    const alertIdRef = useRef(0)

    // ====================================================================================================
    // @brief: Connect to the WebSocket bridge and set up message handlers.
    // ====================================================================================================
    const connectWebSocket = useCallback(() => {
        const ws = new WebSocket(WS_URL)
        wsRef.current = ws

        ws.onopen = () => {
            console.log('[WS] Connected to bridge')
            setIsConnected(true)
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            handleServerMessage(data)
        }

        ws.onclose = () => {
            console.log('[WS] Disconnected from bridge')
            setIsConnected(false)
            setUsername(null)
        }

        ws.onerror = (error) => {
            console.error('[WS] Error:', error)
        }
    }, [])

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [])

    // ====================================================================================================
    // @brief: Handle incoming messages from the server (via bridge).
    //         Each message has a "type" and "payload".
    // ====================================================================================================
    const handleServerMessage = (data) => {
        const { type, payload } = data
        const message = payload?.message || ''
        const sender = payload?.sender || ''

        switch (type) {
            case 'WELCOME':
                setStreamTitle(payload?.stream_title || '')
                addMessage('system', message)
                break

            case 'USERNAME_ACK':
                setLatestBroadcast(message)
                break

            case 'REPLY':
                setLatestBroadcast(message)
                break

            case 'EVENT': {
                if (message.includes('🎁') || message.includes('sent a gift')) {
                    addAlert('gift', message)
                    addMessage('event-gift', message)
                } else if (message.includes('💰') || message.includes('donated')) {
                    addAlert('donate', message)
                    addMessage('event-donate', message)
                } else if (message.includes('⭐') || message.includes('subscribed')) {
                    addAlert('subscribe', message)
                    addMessage('event-subscribe', message)
                } else if (message.includes('❤️') || message.includes('liked')) {
                    addMessage('event-like', message)
                } else if (message.includes('joined') || message.includes('left')) {
                    addMessage('system', message)
                    const match = message.match(/\((\d+) viewers?\)/)
                    if (match) setViewerCount(parseInt(match[1]))
                } else if (message.startsWith('Harpy:') || sender === 'Harpy') {
                    const commentary = message.startsWith('Harpy: ')
                        ? message.replace('Harpy: ', '')
                        : message
                    setLatestBroadcast(commentary)
                } else {
                    addMessage('chat', message)
                }
                break
            }

            case 'ERROR':
                addMessage('error', message)
                break

            default:
                addMessage('system', `[${type}] ${message}`)
        }
    }

    // ====================================================================================================
    // @brief: Add a message to the chat feed.
    // ====================================================================================================
    const addMessage = (type, content, sender = '') => {
        setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            type,
            content,
            sender,
            timestamp: new Date()
        }])
    }

    // ====================================================================================================
    // @brief: Add an alert (gift/donate/subscribe popup).
    // ====================================================================================================
    const addAlert = (type, content) => {
        const id = ++alertIdRef.current
        setAlerts(prev => [...prev, { id, type, content }])
        // auto-remove after 4 seconds
        setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.id !== id))
        }, 4000)
    }

    // ====================================================================================================
    // @brief: Send a message to the server via WebSocket bridge.
    // ====================================================================================================
    const sendMessage = (type, payload) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type, payload }))
        }
    }

    // ====================================================================================================
    // @brief: Handle username submission — connect WS then send username.
    // ====================================================================================================
    const handleUsernameSubmit = (chosenUsername) => {
        // connect first, then send username after WELCOME arrives
        const ws = new WebSocket(WS_URL)
        wsRef.current = ws

        ws.onopen = () => {
            setIsConnected(true)
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)

            // first message is WELCOME — respond with username
            if (data.type === 'WELCOME' && !username) {
                setStreamTitle(data.payload?.stream_title || '')
                addMessage('system', data.payload?.message || '')

                ws.send(JSON.stringify({
                    type: 'USERNAME',
                    payload: { username: chosenUsername }
                }))
                setUsername(chosenUsername)
            } else {
                handleServerMessage(data)
            }
        }

        ws.onclose = () => {
            setIsConnected(false)
            setUsername(null)
        }

        ws.onerror = (error) => {
            console.error('[WS] Error:', error)
        }
    }

    // ====================================================================================================
    // @brief: Handle chat input submission.
    // ====================================================================================================
    const handleChatSend = (text) => {
        if (text.startsWith('/')) {
            handleCommand(text)
        } else {
            sendMessage('CHAT', { message: text })
        }
    }

    // ====================================================================================================
    // @brief: Parse and handle slash commands from chat input.
    // ====================================================================================================
    const handleCommand = (text) => {
        const parts = text.split(/\s+/)
        const command = parts[0].toLowerCase()

        switch (command) {
            case '/gift': {
                const amount = parseInt(parts[1]) || 1000
                sendMessage('GIFT', { amount })
                break
            }
            case '/donate': {
                const amount = parseInt(parts[1]) || 5000
                const msg = parts.slice(2).join(' ') || 'Keep up the great stream!'
                sendMessage('DONATE', { amount, message: msg })
                break
            }
            case '/subscribe':
                sendMessage('SUBSCRIBE', {})
                break
            case '/like':
                sendMessage('LIKE', {})
                break
            case '/quit':
                sendMessage('QUIT', { message: 'quit' })
                wsRef.current?.close()
                break
            default:
                addMessage('error', `Unknown command: ${command}`)
        }
    }

    // ====================================================================================================
    // Interaction button handlers
    // ====================================================================================================
    const handleGift = (amount) => sendMessage('GIFT', { amount })
    const handleDonate = (amount, msg) => sendMessage('DONATE', { amount, message: msg })
    const handleSubscribe = () => sendMessage('SUBSCRIBE', {})
    const handleLike = () => sendMessage('LIKE', {})

    // ====================================================================================================
    // Render
    // ====================================================================================================

    // show username modal if not logged in
    if (!username) {
        return <UsernameModal onSubmit={handleUsernameSubmit} />
    }

    return (
        <div className="h-screen bg-[#0e0e1a] text-white flex flex-col overflow-hidden">
            {/* Alert overlay */}
            <AlertOverlay alerts={alerts} />

            {/* Header */}
            <header className="bg-[#1a1a2e] px-6 py-3 flex items-center justify-between border-b border-[#2a2a4a]">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <h1 className="text-lg font-bold">{streamTitle || "Harpy's Stream"}</h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>👤 {viewerCount} viewers</span>
                    <span className="text-purple-400">@{username}</span>
                </div>
            </header>

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Stream view — left side, larger */}
                <div className="flex-[2] flex flex-col">
                    <StreamView latestBroadcast={latestBroadcast} />
                </div>

                {/* Chat panel — right side */}
                <div className="flex-[1] flex flex-col border-l border-[#2a2a4a] min-w-[350px] max-w-[420px]">
                    <div className="px-4 py-3 bg-[#1a1a2e] border-b border-[#2a2a4a]">
                        <h2 className="font-semibold text-sm text-gray-300">Stream Chat</h2>
                    </div>

                    <ChatFeed messages={messages} username={username} />

                    <InteractionBar
                        onSend={handleChatSend}
                        onGift={handleGift}
                        onDonate={handleDonate}
                        onSubscribe={handleSubscribe}
                        onLike={handleLike}
                        username={username}
                    />
                </div>
            </div>
        </div>
    )
}
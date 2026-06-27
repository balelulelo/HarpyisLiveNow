export default function AlertOverlay({ alerts }) {
    if (alerts.length === 0) return null

    const getAlertStyle = (type) => {
        switch (type) {
            case 'gift':
                return {
                    bg: 'bg-gradient-to-r from-yellow-500/90 to-orange-500/90',
                    icon: '🎁',
                    border: 'border-yellow-400'
                }
            case 'donate':
                return {
                    bg: 'bg-gradient-to-r from-green-500/90 to-emerald-500/90',
                    icon: '💰',
                    border: 'border-green-400'
                }
            case 'subscribe':
                return {
                    bg: 'bg-gradient-to-r from-purple-500/90 to-pink-500/90',
                    icon: '⭐',
                    border: 'border-purple-400'
                }
            default:
                return {
                    bg: 'bg-gradient-to-r from-blue-500/90 to-cyan-500/90',
                    icon: '📢',
                    border: 'border-blue-400'
                }
        }
    }

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none">
            {alerts.map((alert) => {
                const style = getAlertStyle(alert.type)
                return (
                    <div
                        key={alert.id}
                        className={`alert-enter ${style.bg} text-white px-6 py-3 rounded-xl 
                                    shadow-2xl border ${style.border} backdrop-blur-sm
                                    min-w-[300px] max-w-[500px] text-center`}
                    >
                        <span className="text-xl mr-2">{style.icon}</span>
                        <span className="font-medium text-sm">{alert.content}</span>
                    </div>
                )
            })}
        </div>
    )
}
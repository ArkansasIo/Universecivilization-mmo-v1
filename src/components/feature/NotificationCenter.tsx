import { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      building_complete: 'ri-building-line',
      research_complete: 'ri-flask-line',
      fleet_arrived: 'ri-rocket-line',
      attack: 'ri-sword-line',
      defense: 'ri-shield-line',
      trade: 'ri-exchange-line',
      alliance: 'ri-team-line',
      achievement: 'ri-trophy-line',
      system: 'ri-information-line'
    };
    return icons[type] || 'ri-notification-line';
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      building_complete: 'text-cyan-400',
      research_complete: 'text-purple-400',
      fleet_arrived: 'text-blue-400',
      attack: 'text-red-400',
      defense: 'text-amber-400',
      trade: 'text-emerald-400',
      alliance: 'text-teal-400',
      achievement: 'text-yellow-400',
      system: 'text-gray-400'
    };
    return colors[type] || 'text-cyan-400';
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer"
      >
        <i className="ri-notification-3-line text-xl text-white"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-slate-800 border border-cyan-400/30 rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-cyan-400/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="ri-notification-off-line text-4xl text-gray-600 mb-2"></i>
                  <p className="text-gray-400">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-700/50 transition-all cursor-pointer ${
                        !notification.is_read ? 'bg-cyan-400/5' : ''
                      }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/50 flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                          <i className={`${getNotificationIcon(notification.type)} text-xl`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white mb-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                      {!notification.is_read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

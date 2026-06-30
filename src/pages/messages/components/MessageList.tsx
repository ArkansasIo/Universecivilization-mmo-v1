import type { Message } from '@/hooks/useMessaging';

const TYPE_META: Record<string, { icon: string; color: string; label: string }> = {
  personal:      { icon: 'ri-user-line',        color: '#00d4ff', label: 'Personal'      },
  battle_report: { icon: 'ri-sword-line',        color: '#f87171', label: 'Battle Report' },
  trade:         { icon: 'ri-exchange-line',     color: '#34d399', label: 'Trade'         },
  system:        { icon: 'ri-settings-3-line',   color: '#fbbf24', label: 'System'        },
  alliance:      { icon: 'ri-shield-star-line',  color: '#a78bfa', label: 'Alliance'      },
};

interface Props {
  messages: Message[];
  selected: Message | null;
  folder: 'inbox' | 'sent';
  onSelect: (m: Message) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function MessageList({ messages, selected, folder, onSelect, onDelete, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <i className="ri-loader-4-line text-2xl text-cyan-400 animate-spin"></i>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
        <i className="ri-inbox-line text-5xl mb-3"></i>
        <p className="text-sm">{folder === 'inbox' ? 'Your inbox is empty' : 'No sent messages'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
      {messages.map(msg => {
        const meta = TYPE_META[msg.message_type] ?? TYPE_META.personal;
        const isSelected = selected?.id === msg.id;
        const isUnread = folder === 'inbox' && !msg.is_read;

        return (
          <div
            key={msg.id}
            onClick={() => onSelect(msg)}
            className="group relative flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all"
            style={{
              background: isSelected
                ? 'rgba(0,212,255,0.1)'
                : isUnread
                  ? 'rgba(0,212,255,0.04)'
                  : 'rgba(255,255,255,0.02)',
              border: isSelected
                ? '1px solid rgba(0,212,255,0.4)'
                : isUnread
                  ? '1px solid rgba(0,212,255,0.15)'
                  : '1px solid transparent',
            }}
          >
            {/* Unread dot */}
            {isUnread && (
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            )}

            {/* Type icon */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${meta.color}18` }}>
              <i className={`${meta.icon} text-sm`} style={{ color: meta.color }}></i>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className={`text-xs font-bold truncate ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                  {folder === 'inbox' ? (msg.sender_name ?? 'Unknown') : (msg.receiver_name ?? 'Unknown')}
                </span>
                <span className="text-xs text-gray-600 flex-shrink-0">{timeAgo(msg.created_at)}</span>
              </div>
              <p className={`text-xs truncate mb-0.5 ${isUnread ? 'text-white font-semibold' : 'text-gray-400'}`}>
                {msg.subject}
              </p>
              <p className="text-xs text-gray-600 truncate">{msg.body}</p>
            </div>

            {/* Delete btn (hover) */}
            <button
              onClick={e => { e.stopPropagation(); onDelete(msg.id); }}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0 cursor-pointer"
            >
              <i className="ri-delete-bin-line text-xs"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
}
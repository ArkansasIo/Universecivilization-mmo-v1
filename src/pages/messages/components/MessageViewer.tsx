import { useState } from 'react';
import type { Message } from '@/hooks/useMessaging';

const TYPE_META: Record<string, { icon: string; color: string; label: string; bg: string }> = {
  personal:      { icon: 'ri-user-line',        color: '#00d4ff', label: 'Personal',      bg: 'rgba(0,212,255,0.08)'   },
  battle_report: { icon: 'ri-sword-line',        color: '#f87171', label: 'Battle Report', bg: 'rgba(248,113,113,0.08)' },
  trade:         { icon: 'ri-exchange-line',     color: '#34d399', label: 'Trade',         bg: 'rgba(52,211,153,0.08)'  },
  system:        { icon: 'ri-settings-3-line',   color: '#fbbf24', label: 'System',        bg: 'rgba(251,191,36,0.08)'  },
  alliance:      { icon: 'ri-shield-star-line',  color: '#a78bfa', label: 'Alliance',      bg: 'rgba(167,139,250,0.08)' },
};

interface Props {
  message: Message;
  folder: 'inbox' | 'sent';
  onDelete: (id: number) => void;
  onReply: (body: string) => Promise<{ success: boolean; error?: string }>;
}

export default function MessageViewer({ message, folder, onDelete, onReply }: Props) {
  const [showReply, setShowReply] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);
  const [replyToast, setReplyToast] = useState<string | null>(null);

  const meta = TYPE_META[message.message_type] ?? TYPE_META.personal;

  const handleReply = async () => {
    if (!replyBody.trim()) return;
    setSending(true);
    const result = await onReply(replyBody.trim());
    setSending(false);
    if (result.success) {
      setReplyBody('');
      setShowReply(false);
      setReplyToast('Reply sent!');
      setTimeout(() => setReplyToast(null), 2500);
    } else {
      setReplyToast(result.error ?? 'Failed to send reply');
      setTimeout(() => setReplyToast(null), 3000);
    }
  };

  // Parse battle report body if JSON
  let parsedBody: any = null;
  if (message.message_type === 'battle_report') {
    try { parsedBody = JSON.parse(message.body); } catch { parsedBody = null; }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 mb-4 border-b" style={{ borderColor: `${meta.color}20` }}>
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
            <i className={`${meta.icon} text-xl`} style={{ color: meta.color }}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-white leading-tight mb-1 pr-4">{message.subject}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <i className="ri-user-line text-xs"></i>
                {folder === 'inbox'
                  ? <><span className="text-gray-400">From:</span> <span className="text-white">{message.sender_name ?? 'Unknown'}</span></>
                  : <><span className="text-gray-400">To:</span> <span className="text-white">{message.receiver_name ?? 'Unknown'}</span></>
                }
              </span>
              <span className="flex items-center gap-1">
                <i className="ri-time-line text-xs"></i>
                {new Date(message.created_at).toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: meta.color, background: meta.bg }}>
                {meta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {folder === 'inbox' && message.message_type !== 'system' && (
            <button
              onClick={() => setShowReply(r => !r)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.25)' }}
            >
              <i className="ri-reply-line text-sm"></i>Reply
            </button>
          )}
          <button
            onClick={() => onDelete(message.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <i className="ri-delete-bin-line text-sm"></i>Delete
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {parsedBody ? (
          /* Battle report structured view */
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                  <i className="ri-sword-line"></i>Battle Outcome
                </h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${parsedBody.result === 'victory' ? 'text-green-400 bg-green-400/15' : 'text-red-400 bg-red-400/15'}`}>
                  {parsedBody.result?.toUpperCase() ?? 'UNKNOWN'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {parsedBody.attacker_losses && (
                  <div>
                    <p className="text-gray-500 mb-1">Your Losses</p>
                    {Object.entries(parsedBody.attacker_losses as Record<string, number>).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-gray-300">
                        <span className="capitalize">{k}</span><span className="text-red-400 font-bold">-{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {parsedBody.loot && (
                  <div>
                    <p className="text-gray-500 mb-1">Resources Looted</p>
                    <div className="flex justify-between text-gray-300"><span>Metal</span><span className="text-amber-400 font-bold">+{(parsedBody.loot.metal ?? 0).toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-300"><span>Crystal</span><span className="text-cyan-400 font-bold">+{(parsedBody.loot.crystal ?? 0).toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-300"><span>Deuterium</span><span className="text-green-400 font-bold">+{(parsedBody.loot.deuterium ?? 0).toLocaleString()}</span></div>
                  </div>
                )}
              </div>
            </div>
            {parsedBody.notes && (
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{parsedBody.notes}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{message.body}</p>
        )}
      </div>

      {/* Reply toast */}
      {replyToast && (
        <div className="mt-3 px-3 py-2 rounded-lg text-xs font-semibold text-center"
          style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
          {replyToast}
        </div>
      )}

      {/* Reply box */}
      {showReply && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(0,212,255,0.15)' }}>
          <p className="text-xs text-gray-400 mb-2 font-semibold">
            Replying to <span className="text-white">{message.sender_name}</span>
          </p>
          <textarea
            value={replyBody}
            onChange={e => setReplyBody(e.target.value)}
            placeholder="Write your reply..."
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-600">{replyBody.length}/500</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowReply(false); setReplyBody(''); }}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-400 cursor-pointer whitespace-nowrap"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyBody.trim() || sending}
                className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap disabled:opacity-40 text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #a78bfa)' }}
              >
                {sending ? <><i className="ri-loader-4-line mr-1 animate-spin"></i>Sending...</> : <><i className="ri-send-plane-2-line mr-1"></i>Send Reply</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
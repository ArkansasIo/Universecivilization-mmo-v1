import { useState } from 'react';
import type { Message } from '@/hooks/useMessaging';

interface Props {
  onSend: (params: {
    receiverUsername: string;
    subject: string;
    body: string;
    messageType: Message['message_type'];
  }) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
  prefill?: { receiverUsername?: string; subject?: string; messageType?: Message['message_type'] };
}

const TYPE_OPTIONS: { value: Message['message_type']; label: string; icon: string; color: string }[] = [
  { value: 'personal',      label: 'Personal',      icon: 'ri-user-line',        color: '#00d4ff' },
  { value: 'trade',         label: 'Trade Request',  icon: 'ri-exchange-line',    color: '#34d399' },
  { value: 'alliance',      label: 'Alliance',       icon: 'ri-shield-star-line', color: '#a78bfa' },
  { value: 'battle_report', label: 'Battle Report',  icon: 'ri-sword-line',       color: '#f87171' },
];

export default function ComposeModal({ onSend, onClose, prefill }: Props) {
  const [receiverUsername, setReceiverUsername] = useState(prefill?.receiverUsername ?? '');
  const [subject, setSubject] = useState(prefill?.subject ?? '');
  const [body, setBody] = useState('');
  const [messageType, setMessageType] = useState<Message['message_type']>(prefill?.messageType ?? 'personal');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!receiverUsername.trim() || !subject.trim() || !body.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setSending(true);
    const result = await onSend({ receiverUsername, subject, body, messageType });
    setSending(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error ?? 'Failed to send.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: '#0a0f1e', border: '1px solid rgba(0,212,255,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.12)' }}>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <i className="ri-mail-send-line text-cyan-400"></i>Compose Message
          </h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Message type selector */}
          <div>
            <label className="text-xs text-gray-400 block mb-2 font-semibold uppercase tracking-wider">Message Type</label>
            <div className="grid grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setMessageType(opt.value)}
                  className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  style={messageType === opt.value
                    ? { background: `${opt.color}20`, border: `1px solid ${opt.color}60`, color: opt.color }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }
                  }
                >
                  <i className={`${opt.icon} text-lg`}></i>
                  <span className="leading-tight text-center">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* To */}
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-semibold">To (player username)</label>
            <input
              type="text"
              value={receiverUsername}
              onChange={e => setReceiverUsername(e.target.value)}
              placeholder="Enter commander name..."
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-semibold">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Message subject..."
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-400 font-semibold">Message</label>
              <span className="text-xs text-gray-600">{body.length}/500</span>
            </div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your message here..."
              rows={5}
              maxLength={500}
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Trade offer helper */}
          {messageType === 'trade' && (
            <div className="p-3 rounded-xl text-xs text-gray-400" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <i className="ri-lightbulb-line text-green-400 mr-1.5"></i>
              Tip: Describe what you&apos;re offering and what you want in return, e.g. &quot;Offering 500K Metal for 250K Crystal&quot;
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 px-1">
              <i className="ri-error-warning-line mr-1"></i>{error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm cursor-pointer whitespace-nowrap disabled:opacity-50 text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #a78bfa)' }}
            >
              {sending
                ? <><i className="ri-loader-4-line mr-2 animate-spin"></i>Sending...</>
                : <><i className="ri-send-plane-2-line mr-2"></i>Send Message</>
              }
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-400 cursor-pointer whitespace-nowrap transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
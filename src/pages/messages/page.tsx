import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging, type Message } from '@/hooks/useMessaging';
import MessageList from './components/MessageList';
import MessageViewer from './components/MessageViewer';
import ComposeModal from './components/ComposeModal';

type Folder = 'inbox' | 'sent';
type FilterType = 'all' | Message['message_type'];

const GOLD = '#d4a853';
const BORDER = '#1e2a36';
const CARD_BG = '#080b0f';

const TYPE_FILTERS: { value: FilterType; label: string; icon: string }[] = [
  { value: 'all',          label: 'All',           icon: 'ri-apps-line'         },
  { value: 'personal',     label: 'Personal',      icon: 'ri-user-line'         },
  { value: 'battle_report',label: 'Battle Reports',icon: 'ri-sword-line'        },
  { value: 'trade',        label: 'Trade',         icon: 'ri-exchange-line'     },
  { value: 'alliance',     label: 'Alliance',      icon: 'ri-shield-star-line'  },
  { value: 'system',       label: 'System',        icon: 'ri-settings-3-line'   },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    inbox, sent, unreadCount, loading,
    sendMessage, markAsRead, markAllAsRead,
    deleteMessage, replyToMessage, refresh,
  } = useMessaging();

  const [folder, setFolder] = useState<Folder>('inbox');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [selected, setSelected] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composePrefill, setComposePrefill] = useState<{ messageType?: Message['message_type']; receiverUsername?: string; subject?: string } | undefined>(undefined);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const messages = folder === 'inbox' ? inbox : sent;
  const filtered = typeFilter === 'all' ? messages : messages.filter(m => m.message_type === typeFilter);

  const handleSelect = useCallback((msg: Message) => {
    setSelected(msg);
    if (folder === 'inbox' && !msg.is_read) markAsRead(msg.id);
  }, [folder, markAsRead]);

  const handleDelete = useCallback(async (id: number) => {
    await deleteMessage(id, folder);
    if (selected?.id === id) setSelected(null);
    showToast('Message deleted');
  }, [deleteMessage, folder, selected]);

  const handleReply = useCallback(async (body: string) => {
    if (!selected) return { success: false, error: 'No message selected' };
    return replyToMessage(selected, body);
  }, [selected, replyToMessage]);

  const handleSend = useCallback(async (params: Parameters<typeof sendMessage>[0]) => {
    const result = await sendMessage(params);
    if (result.success) { showToast('Message sent!'); setFolder('sent'); }
    return result;
  }, [sendMessage]);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    showToast('All messages marked as read');
  };

  const openCompose = (prefill?: typeof composePrefill) => {
    setComposePrefill(prefill);
    setShowCompose(true);
  };

  const countByType = (messages: Message[], type: FilterType) =>
    type === 'all' ? messages.length : messages.filter(m => m.message_type === type).length;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <i className="ri-lock-line text-5xl text-ogame-dim mb-4"></i>
        <p className="text-ogame-muted mb-4">Sign in to access your messages</p>
        <button onClick={() => navigate('/login')}
          className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer text-black"
          style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: CARD_BG,
            border: `1px solid ${toast.ok ? 'rgba(212,168,83,0.4)' : 'rgba(248,113,113,0.4)'}`,
            color: toast.ok ? GOLD : '#f87171',
          }}>
          <i className={`${toast.ok ? 'ri-check-line' : 'ri-close-circle-line'} mr-2`}></i>{toast.msg}
        </div>
      )}

      {showCompose && (
        <ComposeModal onSend={handleSend} onClose={() => setShowCompose(false)} prefill={composePrefill as any} />
      )}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20space%20communications%20hub%20holographic%20message%20displays%20commanders%20reading%20transmissions%20glowing%20terminals%20star%20maps%20space%20station%20interior%20sci-fi%20cinematic%20dramatic%20lighting%20deep%20blue%20atmosphere%20wide%20angle&width=1920&height=320&seq=messages_hero_v1&orientation=landscape"
          alt="Messages"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.4) saturate(1.2)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(5,10,25,0.95) 100%)' }} />
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div className="flex items-end justify-between w-full">
            <div>
              <h1 className="text-4xl font-black mb-1" style={{ color: GOLD }}>Command Inbox</h1>
              <p className="text-sm text-ogame-muted">Transmissions, battle reports &amp; trade negotiations</p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                  style={{ background: 'rgba(212,168,83,0.08)', color: GOLD, border: `1px solid rgba(212,168,83,0.2)` }}>
                  <i className="ri-checkbox-multiple-line"></i>Mark all read
                </button>
              )}
              <button onClick={() => openCompose()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap text-black transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                <i className="ri-mail-send-line"></i>Compose
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 220px)', minHeight: 600 }}>
        {/* LEFT SIDEBAR */}
        <div className="w-72 flex-shrink-0 flex flex-col border-r" style={{ borderColor: BORDER, background: 'rgba(5,10,25,0.6)' }}>
          <div className="flex gap-1 p-3 border-b" style={{ borderColor: BORDER }}>
            {(['inbox', 'sent'] as Folder[]).map(f => (
              <button
                key={f}
                onClick={() => { setFolder(f); setSelected(null); setTypeFilter('all'); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all capitalize flex items-center justify-center gap-1.5`}
                style={folder === f
                  ? { background: 'rgba(212,168,83,0.15)', color: GOLD, border: `1px solid rgba(212,168,83,0.3)` }
                  : { background: 'rgba(255,255,255,0.03)', color: '#6b7280', border: '1px solid transparent' }
                }
              >
                <i className={f === 'inbox' ? 'ri-inbox-line' : 'ri-send-plane-line'}></i>
                {f === 'inbox' ? `Inbox${unreadCount > 0 ? ` (${unreadCount})` : ''}` : 'Sent'}
              </button>
            ))}
          </div>

          <div className="px-3 py-2 border-b space-y-0.5" style={{ borderColor: BORDER }}>
            {TYPE_FILTERS.map(tf => {
              const count = countByType(folder === 'inbox' ? inbox : sent, tf.value);
              const unread = tf.value === 'all'
                ? inbox.filter(m => !m.is_read).length
                : inbox.filter(m => !m.is_read && m.message_type === tf.value).length;
              if (count === 0 && tf.value !== 'all') return null;
              return (
                <button
                  key={tf.value}
                  onClick={() => setTypeFilter(tf.value)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all"
                  style={typeFilter === tf.value
                    ? { background: 'rgba(212,168,83,0.1)', color: GOLD }
                    : { color: '#8892aa' }
                  }
                >
                  <span className="flex items-center gap-2"><i className={`${tf.icon} text-sm`}></i>{tf.label}</span>
                  <div className="flex items-center gap-1.5">
                    {folder === 'inbox' && unread > 0 && (
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ background: GOLD, fontSize: 9 }}>{unread}</span>
                    )}
                    <span className="text-ogame-dim text-xs">{count}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-hidden px-2 py-2">
            <MessageList messages={filtered} selected={selected} folder={folder} onSelect={handleSelect} onDelete={handleDelete} loading={loading} />
          </div>

          <div className="p-3 border-t space-y-1.5" style={{ borderColor: BORDER }}>
            <p className="text-xs text-ogame-dim font-semibold uppercase tracking-wider px-1 mb-2">Quick Send</p>
            {[
              { label: 'Trade Offer',   type: 'trade',   icon: 'ri-exchange-line',   color: '#34d399' },
              { label: 'Battle Report', type: 'battle_report', icon: 'ri-sword-line', color: '#f87171' },
              { label: 'Alliance Msg',  type: 'alliance', icon: 'ri-shield-star-line', color: '#a78bfa' },
            ].map(s => (
              <button key={s.type}
                onClick={() => openCompose({ messageType: s.type as Message['message_type'] })}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                style={{ background: `${s.color}10`, color: s.color, border: `1px solid ${s.color}20` }}>
                <i className={`${s.icon}`}></i>{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN PANE */}
        <div className="flex-1 overflow-hidden p-5">
          {selected ? (
            <MessageViewer message={selected} folder={folder} onDelete={handleDelete} onReply={handleReply} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ background: 'rgba(212,168,83,0.06)', border: `1px solid ${BORDER}` }}>
                <i className="ri-mail-open-line text-4xl text-ogame-dim"></i>
              </div>
              <p className="text-ogame-muted text-sm mb-1">No message selected</p>
              <p className="text-ogame-dim text-xs">Pick a message from the list or compose a new one</p>
              <button onClick={() => openCompose()}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap text-black"
                style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                <i className="ri-mail-send-line"></i>New Message
              </button>
              <div className="flex items-center gap-6 mt-10 text-xs text-ogame-dim">
                <div className="text-center"><p className="text-2xl font-black text-white">{inbox.length}</p><p>In Inbox</p></div>
                <div className="w-px h-8 bg-white/5"></div>
                <div className="text-center"><p className="text-2xl font-black" style={{ color: GOLD }}>{unreadCount}</p><p>Unread</p></div>
                <div className="w-px h-8 bg-white/5"></div>
                <div className="text-center"><p className="text-2xl font-black text-white">{sent.length}</p><p>Sent</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
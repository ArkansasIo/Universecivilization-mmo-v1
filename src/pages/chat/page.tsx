import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  channel: string;
  created_at: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('global');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: 'global', name: 'Global', icon: 'ri-global-line', color: 'purple' },
    { id: 'trade', name: 'Trade', icon: 'ri-exchange-line', color: 'green' },
    { id: 'alliance', name: 'Alliance', icon: 'ri-shield-star-line', color: 'blue' },
    { id: 'help', name: 'Help', icon: 'ri-question-line', color: 'yellow' }
  ];

  useEffect(() => {
    loadMessages();
    
    // Subscribe to new messages from the messages table
    // Note: chat_messages table does not exist yet — subscription is disabled
    // When ready, uncomment and point to the correct table
    /*
    const subscription = supabase
      .channel('chat_messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          try {
            const newMsg = payload.new as ChatMessage;
            if (newMsg.channel === activeChannel) {
              setMessages(prev => [...prev, newMsg]);
            }
          } catch (err) {
            console.error('Error handling new message:', err);
            setError('Failed to receive new message');
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to chat messages');
        } else if (status === 'CHANNEL_ERROR') {
          setError('Failed to subscribe to chat messages');
        }
      });

    return () => {
      subscription.unsubscribe();
    };
    */
  }, [activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, create mock messages
      // In production, this would fetch from supabase
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          user_id: 'user1',
          username: 'Commander_Alpha',
          message: 'Anyone want to trade crystal for metal?',
          channel: activeChannel,
          created_at: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: '2',
          user_id: 'user2',
          username: 'StarLord_99',
          message: 'Looking for alliance members! We are top 50!',
          channel: activeChannel,
          created_at: new Date(Date.now() - 240000).toISOString()
        },
        {
          id: '3',
          user_id: 'user3',
          username: 'GalaxyDefender',
          message: 'Just completed my first Dyson Sphere! 🎉',
          channel: activeChannel,
          created_at: new Date(Date.now() - 180000).toISOString()
        },
        {
          id: '4',
          user_id: 'user4',
          username: 'NovaExplorer',
          message: 'How do I upgrade my research lab?',
          channel: activeChannel,
          created_at: new Date(Date.now() - 120000).toISOString()
        },
        {
          id: '5',
          user_id: 'user5',
          username: 'CosmicTrader',
          message: 'Selling 10k deuterium at market price!',
          channel: activeChannel,
          created_at: new Date(Date.now() - 60000).toISOString()
        }
      ];

      setMessages(mockMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setError(null);
    
    try {
      // Get username from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      const message: ChatMessage = {
        id: Date.now().toString(),
        user_id: user.id,
        username: profile?.username || 'Anonymous',
        message: newMessage.trim(),
        channel: activeChannel,
        created_at: new Date().toISOString()
      };

      // In production, save to supabase
      // const { error: insertError } = await supabase
      //   .from('chat_messages')
      //   .insert(message);
      
      // if (insertError) {
      //   throw insertError;
      // }

      // For now, just add to local state
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const getChannelColor = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel?.color || 'purple';
  };

  const getChannelClasses = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    const isActive = activeChannel === channelId;
    
    if (!channel) return 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white';
    
    const baseClasses = 'w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all whitespace-nowrap cursor-pointer';
    
    if (isActive) {
      const colorMap: Record<string, string> = {
        purple: 'bg-purple-500/20 border border-purple-500/50 text-white',
        green: 'bg-green-500/20 border border-green-500/50 text-white',
        blue: 'bg-blue-500/20 border border-blue-500/50 text-white',
        yellow: 'bg-yellow-500/20 border border-yellow-500/50 text-white'
      };
      return `${baseClasses} ${colorMap[channel.color] || colorMap.purple}`;
    }
    
    return `${baseClasses} bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white`;
  };

  const getHeaderIconClasses = (channelId: string) => {
    const color = getChannelColor(channelId);
    return `text-2xl text-${color}-400`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden h-[calc(100vh-12rem)]">
        <div className="flex h-full">
          {/* Channel Sidebar */}
          <div className="w-64 bg-slate-900/50 border-r border-slate-700 p-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i className="ri-chat-3-line text-purple-400"></i>
              Channels
            </h2>
            <div className="space-y-2">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={getChannelClasses(channel.id)}
                >
                  <i className={`${channel.icon} text-lg`}></i>
                  <span className="font-semibold">{channel.name}</span>
                </button>
              ))}
            </div>

            {/* Online Users */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">ONLINE PLAYERS</h3>
              <div className="space-y-2">
                {['Commander_Alpha', 'StarLord_99', 'GalaxyDefender', 'NovaExplorer', 'CosmicTrader'].map((username, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">{username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className={`${channels.find(c => c.id === activeChannel)?.icon} ${getHeaderIconClasses(activeChannel)}`}></i>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {channels.find(c => c.id === activeChannel)?.name}
                    </h2>
                    <p className="text-sm text-slate-400">{messages.length} messages</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
                    <i className="ri-notification-line text-slate-400 hover:text-white"></i>
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
                    <i className="ri-settings-3-line text-slate-400 hover:text-white"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <i className="ri-loader-4-line animate-spin text-3xl text-purple-400"></i>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {msg.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-white">{msg.username}</span>
                          <span className="text-xs text-slate-500">{formatTime(msg.created_at)}</span>
                        </div>
                        <p className="text-slate-300">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-slate-900/50 border-t border-slate-700 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name.toLowerCase()}`}
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={500}
                />
                <button
                  type="button"
                  className="p-3 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-emotion-line text-xl text-slate-400 hover:text-white"></i>
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-send-plane-fill"></i>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

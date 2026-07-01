import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Real schema: sender_id, receiver_id, subject, body, is_read, is_deleted, message_type, created_at
export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  subject: string;
  body: string;
  is_read: boolean;
  is_deleted: boolean;
  message_type: 'personal' | 'battle_report' | 'trade' | 'system' | 'alliance';
  created_at: string;
  // Joined from profiles
  sender_name?: string;
  receiver_name?: string;
}

export interface SendMessageParams {
  receiverUsername: string;
  subject: string;
  body: string;
  messageType?: Message['message_type'];
}

export function useMessaging() {
  const { user } = useAuth();
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sent, setSent] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  // Load inbox (messages where receiver_id = me, not deleted)
  const loadInbox = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', user.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error || !data || !mountedRef.current) return;

    // Fetch sender usernames from profiles
    const senderIds = [...new Set(data.map(m => m.sender_id).filter(Boolean))];
    const nameMap: Record<string, string> = {};
    if (senderIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', senderIds);
      (profiles || []).filter(Boolean).forEach(p => { if (p && p.id) nameMap[p.id] = p.username || 'Unknown'; });
    }

    if (mountedRef.current) {
      setInbox(data.map(m => ({
        ...m,
        sender_name: nameMap[m.sender_id] ?? 'Unknown',
      })));
      setUnreadCount(data.filter(m => !m.is_read).length);
    }
  }, [user]);

  // Load sent (messages where sender_id = me, not deleted)
  const loadSent = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error || !data || !mountedRef.current) return;

    const receiverIds = [...new Set(data.map(m => m.receiver_id).filter(Boolean))];
    const nameMap: Record<string, string> = {};
    if (receiverIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', receiverIds);
      (profiles || []).filter(Boolean).forEach(p => { if (p && p.id) nameMap[p.id] = p.username || 'Unknown'; });
    }

    if (mountedRef.current) {
      setSent(data.map(m => ({
        ...m,
        receiver_name: nameMap[m.receiver_id] ?? 'Unknown',
      })));
    }
  }, [user]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadInbox(), loadSent()]);
    if (mountedRef.current) setLoading(false);
  }, [loadInbox, loadSent]);

  // Send a message by recipient username
  const sendMessage = async (params: SendMessageParams): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    // Look up receiver by username in profiles
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', params.receiverUsername.trim())
      .maybeSingle();

    if (profileErr || !profile) {
      return { success: false, error: `Player "${params.receiverUsername}" not found` };
    }

    if (profile.id === user.id) {
      return { success: false, error: 'You cannot send a message to yourself' };
    }

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: profile.id,
      subject: params.subject.trim() || 'No Subject',
      body: params.body.trim(),
      is_read: false,
      is_deleted: false,
      message_type: params.messageType ?? 'personal',
    });

    if (error) return { success: false, error: error.message };

    await loadSent();
    return { success: true };
  };

  // Send a pre-built system/battle report message (by receiver UUID directly)
  const sendSystemMessage = async (
    receiverId: string,
    subject: string,
    body: string,
    messageType: Message['message_type'] = 'system'
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      subject,
      body,
      is_read: false,
      is_deleted: false,
      message_type: messageType,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const markAsRead = async (messageId: number) => {
    if (!user) return;
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .eq('receiver_id', user.id);

    if (mountedRef.current) {
      setInbox(prev => prev.map(m => m.id === messageId ? { ...m, is_read: true } : m));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    if (mountedRef.current) {
      setInbox(prev => prev.map(m => ({ ...m, is_read: true })));
      setUnreadCount(0);
    }
  };

  const deleteMessage = async (messageId: number, folder: 'inbox' | 'sent') => {
    if (!user) return;
    await supabase
      .from('messages')
      .update({ is_deleted: true })
      .eq('id', messageId);

    if (mountedRef.current) {
      if (folder === 'inbox') {
        setInbox(prev => {
          const removed = prev.find(m => m.id === messageId);
          const next = prev.filter(m => m.id !== messageId);
          if (removed && !removed.is_read) setUnreadCount(c => Math.max(0, c - 1));
          return next;
        });
      } else {
        setSent(prev => prev.filter(m => m.id !== messageId));
      }
    }
  };

  const replyToMessage = async (original: Message, body: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: original.sender_id,
      subject: original.subject.startsWith('Re: ') ? original.subject : `Re: ${original.subject}`,
      body,
      is_read: false,
      is_deleted: false,
      message_type: original.message_type,
    });

    if (error) return { success: false, error: error.message };
    await loadSent();
    return { success: true };
  };

  useEffect(() => {
    mountedRef.current = true;
    if (user) loadAll();
    else { setLoading(false); }
    return () => { mountedRef.current = false; };
  }, [user, loadAll]);

  // Real-time: new incoming messages
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`messages-inbox-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, () => { loadInbox(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, loadInbox]);

  return {
    inbox,
    sent,
    unreadCount,
    loading,
    sendMessage,
    sendSystemMessage,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    replyToMessage,
    refresh: loadAll,
  };
}
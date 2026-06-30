import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export function useNotificationSystem() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error && error.code !== 'PGRST116') throw error;

      const notifs: Notification[] = (data || []).map(n => ({
        id: n.id,
        type: n.notification_type,
        title: n.title,
        message: n.message,
        data: n.data,
        read: n.read,
        created_at: n.created_at
      }));

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();

    if (!user) return;

    // Subscribe to real-time notifications
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `player_id=eq.${user.id}`
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadNotifications]);

  const createNotification = async (
    type: string,
    title: string,
    message: string,
    data?: any
  ) => {
    if (!user) return;

    try {
      await supabase.from('notifications').insert({
        player_id: user.id,
        notification_type: type,
        title,
        message,
        data,
        read: false
      });

      await loadNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('player_id', user.id)
        .eq('read', false);

      await loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      await loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('player_id', user.id);

      await loadNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    reload: loadNotifications
  };
}

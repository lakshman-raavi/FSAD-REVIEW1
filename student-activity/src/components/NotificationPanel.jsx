import { X, Bell, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../utils/storage.js';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ userId, isOpen, onClose }) => {
    const [notifs, setNotifs] = useState([]);

    const refresh = () => setNotifs(getNotifications(userId));

    useEffect(() => {
        if (isOpen) refresh();
    }, [isOpen, userId]);

    const markAllRead = () => {
        markAllNotificationsRead(userId);
        refresh();
    };

    const markRead = (id) => {
        markNotificationRead(userId, id);
        refresh();
    };

    const getIcon = (type) => ({ registration: '📋', attendance: '✅', points: '🏆', reminder: '🔔' }[type] || '🔔');

    const unreadCount = notifs.filter(n => !n.read).length;

    return (
        <>
            {isOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(0,0,0,0.3)' }}
                    onClick={onClose}
                />
            )}
            <div className={`notif-panel ${isOpen ? 'open' : ''}`} aria-label="Notifications">
                <div className="notif-panel-header">
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Notifications</h3>
                        {unreadCount > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{unreadCount} unread</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {unreadCount > 0 && (
                            <button className="btn btn-ghost btn-sm" onClick={markAllRead} title="Mark all read">
                                <CheckCheck size={16} />
                            </button>
                        )}
                        <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close"><X size={18} /></button>
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {notifs.length === 0 ? (
                        <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                            <Bell size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No notifications yet</p>
                        </div>
                    ) : (
                        notifs.map(n => (
                            <div
                                key={n.id}
                                className={`notif-item ${!n.read ? 'unread' : ''}`}
                                onClick={() => markRead(n.id)}
                                role="button"
                                tabIndex={0}
                            >
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '1.25rem' }}>{getIcon(n.type)}</span>
                                    <div>
                                        <p className="notif-item-msg">{n.message}</p>
                                        <p className="notif-item-time">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginLeft: 'auto', flexShrink: 0, marginTop: 4 }} />}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;

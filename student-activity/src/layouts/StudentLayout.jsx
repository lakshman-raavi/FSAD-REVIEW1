import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, User, Calendar, Bell, LogOut, Zap } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import { getNotifications } from '../utils/storage.js';

const StudentLayout = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const [notifOpen, setNotifOpen] = useState(false);

    const unread = getNotifications(user?.studentId).filter(n => !n.read).length;

    const handleLogout = () => { logout(); navigate('/'); };

    const navItems = [
        { to: '/student', label: 'Home', icon: <Home size={20} /> },
        { to: '/student/events', label: 'Events', icon: <Search size={20} /> },
        { to: '/student/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
        { to: '/student/profile', label: 'Profile', icon: <User size={20} /> },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top navbar */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{
                    maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
                    height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    {/* Logo */}
                    <NavLink to="/student" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Zap size={16} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                            Activity<span style={{ color: 'var(--primary)' }}>Hub</span>
                        </span>
                    </NavLink>

                    {/* Desktop nav links */}
                    <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
                        {navItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/student'}
                                className={({ isActive }) => `btn btn-ghost btn-sm ${isActive ? 'text-primary' : ''}`}
                                style={({ isActive }) => isActive ? { color: 'var(--primary)', background: 'var(--primary-light)' } : {}}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ThemeToggle />
                        <div style={{ position: 'relative' }}>
                            <button className="btn btn-ghost btn-icon" onClick={() => setNotifOpen(true)} aria-label="Notifications">
                                <Bell size={18} color="var(--text-secondary)" />
                                {unread > 0 && <span className="notification-dot" />}
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: '0.25rem' }}>
                            <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
                                {user?.name?.[0] || 'S'}
                            </div>
                            <div className="user-info-desktop">
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{user?.name}</p>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{user?.studentId}</p>
                            </div>
                            <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout" aria-label="Logout">
                                <LogOut size={16} color="var(--text-muted)" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '2rem 1.5rem 6rem' }}>
                <Outlet />
            </main>

            {/* Bottom nav (mobile) */}
            <nav className="bottom-nav" aria-label="Student mobile navigation">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/student'}
                        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <NotificationPanel userId={user?.studentId} isOpen={notifOpen} onClose={() => setNotifOpen(false)} />

            <style>{`
        @media (max-width: 768px) { .desktop-nav, .user-info-desktop { display: none !important; } }
        @media (min-width: 769px) { .user-info-desktop { display: flex !important; flex-direction: column; } }
      `}</style>
        </div>
    );
};

export default StudentLayout;

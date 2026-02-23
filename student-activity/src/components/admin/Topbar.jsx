import { Menu, Bell, User, Sun, Moon } from 'lucide-react';
import ThemeToggle from '../ThemeToggle.jsx';

const Topbar = ({ title, subtitle, setMobileOpen, user, unread, onNotifClick, collapsed }) => {
    return (
        <header className={`topbar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                    className="btn btn-ghost btn-icon mobile-menu-btn"
                    onClick={() => setMobileOpen(true)}
                    style={{ display: 'none' }}
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{title}</h1>
                    {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ThemeToggle />

                <button className="btn btn-ghost btn-icon" onClick={onNotifClick} style={{ position: 'relative' }}>
                    <Bell size={20} color="var(--text-secondary)" />
                    {unread > 0 && (
                        <span style={{
                            position: 'absolute', top: 8, right: 8,
                            width: 8, height: 8, borderRadius: '50%',
                            background: '#ef4444', border: '2px solid var(--bg-card)'
                        }} />
                    )}
                </button>

                <div style={{ height: 24, width: 1, background: 'var(--border)', margin: '0 0.5rem' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'right' }} className="hide-on-mobile">
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{user?.name || 'Admin'}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Administrator</p>
                    </div>
                    <div className="avatar" style={{
                        width: 38, height: 38,
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        color: 'white', fontWeight: 700, fontSize: '0.9rem'
                    }}>
                        {(user?.name || 'A')[0]}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: flex !important; }
                    .hide-on-mobile { display: none !important; }
                }
            `}</style>
        </header>
    );
};

export default Topbar;

import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import { getNotifications } from '../utils/storage.js';
import Sidebar from '../components/admin/Sidebar.jsx';
import Topbar from '../components/admin/Topbar.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';

const AdminLayout = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const unread = getNotifications('admin').filter(n => !n.read).length;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getTitle = () => {
        const path = location.pathname;
        if (path === '/admin') return 'Admin Dashboard';
        if (path === '/admin/calendar') return 'Event Calendar';
        if (path === '/admin/events') return 'Event Management';
        if (path === '/admin/attendance-view') return 'Attendance Portal';
        if (path === '/admin/students') return 'Student Directory';
        if (path === '/admin/reports') return 'Performance Reports';
        if (path === '/admin/settings') return 'System Settings';
        if (path.startsWith('/admin/attendance/')) return 'Mark Attendance';
        return 'Admin Portal';
    };

    const getSubtitle = () => {
        const path = location.pathname;
        if (path === '/admin') return 'Overview & Analytics';
        return 'Manage events & students';
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                onLogout={handleLogout}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className={`admin-container ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
                <Topbar
                    title={getTitle()}
                    subtitle={getSubtitle()}
                    setMobileOpen={setMobileOpen}
                    user={user}
                    unread={unread}
                    onNotifClick={() => setNotifOpen(true)}
                    collapsed={collapsed}
                />

                <main className="main-content">
                    <div className="page-content">
                        <Outlet />
                    </div>
                </main>
            </div>

            <NotificationPanel userId="admin" isOpen={notifOpen} onClose={() => setNotifOpen(false)} />

            <style>{`
                .admin-container {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-expanded { margin-left: var(--sidebar-width); }
                .sidebar-collapsed { margin-left: var(--sidebar-collapsed); }
                
                @media (max-width: 1024px) {
                    .sidebar-expanded, .sidebar-collapsed { margin-left: 0; }
                }

                .main-content {
                    flex: 1;
                    padding-top: var(--topbar-height);
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;

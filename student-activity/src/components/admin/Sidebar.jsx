import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Calendar, List, CheckCircle, Users,
    FileText, Settings, LogOut, Zap, ChevronLeft, ChevronRight
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, onLogout, mobileOpen, setMobileOpen }) => {
    const mainNav = [
        { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} />, end: true },
        { to: '/admin/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
        { to: '/admin/events', label: 'Events', icon: <List size={20} /> },
        { to: '/admin/attendance-view', label: 'Attendance', icon: <CheckCircle size={20} /> },
        { to: '/admin/students', label: 'Students', icon: <Users size={20} /> },
        { to: '/admin/reports', label: 'Reports', icon: <FileText size={20} /> },
    ];

    const accountNav = [
        { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-logo">
                <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Zap size={18} color="white" />
                </div>
                {!collapsed && (
                    <span className="sidebar-logo-text">
                        Activity<span>Hub</span>
                    </span>
                )}
            </div>

            <nav className="sidebar-nav">
                {!collapsed && <div className="sidebar-section-title">Main Menu</div>}
                {mainNav.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={() => setMobileOpen(false)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}

                {!collapsed && <div className="sidebar-section-title" style={{ marginTop: '1.5rem' }}>Account</div>}
                {accountNav.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={() => setMobileOpen(false)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}

                <button onClick={onLogout} style={{ marginTop: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                    <span className="nav-icon"><LogOut size={20} /></span>
                    {!collapsed && <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Logout</span>}
                </button>
            </nav>

            <div className="sidebar-footer">
                <button
                    className="btn btn-ghost"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', color: 'rgba(255,255,255,0.6)', padding: '0.5rem' }}
                >
                    {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span style={{ fontSize: '0.85rem', marginLeft: '0.5rem' }}>Collapse</span></>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

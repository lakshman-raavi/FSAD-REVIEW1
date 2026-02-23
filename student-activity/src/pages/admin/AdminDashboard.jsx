import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus, Calendar, CheckCircle, Clock,
    ArrowRight, Zap, Star, FileText
} from 'lucide-react';
import { useDataContext } from '../../context/DataContext.jsx';
import { useAuthContext } from '../../context/AuthContext.jsx';
import Modal from '../../components/Modal.jsx';
import EventForm from './EventForm.jsx';
import KPICard from '../../components/admin/KPICard.jsx';

const AdminDashboard = () => {
    const { activities } = useDataContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [createOpen, setCreateOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const today = new Date().toISOString().split('T')[0];

    // KPI Data
    const totalEvents = activities.length;
    const upcomingEvents = activities.filter(a => a.date >= today).length;
    const attendanceCount = activities.filter(a => a.attendanceLocked).length;
    const attendanceRate = totalEvents > 0 ? Math.round((attendanceCount / totalEvents) * 100) : 0;
    const totalPoints = activities.reduce((acc, curr) => acc + (curr.attendanceLocked ? curr.registrations.filter(r => r.attended).length * curr.defaultPoints : 0), 0);

    const quickActions = [
        { label: 'Create Event', icon: <Plus size={18} />, action: () => setCreateOpen(true), primary: true },
        { label: 'Event List', icon: <ArrowRight size={18} />, action: () => navigate('/admin/events') },
        { label: 'Reports', icon: <FileText size={18} />, action: () => navigate('/admin/reports') },
    ];

    const sortedActivities = [...activities].sort((a, b) => b.date.localeCompare(a.date));
    const recentActivities = sortedActivities.slice(0, 5);
    const pendingAttendance = activities.filter(a => !a.attendanceLocked && a.date < today);

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Welcome back, {user?.name || 'Admin'}</h2>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Here's what's happening today</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {quickActions.map(qa => (
                        <button
                            key={qa.label}
                            className={`btn ${qa.primary ? 'btn-primary' : 'btn-secondary glass'}`}
                            onClick={qa.action}
                            style={{ padding: '0.7rem 1.2rem' }}
                        >
                            {qa.icon} {qa.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="kpi-grid" style={{ marginBottom: '2.5rem' }}>
                <KPICard loading={loading} label="Total Events" value={totalEvents} icon={<Calendar size={24} />} color="#6366f1" trend={12} />
                <KPICard loading={loading} label="Upcoming" value={upcomingEvents} icon={<Zap size={24} />} color="#f59e0b" trend={5} />
                <KPICard loading={loading} label="Attendance Rate" value={`${attendanceRate}%`} icon={<CheckCircle size={24} />} color="#10b981" trend={-2} />
                <KPICard loading={loading} label="Points Distributed" value={totalPoints.toLocaleString()} icon={<Star size={24} />} color="#06b6d4" trend={18} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem' }} className="dashboard-grid">
                {/* Main section: Recent Activity */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Recent Events</h3>
                        <Link to="/admin/events" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        {recentActivities.length > 0 ? (
                            recentActivities.map(activity => (
                                <div key={activity.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: 8, transition: 'background 0.2s', cursor: 'pointer' }}
                                    onClick={() => navigate('/admin/events')}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                                        <Calendar size={20} color="var(--text-secondary)" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.2rem' }}>{activity.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{activity.date} • {activity.venue}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`badge badge-${activity.type}`} style={{ fontSize: '0.7rem' }}>{activity.type}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent events found.</div>
                        )}
                    </div>
                </div>

                {/* Sidebar Section: Alerts/Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Pending Attendance */}
                    <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ color: '#f59e0b' }}><Clock size={20} /></div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Attention Required</h3>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            There are {pendingAttendance.length} events waiting for attendance finalization.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {pendingAttendance.slice(0, 3).map(pa => (
                                <div key={pa.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 6 }}>
                                    <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{pa.name}</span>
                                    <button onClick={() => navigate(`/admin/attendance/${pa.id}`)}
                                        style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                        Mark
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem' }}>Upcoming Highlights</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ fontSize: '1.5rem' }}>🎯</div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{upcomingEvents} Upcoming</div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Events scheduled for this month</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ fontSize: '1.5rem' }}>📈</div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Growing Community</div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>+5% registration growth this week</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Event" size="lg">
                <EventForm onClose={() => setCreateOpen(false)} />
            </Modal>

            <style>{`
                @media (max-width: 992px) {
                    .dashboard-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;

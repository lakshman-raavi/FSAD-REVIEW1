import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useDataContext } from '../../context/DataContext.jsx';
import { Calendar, MapPin, Star, ChevronRight, Award, CheckCircle } from 'lucide-react';
import EmptyState from '../../components/EmptyState.jsx';

const getBadge = (points) => {
    if (points >= 300) return { label: 'Gold', emoji: '🥇', color: '#ffd700', min: 300 };
    if (points >= 150) return { label: 'Silver', emoji: '🥈', color: '#a8a9ad', min: 150 };
    if (points >= 50) return { label: 'Bronze', emoji: '🥉', color: '#cd7f32', min: 50 };
    return { label: 'Newbie', emoji: '⭐', color: '#6366f1', min: 0 };
};

const StudentDashboard = () => {
    const { user } = useAuthContext();
    const { activities } = useDataContext();
    const today = new Date().toISOString().split('T')[0];

    const myRegistrations = useMemo(() =>
        activities.filter(a => a.registrations.some(r => r.studentId === user.studentId)),
        [activities, user.studentId]
    );

    const totalPoints = useMemo(() =>
        myRegistrations.reduce((sum, a) => {
            const r = a.registrations.find(r => r.studentId === user.studentId);
            return sum + (r?.points || 0);
        }, 0),
        [myRegistrations, user.studentId]
    );

    const attended = useMemo(() =>
        myRegistrations.filter(a => {
            const r = a.registrations.find(r => r.studentId === user.studentId);
            return r?.attended;
        }).length,
        [myRegistrations, user.studentId]
    );

    const upcoming = useMemo(() =>
        activities.filter(a => a.date >= today && !a.attendanceLocked).slice(0, 6),
        [activities, today]
    );

    const badge = getBadge(totalPoints);
    const nextBadges = [{ label: 'Bronze', min: 50 }, { label: 'Silver', min: 150 }, { label: 'Gold', min: 300 }];
    const nextBadge = nextBadges.find(b => totalPoints < b.min);
    const progressToNext = nextBadge ? Math.min(100, Math.round((totalPoints / nextBadge.min) * 100)) : 100;

    const kpis = [
        { label: 'Events Joined', value: myRegistrations.length, icon: '📋', color: '#6366f1', bg: '#ede9fe' },
        { label: 'Attended', value: attended, icon: '✅', color: '#10b981', bg: '#d1fae5' },
        { label: 'Total Points', value: totalPoints, icon: '🏆', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'My Badge', value: badge.label, icon: badge.emoji, color: badge.color, bg: '#f8fafc' },
    ];

    return (
        <div className="animate-slide-up">
            {/* Welcome */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                    Welcome back, {user.name.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>{user.studentId} • Student</p>
            </div>

            {/* KPIs */}
            <div className="kpi-grid" style={{ marginBottom: '2rem' }}>
                {kpis.map(k => (
                    <div key={k.label} className="kpi-card">
                        <div className="kpi-icon" style={{ background: k.bg, color: k.color }}><span style={{ fontSize: '1.4rem' }}>{k.icon}</span></div>
                        <div className="kpi-value">{k.value}</div>
                        <div className="kpi-label">{k.label}</div>
                    </div>
                ))}
            </div>

            {/* Points progress */}
            {nextBadge && (
                <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div>
                            <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>Progress to {nextBadge.label} Badge</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{totalPoints} / {nextBadge.min} pts</p>
                        </div>
                        <span style={{ fontSize: '1.5rem' }}>{badge.emoji}</span>
                    </div>
                    <div className="progress" style={{ height: 10 }}>
                        <div className="progress-bar" style={{ width: `${progressToNext}%` }} />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>
                        {nextBadge.min - totalPoints} more points to earn {nextBadge.label}!
                    </p>
                </div>
            )}

            {/* Upcoming events */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Upcoming Events</h2>
                <Link to="/student/events" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>
                    View All <ChevronRight size={15} />
                </Link>
            </div>

            {upcoming.length === 0 ? (
                <EmptyState icon="📅" title="No upcoming events" message="Check back later or browse all events."
                    action={<Link to="/student/events" className="btn btn-primary">Browse Events</Link>} />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {upcoming.map(ev => {
                        const isRegistered = ev.registrations.some(r => r.studentId === user.studentId);
                        return (
                            <div key={ev.id} className="event-card">
                                <div className="event-card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                                        <span className={`event-type-tag event-type-${ev.type}`}>{ev.type}</span>
                                        {isRegistered && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}><CheckCircle size={10} /> Registered</span>}
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{ev.name}</h3>
                                </div>
                                <div className="event-card-body">
                                    <div className="event-meta">
                                        <div className="event-meta-row"><Calendar size={13} />{ev.date} at {ev.time}</div>
                                        <div className="event-meta-row"><MapPin size={13} />{ev.venue}</div>
                                        <div className="event-meta-row"><Star size={13} color="var(--accent)" />{ev.defaultPoints} pts</div>
                                    </div>
                                </div>
                                <div className="event-card-footer">
                                    <Link to="/student/events" className="btn btn-primary btn-sm">
                                        {isRegistered ? 'View Details' : 'Register'}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;

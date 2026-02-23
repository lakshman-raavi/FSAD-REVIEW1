import { useMemo } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useDataContext } from '../../context/DataContext.jsx';
import { Calendar, MapPin, Star, Download, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportStudentReport } from '../../utils/exportUtils.js';
import EmptyState from '../../components/EmptyState.jsx';

const getBadge = (points) => {
    if (points >= 300) return { label: 'Gold', emoji: '🥇', color: '#ffd700', next: null, nextMin: 300 };
    if (points >= 150) return { label: 'Silver', emoji: '🥈', color: '#a8a9ad', next: 'Gold', nextMin: 300 };
    if (points >= 50) return { label: 'Bronze', emoji: '🥉', color: '#cd7f32', next: 'Silver', nextMin: 150 };
    return { label: 'Newbie', emoji: '⭐', color: '#6366f1', next: 'Bronze', nextMin: 50 };
};

const ProgressRing = ({ percent, size = 120, color = '#6366f1', children }) => {
    const r = (size - 12) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ - (percent / 100) * circ;
    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} className="progress-ring">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth={10} />
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={color} strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={dash}
                    className="progress-ring-circle"
                />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>{children}</div>
        </div>
    );
};

const StudentProfile = () => {
    const { user } = useAuthContext();
    const { activities } = useDataContext();
    const today = new Date().toISOString().split('T')[0];

    const myActivities = useMemo(() =>
        activities.filter(a => a.registrations.some(r => r.studentId === user.studentId)),
        [activities, user.studentId]
    );

    const totalPoints = useMemo(() =>
        myActivities.reduce((sum, a) => {
            const r = a.registrations.find(r => r.studentId === user.studentId);
            return sum + (r?.points || 0);
        }, 0),
        [myActivities, user.studentId]
    );

    const attended = useMemo(() =>
        myActivities.filter(a => a.registrations.find(r => r.studentId === user.studentId)?.attended),
        [myActivities, user.studentId]
    );

    const upcoming = myActivities.filter(a => a.date >= today && !a.attendanceLocked);
    const past = myActivities.filter(a => a.date < today || a.attendanceLocked);

    const badge = getBadge(totalPoints);
    const ringPct = badge.nextMin > 0 ? Math.min(100, Math.round((totalPoints / badge.nextMin) * 100)) : 100;

    const handleExport = () => {
        exportStudentReport(user, activities);
        toast.success('Your activity report downloaded!');
    };

    const allBadges = [
        { label: 'Bronze', emoji: '🥉', min: 50, color: '#cd7f32' },
        { label: 'Silver', emoji: '🥈', min: 150, color: '#a8a9ad' },
        { label: 'Gold', emoji: '🥇', min: 300, color: '#ffd700' },
    ];

    return (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Profile header card */}
            <div className="card" style={{ background: 'var(--gradient-primary)', color: 'white', overflow: 'visible' }}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Progress ring */}
                    <ProgressRing percent={ringPct} size={120} color="rgba(255,255,255,0.9)">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem' }}>{badge.emoji}</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>{badge.label}</div>
                        </div>
                    </ProgressRing>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <h2 style={{ color: 'white', margin: '0 0 0.25rem', fontSize: '1.5rem' }}>{user.name}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 0.75rem', fontSize: '0.9rem' }}>{user.studentId} • {user.email}</p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {[
                                ['Events', myActivities.length],
                                ['Attended', attended.length],
                                ['Points', totalPoints],
                            ].map(([l, v]) => (
                                <div key={l}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{v}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="btn btn-sm" onClick={handleExport}
                        style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap' }}>
                        <Download size={15} /> Export Report
                    </button>
                </div>
            </div>

            {/* Badges */}
            <div className="card">
                <div className="card-header"><h3 style={{ margin: 0, fontSize: '1rem' }}>🏅 Badges</h3></div>
                <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {allBadges.map(b => {
                        const earned = totalPoints >= b.min;
                        return (
                            <div key={b.label} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                                padding: '1rem 1.5rem', borderRadius: 12, flex: 1, minWidth: 100, textAlign: 'center',
                                background: earned ? `${b.color}15` : 'var(--bg-secondary)',
                                border: `2px solid ${earned ? b.color : 'var(--border)'}`,
                                opacity: earned ? 1 : 0.5, transition: 'all 0.3s',
                            }}>
                                <span style={{ fontSize: '2.25rem', filter: earned ? 'none' : 'grayscale(1)' }}>{b.emoji}</span>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: earned ? b.color : 'var(--text-muted)' }}>{b.label}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.min} pts {earned ? '✓' : `(${Math.max(0, b.min - totalPoints)} more)`}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* My registered events — timeline */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>📋 Registered Events</h3>
                    <span className="badge badge-secondary">{myActivities.length} total</span>
                </div>

                {myActivities.length === 0 ? (
                    <EmptyState icon="📅" title="No events yet" message="Register for events to track your history." />
                ) : (
                    <div>
                        {upcoming.length > 0 && (
                            <>
                                <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-secondary)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Upcoming ({upcoming.length})
                                </div>
                                {upcoming.map((ev, i) => (
                                    <EventRow key={ev.id} ev={ev} studentId={user.studentId} isLast={i === upcoming.length - 1} />
                                ))}
                            </>
                        )}
                        {past.length > 0 && (
                            <>
                                <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-secondary)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Completed ({past.length})
                                </div>
                                {past.map((ev, i) => (
                                    <EventRow key={ev.id} ev={ev} studentId={user.studentId} isLast={i === past.length - 1} />
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const EventRow = ({ ev, studentId, isLast }) => {
    const reg = ev.registrations.find(r => r.studentId === studentId);
    const today = new Date().toISOString().split('T')[0];
    const isPast = ev.date < today;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
            borderBottom: isLast ? 'none' : '1px solid var(--border)',
            background: reg?.attended ? '#f0fdf4' : undefined,
            transition: 'background 0.2s',
        }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: reg?.attended ? '#d1fae5' : (ev.attendanceLocked ? '#fee2e2' : 'var(--primary-light)') }}>
                {reg?.attended ? <CheckCircle size={18} color="#10b981" /> : (ev.attendanceLocked ? '❌' : <Clock size={18} color="var(--primary)" />)}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{ev.name}</div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span><Calendar size={11} style={{ verticalAlign: 'middle' }} /> {ev.date}</span>
                    <span><MapPin size={11} style={{ verticalAlign: 'middle' }} /> {ev.venue}</span>
                </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className={`event-type-tag event-type-${ev.type}`}>{ev.type}</span>
                {reg?.attended && (
                    <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: '0.25rem' }}>+{ev.defaultPoints} pts</div>
                )}
                {ev.attendanceLocked && !reg?.attended && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '0.25rem' }}>Absent</div>
                )}
                {!ev.attendanceLocked && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Pending</div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;

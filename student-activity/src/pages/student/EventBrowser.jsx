import { useState, useMemo } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useDataContext } from '../../context/DataContext.jsx';
import { Search, Calendar, MapPin, Star, Users, CheckCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/EmptyState.jsx';

const EventBrowser = () => {
    const { user } = useAuthContext();
    const { activities, registerForActivity, unregister } = useDataContext();

    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const today = new Date().toISOString().split('T')[0];

    const filtered = useMemo(() => {
        let list = [...activities];
        if (search) list = list.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.venue.toLowerCase().includes(search.toLowerCase()));
        if (filterType !== 'all') list = list.filter(a => a.type === filterType);
        if (filterDate === 'upcoming') list = list.filter(a => a.date >= today);
        if (filterDate === 'past') list = list.filter(a => a.date < today);
        list.sort((a, b) => {
            if (sortBy === 'date') return a.date.localeCompare(b.date);
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'registrations') return b.registrations.length - a.registrations.length;
            return 0;
        });
        return list;
    }, [activities, search, filterType, filterDate, sortBy, today]);

    const handleRegister = async (activity) => {
        if (!user?.studentId) return;
        const result = await registerForActivity(activity.id, user);
        if (result.success) toast.success(`Registered for "${activity.name}"! 🎉`);
        else toast.error(result.error);
    };

    const handleUnregister = async (activity) => {
        if (!user?.studentId) return;
        const result = await unregister(activity.id, user.studentId);
        if (result.success) toast.success(`Unregistered from "${activity.name}"`);
        else toast.error(result.error);
    };

    return (
        <div className="animate-slide-up">
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Browse Events</h1>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Discover and register for upcoming activities</p>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
                        <Search size={16} color="var(--text-muted)" />
                        <input placeholder="Search events or venues..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search events" />
                    </div>
                    {[
                        { value: filterType, onChange: setFilterType, options: [['all', 'All Types'], ['event', 'Events'], ['sport', 'Sports'], ['club', 'Clubs'], ['workshop', 'Workshops'], ['seminar', 'Seminars'], ['cultural', 'Cultural'], ['volunteering', 'Volunteering'], ['competition', 'Competitions']] },
                        { value: filterDate, onChange: setFilterDate, options: [['all', 'All Dates'], ['upcoming', 'Upcoming'], ['past', 'Past']] },
                        { value: sortBy, onChange: setSortBy, options: [['date', 'Sort: Date'], ['name', 'Sort: Name'], ['registrations', 'Sort: Popular']] },
                    ].map(({ value, onChange, options }, i) => (
                        <select key={i} className="form-control" value={value} onChange={e => onChange(e.target.value)} style={{ width: 155 }}>
                            {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                    ))}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon="🔍" title="No events found" message="Try changing your search or filters." />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {filtered.map(ev => {
                        const isRegistered = ev.registrations.some(r => r.studentId === user.studentId);
                        const myReg = ev.registrations.find(r => r.studentId === user.studentId);
                        const isPast = ev.date < today;
                        const canRegister = !ev.attendanceLocked && !isRegistered;
                        const canUnregister = !ev.attendanceLocked && isRegistered;

                        return (
                            <div key={ev.id} className="event-card" style={{
                                borderColor: isRegistered ? 'var(--primary)' : myReg?.attended ? 'var(--success)' : undefined,
                                boxShadow: isRegistered ? '0 0 0 2px rgba(99,102,241,0.15)' : undefined,
                            }}>
                                <div className="event-card-header">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                                                <span className={`event-type-tag event-type-${ev.type}`}>{ev.type}</span>
                                                {ev.attendanceLocked && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}><CheckCircle size={10} /> Finalized</span>}
                                                {isRegistered && !ev.attendanceLocked && <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>✓ Registered</span>}
                                                {myReg?.attended && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>✅ Attended</span>}
                                            </div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{ev.name}</h3>
                                        </div>
                                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                            +{ev.defaultPoints}pts
                                        </div>
                                    </div>
                                </div>

                                <div className="event-card-body">
                                    {ev.description && (
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {ev.description}
                                        </p>
                                    )}
                                    <div className="event-meta">
                                        <div className="event-meta-row"><Calendar size={13} />{ev.date} at {ev.time}</div>
                                        <div className="event-meta-row"><MapPin size={13} />{ev.venue}</div>
                                        <div className="event-meta-row"><Users size={13} />{ev.registrations.length} registered</div>
                                    </div>
                                    {myReg?.attended && (
                                        <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#d1fae5', borderRadius: 8, fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>
                                            🏆 You earned {ev.defaultPoints} points from this event!
                                        </div>
                                    )}
                                </div>

                                <div className="event-card-footer">
                                    {canRegister && (
                                        <button className="btn btn-primary btn-sm" onClick={() => handleRegister(ev)}>
                                            Register
                                        </button>
                                    )}
                                    {canUnregister && (
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleUnregister(ev)}>
                                            Unregister
                                        </button>
                                    )}
                                    {ev.attendanceLocked && isRegistered && (
                                        <span className="badge badge-secondary">
                                            <Lock size={11} /> Registration Closed
                                        </span>
                                    )}
                                    {!isRegistered && ev.attendanceLocked && (
                                        <span className="badge badge-danger">
                                            <Lock size={11} /> Registration Closed
                                        </span>
                                    )}
                                    {isPast && !ev.attendanceLocked && isRegistered && (
                                        <span className="badge badge-warning">Awaiting Attendance</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EventBrowser;

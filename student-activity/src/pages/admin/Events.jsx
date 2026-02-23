import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext.jsx';
import {
    Plus, Search, Filter, SortAsc, Edit2, Trash2, Users, Download,
    CheckCircle, Clock, Calendar, MapPin, Star, ChevronDown, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { exportAttendanceReport } from '../../utils/exportUtils.js';
import EventForm from './EventForm.jsx';

const Events = ({ attendanceMode = false }) => {
    const { activities, removeActivity } = useDataContext();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterDate, setFilterDate] = useState(attendanceMode ? 'all' : 'all');
    const [filterStatus, setFilterStatus] = useState(attendanceMode ? 'unlocked' : 'all');
    const [sortBy, setSortBy] = useState('date');
    const [createOpen, setCreateOpen] = useState(false);
    const [editActivity, setEditActivity] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const today = new Date().toISOString().split('T')[0];

    const filtered = useMemo(() => {
        let list = activities.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
            const matchesType = filterType === 'all' || a.type === filterType;
            const matchesStatus = filterStatus === 'all' || (filterStatus === 'locked' ? a.attendanceLocked : !a.attendanceLocked);

            let matchesDate = true;
            if (filterDate === 'upcoming') matchesDate = a.date >= today;
            else if (filterDate === 'past') matchesDate = a.date < today;

            return matchesSearch && matchesType && matchesStatus && matchesDate;
        });

        // If in attendance mode, we might want to prioritize past events that aren't locked
        if (attendanceMode) {
            // No specific forced filter here yet, but we could add one
        }

        list.sort((a, b) => {
            if (sortBy === 'date') return a.date.localeCompare(b.date);
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'registrations') return b.registrations.length - a.registrations.length;
            return 0;
        });
        return list;
    }, [activities, search, filterType, filterDate, filterStatus, sortBy, today, attendanceMode]);

    const handleDelete = useCallback(async (activity) => {
        await removeActivity(activity.id);
        toast.success(`"${activity.name}" deleted`);
        setDeleteTarget(null);
    }, [removeActivity]);

    const handleDownload = useCallback((activity) => {
        exportAttendanceReport(activity);
        toast.success('Report downloaded!');
    }, []);

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{attendanceMode ? 'Attendance Portal' : 'All Events'}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{attendanceMode ? 'Manage participation and finalize event records' : `${filtered.length} total events matching criteria`}</p>
                </div>
                {!attendanceMode && (
                    <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
                        <Plus size={18} /> Create Event
                    </button>
                )}
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-bar" style={{ flex: 1, minWidth: 250 }}>
                        <Search size={16} color="var(--text-muted)" />
                        <input
                            placeholder="Search events by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>}
                    </div>

                    <select className="form-control" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: 140 }}>
                        <option value="all">All Types</option>
                        {['event', 'sport', 'club', 'workshop', 'seminar', 'cultural', 'volunteering', 'competition'].map(t => (
                            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                    </select>

                    <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 140 }}>
                        <option value="all">All Status</option>
                        <option value="locked">Finalized</option>
                        <option value="unlocked">Not Locked</option>
                    </select>

                    <select className="form-control" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 140 }}>
                        <option value="date">Sort: Date</option>
                        <option value="name">Sort: Name</option>
                        <option value="registrations">Sort: Reg count</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="card" style={{ padding: '1.5rem', minHeight: '280px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 20 }} />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
                                    <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
                                </div>
                            </div>
                            <div className="skeleton skeleton-title" style={{ width: '80%', marginBottom: '1.5rem' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="skeleton skeleton-text" />
                                <div className="skeleton skeleton-text" />
                                <div className="skeleton skeleton-text" />
                                <div className="skeleton skeleton-text" />
                            </div>
                            <div className="skeleton" style={{ width: '100%', height: 40, borderRadius: 8 }} />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No events found"
                    message="Adjust your filters or try a different search term."
                />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map(activity => (
                        <EventDetailsCard
                            key={activity.id}
                            activity={activity}
                            onEdit={() => setEditActivity(activity)}
                            onDelete={() => setDeleteTarget(activity)}
                            onAttendance={() => navigate(`/admin/attendance/${activity.id}`)}
                            onDownload={() => handleDownload(activity)}
                        />
                    ))}
                </div>
            )}

            <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Event" size="lg">
                <EventForm onClose={() => setCreateOpen(false)} />
            </Modal>

            <Modal isOpen={!!editActivity} onClose={() => setEditActivity(null)} title="Edit Event" size="lg">
                <EventForm activity={editActivity} onClose={() => setEditActivity(null)} />
            </Modal>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => handleDelete(deleteTarget)}
                title="Delete Event"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                danger
            />
        </div>
    );
};

const EventDetailsCard = ({ activity, onEdit, onDelete, onAttendance, onDownload }) => {
    const present = activity.registrations.filter(r => r.attended).length;
    const pct = activity.registrations.length > 0 ? Math.round((present / activity.registrations.length) * 100) : 0;
    const today = new Date().toISOString().split('T')[0];
    const isPast = activity.date < today;

    return (
        <div className="card event-card-modern" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${activity.type}`} style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>{activity.type}</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {!activity.attendanceLocked && (
                            <button className="btn btn-ghost btn-icon" onClick={onEdit}><Edit2 size={16} /></button>
                        )}
                        <button className="btn btn-ghost btn-icon" onClick={onDelete} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                    </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{activity.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {activity.attendanceLocked ? (
                        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}><CheckCircle size={12} /> Finalized</span>
                    ) : isPast ? (
                        <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}><Clock size={12} /> Pending</span>
                    ) : (
                        <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>Upcoming</span>
                    )}
                </div>
            </div>

            <div style={{ padding: '1.25rem', flex: 1 }}>
                <div className="event-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Calendar size={14} /> {activity.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <MapPin size={14} /> {activity.venue}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Users size={14} /> {activity.registrations.length} Reg.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Star size={14} color="var(--accent)" /> {activity.defaultPoints} Pts
                    </div>
                </div>

                {activity.attendanceLocked && (
                    <div style={{ marginTop: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Attendance Rate</span>
                            <span style={{ fontWeight: 700 }}>{pct}% ({present}/{activity.registrations.length})</span>
                        </div>
                        <div className="progress" style={{ height: 6 }}>
                            <div className="progress-bar" style={{ width: `${pct}%`, background: 'var(--success)' }} />
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
                <button className={`btn btn-sm ${activity.attendanceLocked ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={onAttendance} style={{ flex: 1 }}>
                    {activity.attendanceLocked ? 'View Attendance' : 'Take Attendance'}
                </button>
                {activity.attendanceLocked && (
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={onDownload} title="Download Excel">
                        <Download size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Events;

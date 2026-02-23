import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext.jsx';
import { CheckCircle, ArrowLeft, Download, AlertTriangle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { exportAttendanceReport } from '../../utils/exportUtils.js';

const AttendanceManager = () => {
    const { eventId } = useParams();
    const { activities, finalizeAttendance } = useDataContext();
    const navigate = useNavigate();

    const activity = activities.find(a => a.id === eventId);
    const [attendance, setAttendance] = useState({});
    const [confirmFinalize, setConfirmFinalize] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (activity) {
            const map = {};
            activity.registrations.forEach(r => { map[r.studentId] = r.attended; });
            setAttendance(map);
            setSelectAll(activity.registrations.every(r => r.attended));
        }
    }, [activity]);

    if (!activity) {
        return (
            <div className="animate-fade-in">
                <EmptyState icon="🔍" title="Event not found" message="This event does not exist or was deleted."
                    action={<button className="btn btn-primary" onClick={() => navigate('/admin')}>Back to Dashboard</button>} />
            </div>
        );
    }

    const toggle = (studentId) => {
        if (activity.attendanceLocked) return;
        setAttendance(p => ({ ...p, [studentId]: !p[studentId] }));
    };

    const toggleAll = () => {
        if (activity.attendanceLocked) return;
        const newVal = !selectAll;
        setSelectAll(newVal);
        const map = {};
        activity.registrations.forEach(r => { map[r.studentId] = newVal; });
        setAttendance(map);
    };

    const handleFinalize = async () => {
        setConfirmFinalize(false);
        const result = await finalizeAttendance(activity.id, attendance);
        if (result.success) {
            toast.success('Attendance finalized and locked! Points have been awarded. 🏆');
            setTimeout(() => navigate('/admin'), 1500);
        } else {
            toast.error(result.error);
        }
    };



    const handleDownload = () => {
        exportAttendanceReport(activity);
        toast.success('Report downloaded!');
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const total = activity.registrations.length;
    const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    return (
        <div className="page-content">
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin')} style={{ marginBottom: '1rem' }}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className={`event-type-tag event-type-${activity.type}`}>{activity.type}</span>
                            {activity.attendanceLocked && <span className="badge badge-success"><CheckCircle size={11} /> Attendance Finalized</span>}
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{activity.name}</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                            {activity.date} at {activity.time} • {activity.venue}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {activity.attendanceLocked && (
                            <button className="btn btn-secondary" onClick={handleDownload}>
                                <Download size={16} /> Download Report
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Registered', value: total, emoji: '👥', color: '#6366f1' },
                    { label: 'Present', value: presentCount, emoji: '✅', color: '#10b981' },
                    { label: 'Absent', value: total - presentCount, emoji: '❌', color: '#ef4444' },
                    { label: 'Points Each', value: activity.defaultPoints, emoji: '🏆', color: '#f59e0b' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{s.emoji}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Progress */}
            {total > 0 && (
                <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>Attendance Progress</span>
                        <span style={{ color: 'var(--text-muted)' }}>{presentCount}/{total} ({pct}%)</span>
                    </div>
                    <div className="progress">
                        <div className="progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                </div>
            )}

            {/* Attendance list */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>
                        <Users size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                        Registered Students ({total})
                    </h3>
                    {!activity.attendanceLocked && total > 0 && (
                        <label className="checkbox-wrap" style={{ cursor: 'pointer' }}>
                            <input type="checkbox" checked={selectAll} onChange={toggleAll} aria-label="Select all" />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Select All Present</span>
                        </label>
                    )}
                </div>

                {total === 0 ? (
                    <EmptyState icon="👤" title="No students registered" message="No students have registered for this event yet." />
                ) : (
                    <div>
                        {activity.registrations.map((reg, i) => (
                            <div
                                key={reg.studentId}
                                className="attendance-row"
                                style={{ background: i % 2 === 0 ? 'var(--bg-secondary)' : 'transparent' }}
                                onClick={() => toggle(reg.studentId)}
                            >
                                <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem', flexShrink: 0 }}>
                                    {(reg.studentName || reg.name || 'S')[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{reg.studentName || reg.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{reg.studentId}</div>
                                </div>
                                {activity.attendanceLocked ? (
                                    <span className={`badge ${reg.attended ? 'badge-success' : 'badge-danger'}`}>
                                        {reg.attended ? '✅ Present' : '❌ Absent'}
                                    </span>
                                ) : (
                                    <label className="checkbox-wrap" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={attendance[reg.studentId] || false}
                                            onChange={() => toggle(reg.studentId)}
                                            aria-label={`Mark ${reg.studentName} present`}
                                        />
                                        <span style={{ fontSize: '0.875rem' }}>{attendance[reg.studentId] ? 'Present' : 'Absent'}</span>
                                    </label>
                                )}
                                {attendance[reg.studentId] && !activity.attendanceLocked && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>+{activity.defaultPoints} pts</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Finalize button */}
            {!activity.attendanceLocked && total > 0 && (
                <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#fffbeb', border: '1px solid #fcd34d' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', flexWrap: 'wrap' }}>
                        <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600, color: '#92400e', margin: '0 0 0.25rem' }}>Ready to finalize?</p>
                            <p style={{ fontSize: '0.85rem', color: '#b45309', margin: 0 }}>
                                Once finalized, attendance is <strong>permanently locked</strong> and <strong>{presentCount} student{presentCount !== 1 ? 's' : ''}</strong> will each be awarded <strong>{activity.defaultPoints} points</strong>.
                            </p>
                        </div>
                        <button className="btn btn-success" onClick={() => setConfirmFinalize(true)}>
                            <CheckCircle size={16} /> Finalize Attendance
                        </button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmFinalize}
                onClose={() => setConfirmFinalize(false)}
                onConfirm={handleFinalize}
                title="Finalize Attendance"
                message={`Finalize attendance for "${activity.name}"? ${presentCount} student(s) will earn ${activity.defaultPoints} points each. Attendance will be locked.`}
                confirmText="Yes, Finalize"
            />


        </div>
    );
};

export default AttendanceManager;

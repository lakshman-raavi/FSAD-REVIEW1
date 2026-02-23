import { useDataContext } from '../../context/DataContext.jsx';
import { FileText, Download, PieChart, Users, Calendar, Filter } from 'lucide-react';
import { exportAttendanceReport } from '../../utils/exportUtils.js';
import toast from 'react-hot-toast';

const Reports = () => {
    const { activities, users } = useDataContext();
    const lockedEvents = activities.filter(a => a.attendanceLocked);

    const handleDownload = (event) => {
        exportAttendanceReport(event);
        toast.success(`Report for ${event.name} downloaded!`);
    };

    const stats = [
        { label: 'Exportable Events', value: lockedEvents.length, icon: <Calendar size={20} />, color: '#6366f1' },
        { label: 'Total Attendees', value: lockedEvents.reduce((s, a) => s + a.registrations.filter(r => r.attended).length, 0), icon: <Users size={20} />, color: '#10b981' },
        { label: 'Avg. Attendance', value: lockedEvents.length ? Math.round(lockedEvents.reduce((s, a) => s + (a.registrations.filter(r => r.attended).length / a.registrations.length * 100), 0) / lockedEvents.length) + '%' : '0%', icon: <PieChart size={20} />, color: '#f59e0b' }
    ];

    return (
        <div className="animate-slide-up">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Reports & Exports</h2>
                <p style={{ color: 'var(--text-muted)' }}>Generate and download event analytics and attendance data.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Event Attendance Reports</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-ghost btn-sm" style={{ gap: '0.5rem' }}><Filter size={14} /> Filter</button>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.01)' }}>
                                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>Event Name</th>
                                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
                                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>Attendees</th>
                                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map(event => (
                                <tr key={event.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>{event.name}</td>
                                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{event.date}</td>
                                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem' }}>
                                        {event.attendanceLocked
                                            ? `${event.registrations.filter(r => r.attended).length} / ${event.registrations.length}`
                                            : `${event.registrations.length} Registered`}
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        {event.attendanceLocked
                                            ? <span className="badge badge-success">Finalized</span>
                                            : <span className="badge badge-warning">Pending</span>}
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                        <button
                                            className={`btn btn-sm ${event.attendanceLocked ? 'btn-primary' : 'btn-disabled'}`}
                                            disabled={!event.attendanceLocked}
                                            onClick={() => handleDownload(event)}
                                            style={{ gap: '0.5rem' }}
                                        >
                                            <Download size={14} /> XLSX
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {activities.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No events found to generate reports.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;

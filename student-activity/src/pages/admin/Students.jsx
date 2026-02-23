import { useDataContext } from '../../context/DataContext.jsx';
import { Users, Mail, GraduationCap, Award, Search, Filter, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const Students = () => {
    const { users, activities } = useDataContext();
    const [search, setSearch] = useState('');
    const students = users.filter(u => u.role === 'student');

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const getPoints = (studentId) => {
        let points = 0;
        activities.forEach(a => {
            if (a.attendanceLocked) {
                const reg = a.registrations.find(r => r.studentId === studentId);
                if (reg && reg.attended) points += a.defaultPoints;
            }
        });
        return points;
    };

    const getBadge = (points) => {
        if (points >= 150) return { label: 'Gold', color: '#f59e0b' };
        if (points >= 100) return { label: 'Silver', color: '#94a3b8' };
        if (points >= 50) return { label: 'Bronze', color: '#b45309' };
        return { label: 'None', color: 'var(--text-muted)' };
    };

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Student Directory</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage and view student participation records.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="search-bar" style={{ minWidth: 300 }}>
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            placeholder="Search by name, ID or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Student ID</th>
                                <th>Email</th>
                                <th>Participation</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => {
                                const points = getPoints(s.studentId);
                                const badge = getBadge(points);
                                return (
                                    <tr key={s.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div style={{ fontWeight: 600 }}>{s.name}</div>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.studentId}</td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.email}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{points} pts</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {activities.filter(a => a.registrations.some(r => r.studentId === s.studentId && r.attended)).length} events attended
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge" style={{ backgroundColor: `${badge.color}15`, color: badge.color }}>
                                                {badge.label} Badge
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="btn btn-ghost btn-icon">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '4rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👥</div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No students found</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try adjusting your search query</div>
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

export default Students;

import { useMemo } from 'react';
import { useDataContext } from '../../context/DataContext.jsx';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, Area, AreaChart
} from 'recharts';
import EmptyState from '../../components/EmptyState.jsx';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', fontSize: '0.85rem', boxShadow: 'var(--shadow)' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</p>
            {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}{p.name === 'pct' ? '%' : ''}</p>)}
        </div>
    );
};

const AnalyticsDashboard = ({ isInternal = false }) => {

    if (activities.length === 0) {
        return <div className={isInternal ? "" : "page-content"}><EmptyState icon="📊" title="No data yet" message="Create some events to see analytics." /></div>;
    }

    return (
        <div className={isInternal ? "" : "page-content"} style={{ padding: isInternal ? 0 : undefined }}>
            {!isInternal && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Analytics Dashboard</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Visual insights across all events and attendance</p>
                </div>
            )}

            {!isInternal && (
                /* Summary KPIs - Only show if not internal, or optionally deduplicate */
                <div className="kpi-grid" style={{ marginBottom: '2rem' }}>
                    {[
                        { label: 'Finalized Events', value: kpis.locked, icon: '🔒', color: '#6366f1', bg: '#ede9fe' },
                        { label: 'Total Attended', value: kpis.totalAttended, icon: '✅', color: '#10b981', bg: '#d1fae5' },
                        { label: 'Avg Attendance %', value: `${kpis.avgPct}%`, icon: '📈', color: '#06b6d4', bg: '#e0f7fa' },
                        { label: 'Points Distributed', value: kpis.totalPoints.toLocaleString(), icon: '🏆', color: '#f59e0b', bg: '#fef3c7' },
                    ].map(k => (
                        <div key={k.label} className="kpi-card">
                            <div className="kpi-icon" style={{ background: k.bg, color: k.color }}><span style={{ fontSize: '1.4rem' }}>{k.icon}</span></div>
                            <div className="kpi-value">{k.value}</div>
                            <div className="kpi-label">{k.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Charts grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Events per month */}
                <div className="chart-card">
                    <h3>Events Per Month</h3>
                    {eventsByMonth.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={eventsByMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Events" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <EmptyState icon="📅" title="No events yet" message="" />}
                </div>

                {/* Activity type distribution */}
                <div className="chart-card">
                    <h3>Events by Type</h3>
                    {typeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={typeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <EmptyState icon="🥧" title="No data" message="" />}
                </div>
            </div>

            {/* Attendance per event */}
            {attendanceData.length > 0 && (
                <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
                    <h3>Attendance % per Event (Finalized Only)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={attendanceData} layout="vertical" margin={{ left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={v => `${v}%`} />
                            <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                            <Tooltip formatter={(v, n) => [`${v}%`, 'Attendance']} />
                            <Bar dataKey="pct" radius={[0, 4, 4, 0]} name="pct">
                                {attendanceData.map((d, i) => (
                                    <Cell key={i} fill={d.pct >= 70 ? '#10b981' : d.pct >= 40 ? '#f59e0b' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Points distributed */}
            {pointsData.length > 0 && (
                <div className="chart-card">
                    <h3>Points Distributed per Event</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={pointsData}>
                            <defs>
                                <linearGradient id="pointsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="points" stroke="#6366f1" fill="url(#pointsGrad)" strokeWidth={2} name="Points" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Attendance progress bars per event */}
            {attendanceData.length > 0 && (
                <div className="card" style={{ marginTop: '1.5rem' }}>
                    <div className="card-header"><h3 style={{ margin: 0, fontSize: '1rem' }}>Attendance Completion</h3></div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {attendanceData.map((d, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 500 }}>
                                    <span>{d.name}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{d.present}/{d.total} • {d.pct}%</span>
                                </div>
                                <div className="progress" style={{ height: 10 }}>
                                    <div className={`progress-bar ${d.pct >= 70 ? 'success' : d.pct >= 40 ? 'warning' : 'danger'}`}
                                        style={{ width: `${d.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;

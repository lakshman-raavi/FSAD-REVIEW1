import React from 'react';

const KPICard = ({ label, value, icon, color, trend, loading = false }) => {
    if (loading) {
        return (
            <div className="card kpi-card" style={{ padding: '1.5rem', minHeight: '140px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--border-radius-sm)' }} />
                    <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 'var(--border-radius-full)' }} />
                </div>
                <div className="skeleton skeleton-title" style={{ width: '50%' }} />
                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            </div>
        );
    }

    return (
        <div className="card kpi-card" style={{ height: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    backgroundColor: `${color}15`, color: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem'
                }}>
                    {icon}
                </div>
                {trend && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        color: trend > 0 ? 'var(--success)' : 'var(--danger)',
                        fontSize: '0.8rem', fontWeight: 700,
                        padding: '0.25rem 0.5rem', borderRadius: '99px', background: trend > 0 ? '#10b98115' : '#ef444415'
                    }}>
                        {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
            </div>
        </div>
    );
};

export default KPICard;

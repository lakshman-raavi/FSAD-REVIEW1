import { Settings as SettingsIcon, Shield, Bell, Palette, Globe } from 'lucide-react';

const Settings = () => {
    const sections = [
        { title: 'General', icon: <Globe size={20} />, desc: 'System-wide configurations and preferences.' },
        { title: 'Security', icon: <Shield size={20} />, desc: 'Manage passwords, role permissions, and access logs.' },
        { title: 'Notifications', icon: <Bell size={20} />, desc: 'Configure email and system alert triggers.' },
        { title: 'Appearance', icon: <Palette size={20} />, desc: 'Customize dashboard themes and branding color.' }
    ];

    return (
        <div className="animate-slide-up">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Settings</h2>
                <p style={{ color: 'var(--text-muted)' }}>Configure your Admin Portal environment.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {sections.map(s => (
                    <div key={s.title} className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ padding: '0.75rem', borderRadius: 12, background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                                {s.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{s.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center', background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
                <SettingsIcon size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ margin: '0 0 0.5rem' }}>Advanced Settings Coming Soon</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
                    We are working on bringing more granular controls to your administrator experience.
                </p>
            </div>
        </div>
    );
};

export default Settings;

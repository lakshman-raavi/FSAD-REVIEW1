import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Zap, Activity, CheckSquare, Award, FileSpreadsheet, BarChart3,
    ArrowRight, ChevronDown, X, Users, Shield, Smartphone, Clock
} from 'lucide-react';

const features = [
    { icon: <Activity size={24} />, title: 'Activity Management', desc: 'Create and manage clubs, sports, and events with ease. Full CRUD with instant updates.', color: '#6366f1' },
    { icon: <CheckSquare size={24} />, title: 'Attendance Tracking', desc: 'One-time attendance marking with lock mechanism to prevent edits after finalization.', color: '#06b6d4' },
    { icon: <Award size={24} />, title: 'Points & Badges', desc: 'Gamified experience with Bronze, Silver, Gold badges based on total points earned.', color: '#f59e0b' },
    { icon: <FileSpreadsheet size={24} />, title: 'Excel Reports', desc: 'Export detailed attendance reports as .xlsx files with separate sheets for present/absent.', color: '#10b981' },
    { icon: <BarChart3 size={24} />, title: 'Analytics Dashboard', desc: 'Visual charts for attendance rates, event counts per month, and points distribution.', color: '#ef4444' },
    { icon: <Smartphone size={24} />, title: 'Mobile-First Design', desc: 'Fully responsive layout with bottom navigation for students on mobile devices.', color: '#8b5cf6' },
];

const steps = [
    { num: '01', title: 'Create Events', desc: 'Admins set up events with name, date, venue, type, and default points per attendance.', icon: <Zap size={28} /> },
    { num: '02', title: 'Students Register', desc: 'Students browse upcoming events and register with a single click from any device.', icon: <Users size={28} /> },
    { num: '03', title: 'Track & Export', desc: 'Mark attendance, finalize it with a lock, then export the full report as Excel.', icon: <FileSpreadsheet size={28} /> },
];

const benefits = [
    { icon: <Clock size={22} />, title: 'Saves Admin Time', desc: 'Automated points, instant exports, and bulk attendance reduce manual work by 80%.', color: '#6366f1' },
    { icon: <Shield size={22} />, title: 'Transparent Tracking', desc: 'Students see their own attendance history, points earned, and badge progress in real time.', color: '#10b981' },
    { icon: <Smartphone size={22} />, title: 'Works Everywhere', desc: 'Mobile-optimized with bottom nav, responsive tables, and sticky controls on all screen sizes.', color: '#f59e0b' },
];

const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.12 }
        );
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

const LandingPage = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useScrollReveal();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    const handleRole = (role) => { setModalOpen(false); navigate(`/login?role=${role}`); };

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Navbar */}
            <nav className="landing-nav" style={{ background: scrolled ? 'rgba(15,15,35,0.95)' : 'rgba(15,15,35,0.75)' }}>
                <div className="landing-nav-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={16} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>Activity<span style={{ color: '#06b6d4' }}>Hub</span></span>
                    </div>

                    <div className="landing-nav-links">
                        <a href="#features" onClick={e => { e.preventDefault(); scrollTo('features'); }}>Features</a>
                        <a href="#how-it-works" onClick={e => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a>
                        <a href="#benefits" onClick={e => { e.preventDefault(); scrollTo('benefits'); }}>Benefits</a>
                        <a href="#" onClick={e => { e.preventDefault(); navigate('/login?role=admin'); }} style={{ color: 'rgba(255,255,255,0.75)' }}>Login</a>
                    </div>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setModalOpen(true)}
                        style={{ fontSize: '0.875rem', borderRadius: 8 }}
                    >
                        Get Started <ArrowRight size={14} />
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--gradient-hero)',
                backgroundSize: '400% 400%', animation: 'gradientShift 12s ease infinite',
                position: 'relative', overflow: 'hidden', padding: '6rem 2rem 4rem',
            }}>
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: '15%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(6,182,212,0.1)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />

                <div style={{ textAlign: 'center', maxWidth: 800, position: 'relative', zIndex: 1 }}>
                    <div className="animate-fade-in" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                        borderRadius: 100, padding: '0.35rem 1rem', marginBottom: '1.5rem',
                    }}>
                        <Zap size={14} color="#a5b4fc" />
                        <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>Student Activity Platform</span>
                    </div>

                    <h1 className="animate-slide-up" style={{ color: 'white', marginBottom: '1.25rem', lineHeight: 1.1 }}>
                        Manage Student Activities{' '}
                        <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Smarter
                        </span>
                    </h1>

                    <p className="animate-slide-up" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem', lineHeight: 1.7, animationDelay: '0.1s' }}>
                        The all-in-one platform for tracking attendance, awarding points,<br className="hide-mobile" />
                        and exporting reports — for admins and students alike.
                    </p>

                    <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.2s' }}>
                        <button className="btn btn-primary btn-lg" onClick={() => setModalOpen(true)}>
                            Get Started <ArrowRight size={18} />
                        </button>
                        <button
                            className="btn btn-lg"
                            onClick={() => scrollTo('features')}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                        >
                            View Features <ChevronDown size={18} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap', animationDelay: '0.4s' }}>
                        {[['1000+', 'Students'], ['50+', 'Events'], ['95%', 'Satisfaction']].map(([val, label]) => (
                            <div key={label} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{val}</div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{ padding: '6rem 2rem', background: 'var(--bg-primary)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div className="badge badge-primary" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>Features</div>
                        <h2>Everything You Need</h2>
                        <p style={{ maxWidth: 500, margin: '0.75rem auto 0' }}>Powerful tools for admins and a seamless experience for students.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {features.map((f, i) => (
                            <div key={f.title} className={`card card-interactive reveal reveal-delay-${(i % 4) + 1}`} style={{ padding: '1.75rem' }}>
                                <div style={{ width: 52, height: 52, borderRadius: 12, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: f.color }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{f.title}</h3>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" style={{ padding: '6rem 2rem', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div className="badge badge-info" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>Process</div>
                        <h2>How It Works</h2>
                        <p style={{ maxWidth: 480, margin: '0.75rem auto 0' }}>Simple 3-step workflow that anyone can follow from day one.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                        {steps.map((s, i) => (
                            <div key={s.num} className={`reveal reveal-delay-${i + 1}`} style={{ textAlign: 'center', position: 'relative' }}>
                                {i < steps.length - 1 && (
                                    <div style={{ position: 'absolute', top: 32, left: '75%', right: '-25%', height: 2, background: 'var(--border)', display: 'none' }} className="step-connector" />
                                )}
                                <div style={{
                                    width: 64, height: 64, borderRadius: '50%',
                                    background: 'var(--gradient-primary)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                                }}>
                                    {s.icon}
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem', letterSpacing: '0.06em' }}>STEP {s.num}</div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section id="benefits" style={{ padding: '6rem 2rem', background: 'var(--bg-primary)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div className="badge badge-success" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>Benefits</div>
                        <h2>Why ActivityHub?</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {benefits.map((b, i) => (
                            <div key={b.title} className={`card reveal reveal-delay-${i + 1}`} style={{ padding: '2rem', borderTop: `3px solid ${b.color}` }}>
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: b.color }}>
                                    {b.icon}
                                </div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{b.title}</h3>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '6rem 2rem', background: 'var(--gradient-hero)' }}>
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                    <div className="reveal">
                        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Get Started?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                            Join as an admin to manage events, or sign up as a student to start earning points.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                className="btn btn-lg"
                                onClick={() => navigate('/login?role=admin')}
                                style={{ background: 'white', color: '#1e1b4b', fontWeight: 700, fontSize: '0.95rem' }}
                            >
                                <Shield size={18} /> Get Started as Admin
                            </button>
                            <button
                                className="btn btn-lg"
                                onClick={() => navigate('/login?role=student')}
                                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', fontSize: '0.95rem' }}
                            >
                                <Users size={18} /> Join as Student
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#0a0a1a', padding: '1.5rem 2rem', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>
                    © 2026 ActivityHub • Student Activity Platform • Built with React + Vite
                </p>
            </footer>

            {/* Role Selection Modal */}
            {modalOpen && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
                    <div className="modal modal-sm animate-scale-in">
                        <div className="modal-header">
                            <h2>Choose Your Role</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setModalOpen(false)}><X size={18} /></button>
                        </div>
                        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                                How would you like to use ActivityHub?
                            </p>
                            <button
                                onClick={() => handleRole('admin')}
                                style={{
                                    padding: '1.5rem', border: '2px solid var(--border)', borderRadius: 12,
                                    background: 'var(--bg-secondary)', cursor: 'pointer', textAlign: 'left',
                                    transition: 'all 0.2s', fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Shield size={22} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Admin</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Create events, track attendance, export reports</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleRole('student')}
                                style={{
                                    padding: '1.5rem', border: '2px solid var(--border)', borderRadius: 12,
                                    background: 'var(--bg-secondary)', cursor: 'pointer', textAlign: 'left',
                                    transition: 'all 0.2s', fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--secondary)'; e.currentTarget.style.background = '#e0f7fa'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Users size={22} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Student</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Register for events, track points, earn badges</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;

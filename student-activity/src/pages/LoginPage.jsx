import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Zap, Eye, EyeOff, ArrowLeft, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Captcha from '../components/Captcha.jsx';
import { useRef } from 'react';

const LoginPage = () => {
    const { login, register, user } = useAuthContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'student';
    const [tab, setTab] = useState(role); // 'admin' | 'student'
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const [adminForm, setAdminForm] = useState({ username: '', password: '' });
    const [studentForm, setStudentForm] = useState({ studentId: '', password: '' });
    const [regForm, setRegForm] = useState({ studentId: '', name: '', email: '', password: '', confirmPassword: '' });

    const adminCaptchaRef = useRef();
    const studentCaptchaRef = useRef();
    const regCaptchaRef = useRef();

    // Disabled auto-redirect per user request to ensure credential login
    // useEffect(() => {
    //     if (user) navigate(user.role === 'admin' ? '/admin' : '/student', { replace: true });
    // }, [user, navigate]);

    useEffect(() => { setTab(role); }, [role]);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (!adminCaptchaRef.current?.validate()) {
            toast.error('Invalid CAPTCHA');
            return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 400));
        const result = await login(adminForm, 'admin');
        setLoading(false);
        if (result.success) { toast.success('Welcome back, Admin!'); navigate('/admin'); }
        else toast.error(result.error);
    };

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        if (!studentCaptchaRef.current?.validate()) {
            toast.error('Invalid CAPTCHA');
            return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 400));
        const result = await login(studentForm, 'student');
        setLoading(false);
        if (result.success) { toast.success(`Welcome back, ${result.user.name}!`); navigate('/student'); }
        else toast.error(result.error);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (regForm.password !== regForm.confirmPassword) { toast.error('Passwords do not match'); return; }
        if (regForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        if (!regCaptchaRef.current?.validate()) {
            toast.error('Invalid CAPTCHA');
            return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 400));
        const result = await register(regForm);
        setLoading(false);
        if (result.success) { toast.success('Account created! Welcome to ActivityHub 🎉'); navigate('/student'); }
        else toast.error(result.error);
    };

    const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'white', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gradient-hero)' }}>
            {/* Left panel */}
            <div style={{ flex: 1, maxWidth: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', position: 'relative' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '3rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={22} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>Activity<span style={{ color: '#67e8f9' }}>Hub</span></span>
                </div>

                {/* Role tabs */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.3rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {[['admin', <Shield size={15} />, 'Admin'], ['student', <Users size={15} />, 'Student']].map(([r, icon, label]) => (
                        <button key={r} onClick={() => { setTab(r); setMode('login'); }}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                padding: '0.6rem', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 600,
                                fontSize: '0.875rem', fontFamily: 'inherit', transition: 'all 0.2s',
                                background: tab === r ? 'rgba(255,255,255,0.15)' : 'transparent',
                                color: tab === r ? 'white' : 'rgba(255,255,255,0.5)',
                            }}>
                            {icon} {label}
                        </button>
                    ))}
                </div>


                {/* Admin form */}
                {tab === 'admin' && (
                    <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>Username</label>
                            <input style={inputStyle} type="text" placeholder="admin"
                                value={adminForm.username} onChange={e => setAdminForm(p => ({ ...p, username: e.target.value }))}
                                required autoFocus
                                onFocus={e => e.target.style.borderColor = '#818cf8'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input style={{ ...inputStyle, paddingRight: '2.75rem' }} type={showPw ? 'text' : 'password'} placeholder="admin123"
                                    value={adminForm.password} onChange={e => setAdminForm(p => ({ ...p, password: e.target.value }))}
                                    required
                                    onFocus={e => e.target.style.borderColor = '#818cf8'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                                />
                                <button type="button" onClick={() => setShowPw(p => !p)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4 }}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                            💡 Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
                        </div>
                        <Captcha ref={adminCaptchaRef} />
                        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
                            {loading ? <span className="spinner" /> : 'Sign In as Admin'}
                        </button>
                    </form>
                )}

                {/* Student forms */}
                {tab === 'student' && mode === 'login' && (
                    <form onSubmit={handleStudentLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>Student ID or Email</label>
                            <input style={inputStyle} type="text" placeholder="e.g. STU001 or alice@university.edu"
                                value={studentForm.studentId} onChange={e => setStudentForm(p => ({ ...p, studentId: e.target.value }))}
                                required autoFocus
                                onFocus={e => e.target.style.borderColor = '#67e8f9'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input style={{ ...inputStyle, paddingRight: '2.75rem' }} type={showPw ? 'text' : 'password'} placeholder="Your password"
                                    value={studentForm.password} onChange={e => setStudentForm(p => ({ ...p, password: e.target.value }))}
                                    required
                                    onFocus={e => e.target.style.borderColor = '#67e8f9'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                                />
                                <button type="button" onClick={() => setShowPw(p => !p)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4 }}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 8, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                            💡 Demo: <strong>STU001</strong> / <strong>student123</strong>
                        </div>
                        <Captcha ref={studentCaptchaRef} />
                        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
                            {loading ? <span className="spinner" /> : 'Sign In as Student'}
                        </button>
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>
                            No account?{' '}
                            <button type="button" onClick={() => setMode('register')}
                                style={{ background: 'none', border: 'none', color: '#67e8f9', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>
                                Register here
                            </button>
                        </p>
                    </form>
                )}

                {tab === 'student' && mode === 'register' && (
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '0.25rem' }}>Create your account</h3>
                        {[
                            { label: 'Student ID', key: 'studentId', placeholder: 'e.g. STU006', type: 'text' },
                            { label: 'Full Name', key: 'name', placeholder: 'Your full name', type: 'text' },
                            { label: 'Email', key: 'email', placeholder: 'your@university.edu', type: 'email' },
                            { label: 'Password', key: 'password', placeholder: 'Min. 6 characters', type: 'password' },
                            { label: 'Confirm Password', key: 'confirmPassword', placeholder: 'Repeat password', type: 'password' },
                        ].map(field => (
                            <div key={field.key}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>{field.label}</label>
                                <input style={inputStyle} type={field.type} placeholder={field.placeholder}
                                    value={regForm[field.key]} onChange={e => setRegForm(p => ({ ...p, [field.key]: e.target.value }))}
                                    required
                                    onFocus={e => e.target.style.borderColor = '#67e8f9'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                                />
                            </div>
                        ))}
                        <Captcha ref={regCaptchaRef} />
                        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: '0.25rem' }}>
                            {loading ? <span className="spinner" /> : 'Create Account'}
                        </button>
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>
                            Already have an account?{' '}
                            <button type="button" onClick={() => setMode('login')}
                                style={{ background: 'none', border: 'none', color: '#67e8f9', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>
                                Sign in
                            </button>
                        </p>
                    </form>
                )}
            </div>

            {/* Right decorative panel */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }} className="hide-on-mobile">
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'bounce 3s ease-in-out infinite' }}>🎓</div>
                    <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem' }}>Your Campus<br />Activity Hub</h2>
                    <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 340, lineHeight: 1.7 }}>
                        Track events, earn points, collect badges, and stay connected with your campus community.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                        {['🏆 Points', '🎖️ Badges', '📅 Events', '📊 Reports'].map(f => (
                            <div key={f} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: 100, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' }}>{f}</div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) { .hide-on-mobile { display: none !important; } }
      `}</style>
        </div>
    );
};

export default LoginPage;

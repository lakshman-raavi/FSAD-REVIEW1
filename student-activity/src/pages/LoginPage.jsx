import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Zap, Eye, EyeOff, ArrowLeft, Shield, Users, Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Captcha from '../components/Captcha.jsx';

const InputField = ({ label, icon: Icon, type, value, onChange, placeholder, showEye, onEyeClick, id }) => (
    <div style={{ marginBottom: '1.25rem' }}>
        <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '0.5rem',
            marginLeft: '4px'
        }}>
            {label}
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{
                position: 'absolute',
                left: '12px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 10
            }}>
                <Icon size={18} />
            </div>
            <input
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#1e293b',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'inherit',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className="saas-input"
            />
            {showEye !== undefined && (
                <button
                    type="button"
                    onClick={onEyeClick}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        zIndex: 10
                    }}
                >
                    {showEye ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    </div>
);

const LoginPage = () => {
    const { login, register } = useAuthContext();
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

    useEffect(() => { setTab(role); }, [role]);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (!adminCaptchaRef.current?.validate()) {
            toast.error('Invalid CAPTCHA');
            return;
        }
        setLoading(true);
        const result = await login(adminForm, 'admin');
        setLoading(false);
        if (result.success) {
            toast.success('Welcome back, Administrator');
            navigate('/admin');
        } else {
            toast.error(result.error);
        }
    };

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        if (!studentCaptchaRef.current?.validate()) {
            toast.error('Invalid CAPTCHA');
            return;
        }
        setLoading(true);
        const result = await login(studentForm, 'student');
        setLoading(false);
        if (result.success) {
            toast.success(`Welcome back, ${result.user.name}`);
            navigate('/student');
        } else {
            toast.error(result.error);
        }
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
        const result = await register(regForm);
        setLoading(false);
        if (result.success) {
            toast.success('Account created successfully! 🎉');
            navigate('/student');
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem'
        }}>
            {/* Ambient Background Elements */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
                {/* Logo & Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none',
                        marginBottom: '1.5rem',
                        animation: 'float 6s ease-in-out infinite'
                    }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 15px -3px rgba(79,70,229,0.3)'
                        }}>
                            <Zap size={26} color="white" fill="white" />
                        </div>
                        <span style={{
                            fontSize: '1.85rem',
                            fontWeight: 900,
                            color: '#0f172a',
                            letterSpacing: '-0.025em'
                        }}>
                            Activity<span style={{ color: '#0ea5e9' }}>Hub</span>
                        </span>
                    </Link>
                    <h1 style={{ color: '#0f172a', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
                        {mode === 'login' ? 'Welcome back' : 'Create an account'}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.05rem', fontWeight: 500 }}>
                        {mode === 'login' ? 'Enter your credentials to access your dashboard' : 'Join our community and start tracking your activities'}
                    </p>
                </div>

                <div className="card" style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '28px',
                    padding: '2.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)'
                }}>
                    {/* Role Toggles */}
                    {mode === 'login' && (
                        <div style={{
                            display: 'flex',
                            background: '#f8fafc',
                            borderRadius: '16px',
                            padding: '4px',
                            marginBottom: '2.25rem',
                            border: '1.5px solid #e2e8f0'
                        }}>
                            {[
                                { id: 'student', label: 'Student', icon: <Users size={16} /> },
                                { id: 'admin', label: 'Admin', icon: <Shield size={16} /> }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: tab === t.id ? '#ffffff' : 'transparent',
                                        color: tab === t.id ? '#4f46e5' : '#64748b',
                                        boxShadow: tab === t.id ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                    className="role-toggle"
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Forms */}
                    {tab === 'admin' ? (
                        <form onSubmit={handleAdminLogin}>
                            <InputField
                                label="Admin Username"
                                icon={User}
                                type="text"
                                placeholder="Username"
                                value={adminForm.username}
                                onChange={e => setAdminForm(p => ({ ...p, username: e.target.value }))}
                                id="admin-username"
                            />
                            <InputField
                                label="Password"
                                icon={Lock}
                                type={showPw ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={adminForm.password}
                                onChange={e => setAdminForm(p => ({ ...p, password: e.target.value }))}
                                showEye={showPw}
                                onEyeClick={() => setShowPw(!showPw)}
                                id="admin-password"
                            />
                            <Captcha ref={adminCaptchaRef} theme="light-saas" />
                            <button type="submit" className="btn-full" disabled={loading} style={{
                                marginTop: '1.75rem',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.25)'
                            }}>
                                {loading ? <span className="spinner" /> : 'Sign in as Admin'}
                            </button>
                        </form>
                    ) : mode === 'login' ? (
                        <form onSubmit={handleStudentLogin}>
                            <InputField
                                label="Student ID / Email"
                                icon={Mail}
                                type="text"
                                placeholder="ID or Email"
                                value={studentForm.studentId}
                                onChange={e => setStudentForm(p => ({ ...p, studentId: e.target.value }))}
                                id="student-id"
                            />
                            <InputField
                                label="Password"
                                icon={Lock}
                                type={showPw ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={studentForm.password}
                                onChange={e => setStudentForm(p => ({ ...p, password: e.target.value }))}
                                showEye={showPw}
                                onEyeClick={() => setShowPw(!showPw)}
                                id="student-password"
                            />
                            <Captcha ref={studentCaptchaRef} theme="light-saas" />
                            <button type="submit" className="btn-full" disabled={loading} style={{
                                marginTop: '1.75rem',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.25)'
                            }}>
                                {loading ? <span className="spinner" /> : 'Sign in as Student'}
                            </button>
                            <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>
                                Don't have an account? {' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('register')}
                                    style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                                >
                                    Register here
                                </button>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <InputField
                                label="Full Name"
                                icon={User}
                                type="text"
                                placeholder="Your Name"
                                value={regForm.name}
                                onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))}
                                id="reg-name"
                            />
                            <InputField
                                label="Student ID"
                                icon={Shield}
                                type="text"
                                placeholder="STU-000"
                                value={regForm.studentId}
                                onChange={e => setRegForm(p => ({ ...p, studentId: e.target.value }))}
                                id="reg-id"
                            />
                            <InputField
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="name@university.edu"
                                value={regForm.email}
                                onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                                id="reg-email"
                            />
                            <InputField
                                label="Password"
                                icon={Lock}
                                type="password"
                                placeholder="••••••••"
                                value={regForm.password}
                                onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                                id="reg-password"
                            />
                            <Captcha ref={regCaptchaRef} theme="light-saas" />
                            <button type="submit" className="btn-full" disabled={loading} style={{
                                marginTop: '1.75rem',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.25)'
                            }}>
                                {loading ? <span className="spinner" /> : 'Create Account'}
                            </button>
                            <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>
                                Already have an account? {' '}
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setMode('login'); }}
                                    style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                                >
                                    Sign in
                                </button>
                            </p>
                        </form>
                    )}
                </div>

                {/* Footer Links */}
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <Link to="/" style={{ color: '#64748b', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                        className="back-link"
                    >
                        <ArrowLeft size={16} /> Back to Landing Page
                    </Link>
                </div>
            </div>

            <style>{`
                .saas-input:focus {
                    background: #ffffff !important;
                    border-color: #4f46e5 !important;
                    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
                }
                .btn-full { width: 100%; display: flex; align-items: center; justify-content: center; height: 52px; font-size: 1rem; font-weight: 800; border: none; cursor: pointer; transition: all 0.2s; }
                .btn-full:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(79,70,229,0.3) !important; }
                .btn-full:active { transform: translateY(0); }
                .role-toggle:hover:not(:disabled) { background: #e2e8f0 !important; }
                .back-link:hover { color: #4f46e5 !important; transform: translateX(-4px); }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;

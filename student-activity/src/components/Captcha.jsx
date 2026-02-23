import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { RefreshCw } from 'lucide-react';

const Captcha = forwardRef(({ onVerify }, ref) => {
    const [captcha, setCaptcha] = useState('');
    const [userInput, setUserInput] = useState('');

    const generateCaptcha = () => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
        setUserInput('');
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    useImperativeHandle(ref, () => ({
        validate: () => {
            const isValid = userInput === captcha;
            if (!isValid) {
                generateCaptcha(); // Reset on failure
            }
            return isValid;
        },
        refresh: generateCaptcha
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    letterSpacing: '4px',
                    color: '#67e8f9',
                    fontStyle: 'italic',
                    textDecoration: 'line-through',
                    userSelect: 'none',
                    border: '1px solid rgba(103, 232, 249, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '20%', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.2)', transform: 'rotate(5deg)' }} />
                    <div style={{ position: 'absolute', top: '70%', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.2)', transform: 'rotate(-5deg)' }} />
                    {captcha}
                </div>
                <button
                    type="button"
                    onClick={generateCaptcha}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.5rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title="Refresh CAPTCHA"
                >
                    <RefreshCw size={18} />
                </button>
            </div>
            <input
                type="text"
                placeholder="Enter CAPTCHA"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    outline: 'none'
                }}
            />
        </div>
    );
});

export default Captcha;

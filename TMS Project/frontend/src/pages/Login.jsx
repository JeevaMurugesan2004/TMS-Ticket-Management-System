import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#0f172a',
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '3rem',
                background: 'white',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
                        color: 'white',
                        width: '64px',
                        height: '64px',
                        borderRadius: '1.25rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.4)'
                    }}>
                        <ShieldCheck size={36} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                        TMS <span className="text-primary">Portal</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', fontWeight: '500' }}>
                        Sign in to manage your tickets
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label style={{ fontWeight: '700', fontSize: '0.8125rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                style={{ background: '#f8fafc', paddingLeft: '3rem', border: '1px solid #e2e8f0' }}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-8">
                        <label style={{ fontWeight: '700', fontSize: '0.8125rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ background: '#f8fafc', paddingLeft: '3rem', border: '1px solid #e2e8f0' }}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center gap-2" style={{
                        padding: '1.25rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
                        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                    }}>
                        Authorize & Sign In <ArrowRight size={18} />
                    </button>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>
                            <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            SECURE ENTERPRISE ACCESS
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    LayoutDashboard,
    Clock,
    CheckCircle2,
    AlertCircle,
    PlusCircle,
    List,
    FileText,
    Settings,
    UserCircle,
    LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, closed: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/complaints/dashboard');
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
                        padding: '1rem',
                        borderRadius: '1.25rem',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                    }}>
                        <UserCircle size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', lineHeight: '1.2' }}>
                            Welcome back, <span className="text-primary">{user?.userName}</span>
                        </h1>
                        <p style={{ color: 'var(--secondary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: '#e2e8f0', padding: '0.125rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem' }}>{user?.role}</span>
                            • Ticket Management System
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {user?.role === 'superAdmin' && (
                        <Link to="/reports">
                            <button style={{ background: '#475569', boxShadow: 'none' }} className="flex items-center gap-2">
                                <FileText size={18} /> Reports
                            </button>
                        </Link>
                    )}
                    <button onClick={logout} style={{ background: 'var(--danger)', boxShadow: 'none' }} className="flex items-center gap-2">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Complaints', value: stats.total, icon: <LayoutDashboard size={24} />, color: '#6366f1' },
                    { label: 'Pending Tickets', value: stats.pending, icon: <Clock size={24} />, color: '#f59e0b' },
                    { label: 'Assigned', value: stats.assigned, icon: <AlertCircle size={24} />, color: '#8b5cf6' },
                    { label: 'Resolved', value: stats.closed, icon: <CheckCircle2 size={24} />, color: '#10b981' },
                ].map((item, idx) => (
                    <div key={idx} className="card" style={{
                        padding: '1.5rem',
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        background: '#fff'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            width: '80px',
                            height: '80px',
                            background: `${item.color}08`,
                            borderRadius: '50%'
                        }} />
                        <div className="flex justify-between items-start mb-4">
                            <div style={{ color: item.color, background: `${item.color}15`, padding: '0.95rem', borderRadius: '1rem' }}>
                                {item.icon}
                            </div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.25rem' }}>{item.value}</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div style={{ background: 'var(--success)', color: 'white', padding: '0.5rem', borderRadius: '0.75rem' }}><PlusCircle size={22} /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Quick Actions</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        {['user', 'Admin', 'superAdmin'].includes(user?.role) && (
                            <Link to="/raise-complaint">
                                <button className="flex items-center justify-center gap-2 w-full" style={{ background: 'var(--success)', padding: '0.75rem' }}>
                                    <PlusCircle size={20} /> Raise New Complaint
                                </button>
                            </Link>
                        )}
                        <Link to="/complaints">
                            <button className="flex items-center justify-center gap-2 w-full" style={{ background: 'white', color: 'var(--text)', border: '1px solid var(--border)', boxShadow: 'none', padding: '0.75rem' }}>
                                <List size={20} /> View All Complaints
                            </button>
                        </Link>
                    </div>
                </div>

                {user?.role === 'superAdmin' && (
                    <div className="card" style={{ borderTop: '4px solid #475569' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div style={{ background: '#475569', color: 'white', padding: '0.5rem', borderRadius: '0.75rem' }}><Settings size={22} /></div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>System Administration</h3>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border)' }} className="mb-6">
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: '1.5' }}>
                                Access master configurations for departments, programmes, roles, and user management.
                            </p>
                        </div>
                        <Link to="/master/department">
                            <button style={{ width: '100%', background: '#475569', padding: '0.75rem' }} className="flex items-center justify-center gap-2">
                                <Settings size={18} /> Go to Administrative Panel
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

import React from 'react';
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Building2,
    BookOpen,
    Warehouse,
    DoorOpen,
    ShieldCheck,
    LogOut,
    ChevronRight
} from 'lucide-react';

const MasterLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user || user.role !== 'superAdmin') return <Navigate to="/" />;

    const navItems = [
        { icon: <Building2 size={20} />, label: 'Departments', path: '/master/department' },
        { icon: <BookOpen size={20} />, label: 'Programmes', path: '/master/programme' },
        { icon: <Warehouse size={20} />, label: 'Blocks', path: '/master/block' },
        { icon: <DoorOpen size={20} />, label: 'Rooms', path: '/master/room' },
        { icon: <ShieldCheck size={20} />, label: 'Roles', path: '/master/role' },
        { icon: <Users size={20} />, label: 'Users', path: '/master/user' },
    ];

    return (
        <div className="flex" style={{ minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: '#0f172a',
                color: 'white',
                padding: '2.5rem 1.5rem',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '0 0.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '3rem'
                    }}>
                        <div style={{
                            background: 'var(--primary)',
                            padding: '0.5rem',
                            borderRadius: '0.75rem',
                            color: 'white'
                        }}>
                            <ShieldCheck size={24} />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.025em' }}>
                            TMS <span style={{ color: '#818cf8' }}>Admin</span>
                        </h1>
                    </div>

                    <nav>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li className="mb-2">
                                <Link to="/" style={{
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '0.75rem',
                                    transition: 'all 0.2s',
                                    fontWeight: '600',
                                    fontSize: '0.9375rem'
                                }}>
                                    <LayoutDashboard size={20} /> Dashboard
                                </Link>
                            </li>

                            <div style={{
                                fontSize: '0.75rem',
                                color: '#475569',
                                textTransform: 'uppercase',
                                fontWeight: '800',
                                letterSpacing: '0.05em',
                                margin: '2.5rem 0 1rem 1rem'
                            }}>Master Configuration</div>

                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                        <Link to={item.path} style={{
                                            color: isActive ? 'white' : '#94a3b8',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '0.75rem',
                                            padding: '0.875rem 1rem',
                                            borderRadius: '0.75rem',
                                            background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                                            transition: 'all 0.2s',
                                            fontWeight: isActive ? '700' : '600',
                                            fontSize: '0.9375rem'
                                        }}>
                                            <div className="flex items-center gap-3">
                                                {item.icon} {item.label}
                                            </div>
                                            {isActive && <ChevronRight size={16} />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={logout} className="flex items-center gap-3 w-full" style={{
                        background: 'transparent',
                        color: '#ef4444',
                        boxShadow: 'none',
                        padding: '1rem',
                        justifyContent: 'flex-start',
                        fontWeight: '700'
                    }}>
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                marginLeft: '280px',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <header style={{
                    padding: '1.5rem 3rem',
                    background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                            {navItems.find(i => i.path === location.pathname)?.label || 'Master Management'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#1e293b' }}>{user.userName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>System Administrator</div>
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '1rem'
                        }}>
                            {user.userName.charAt(0)}
                        </div>
                    </div>
                </header>

                <div style={{ padding: '2.5rem 3rem', flex: 1 }}>
                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterLayout;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, Users, Mail, Phone, Shield, FilterX } from 'lucide-react';

const UserScreen = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const roleFilter = searchParams.get('role');

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        userName: '',
        phoneNumber: '',
        email: '',
        password: '',
        roleName: 'user',
        department: '',
        programme: ''
    });

    useEffect(() => {
        fetchData();
    }, [roleFilter]);

    const fetchData = async () => {
        try {
            const [userRes, roleRes, deptRes] = await Promise.all([
                axios.get('/api/master/users'),
                axios.get('/api/master/roles'),
                axios.get('/api/master/departments')
            ]);

            let filteredUsers = userRes.data;
            if (roleFilter) {
                filteredUsers = filteredUsers.filter(u => u.role?.roleName === roleFilter);
            }

            setUsers(filteredUsers);
            setRoles(roleRes.data);
            setDepartments(deptRes.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            alert('User registered successfully!');
            setFormData({ userName: '', phoneNumber: '', email: '', password: '', roleName: 'user', department: '', programme: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="flex items-center gap-3" style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                    <Users size={32} className="text-primary" /> User Management
                </h2>
                {roleFilter && (
                    <button
                        onClick={() => setSearchParams({})}
                        className="flex items-center gap-2"
                        style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', boxShadow: 'none' }}
                    >
                        <FilterX size={18} /> Clear Filter: {roleFilter}
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="card mb-10" style={{ background: '#f8fafc' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Register New User</h3>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Full Name</label>
                        <input placeholder="John Doe" value={formData.userName} onChange={e => setFormData({ ...formData, userName: e.target.value })} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Email Address</label>
                        <input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Phone Number</label>
                        <input placeholder="9876543210" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Password</label>
                        <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Initial Role</label>
                        <select value={formData.roleName} onChange={e => setFormData({ ...formData, roleName: e.target.value })} required>
                            {roles.map(r => <option key={r._id} value={r.roleName}>{r.roleName}</option>)}
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex items-center justify-center gap-2" style={{ height: '44px' }}>
                            <Plus size={18} /> Register User
                        </button>
                    </div>
                </div>
            </form>

            <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>User</th>
                            <th style={{ textAlign: 'left' }}>Contact Info</th>
                            <th style={{ textAlign: 'left' }}>Role</th>
                            <th style={{ textAlign: 'left' }}>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <div style={{ fontWeight: '600' }}>{u.userName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u._id.slice(-6).toUpperCase()}</div>
                                </td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        <Mail size={14} /> {u.email}
                                    </div>
                                    <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <Phone size={14} /> {u.phoneNumber}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <span style={{
                                        background: u.role?.roleName === 'superAdmin' ? 'rgba(99, 102, 241, 0.1)' : '#f1f5f9',
                                        color: u.role?.roleName === 'superAdmin' ? 'var(--primary)' : 'var(--text-muted)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <Shield size={12} /> {u.role?.roleName}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <div style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {u.department?.departmentName || '-'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserScreen;

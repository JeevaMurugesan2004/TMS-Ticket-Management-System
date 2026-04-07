import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ShieldCheck, Eye } from 'lucide-react';

const RoleScreen = () => {
    const [roles, setRoles] = useState([]);
    const [roleName, setRoleName] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const { data } = await axios.get('/api/master/roles');
            setRoles(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/master/roles', { roleName });
            setRoleName('');
            fetchRoles();
        } catch (err) { alert('Failed to add role'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await axios.delete(`/api/master/roles/${id}`);
                fetchRoles();
            } catch (err) { alert('Failed to delete role'); }
        }
    };

    return (
        <>
            <h2 className="mb-6 flex items-center gap-2" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                <ShieldCheck size={32} className="text-primary" /> Role Management
            </h2>

            <form onSubmit={handleSubmit} className="flex gap-4 mb-10 items-end card" style={{ background: '#f8fafc', border: '1px border var(--border)' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-muted)' }}>New Role Name</label>
                    <input
                        value={roleName}
                        onChange={e => setRoleName(e.target.value)}
                        placeholder="e.g. Technician"
                        required
                        style={{ width: '100%' }}
                    />
                </div>
                <button type="submit" className="flex items-center gap-2" style={{ height: '42px' }}>
                    <Plus size={18} /> Add Role
                </button>
            </form>

            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {roles.map(r => (
                    <div key={r._id} className="card flex justify-between items-center transition-all hover:shadow-md" style={{ borderLeft: '4px solid var(--primary)' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</p>
                            <strong style={{ fontSize: '1.125rem' }}>{r.roleName}</strong>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                to={`/master/user?role=${r.roleName}`}
                                style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }}
                                title="View Users"
                            >
                                <Eye size={20} />
                            </Link>
                            <button
                                onClick={() => handleDelete(r._id)}
                                style={{ background: 'transparent', color: 'var(--danger)', border: 'none', padding: '0.5rem', cursor: 'pointer', borderRadius: '0.5rem', boxShadow: 'none' }}
                                className="hover:bg-red-50 flex items-center"
                                title="Delete Role"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default RoleScreen;

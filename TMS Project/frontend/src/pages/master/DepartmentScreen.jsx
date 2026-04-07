import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Building2 } from 'lucide-react';

const DepartmentScreen = () => {
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');

    useEffect(() => {
        fetchDepts();
    }, []);

    const fetchDepts = async () => {
        try {
            const { data } = await axios.get('/api/master/departments');
            setDepartments(data);
        } catch (err) { console.error(err); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/master/departments', { departmentName: name, shortName });
            setName('');
            setShortName('');
            fetchDepts();
        } catch (err) { 
            console.error('Add department error:', err);
            alert(`Failed to add department: ${err.response?.data?.message || err.message}`); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await axios.delete(`/api/master/departments/${id}`);
                fetchDepts();
            } catch (err) { alert('Failed to delete department'); }
        }
    };

    return (
        <>
            <h2 className="mb-8 flex items-center gap-3" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                <Building2 size={28} className="text-primary" /> Department Management
            </h2>

            <form onSubmit={handleAdd} className="flex gap-4 mb-10 items-end card" style={{ background: '#f8fafc' }}>
                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Department Name</label>
                    <input style={{ padding: '0.75rem' }} placeholder="e.g. Information Technology" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Short Name</label>
                    <input style={{ padding: '0.75rem' }} placeholder="e.g. IT" value={shortName} onChange={e => setShortName(e.target.value)} required />
                </div>
                <button type="submit" className="flex items-center gap-2" style={{ height: '44px' }}>
                    <Plus size={18} /> Add Department
                </button>
            </form>

            <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>#</th>
                            <th style={{ textAlign: 'left' }}>Department Name</th>
                            <th style={{ textAlign: 'left' }}>Short Name</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No departments found.</td></tr>
                        ) : (
                            departments.map((d, index) => (
                                <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{index + 1}</td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>{d.departmentName}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700' }}>
                                            {d.shortName}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDelete(d._id)}
                                            style={{ background: 'transparent', color: 'var(--danger)', border: 'none', padding: '0.5rem', cursor: 'pointer', boxShadow: 'none' }}
                                            className="hover:scale-110"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DepartmentScreen;

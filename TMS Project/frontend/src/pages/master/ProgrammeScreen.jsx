import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

const ProgrammeScreen = () => {
    const [programmes, setProgrammes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ department: '', programmeName: '', shortName: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [progRes, deptRes] = await Promise.all([
                axios.get('/api/master/programmes'),
                axios.get('/api/master/departments')
            ]);
            setProgrammes(progRes.data);
            setDepartments(deptRes.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/master/programmes', formData);
            setFormData({ department: '', programmeName: '', shortName: '' });
            fetchData();
        } catch (err) { 
            console.error('Add programme error:', err);
            alert(`Failed to add programme: ${err.response?.data?.message || err.message}`); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this programme?')) {
            try {
                await axios.delete(`/api/master/programmes/${id}`);
                fetchData();
            } catch (err) { alert('Failed to delete programme'); }
        }
    };

    return (
        <>
            <h2 className="mb-8 flex items-center gap-3" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                <GraduationCap size={28} className="text-primary" /> Programme Management
            </h2>

            <form onSubmit={handleSubmit} className="flex gap-4 mb-10 items-end card" style={{ background: '#f8fafc' }}>
                <div style={{ flex: 1.5 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Department</label>
                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required>
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
                    </select>
                </div>
                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Programme Name</label>
                    <input style={{ padding: '0.75rem' }} placeholder="e.g. B.Tech Computer Science" value={formData.programmeName} onChange={e => setFormData({ ...formData, programmeName: e.target.value })} required />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Short Name</label>
                    <input style={{ padding: '0.75rem' }} placeholder="e.g. BTCS" value={formData.shortName} onChange={e => setFormData({ ...formData, shortName: e.target.value })} required />
                </div>
                <button type="submit" className="flex items-center gap-2" style={{ height: '44px' }}>
                    <Plus size={18} /> Add Programme
                </button>
            </form>

            <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>#</th>
                            <th style={{ textAlign: 'left' }}>Department</th>
                            <th style={{ textAlign: 'left' }}>Programme</th>
                            <th style={{ textAlign: 'left' }}>Code</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programmes.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No programmes found.</td></tr>
                        ) : (
                            programmes.map((p, index) => (
                                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{index + 1}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{p.department?.departmentName}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>{p.programmeName}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{ border: '1px solid var(--border)', padding: '0.2rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '600', background: '#fff' }}>
                                            {p.shortName}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDelete(p._id)}
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

export default ProgrammeScreen;

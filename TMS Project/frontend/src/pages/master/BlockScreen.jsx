import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, LayoutGrid } from 'lucide-react';

const BlockScreen = () => {
    const [blocks, setBlocks] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [formData, setFormData] = useState({ department: '', programme: '', blockName: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [blockRes, deptRes, progRes] = await Promise.all([
                axios.get('/api/master/blocks'),
                axios.get('/api/master/departments'),
                axios.get('/api/master/programmes')
            ]);
            setBlocks(blockRes.data);
            setDepartments(deptRes.data);
            setProgrammes(progRes.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/master/blocks', formData);
            setFormData({ department: '', programme: '', blockName: '' });
            fetchData();
        } catch (err) { 
            console.error('Add block error:', err);
            alert(`Failed to add block: ${err.response?.data?.message || err.message}`); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this block?')) {
            try {
                await axios.delete(`/api/master/blocks/${id}`);
                fetchData();
            } catch (err) { alert('Failed to delete block'); }
        }
    };

    return (
        <>
            <h2 className="mb-8 flex items-center gap-3" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                <LayoutGrid size={28} className="text-primary" /> Block Management
            </h2>

            <form onSubmit={handleSubmit} className="flex gap-4 mb-10 items-end card" style={{ background: '#f8fafc' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Dept</label>
                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value, programme: '' })} required>
                        <option value="">Select</option>
                        {departments.map(d => <option key={d._id} value={d._id}>{d.shortName}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Prog</label>
                    <select value={formData.programme} onChange={e => setFormData({ ...formData, programme: e.target.value })} required disabled={!formData.department}>
                        <option value="">Select</option>
                        {programmes.filter(p => p.department?._id === formData.department).map(p => <option key={p._id} value={p._id}>{p.shortName}</option>)}
                    </select>
                </div>
                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Block Name</label>
                    <input style={{ padding: '0.75rem' }} placeholder="e.g. Block A" value={formData.blockName} onChange={e => setFormData({ ...formData, blockName: e.target.value })} required />
                </div>
                <button type="submit" className="flex items-center gap-2" style={{ height: '44px' }}>
                    <Plus size={18} /> Add Block
                </button>
            </form>

            <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>#</th>
                            <th style={{ textAlign: 'left' }}>Department</th>
                            <th style={{ textAlign: 'left' }}>Programme</th>
                            <th style={{ textAlign: 'left' }}>Block Name</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blocks.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No blocks found.</td></tr>
                        ) : (
                            blocks.map((b, index) => (
                                <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{index + 1}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>{b.department?.shortName}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>{b.programme?.shortName}</td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>{b.blockName}</td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDelete(b._id)}
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

export default BlockScreen;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Home } from 'lucide-react';

const RoomScreen = () => {
    const [rooms, setRooms] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [formData, setFormData] = useState({ block: '', roomNumber: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomRes, blockRes] = await Promise.all([
                axios.get('/api/master/rooms'),
                axios.get('/api/master/blocks')
            ]);
            setRooms(roomRes.data);
            setBlocks(blockRes.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const block = blocks.find(b => b._id === formData.block);
            if (!block) return alert('Please select a block');

            await axios.post('/api/master/rooms', {
                ...formData,
                department: block.department._id,
                programme: block.programme._id
            });
            setFormData({ block: '', roomNumber: '' });
            fetchData();
        } catch (err) { 
            console.error('Add room error:', err);
            alert(`Failed to add room: ${err.response?.data?.message || err.message}`); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await axios.delete(`/api/master/rooms/${id}`);
                fetchData();
            } catch (err) { alert('Failed to delete room'); }
        }
    };

    return (
        <>
            <h2 className="mb-8 flex items-center gap-3" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                <Home size={28} className="text-primary" /> Room Management
            </h2>

            <form onSubmit={handleSubmit} className="flex gap-4 mb-10 items-end card" style={{ background: '#f8fafc' }}>
                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Block</label>
                    <select value={formData.block} onChange={e => setFormData({ ...formData, block: e.target.value })} required>
                        <option value="">Select Block</option>
                        {blocks.map(b => (
                            <option key={b._id} value={b._id}>
                                {b.blockName} — {b.department?.shortName} ({b.programme?.shortName})
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Room Number</label>
                    <input style={{ padding: '0.75rem' }} placeholder="e.g. 101" value={formData.roomNumber} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} required />
                </div>
                <button type="submit" className="flex items-center gap-2" style={{ height: '44px' }}>
                    <Plus size={18} /> Add Room
                </button>
            </form>

            <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>#</th>
                            <th style={{ textAlign: 'left' }}>Block</th>
                            <th style={{ textAlign: 'left' }}>Department / Programme</th>
                            <th style={{ textAlign: 'left' }}>Room Number</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No rooms found.</td></tr>
                        ) : (
                            rooms.map((r, index) => (
                                <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{index + 1}</td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>{r.block?.blockName}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {r.department?.shortName} / {r.programme?.shortName}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
                                            {r.roomNumber}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDelete(r._id)}
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

export default RoomScreen;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Filter, UserPlus, CheckCircle2, MoreHorizontal, Clock, ArrowRight } from 'lucide-react';

const ComplaintList = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        fetchComplaints();
        if (user?.role === 'superAdmin') fetchStaff();
    }, []);

    const fetchComplaints = async () => {
        try {
            const { data } = await axios.get('/api/complaints');
            setComplaints(data);
        } catch (err) { console.error(err); }
    };

    const fetchStaff = async () => {
        try {
            const { data } = await axios.get('/api/master/users');
            setStaff(data.filter(u => !['user', 'superAdmin'].includes(u.role?.roleName)));
        } catch (err) { console.error(err); }
    };

    const handleAction = async (complaintId, status, assigneeId) => {
        try {
            await axios.put(`/api/complaints/${complaintId}`, { status, assignee: assigneeId });
            fetchComplaints();
        } catch (err) { alert('Update failed'); }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return { bg: '#fff7ed', text: '#9a3412', border: '#ffedd5' };
            case 'Assigned': return { bg: '#eff6ff', text: '#1e40af', border: '#dbeafe' };
            case 'In-Progress': return { bg: '#fdf4ff', text: '#86198f', border: '#fae8ff' };
            case 'Completed': return { bg: '#f0fdf4', text: '#166534', border: '#dcfce7' };
            default: return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
        }
    };

    return (
        <div className="container" style={{ padding: '0' }}>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>Complaints Queue</h2>
                    <p style={{ color: 'var(--secondary)', fontWeight: '500' }}>Manage and track all issue tickets</p>
                </div>
                <div className="flex gap-3">
                    <button style={{ background: 'white', color: 'var(--text)', border: '1px solid var(--border)', boxShadow: 'none' }} className="flex items-center gap-2">
                        <Filter size={18} /> Advanced Filter
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', width: '80px' }}>Ticket</th>
                            <th style={{ textAlign: 'left' }}>Issue Detail</th>
                            <th style={{ textAlign: 'left' }}>Location</th>
                            <th style={{ textAlign: 'left' }}>Status</th>
                            <th style={{ textAlign: 'left' }}>Assignee</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No tickets in the queue.</td></tr>
                        ) : (
                            complaints.map((c) => {
                                const styles = getStatusStyles(c.status);
                                return (
                                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                                                #{c._id.slice(-4).toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{c.complaintType}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={12} /> {new Date(c.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{c.block?.blockName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>Room {c.room?.roomNumber}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <span style={{
                                                padding: '0.375rem 0.75rem',
                                                border: `1px solid ${styles.border}`,
                                                borderRadius: '2rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                background: styles.bg,
                                                color: styles.text,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: styles.text }} />
                                                {c.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            {c.assignee ? (
                                                <div className="flex items-center gap-2">
                                                    <div style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.625rem', fontWeight: '800' }}>
                                                        {c.assignee.userName.charAt(0)}
                                                    </div>
                                                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{c.assignee.userName}</span>
                                                </div>
                                            ) : (
                                                <span style={{ fontStyle: 'italic', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Unassigned</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                                            <div className="flex gap-2 justify-center">
                                                {user.role === 'superAdmin' && (
                                                    <div className="flex items-center gap-1">
                                                        <select
                                                            onChange={(e) => handleAction(c._id, 'Assigned', e.target.value)}
                                                            style={{ padding: '0.5rem', width: 'auto', fontSize: '0.75rem', height: '32px' }}
                                                        >
                                                            <option value="">Assign to...</option>
                                                            {staff.map(s => <option key={s._id} value={s._id}>{s.userName} ({s.role?.roleName})</option>)}
                                                        </select>
                                                    </div>
                                                )}
                                                {['superAdmin', 'Admin', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer'].includes(user.role) && c.status !== 'Completed' && (
                                                    <button
                                                        onClick={() => {
                                                            const newStatus = c.status === 'Pending' ? 'Assigned' : (c.status === 'Assigned' ? 'In-Progress' : 'Completed');
                                                            const newAssignee = c.status === 'Pending' ? user.id : c.assignee?._id;
                                                            handleAction(c._id, newStatus, newAssignee);
                                                        }}
                                                        className="flex items-center gap-1"
                                                        style={{ 
                                                            padding: '0.5rem 1rem', 
                                                            background: c.status === 'Pending' ? 'var(--secondary)' : (c.status === 'Assigned' ? 'var(--primary)' : 'var(--success)'), 
                                                            fontSize: '0.75rem', 
                                                            height: '32px', 
                                                            boxShadow: 'none' 
                                                        }}
                                                    >
                                                        {c.status === 'Pending' ? 'Accept Task' : (c.status === 'Assigned' ? 'Start Task' : 'Complete')} <ArrowRight size={14} />
                                                    </button>
                                                )}
                                                {c.status === 'Completed' && <CheckCircle2 size={24} className="text-success" />}
                                                <button style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '0.25rem', boxShadow: 'none' }}>
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComplaintList;

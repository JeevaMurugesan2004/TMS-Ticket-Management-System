import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, Filter, Calendar, Shield, ClipboardCheck, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportScreen = () => {
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({
        department: '',
        programme: '',
        type: '',
        status: '',
        assignee: ''
    });

    const [isEmailing, setIsEmailing] = useState(false);
    const [emailStatus, setEmailStatus] = useState(null); // 'success' | 'error' | null

    const generateReport = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.type) params.append('complaintType', filters.type);

            const { data } = await axios.get(`/api/complaints?${params.toString()}`);
            setReports(data);
            setEmailStatus(null);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const sendReportToEmail = async () => {
        setIsEmailing(true);
        setEmailStatus(null);
        try {
            await axios.post('/api/complaints/send-report', {
                reports,
                filters
            });
            setEmailStatus('success');
            setTimeout(() => setEmailStatus(null), 5000);
        } catch (error) {
            console.error('Error sending report to email:', error);
            setEmailStatus('error');
        } finally {
            setIsEmailing(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleString();

        // Header Design
        doc.setFillColor(79, 70, 229);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text('TICKET MANAGEMENT SYSTEM', 14, 20);

        doc.setFontSize(10);
        doc.text('COMPLAINT DETAILS REPORT', 14, 30);
        doc.text(`Generated on: ${date}`, 150, 30);

        const tableColumn = ["Ticket ID", "Category", "Status", "Department", "Assignee", "Date"];
        const tableRows = reports.map(r => [
            `#${r._id.slice(-6).toUpperCase()}`,
            r.complaintType,
            r.status,
            r.department?.shortName || r.block?.department?.shortName || '-',
            r.assignee?.userName || 'Unassigned',
            new Date(r.createdAt).toLocaleDateString(),
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'grid',
            headStyles: {
                fillColor: [79, 70, 229],
                fontSize: 10,
                cellPadding: 4,
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 9,
                cellPadding: 4
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            }
        });

        const finalY = (doc).lastAutoTable.finalY || 50;
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text('--- End of Report ---', 105, finalY + 15, { align: 'center' });

        doc.save(`TMS_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="container" style={{ padding: '0' }}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '1.25rem', display: 'flex' }}>
                        <FileText size={32} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>System Reports</h2>
                        <p style={{ color: 'var(--secondary)', fontWeight: '500' }}>Generate and export complaint analytics</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2"
                        style={{ 
                            background: emailStatus === 'success' ? '#10b981' : (emailStatus === 'error' ? '#ef4444' : 'var(--primary)'), 
                            padding: '0.875rem 1.5rem', 
                            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                            color: 'white',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={sendReportToEmail}
                        disabled={reports.length === 0 || isEmailing}
                    >
                        {isEmailing ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            emailStatus === 'success' ? <CheckCircle2 size={18} /> : 
                            emailStatus === 'error' ? <AlertCircle size={18} /> : <Mail size={18} />
                        )}
                        {isEmailing ? 'Sending...' : (emailStatus === 'success' ? 'Email Sent!' : (emailStatus === 'error' ? 'Failed!' : 'Send to Email'))}
                    </button>
                    <button
                        className="flex items-center gap-2"
                        style={{ background: 'var(--success)', padding: '0.875rem 1.5rem', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}
                        onClick={exportToPDF}
                        disabled={reports.length === 0}
                    >
                        <Download size={18} /> Export as PDF
                    </button>
                </div>
            </div>

            <div className="card mb-10" style={{ background: '#f8fafc' }}>
                <h3 className="mb-6 flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                    <Filter size={20} className="text-primary" /> Report Filters
                </h3>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'flex-end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ticket Status</label>
                        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Issue Category</label>
                        <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                            <option value="">All Categories</option>
                            <option value="PC Hardware">PC Hardware</option>
                            <option value="PC Software">PC Software</option>
                            <option value="Network">Network</option>
                            <option value="Electronics">Electronics</option>
                        </select>
                    </div>
                    <button onClick={generateReport} style={{ height: '44px', fontWeight: '700' }}>
                        Compile Report Data
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Ticket ID</th>
                            <th style={{ textAlign: 'left' }}>Details</th>
                            <th style={{ textAlign: 'left' }}>Status</th>
                            <th style={{ textAlign: 'left' }}>Assignee</th>
                            <th style={{ textAlign: 'left' }}>Timeline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Apply filters and generate to see report data.</td></tr>
                        ) : (
                            reports.map(r => (
                                <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                                            #{r._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{r.complaintType}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.block?.blockName} - {r.room?.roomNumber}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            background: '#f1f5f9',
                                            color: '#475569'
                                        }}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div className="flex items-center gap-2" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                                            <Shield size={14} className="text-primary" /> {r.assignee?.userName || 'Unassigned'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <Calendar size={14} /> {new Date(r.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportScreen;

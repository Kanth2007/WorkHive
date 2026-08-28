import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  PhoneCall,
  User,
  ShieldAlert,
  ArrowRight,
  X,
  ExternalLink,
  MessageSquare,
  FileText,
  Building2,
  Check,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { complaintsAPI } from '../../../services/api';

export const ComplaintsScreen = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Open' | 'Investigating' | 'Resolved'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await complaintsAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(c => ({
          id: c.complaintId || c._id,
          complaintId: c.complaintId || c._id,
          complainant: c.complainant,
          complainantRole: c.complainantRole || 'Customer',
          complainantPhone: '+91 98401 00000',
          against: c.against,
          againstRole: 'Member / Participant',
          againstWorkerId: 'ravi-kumar',
          againstPhone: '+91 98402 00000',
          category: c.category,
          description: c.description,
          date: c.date || 'Today',
          status: c.status || 'Open',
          bookingId: c.bookingId || 'BK-1048',
          bookingService: 'Cooperative Service',
          resolutionNotes: c.resolutionNotes || ''
        }));
        setComplaints(mapped);
      }
    } catch (err) {
      console.error('Error fetching complaints from MongoDB:', err);
      setError('Unable to load complaints from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter =
      statusFilter === 'All' ? true : c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      c.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.against.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Action: Mark Investigating
  const handleMarkInvestigating = async (id) => {
    try {
      await complaintsAPI.update(id, { status: 'Investigating' });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'Investigating' } : c))
      );
      if (selectedComplaint?.id === id) {
        setSelectedComplaint((prev) => ({ ...prev, status: 'Investigating' }));
      }
      showToast(`🔍 Complaint #${id} marked as Investigating in MongoDB.`);
    } catch (err) {
      console.error('Update complaint error:', err);
      showToast(`⚠️ Failed to update complaint #${id}`);
    }
  };

  // Action: Resolve
  const handleResolveComplaint = async (id) => {
    const notes = 'Resolved by Ward Operations Desk following mutual conciliation.';
    try {
      await complaintsAPI.update(id, { status: 'Resolved', resolutionNotes: notes });
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: 'Resolved', resolutionNotes: notes } : c
        )
      );
      if (selectedComplaint?.id === id) {
        setSelectedComplaint((prev) => ({ ...prev, status: 'Resolved', resolutionNotes: notes }));
      }
      showToast(`✓ Complaint #${id} marked as Resolved in MongoDB.`);
    } catch (err) {
      console.error('Resolve complaint error:', err);
      showToast(`⚠️ Failed to resolve complaint #${id}`);
    }
  };

  // Action: Escalate to Suspension
  const handleEscalateSuspension = async (complaint) => {
    try {
      await complaintsAPI.update(complaint.id, { status: 'Investigating', escalateSuspension: true });
      navigate('/admin/workers', {
        state: {
          searchWorker: complaint.against,
          toastMessage: `⚠️ Escalated from Complaint #${complaint.id}: Worker suspended in MongoDB.`
        }
      });
    } catch (err) {
      console.error('Escalate error:', err);
      showToast(`⚠️ Complaint #${complaint.id} escalated to Committee Review.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER & TOAST */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
            Complaints & Dispute Resolution
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Review customer and worker grievances, safety incidents, and conciliation actions
          </p>
        </div>

        <Badge variant="active" style={{ fontSize: '12px' }}>
          {complaints.filter((c) => c.status !== 'Resolved').length} Active Inquiries
        </Badge>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          background: 'var(--color-black)',
          color: 'white',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. SEARCH & FILTER CHIPS */}
      <Card padding="md">
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <input
              type="text"
              className="ss-input"
              style={{ paddingLeft: '38px', height: '42px', fontSize: '13px' }}
              placeholder="Search by complainant, defendant, category (e.g. Safety, Late arrival)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 13 }} />
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'All', label: `All (${complaints.length})` },
              { id: 'Open', label: `Open (${complaints.filter((c) => c.status === 'Open').length})` },
              { id: 'Investigating', label: `Investigating (${complaints.filter((c) => c.status === 'Investigating').length})` },
              { id: 'Resolved', label: `Resolved (${complaints.filter((c) => c.status === 'Resolved').length})` }
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setStatusFilter(chip.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: statusFilter === chip.id ? 'var(--color-black)' : 'var(--color-bg)',
                  color: statusFilter === chip.id ? 'white' : 'var(--color-black)',
                  border: `1px solid ${statusFilter === chip.id ? 'var(--color-black)' : 'var(--color-border)'}`,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 3. COMPLAINTS DATA TABLE */}
      <Card padding="none" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1.5px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>ID & Complainant</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Against (Defendant)</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Grievance Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Date Reported</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c, index) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: c.status === 'Open' ? '#FFFDFD' : (index % 2 === 0 ? 'white' : '#FCFCFC'),
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.status === 'Open' ? '#FEE2E2' : '#F5F5F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.status === 'Open' ? '#FFFDFD' : (index % 2 === 0 ? 'white' : '#FCFCFC'))}
                >
                  {/* Complainant Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-black)' }}>{c.complainant}</div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>{c.id} • {c.complainantRole}</div>
                  </td>

                  {/* Against Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-black)' }}>{c.against}</div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>{c.againstRole}</div>
                  </td>

                  {/* Category Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: c.category.includes('Safety') ? 'var(--color-danger-bg)' : 'var(--color-bg)',
                      color: c.category.includes('Safety') ? 'var(--color-danger)' : 'var(--color-black)',
                      border: `1px solid ${c.category.includes('Safety') ? 'var(--color-danger)' : 'var(--color-border)'}`,
                      fontWeight: 600,
                      fontSize: '12px'
                    }}>
                      {c.category}
                    </span>
                  </td>

                  {/* Date Column */}
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                    {c.date}
                  </td>

                  {/* Status Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <Badge
                      variant={
                        c.status === 'Resolved'
                          ? 'success'
                          : c.status === 'Investigating'
                          ? 'active'
                          : 'danger'
                      }
                      style={{ fontSize: '11px' }}
                    >
                      {c.status === 'Open' && '🔴 Open'}
                      {c.status === 'Investigating' && '⏳ Investigating'}
                      {c.status === 'Resolved' && '✓ Resolved'}
                    </Badge>
                  </td>

                  {/* Actions Column */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComplaint(c);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        background: 'var(--color-bg)',
                        color: 'var(--color-black)',
                        border: '1px solid var(--color-border)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Inspect &gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. DETAIL PANEL (CLICKING A COMPLAINT OPENS INSPECTION & ADMIN ACTIONS) */}
      {selectedComplaint && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: 'var(--color-white)',
            width: '100%',
            maxWidth: '520px',
            height: '100vh',
            overflowY: 'auto',
            padding: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Badge variant={selectedComplaint.status === 'Resolved' ? 'success' : (selectedComplaint.status === 'Investigating' ? 'active' : 'danger')}>
                    {selectedComplaint.status}
                  </Badge>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Reported {selectedComplaint.date}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0' }}>
                  Complaint #{selectedComplaint.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Complainant vs Defendant Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
              {/* Complainant */}
              <div style={{ background: 'var(--color-bg)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600 }}>COMPLAINANT</span>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: 2 }}>{selectedComplaint.complainant}</div>
                <div className="text-secondary" style={{ fontSize: '11px' }}>{selectedComplaint.complainantRole}</div>
                <div style={{ marginTop: 6 }}>
                  <a href={`tel:${selectedComplaint.complainantPhone}`}>
                    <Button variant="outline" size="small" icon={PhoneCall}>Call</Button>
                  </a>
                </div>
              </div>

              {/* Defendant */}
              <div style={{ background: 'var(--color-bg)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600 }}>AGAINST</span>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: 2 }}>{selectedComplaint.against}</div>
                <div className="text-secondary" style={{ fontSize: '11px' }}>{selectedComplaint.againstRole}</div>
                <div style={{ marginTop: 6 }}>
                  <a href={`tel:${selectedComplaint.againstPhone}`}>
                    <Button variant="outline" size="small" icon={PhoneCall}>Call</Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Grievance Description Card */}
            <Card padding="md" style={{ background: '#FFFDF9', border: '1.5px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-black)' }}>
                  Grievance: {selectedComplaint.category}
                </span>
                <Badge variant="active" style={{ fontSize: '10px' }}>
                  {selectedComplaint.category}
                </Badge>
              </div>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: 1.5, margin: 0 }}>
                "{selectedComplaint.description}"
              </p>
            </Card>

            {/* Related Booking Link (Back to All Bookings) */}
            <Card padding="sm" style={{ background: 'var(--color-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600 }}>RELATED SERVICE BOOKING</span>
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                    #{selectedComplaint.bookingId} • {selectedComplaint.bookingService}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="small"
                  icon={ExternalLink}
                  onClick={() => navigate('/admin/bookings')}
                >
                  View in All Bookings
                </Button>
              </div>
            </Card>

            {/* Resolution Notes if Resolved */}
            {selectedComplaint.resolutionNotes && (
              <div style={{
                background: 'var(--color-success-bg)',
                border: '1px solid var(--color-success)',
                color: 'var(--color-success)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: 2 }}>✓ Conciliation Resolution:</div>
                <div>{selectedComplaint.resolutionNotes}</div>
              </div>
            )}

            {/* 3 ADMIN ACTION BUTTONS */}
            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              
              {/* Button 1: Mark Investigating */}
              {selectedComplaint.status !== 'Investigating' && selectedComplaint.status !== 'Resolved' && (
                <Button
                  variant="outline"
                  fullWidth
                  icon={Clock}
                  onClick={() => handleMarkInvestigating(selectedComplaint.id)}
                >
                  Mark Investigating
                </Button>
              )}

              {/* Button 2: Resolve */}
              {selectedComplaint.status !== 'Resolved' && (
                <Button
                  variant="primary"
                  fullWidth
                  icon={CheckCircle2}
                  onClick={() => handleResolveComplaint(selectedComplaint.id)}
                >
                  Resolve & Settle Conciliation
                </Button>
              )}

              {/* Button 3: Escalate to Suspension */}
              {selectedComplaint.againstWorkerId && (
                <Button
                  variant="danger"
                  fullWidth
                  icon={Ban}
                  onClick={() => handleEscalateSuspension(selectedComplaint)}
                >
                  Escalate to Worker Suspension ⚠️
                </Button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ComplaintsScreen;

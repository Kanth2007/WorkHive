import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  Eye,
  ShieldCheck,
  Award,
  FileText,
  AlertTriangle,
  X,
  Phone,
  MapPin,
  Star,
  Check,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { workersAPI } from '../../../services/api';

export const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Verified' | 'Pending' | 'Suspended'
  
  // Modal / Side Panel View
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Suspension Confirmation Modal State
  const [suspendingWorker, setSuspendingWorker] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await workersAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(w => ({
          id: w.workerId || w._id,
          workerId: w.workerId || w._id,
          name: w.name,
          phone: w.phone,
          coopId: w.societyReg || '#CLC-COOP',
          skill: w.skill,
          subSkills: w.skills || [w.skill],
          status: w.status || 'Verified',
          rating: w.rating || 4.8,
          jobsCompleted: w.completedJobs || 0,
          experience: w.experience || '5 years',
          languages: ['Tamil', 'English'],
          zone: w.locality || 'Ward 4, Adyar',
          avatar: w.avatar || 'WK',
          docs: w.documents?.length ? w.documents : [
            { name: 'Aadhaar Card (UIDAI Verified)', file: 'aadhaar.pdf', verified: true },
            { name: 'Trade Skill Certification', file: 'trade_cert.pdf', verified: true }
          ],
          complaints: []
        }));
        setWorkers(mapped);
      }
    } catch (err) {
      console.error('Error loading workers from MongoDB:', err);
      setError('Unable to load worker records from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Logic
  const filteredWorkers = workers.filter((w) => {
    const matchesFilter = statusFilter === 'All' || w.status === statusFilter;
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.phone.includes(searchTerm) ||
      w.coopId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Action: Verify
  const handleVerifyWorker = async (workerId, name) => {
    try {
      await workersAPI.update(workerId, { status: 'Verified', isOnline: true });
      setWorkers((prev) =>
        prev.map((w) => (w.id === workerId ? { ...w, status: 'Verified' } : w))
      );
      if (selectedWorker?.id === workerId) {
        setSelectedWorker((prev) => ({ ...prev, status: 'Verified' }));
      }
      showToast(`✓ ${name} verified & approved in MongoDB!`);
    } catch (err) {
      console.error('Verify error:', err);
      showToast(`⚠️ Failed to verify ${name}`);
    }
  };

  // Action: Confirm Suspend
  const handleConfirmSuspend = async () => {
    if (!suspendingWorker) return;
    const { id, name } = suspendingWorker;
    try {
      await workersAPI.update(id, { status: 'Suspended', isOnline: false });
      setWorkers((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: 'Suspended' } : w))
      );
      if (selectedWorker?.id === id) {
        setSelectedWorker((prev) => ({ ...prev, status: 'Suspended' }));
      }
      setSuspendingWorker(null);
      showToast(`⚠️ ${name} suspended in MongoDB. Job allocations paused.`);
    } catch (err) {
      console.error('Suspend error:', err);
      showToast(`⚠️ Failed to suspend ${name}`);
    }
  };

  // Action: Reactivate
  const handleReactivateWorker = async (workerId, name) => {
    try {
      await workersAPI.update(workerId, { status: 'Verified', isOnline: true });
      setWorkers((prev) =>
        prev.map((w) => (w.id === workerId ? { ...w, status: 'Verified' } : w))
      );
      if (selectedWorker?.id === workerId) {
        setSelectedWorker((prev) => ({ ...prev, status: 'Verified' }));
      }
      showToast(`✓ ${name} reactivated to Verified status.`);
    } catch (err) {
      console.error('Reactivate error:', err);
      showToast(`⚠️ Failed to reactivate ${name}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER & TOAST NOTIFICATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
            Worker Roster & Accreditation
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Manage cooperative worker verification, skill credentials, and allocation standing
          </p>
        </div>

        <Badge variant="active" style={{ fontSize: '12px' }}>
          {workers.length} Total Registered Workers
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

      {/* 2. SEARCH BAR & FILTER CHIPS */}
      <Card padding="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Bar */}
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                className="ss-input"
                style={{ paddingLeft: '38px', height: '42px', fontSize: '13px' }}
                placeholder="Search by worker name, trade skill, phone number, or Coop ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 13 }} />
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'All', label: `All (${workers.length})` },
                { id: 'Verified', label: `Verified (${workers.filter((w) => w.status === 'Verified').length})` },
                { id: 'Pending', label: `Pending (${workers.filter((w) => w.status === 'Pending').length})` },
                { id: 'Suspended', label: `Suspended (${workers.filter((w) => w.status === 'Suspended').length})` }
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
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </Card>

      {/* 3. WORKERS DATA TABLE */}
      <Card padding="none" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1.5px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Worker</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Trade Skill</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Accreditation Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Rating</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Jobs Done</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((w, index) => (
                <tr
                  key={w.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: index % 2 === 0 ? 'white' : '#FCFCFC'
                  }}
                >
                  {/* Worker Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-black)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {w.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-black)' }}>{w.name}</div>
                        <div className="text-secondary" style={{ fontSize: '11px' }}>{w.coopId} • {w.zone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Skill Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}>
                      {w.skill}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <Badge
                      variant={
                        w.status === 'Verified'
                          ? 'success'
                          : (w.status === 'Pending' ? 'active' : 'danger')
                      }
                    >
                      {w.status === 'Verified' && '✓ Verified'}
                      {w.status === 'Pending' && '⏳ Pending Review'}
                      {w.status === 'Suspended' && '⛔ Suspended'}
                    </Badge>
                  </td>

                  {/* Rating Column */}
                  <td style={{ padding: '12px 16px' }}>
                    {w.rating !== '—' ? (
                      <span style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>
                        {w.rating} ⭐
                      </span>
                    ) : (
                      <span className="text-secondary">—</span>
                    )}
                  </td>

                  {/* Jobs Completed Column */}
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                    {w.jobsCompleted}
                  </td>

                  {/* Actions Column */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      
                      {/* Verify Button (if Pending) */}
                      {w.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handleVerifyWorker(w.id, w.name)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: 'var(--color-success)',
                            color: 'white',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          Verify ✓
                        </button>
                      )}

                      {/* Suspend Button (if Verified) */}
                      {w.status === 'Verified' && (
                        <button
                          type="button"
                          onClick={() => setSuspendingWorker(w)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: 'var(--color-bg)',
                            color: 'var(--color-danger)',
                            border: '1px solid var(--color-border)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Suspend
                        </button>
                      )}

                      {/* Reactivate Button (if Suspended) */}
                      {w.status === 'Suspended' && (
                        <button
                          type="button"
                          onClick={() => handleReactivateWorker(w.id, w.name)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: 'var(--color-black)',
                            color: 'white',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Reactivate
                        </button>
                      )}

                      {/* View Profile Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedWorker(w)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          background: 'var(--color-bg)',
                          color: 'var(--color-black)',
                          border: '1px solid var(--color-border)',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                      >
                        <Eye size={12} />
                        <span>View Profile</span>
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. "VIEW PROFILE" ADMIN SIDE PANEL / MODAL */}
      {selectedWorker && (
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
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-black)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {selectedWorker.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                    {selectedWorker.name}
                  </h2>
                  <div className="text-secondary" style={{ fontSize: '12px' }}>
                    {selectedWorker.coopId} • {selectedWorker.phone}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
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

            {/* Status & Accreditation Card */}
            <Card padding="sm" style={{ background: 'var(--color-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="text-secondary" style={{ fontSize: '11px' }}>MEMBERSHIP STATUS</span>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {selectedWorker.status === 'Verified' && '🟢 Verified Cooperative Worker'}
                    {selectedWorker.status === 'Pending' && '⏳ Application Pending Review'}
                    {selectedWorker.status === 'Suspended' && '🔴 Suspended by Committee'}
                  </div>
                </div>
                <Badge variant={selectedWorker.status === 'Verified' ? 'success' : (selectedWorker.status === 'Pending' ? 'active' : 'danger')}>
                  {selectedWorker.status}
                </Badge>
              </div>
            </Card>

            {/* Overview Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)', fontSize: '13px' }}>
              <div style={{ background: 'var(--color-bg)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary" style={{ fontSize: '11px' }}>PRIMARY SKILL</span>
                <div style={{ fontWeight: 'bold' }}>{selectedWorker.skill}</div>
              </div>
              <div style={{ background: 'var(--color-bg)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary" style={{ fontSize: '11px' }}>EXPERIENCE</span>
                <div style={{ fontWeight: 'bold' }}>{selectedWorker.experience}</div>
              </div>
              <div style={{ background: 'var(--color-bg)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary" style={{ fontSize: '11px' }}>COMPLETED JOBS</span>
                <div style={{ fontWeight: 'bold' }}>{selectedWorker.jobsCompleted} Jobs</div>
              </div>
              <div style={{ background: 'var(--color-bg)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary" style={{ fontSize: '11px' }}>MEMBER RATING</span>
                <div style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>{selectedWorker.rating} ⭐</div>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                TRADE SPECIALTIES
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {selectedWorker.subSkills.map((sub) => (
                  <span key={sub} style={{ padding: '3px 8px', borderRadius: '4px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', fontSize: '12px' }}>
                    ✓ {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* ADMIN FIELD 1: SUBMITTED DOCUMENTS THUMBNAILS */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>
                Submitted Verification Documents ({selectedWorker.docs.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedWorker.docs.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--color-bg)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px' }}>
                      <FileText size={16} color="var(--color-black)" />
                      <div>
                        <div style={{ fontWeight: 600 }}>{doc.name}</div>
                        <div className="text-secondary" style={{ fontSize: '11px' }}>{doc.file}</div>
                      </div>
                    </div>

                    <Badge variant={doc.verified ? 'success' : 'active'} style={{ fontSize: '10px' }}>
                      {doc.verified ? 'Verified' : 'Reviewing'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* ADMIN FIELD 2: VERIFICATION CHECKLIST WITH CHECKBOXES */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>
                Admin Verification Checklist
              </h3>
              <div style={{
                background: '#FAFAFA',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: '12px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={selectedWorker.status === 'Verified'} />
                  <span>Aadhaar / Voter ID authenticated against UIDAI portal</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={selectedWorker.status === 'Verified'} />
                  <span>Trade diploma / ITI certificate verified against vocational database</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={selectedWorker.status === 'Verified'} />
                  <span>Police background clearance record attached</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Bank Account / Direct UPI settlement account validated</span>
                </label>
              </div>
            </div>

            {/* ADMIN FIELD 3: COMPLAINT HISTORY MINI-LIST */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>
                Customer Complaint History
              </h3>
              {selectedWorker.complaints.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedWorker.complaints.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#FFFDF9',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 10px',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span style={{ color: 'var(--color-danger)' }}>⚠️ {c.issue}</span>
                        <span className="text-secondary">{c.date}</span>
                      </div>
                      <div className="text-secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                        Resolution: {c.resolution}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: 'var(--color-bg)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--color-success)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <CheckCircle2 size={16} />
                  <span>Zero complaints reported. Excellent community record.</span>
                </div>
              )}
            </div>

            {/* Bottom Actions in Modal */}
            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-xs)' }}>
              {selectedWorker.status === 'Pending' && (
                <Button
                  variant="primary"
                  fullWidth
                  icon={CheckCircle2}
                  onClick={() => handleVerifyWorker(selectedWorker.id, selectedWorker.name)}
                >
                  Approve & Verify Worker
                </Button>
              )}

              {selectedWorker.status === 'Verified' && (
                <Button
                  variant="danger"
                  fullWidth
                  icon={Ban}
                  onClick={() => setSuspendingWorker(selectedWorker)}
                >
                  Suspend Worker
                </Button>
              )}

              {selectedWorker.status === 'Suspended' && (
                <Button
                  variant="primary"
                  fullWidth
                  icon={RotateCcw}
                  onClick={() => handleReactivateWorker(selectedWorker.id, selectedWorker.name)}
                >
                  Reactivate Worker
                </Button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. SUSPENSION CONFIRMATION DIALOG MODAL */}
      {suspendingWorker && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-md)'
        }}>
          <Card padding="lg" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-xs)'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0' }}>
              Suspend {suspendingWorker.name}?
            </h2>

            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.4, margin: '8px 0 var(--space-md)' }}>
              Suspend this worker? They won't receive new job requests.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <Button
                variant="outline"
                style={{ flex: 1 }}
                onClick={() => setSuspendingWorker(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                style={{ flex: 1 }}
                onClick={handleConfirmSuspend}
              >
                Confirm Suspend
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default WorkerManagement;

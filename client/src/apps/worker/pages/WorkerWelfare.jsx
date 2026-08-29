import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Award,
  HeartPulse,
  User,
  PlusCircle,
  ExternalLink,
  Lock,
  Building2,
  CheckCircle2,
  Info,
  BadgeCheck,
  FileText,
  Scale,
  Coins,
  ArrowRight,
  Loader2,
  X,
  Send,
  Edit3
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useAuth } from '../../../context/AuthContext';
import { bookingsAPI, adminAPI, cooperativeAPI } from '../../../services/api';

export const WorkerWelfare = () => {
  const navigate = useNavigate();
  const { worker, updateWorker } = useWorker();
  const { currentUser } = useAuth();
  
  const [welfareBalance, setWelfareBalance] = useState(0);
  const [coopStats, setCoopStats] = useState({ totalWorkers: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [activeClaimModal, setActiveClaimModal] = useState(null); // 'tools' | 'loan' | null
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDetails, setClaimDetails] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  // Scheme Modal State
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Nominee Edit Modal
  const [isEditingNominee, setIsEditingNominee] = useState(false);
  const [nomineeName, setNomineeName] = useState(worker.nominee?.name || '');
  const [nomineeRelation, setNomineeRelation] = useState(worker.nominee?.relation || 'Family');

  const activeWorkerId = worker.workerId || currentUser?.userId;

  const fetchWelfareData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, statsRes] = await Promise.allSettled([
        activeWorkerId ? bookingsAPI.getAll({ workerId: activeWorkerId }) : Promise.resolve({ data: [] }),
        cooperativeAPI.getStats()
      ]);

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && Array.isArray(bookingsRes.value.data)) {
        const completed = bookingsRes.value.data.filter(b => ['completed', 'paid', 'rated'].includes(b.status));
        const totalGross = completed.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
        setWelfareBalance(Math.round(totalGross * 0.10));
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.success && statsRes.value.data) {
        setCoopStats({
          totalWorkers: statsRes.value.data.totalWorkers || 0,
          totalEarnings: statsRes.value.data.todayEarnings || 0
        });
      }
    } catch (err) {
      console.warn('Welfare data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWelfareData();
  }, [activeWorkerId]);

  const displayName = worker.name || currentUser?.name || 'Worker Member';
  const policyNumber = `#TN-COOP-${(activeWorkerId || '88402').toString().slice(-6).toUpperCase()}`;

  const govtSchemes = [
    {
      id: 'pmjjby',
      name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
      description: '₹2,00,000 life insurance protection for unorganized workers subsidized by the cooperative.',
      tag: 'Central Govt Scheme',
      details: 'Life insurance coverage of ₹2 Lakh for death due to any cause. Annual premium of ₹436 is 100% reimbursed through the Cooperative Welfare Reserve.',
      eligibility: 'All cooperative members aged 18–50 with an active savings bank account.',
      documents: 'Aadhaar Card, Bank Passbook, Society Membership ID.'
    },
    {
      id: 'eshram',
      name: 'e-Shram Universal Social Security Card',
      description: 'Central registry linking accidental insurance, pension benefits, and state welfare aid.',
      tag: 'National Social Registry',
      details: 'National database of unorganized workers with 12-digit UAN card. Eligible for ₹2 Lakh accidental death cover and direct DBT disaster relief.',
      eligibility: 'All workers in unorganized sectors aged 16–59.',
      documents: 'Aadhaar-linked Mobile Number, Bank Account details.'
    },
    {
      id: 'tnuwwb',
      name: 'Tamil Nadu Unorganised Workers Welfare Board (TNUWWB)',
      description: 'State welfare support including children education grants, maternity benefits, and monthly old-age pension.',
      tag: 'State Board Scheme',
      details: 'Provides ₹1,000/month old-age pension after 60, ₹50,000 accidental assistance, ₹4,000/yr higher education grants for children, and marriage grants.',
      eligibility: 'Tamil Nadu residents working in verified trades for at least 90 days a year.',
      documents: 'Proof of trade from Chennai Labour Cooperative, Ration Card, Aadhaar.'
    }
  ];

  const handleSaveNominee = (e) => {
    e.preventDefault();
    if (!nomineeName.trim()) return;
    updateWorker({
      nominee: {
        name: nomineeName.trim(),
        relation: nomineeRelation,
        payout: `${nomineeName.toLowerCase().replace(/\s+/g, '')}@okaxis`
      }
    });
    setIsEditingNominee(false);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(claimAmount);
    if (!amount || amount <= 0) return;

    setClaimSubmitting(true);
    try {
      const res = await cooperativeAPI.createClaim({
        title: activeClaimModal === 'tools' ? 'Tool Upgrade & Safety Gear Subsidy' : 'Emergency Hardship Loan (0% APR)',
        workerId: activeWorkerId,
        workerName: displayName,
        amount: amount,
        category: activeClaimModal === 'tools' ? 'tool_subsidy' : 'emergency_credit',
        details: claimDetails || `Requested by ${displayName}`
      });

      if (res.success) {
        setClaimSuccessMsg(`Claim #${res.data?.claimId || 'CLM-SUCCESS'} successfully approved and recorded in MongoDB.`);
        setTimeout(() => {
          setActiveClaimModal(null);
          setClaimSuccessMsg('');
          setClaimAmount('');
          setClaimDetails('');
          fetchWelfareData();
        }, 2000);
      }
    } catch (err) {
      alert('Error recording claim: ' + err.message);
    } finally {
      setClaimSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. HEADER */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
          Worker Welfare & Insurance
        </h1>
        <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
          Member: <strong>{displayName}</strong> • Chennai Labour Cooperative Society
        </p>

        {/* Mission Statement */}
        <div style={{
          background: '#F0FDF4',
          border: '1.5px solid #22C55E',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          marginTop: 'var(--space-xs)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)'
        }}>
          <Scale size={18} color="#16A34A" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803D', margin: 0, lineHeight: 1.4 }}>
            "This is a worker-owned marketplace — cooperative workers earn directly, not a private company."
          </p>
        </div>
      </div>

      {/* COOPERATIVE SHORTCUTS: ECONOMICS & DEMOCRATIC VOTING */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)' }}>
        <Card
          padding="sm"
          style={{
            border: '1.5px solid var(--color-border)',
            cursor: 'pointer',
            background: 'var(--color-bg)'
          }}
          onClick={() => navigate('/worker/cooperative')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Coins size={18} color="var(--color-black)" />
              <ArrowRight size={14} color="var(--color-text-secondary)" />
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-black)' }}>
              Coop Economics
            </div>
            <div className="text-secondary" style={{ fontSize: '10px' }}>
              {coopStats.totalWorkers} member{coopStats.totalWorkers === 1 ? '' : 's'} registered in Atlas
            </div>
          </div>
        </Card>

        <Card
          padding="sm"
          style={{
            border: '1.5px solid var(--color-accent)',
            cursor: 'pointer',
            background: '#FFFDFB'
          }}
          onClick={() => navigate('/worker/voting')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px' }}>🗳️</span>
              <Badge variant="active" style={{ fontSize: '9px', padding: '1px 5px' }}>Live Ballot</Badge>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-black)' }}>
              Member Voting
            </div>
            <div className="text-secondary" style={{ fontSize: '10px' }}>
              1 Worker = 1 Vote Governance
            </div>
          </div>
        </Card>
      </div>

      {/* 2. INSURANCE POLICY CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        
        {/* Card 1: Health Insurance */}
        <Card padding="md" style={{ border: '1.5px solid #22C55E', background: '#F9FFF9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <span style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#00E676',
                boxShadow: '0 0 0 3px rgba(0, 230, 118, 0.25)',
                flexShrink: 0
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: 'var(--color-black)' }}>
                    Health Insurance
                  </h2>
                  <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '13px' }}>
                    — Active
                  </span>
                </div>
                <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                  ₹5,00,000 Cashless medical hospitalization coverage for worker & dependents.
                </p>
              </div>
            </div>

            <Badge variant="success" style={{ fontSize: '10px' }}>Covered</Badge>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #E0E0E0',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 10px',
            marginTop: 'var(--space-sm)',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span className="text-secondary">Policy: {policyNumber}</span>
            <span className="text-bold">Chennai Coop Health Network</span>
          </div>
        </Card>

        {/* Card 2: Accident Coverage */}
        <Card padding="md" style={{ border: '1.5px solid #22C55E', background: '#F9FFF9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <span style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#00E676',
                boxShadow: '0 0 0 3px rgba(0, 230, 118, 0.25)',
                flexShrink: 0
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: 'var(--color-black)' }}>
                    Accident Coverage
                  </h2>
                  <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '13px' }}>
                    — Active
                  </span>
                </div>
                <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                  ₹5,00,000 24x7 On-duty accident and accidental disability protection.
                </p>
              </div>
            </div>

            <Badge variant="success" style={{ fontSize: '10px' }}>Covered</Badge>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #E0E0E0',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 10px',
            marginTop: 'var(--space-sm)',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="text-secondary">Nominee:</span>
              <strong>{worker.nominee?.name || 'Not assigned yet'}</strong>
              {worker.nominee?.relation && <span className="text-secondary">({worker.nominee.relation})</span>}
            </div>
            <button
              type="button"
              onClick={() => setIsEditingNominee(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Edit3 size={11} />
              <span>{worker.nominee?.name ? 'Edit' : 'Add Nominee'}</span>
            </button>
          </div>
        </Card>

      </div>

      {/* 3. WELFARE FUND BALANCE CARD (DYNAMIC FROM MONGODB) */}
      <Card padding="md" style={{ background: 'var(--color-black)', color: 'var(--color-white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#BBB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              YOUR ACCUMULATED WELFARE FUND
            </span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-white)', margin: '4px 0 2px' }}>
              ₹{welfareBalance.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#00E676', fontWeight: 600 }}>
              ✓ Fully Vested & Claimable from Society Pool
            </div>
          </div>

          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255, 106, 0, 0.2)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HeartHandshake size={22} />
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#E0E0E0', lineHeight: 1.4, margin: 'var(--space-md) 0 var(--space-md)' }}>
          10% of every completed job is automatically deposited into this cooperative escrow to cover your emergency insurance, tool subsidies, and safety gear.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <button
            type="button"
            onClick={() => {
              setActiveClaimModal('tools');
              setClaimAmount('500');
              setClaimDetails('Tool safety equipment replacement');
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'white',
              color: 'var(--color-black)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Claim for Tools
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveClaimModal('loan');
              setClaimAmount('5000');
              setClaimDetails('Emergency family medical cash assistance');
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Emergency 0% Loan
          </button>
        </div>
      </Card>

      {/* 4. GOVERNMENT WELFARE SCHEMES SECTION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
            Government Welfare Schemes
          </h2>
          <span className="text-secondary" style={{ fontSize: '12px' }}>
            3 Active Links
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {govtSchemes.map((scheme) => (
            <Card key={scheme.id} padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Badge variant="active" style={{ fontSize: '10px', marginBottom: 4 }}>
                    {scheme.tag}
                  </Badge>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '2px 0 4px', color: 'var(--color-black)' }}>
                    {scheme.name}
                  </h3>
                  <p className="text-secondary" style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
                    {scheme.description}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedScheme(scheme)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: '12px',
                    color: 'var(--color-accent)',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>Learn more & Apply</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* MODAL 1: SUBMIT TOOL / LOAN CLAIM TO MONGODB */}
      {activeClaimModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <Card padding="lg" style={{ maxWidth: '420px', width: '100%', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                {activeClaimModal === 'tools' ? 'Submit Tool Subsidy Claim' : 'Apply for 0% Emergency Loan'}
              </h3>
              <button type="button" onClick={() => setActiveClaimModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {claimSuccessMsg ? (
              <div style={{ background: '#F0FDF4', border: '1px solid #22C55E', borderRadius: 'var(--radius-sm)', padding: '12px', color: '#15803D', fontSize: '13px', fontWeight: 600 }}>
                ✓ {claimSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div className="ss-form-group">
                  <label className="ss-label">Claim Amount (₹):</label>
                  <input
                    type="number"
                    required
                    min="100"
                    max="15000"
                    className="ss-input"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                  />
                </div>

                <div className="ss-form-group">
                  <label className="ss-label">Purpose / Description:</label>
                  <textarea
                    rows={3}
                    required
                    className="ss-input"
                    value={claimDetails}
                    onChange={(e) => setClaimDetails(e.target.value)}
                    placeholder="e.g. Safety shoes, toolkit repair, medical prescription..."
                  />
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', background: 'var(--color-bg)', padding: '8px', borderRadius: '4px' }}>
                  Recorded directly in MongoDB `welfareclaims` collection and disbursed through Ward 4 Society Ledger.
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 8 }}>
                  <Button type="button" variant="outline" fullWidth onClick={() => setActiveClaimModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" fullWidth disabled={claimSubmitting}>
                    {claimSubmitting ? 'Recording...' : 'Submit Claim'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}

      {/* MODAL 2: EDIT NOMINEE */}
      {isEditingNominee && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <Card padding="lg" style={{ maxWidth: '380px', width: '100%', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                Update Insurance Nominee
              </h3>
              <button type="button" onClick={() => setIsEditingNominee(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNominee} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div className="ss-form-group">
                <label className="ss-label">Nominee Full Name:</label>
                <input
                  type="text"
                  required
                  className="ss-input"
                  placeholder="e.g. Ananya Kumar"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                />
              </div>

              <div className="ss-form-group">
                <label className="ss-label">Relationship to Worker:</label>
                <select
                  className="ss-input"
                  value={nomineeRelation}
                  onChange={(e) => setNomineeRelation(e.target.value)}
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Family">Other Family Member</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 8 }}>
                <Button type="button" variant="outline" fullWidth onClick={() => setIsEditingNominee(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth>
                  Save Nominee
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 3: GOVERNMENT SCHEME DETAILS */}
      {selectedScheme && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <Card padding="lg" style={{ maxWidth: '440px', width: '100%', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
              <div>
                <Badge variant="active" style={{ fontSize: '10px' }}>{selectedScheme.tag}</Badge>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '4px 0 0' }}>
                  {selectedScheme.name}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedScheme(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', margin: 'var(--space-md) 0' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-black)' }}>Scheme Benefits:</strong>
                <p style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)' }}>{selectedScheme.details}</p>
              </div>

              <div>
                <strong style={{ display: 'block', color: 'var(--color-black)' }}>Eligibility:</strong>
                <p style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)' }}>{selectedScheme.eligibility}</p>
              </div>

              <div>
                <strong style={{ display: 'block', color: 'var(--color-black)' }}>Documents Required:</strong>
                <p style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)' }}>{selectedScheme.documents}</p>
              </div>
            </div>

            <div style={{ background: '#F0FDF4', border: '1px solid #22C55E', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '12px', color: '#15803D' }}>
              Cooperative officers assist with documentation and filing free of charge at Ward 4 Society Office.
            </div>

            <div style={{ marginTop: 'var(--space-md)' }}>
              <Button variant="primary" fullWidth onClick={() => setSelectedScheme(null)}>
                Got It
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default WorkerWelfare;

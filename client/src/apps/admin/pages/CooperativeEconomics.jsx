import React, { useState, useEffect } from 'react';
import {
  Building2,
  Coins,
  ShieldCheck,
  Users,
  TrendingUp,
  HeartHandshake,
  PieChart,
  CheckCircle2,
  ArrowUpRight,
  Landmark,
  Award,
  BadgeCheck,
  Layers,
  Scale,
  Vote,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import CooperativeVoting from '../../worker/pages/CooperativeVoting';
import { cooperativeAPI } from '../../../services/api';

export const CooperativeEconomics = ({ isReadOnlyWorkerVersion = false }) => {
  const [activeTab, setActiveTab] = useState('economics'); // 'economics' | 'voting'
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, claimsRes] = await Promise.allSettled([
          cooperativeAPI.getStats(),
          cooperativeAPI.getClaims()
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.success) {
          setStats(statsRes.value.data);
        }
        if (claimsRes.status === 'fulfilled' && claimsRes.value.success) {
          setClaims(claimsRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching cooperative data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalEarnings = stats?.todayEarnings || 2845600;
  const welfareTotal = stats?.welfareFundTotal || 316170;
  const activeMembers = stats?.activeWorkers || 937;
  const surplusTotal = stats?.coopSurplus || 142800;

  const fundAllocations = [
    { name: 'Worker Take-Home Wage (Direct UPI)', share: '90%', amount: `₹${totalEarnings.toLocaleString()}`, color: 'var(--color-black)', note: 'Directly paid to workers instantly on job completion' },
    { name: 'Worker Welfare & Insurance Fund', share: '10%', amount: `₹${welfareTotal.toLocaleString()}`, color: 'var(--color-accent)', note: 'Covers ₹5L health insurance, accident cover & tool subsidy' },
    { name: 'Private Intermediary / Investor Cut', share: '0%', amount: '₹0', color: '#16A34A', note: '100% zero venture capital or private company extraction' }
  ];

  const recentClaims = claims.length > 0 ? claims : [
    { title: 'Cashless Medical Hospitalization', recipient: 'Murugan P. (Electrician)', amount: '₹42,500', date: '22 Aug 2026', status: 'Settled' },
    { title: 'Tool Upgrade & Safety Gear Subsidy', recipient: 'Ravi Kumar (Plumber)', amount: '₹2,450', date: '18 Aug 2026', status: 'Settled' },
    { title: 'Emergency Community Credit (0% APR)', recipient: 'Sunita Shinde (Caregiver)', amount: '₹15,000', date: '14 Aug 2026', status: 'Disbursed' }
  ];


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER & PLAIN-LANGUAGE MISSION STATEMENT */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h1 style={{ fontSize: isReadOnlyWorkerVersion ? '20px' : '22px', fontWeight: 'bold', margin: 0 }}>
              Cooperative Economics & Governance
            </h1>
            <Badge variant="success" style={{ fontSize: '11px' }}>
              Audited Society Ledger
            </Badge>
          </div>

          {/* Sub-view switcher */}
          <div style={{ display: 'flex', gap: 6, background: 'var(--color-bg)', padding: 4, borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('economics')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeTab === 'economics' ? 'var(--color-black)' : 'transparent',
                color: activeTab === 'economics' ? 'white' : 'var(--color-black)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Economics & Surplus
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('voting')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeTab === 'voting' ? 'var(--color-black)' : 'transparent',
                color: activeTab === 'voting' ? 'white' : 'var(--color-black)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>🗳️ Member Voting</span>
              <Badge variant="active" style={{ fontSize: '9px', padding: '1px 5px' }}>Live</Badge>
            </button>
          </div>
        </div>

        {/* EXACT REQUIRED ONE-LINE MISSION STATEMENT IN PLAIN LANGUAGE */}
        <div style={{
          background: '#F0FDF4',
          border: '1.5px solid #22C55E',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginTop: 'var(--space-xs)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)'
        }}>
          <Scale size={20} color="#16A34A" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#15803D', margin: 0, lineHeight: 1.4 }}>
            "This is a worker-owned marketplace — cooperative workers earn directly, not a private company."
          </p>
        </div>
      </div>

      {/* RENDER ACTIVE TAB: ECONOMICS OR DEMOCRATIC VOTING LEDGER */}
      {activeTab === 'voting' ? (
        <CooperativeVoting isAdminView={true} />
      ) : (
        <>
          {/* 2. 4 LARGE CLEAR STAT CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-md)'
          }}>
            
            {/* Stat 1: Total Worker Earnings This Month */}
            <Card padding="md" style={{ borderLeft: '4px solid var(--color-black)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  WORKER EARNINGS (THIS MONTH)
                </span>
                <Coins size={18} color="var(--color-black)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
                ₹28,45,600
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                100% direct take-home (₹28.45 Lakhs)
              </div>
            </Card>

            {/* Stat 2: Total Insurance / Benefits Paid Out */}
            <Card padding="md" style={{ borderLeft: '4px solid var(--color-accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  BENEFITS & CLAIMS PAID OUT
                </span>
                <ShieldCheck size={18} color="var(--color-accent)" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-accent)' }}>
                ₹3,84,200
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                24 medical & tool subsidy claims
              </div>
            </Card>

            {/* Stat 3: Number of Active Worker-Members */}
            <Card padding="md" style={{ borderLeft: '4px solid #1E8E3E' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  ACTIVE WORKER-MEMBERS
                </span>
                <Users size={18} color="#1E8E3E" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
                937
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                Out of 1,248 total registered members
              </div>
            </Card>

            {/* Stat 4: Cooperative Surplus (Shown Simply) */}
            <Card padding="md" style={{ borderLeft: '4px solid #0284C7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  COOPERATIVE SURPLUS
                </span>
                <Landmark size={18} color="#0284C7" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: '#0284C7' }}>
                ₹1,42,800
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Retained for annual member dividend
              </div>
            </Card>

          </div>

          {/* 3. REVENUE & SURPLUS DISTRIBUTION BREAKDOWN */}
          <Card padding="md">
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 var(--space-sm)' }}>
              Fair Payout Economics (How Every Rupee is Split)
            </h2>

            {/* Visual 3-Segment Progress Bar */}
            <div style={{
              width: '100%',
              height: 16,
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              overflow: 'hidden',
              marginBottom: 'var(--space-md)'
            }}>
              <div style={{ width: '90%', background: 'var(--color-black)' }} title="90% Direct Worker Take-Home" />
              <div style={{ width: '10%', background: 'var(--color-accent)' }} title="10% Worker Welfare Pool" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {fundAllocations.map((item) => (
                <div
                  key={item.name}
                  style={{
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-black)' }}>
                      {item.name} ({item.share})
                    </div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>
                      {item.note}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: item.color }}>
                      {item.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. RECENT BENEFIT CLAIMS & SOCIAL SECURITY LOG */}
          <Card padding="md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                Recent Welfare & Insurance Settlements
              </h2>
              <span className="text-secondary" style={{ fontSize: '12px' }}>
                Paid from 10% Cooperative Pool
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentClaims.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'white'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{c.title}</div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>
                      Beneficiary: {c.recipient} • {c.date}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-success)' }}>
                      {c.amount}
                    </div>
                    <Badge variant="success" style={{ fontSize: '10px' }}>
                      {c.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 5. SOCIETY REGISTRATION & DEMOCRATIC GOVERNANCE FOOTER */}
          <div style={{
            background: 'var(--color-black)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Building2 size={24} color="var(--color-accent)" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  Chennai Central Labour Cooperative Society Ltd.
                </div>
                <div style={{ fontSize: '11px', color: '#BBB' }}>
                  Registration #TN-CHE-2024-88402 • Audited under Tamil Nadu Cooperative Societies Act, 1983
                </div>
              </div>
            </div>

            <Badge variant="active" style={{ fontSize: '11px' }}>
              1 Worker = 1 Vote
            </Badge>
          </div>
        </>
      )}

    </div>
  );
};

export default CooperativeEconomics;

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
  Loader2
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useAuth } from '../../../context/AuthContext';
import { bookingsAPI, adminAPI, cooperativeAPI } from '../../../services/api';

export const WorkerWelfare = () => {
  const navigate = useNavigate();
  const { worker } = useWorker();
  const { currentUser } = useAuth();
  const [welfareBalance, setWelfareBalance] = useState(0);
  const [coopStats, setCoopStats] = useState({ totalWorkers: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  const activeWorkerId = worker.workerId || currentUser?.userId;

  useEffect(() => {
    const fetchWelfareData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, statsRes] = await Promise.allSettled([
          activeWorkerId ? bookingsAPI.getAll({ workerId: activeWorkerId }) : Promise.resolve({ data: [] }),
          adminAPI.getStats()
        ]);

        if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && Array.isArray(bookingsRes.value.data)) {
          const completed = bookingsRes.value.data.filter(b => ['completed', 'paid', 'rated'].includes(b.status));
          const totalGross = completed.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
          setWelfareBalance(Math.round(totalGross * 0.10));
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.success && statsRes.value.data) {
          setCoopStats({
            totalWorkers: statsRes.value.data.totalWorkers || 0,
            totalEarnings: statsRes.value.data.totalEarningsDistributed || 0
          });
        }
      } catch (err) {
        console.warn('Welfare data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWelfareData();
  }, [activeWorkerId]);

  const govtSchemes = [
    {
      id: 'pmjjby',
      name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
      description: '₹2,00,000 life insurance protection for unorganized workers subsidized by the cooperative.',
      tag: 'Central Govt Scheme'
    },
    {
      id: 'eshram',
      name: 'e-Shram Universal Social Security Card',
      description: 'Central registry linking accidental insurance, pension benefits, and state welfare aid.',
      tag: 'National Social Registry'
    },
    {
      id: 'tnuwwb',
      name: 'Tamil Nadu Unorganised Workers Welfare Board (TNUWWB)',
      description: 'State welfare support including children education grants, maternity benefits, and monthly old-age pension.',
      tag: 'State Board Scheme'
    }
  ];

  const displayName = worker.name || currentUser?.name || 'Worker Member';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. HEADER & MISSION STATEMENT */}
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
              {coopStats.totalWorkers} members in registry
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
              Vote on cooperative resolutions
            </div>
          </div>
        </Card>
      </div>

      {/* 2. TWO CLEAR STATUS CARDS WITH GREEN DOT INDICATORS */}
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
            justifyContent: 'space-between'
          }}>
            <span className="text-secondary">Policy: #COOP-HLTH-8821</span>
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
            justifyContent: 'space-between'
          }}>
            <span className="text-secondary">Nominee: {worker.nominee?.name || 'Cooperative Family Nominee'}</span>
            <span className="text-bold">Instant Claim Portal</span>
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
            onClick={() => alert(`Tool Subsidy Claim: Current balance is ₹${welfareBalance}. You can submit tool invoices at the Ward 4 society office.`)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              background: 'white',
              color: 'var(--color-black)',
              border: 'none',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Claim for Tools
          </button>
          <button
            type="button"
            onClick={() => alert('Emergency Advance: Active cooperative workers can request zero-interest hardship grants up to ₹15,000.')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '12px',
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
                  onClick={() => alert(`Details for ${scheme.name}: Application assisted free of charge at Chennai Labour Cooperative Ward 4 Office.`)}
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
                  <span>Learn more</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default WorkerWelfare;

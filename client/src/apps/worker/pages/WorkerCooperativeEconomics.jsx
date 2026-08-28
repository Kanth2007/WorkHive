import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Coins,
  ShieldCheck,
  Users,
  Landmark,
  Scale,
  Building2,
  CheckCircle2,
  Award
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';

export const WorkerCooperativeEconomics = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <button
          type="button"
          onClick={() => navigate('/worker/welfare')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-white)',
            cursor: 'pointer'
          }}
          aria-label="Back to Welfare"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
            Cooperative Economics
          </h1>
          <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
            Audited Society Ledger • Ward 4 Chennai
          </p>
        </div>
      </div>

      {/* Required One-Line Mission Statement in Plain Language */}
      <div style={{
        background: '#F0FDF4',
        border: '1.5px solid #22C55E',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)'
      }}>
        <Scale size={22} color="#16A34A" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#15803D', margin: 0, lineHeight: 1.4 }}>
          "This is a worker-owned marketplace — cooperative workers earn directly, not a private company."
        </p>
      </div>

      {/* 4 Large Clear Stat Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        
        {/* Stat 1: Total Worker Earnings This Month */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-black)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              WORKER EARNINGS (THIS MONTH)
            </span>
            <Coins size={18} color="var(--color-black)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            ₹28,45,600
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
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
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-accent)' }}>
            ₹3,84,200
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            24 medical, accident & tool claims
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
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            937 Members
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
            1,248 total registered in cooperative
          </div>
        </Card>

        {/* Stat 4: Cooperative Surplus */}
        <Card padding="md" style={{ borderLeft: '4px solid #0284C7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              COOPERATIVE SURPLUS
            </span>
            <Landmark size={18} color="#0284C7" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: '#0284C7' }}>
            ₹1,42,800
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Retained for annual member dividend
          </div>
        </Card>

      </div>

      {/* 90% / 10% Split Explanation */}
      <Card padding="md">
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}>
          How Your Job Earnings Work
        </h3>
        
        <div style={{
          width: '100%',
          height: 14,
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          overflow: 'hidden',
          marginBottom: '12px'
        }}>
          <div style={{ width: '90%', background: 'var(--color-black)' }} />
          <div style={{ width: '10%', background: 'var(--color-accent)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>90%</strong> — Your direct instant take-home pay</span>
            <span className="text-bold">Direct UPI</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>10%</strong> — Deposited into your Welfare Fund</span>
            <span className="text-bold" style={{ color: 'var(--color-accent)' }}>Your Insurance</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 'bold' }}>
            <span><strong>0%</strong> — Private company or investor fee</span>
            <span>Zero Commission</span>
          </div>
        </div>
      </Card>

      {/* Cooperative Guarantee Badge */}
      <div style={{
        background: 'var(--color-black)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)'
      }}>
        <Building2 size={22} color="var(--color-accent)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '12px' }}>
          <div style={{ fontWeight: 'bold' }}>Chennai Central Labour Cooperative Society Ltd.</div>
          <div style={{ color: '#BBB', fontSize: '11px', marginTop: 1 }}>
            Democratic governance: 1 Worker = 1 Vote • Reg #TN-CHE-2024
          </div>
        </div>
      </div>

    </div>
  );
};

export default WorkerCooperativeEconomics;

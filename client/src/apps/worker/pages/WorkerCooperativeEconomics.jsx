import React, { useState, useEffect } from 'react';
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
  Award,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { cooperativeAPI, adminAPI } from '../../../services/api';

export const WorkerCooperativeEconomics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEarningsDistributed: 0,
    welfareFundBalance: 0,
    activeWorkers: 0,
    totalWorkers: 0,
    coopSurplus: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => {
      if (res.success && res.data) {
        setStats(res.data);
      }
    }).catch(() => {
      cooperativeAPI.getStats().then(res => {
        if (res.success && res.data) setStats(res.data);
      }).catch(() => {});
    }).finally(() => setLoading(false));
  }, []);

  const totalEarnings = stats.totalEarningsDistributed || 0;
  const welfareTotal = stats.welfareFundBalance || 0;
  const activeMembers = stats.activeWorkers || 0;
  const totalMembers = stats.totalWorkers || 0;
  const surplusTotal = stats.coopSurplus || 0;

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
            Audited Society Ledger • Chennai Central Cooperative
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

      {/* 4 Large Clear Stat Cards (100% Dynamic from MongoDB) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        
        {/* Stat 1: Total Worker Earnings This Month */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-black)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              WORKER EARNINGS (DIRECT UPI)
            </span>
            <Coins size={18} color="var(--color-black)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            ₹{totalEarnings.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
            100% direct take-home to member bank accounts
          </div>
        </Card>

        {/* Stat 2: Total Insurance / Benefits Paid Out */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              WELFARE & CLAIMS POOL (5%)
            </span>
            <ShieldCheck size={18} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-accent)' }}>
            ₹{welfareTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Covers emergency insurance, tool subsidies & safety gear
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
            {activeMembers} Online
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
            {totalMembers} total registered in cooperative
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
            ₹{surplusTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Retained for annual member dividend
          </div>
        </Card>

      </div>

      {/* 95% / 5% Split Explanation */}
      <Card padding="md">
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}>
          How Your Job Earnings Work
        </h3>
        <p className="text-secondary" style={{ fontSize: '13px', lineHeight: 1.5, margin: '0 0 12px' }}>
          In WorkHive, 95% of every customer payment is transferred directly to your bank account via UPI. The remaining 5% is held in your cooperative escrow pool to provide insurance, subsidies, and emergency benefits.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
            <span style={{ fontWeight: 600 }}>Your Direct Wage:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>95% (₹{Math.round(totalEarnings)})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
            <span style={{ fontWeight: 600 }}>Your Welfare Escrow:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>5% (₹{Math.round(welfareTotal)})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
            <span style={{ fontWeight: 600 }}>Platform Middleman Cut:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-black)' }}>0% (₹0)</span>
          </div>
        </div>
      </Card>

      {/* Society Details Card */}
      <Card padding="md" style={{ background: 'var(--color-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: '6px' }}>
          <Building2 size={20} color="var(--color-black)" />
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
            Chennai Central Labour Cooperative Society Ltd.
          </h4>
        </div>
        <p className="text-secondary" style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
          Reg. #TN-CHE-2024-88402 • Ward 4 Depot & Service Registry. Supervised by the Registrar of Cooperative Societies, Government of Tamil Nadu.
        </p>
      </Card>

    </div>
  );
};

export default WorkerCooperativeEconomics;

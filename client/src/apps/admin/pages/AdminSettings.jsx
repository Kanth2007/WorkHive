import React, { useState } from 'react';
import {
  RotateCcw,
  Settings,
  ShieldCheck,
  Building2,
  Database,
  CheckCircle2,
  Bell,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useDemoStore } from '../../../context/DemoStoreContext';

export const AdminSettings = () => {
  const { resetDemoData } = useDemoStore();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', paddingBottom: 'var(--space-xl)', maxWidth: '800px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
          Cooperative Node Settings
        </h1>
        <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
          Manage local cooperative node configurations, audit logs, and demo controls
        </p>
      </div>

      {/* Reset Feedback Banner */}
      {resetSuccess && (
        <div style={{
          background: '#F0FDF4',
          border: '1.5px solid #22C55E',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={22} color="#16A34A" />
          <div>
            <div style={{ fontWeight: 'bold', color: '#15803D', fontSize: '14px' }}>
              ✓ Demo Data Cleanly Reset!
            </div>
            <div style={{ color: '#166534', fontSize: '12px' }}>
              All customer bookings, worker jobs, live tracking state, and admin counters have been restored to initial state. Ready for next judge walkthrough.
            </div>
          </div>
        </div>
      )}

      {/* DEMO RUNTIME RESET PANEL (JUDGE READY) */}
      <Card padding="lg" style={{ border: '2px solid var(--color-accent)', background: '#FFFDFB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 106, 0, 0.15)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RotateCcw size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0 }}>
                Judge Demo Controls
              </h2>
              <span className="text-secondary" style={{ fontSize: '12px' }}>
                Replay the 14-step presentation from Step 1
              </span>
            </div>
          </div>

          <Badge variant="active">1-Click Clean Slate</Badge>
        </div>

        <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.5, margin: '0 0 var(--space-md)' }}>
          Resetting clears active customer bookings, reverts worker earnings to baseline (₹1,850), resets admin job counters (391 completed / 428 today), and clears member voting records.
        </p>

        <Button
          variant="primary"
          size="medium"
          icon={RotateCcw}
          onClick={handleReset}
        >
          Reset Demo Data to Initial State
        </Button>
      </Card>

      {/* Cooperative Node Metadata */}
      <Card padding="md">
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
          Node Information & Telemetry
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)', fontSize: '13px' }}>
          <div>
            <span className="text-secondary" style={{ fontSize: '11px' }}>COOPERATIVE REGISTRY</span>
            <div style={{ fontWeight: 'bold' }}>Chennai Central Labour Coop Ltd.</div>
          </div>

          <div>
            <span className="text-secondary" style={{ fontSize: '11px' }}>OPERATING JURISDICTION</span>
            <div style={{ fontWeight: 'bold' }}>Ward 4 (Adyar, Besant Nagar)</div>
          </div>

          <div>
            <span className="text-secondary" style={{ fontSize: '11px' }}>REGISTRATION CODE</span>
            <div style={{ fontWeight: 'bold' }}>TN-CHE-2024-88402</div>
          </div>

          <div>
            <span className="text-secondary" style={{ fontSize: '11px' }}>STATUTORY AUDITOR</span>
            <div style={{ fontWeight: 'bold' }}>Dept. of Cooperative Audit, TN</div>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default AdminSettings;

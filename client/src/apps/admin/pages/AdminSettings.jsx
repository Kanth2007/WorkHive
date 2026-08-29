import React, { useState } from 'react';
import {
  RotateCcw,
  Settings,
  ShieldCheck,
  Building2,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bell,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useDemoStore } from '../../../context/DemoStoreContext';
import { adminAPI } from '../../../services/api';

export const AdminSettings = () => {
  const { resetDemoData } = useDemoStore();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleReset = async () => {
    try {
      setResetting(true);
      setResetError('');
      setResetSuccess(false);

      // 1. Reset MongoDB collections to pristine initial baseline via Backend API
      await adminAPI.resetDemo();

      // 2. Clear local memory and context demo store
      await resetDemoData();

      // 3. Clean storage caches
      const storageKeysToPurge = [
        'sahakari_demo_store',
        'workhive_demo_store',
        'sahakari_proposal_vote_p1',
        'workhive_proposal_vote_p1',
        'sahakari_location_sharing',
        'workhive_location_sharing'
      ];
      storageKeysToPurge.forEach(k => localStorage.removeItem(k));
      Object.keys(localStorage).forEach(k => {
        if (k.includes('booking') || k.includes('bookings') || k.includes('vote')) {
          localStorage.removeItem(k);
        }
      });

      setResetSuccess(true);

      // 4. Refresh to update all live sidebar counter badges and active telemetry
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Reset error:', err);
      setResetError('Failed to reset database: ' + (err.response?.data?.message || err.message || 'Server error'));
    } finally {
      setResetting(false);
    }
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
              ✓ Database & Demo Data Cleanly Reset!
            </div>
            <div style={{ color: '#166534', fontSize: '12px' }}>
              All customer bookings, worker registrations, telemetry counters, and live state have been restored to initial baseline. Reloading...
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {resetError && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1.5px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          color: 'var(--color-danger)'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{resetError}</span>
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
                Replay the presentation from a clean initial state
              </span>
            </div>
          </div>

          <Badge variant="active">1-Click Clean Slate</Badge>
        </div>

        <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.5, margin: '0 0 var(--space-md)' }}>
          Resetting clears all registered test workers, active customer bookings, reverts worker earnings to baseline, resets admin job counters to 0, and restores the standard cooperative services catalog.
        </p>

        <Button
          variant="primary"
          size="medium"
          icon={resetting ? Loader2 : RotateCcw}
          onClick={handleReset}
          disabled={resetting}
          style={{ minWidth: '220px' }}
        >
          {resetting ? 'Resetting Database...' : 'Reset Demo Data to Initial State'}
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

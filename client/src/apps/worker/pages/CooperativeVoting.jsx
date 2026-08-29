import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Vote,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Calendar,
  Users,
  Building2,
  ArrowLeft,
  ShieldCheck,
  Award,
  Lock,
  Clock,
  Loader2,
  Plus,
  RotateCcw
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { cooperativeAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export const CooperativeVoting = ({ isAdminView = false }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [proposals, setProposals] = useState([]);
  const [activeProposal, setActiveProposal] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await cooperativeAPI.getProposals();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProposals(res.data);
        const p1 = res.data[0];
        setActiveProposal(p1);

        const memberKey = currentUser?.userId || currentUser?.phone || 'member';
        const savedVote = localStorage.getItem(`sahakari_vote_${p1.proposalCode}_${memberKey}`);
        if (savedVote) setUserVote(savedVote);
      } else {
        setProposals([]);
        setActiveProposal(null);
      }
    } catch (err) {
      console.error('Error fetching proposals from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [currentUser?.userId]);

  const yesVotes = activeProposal?.yesVotes || 0;
  const noVotes = activeProposal?.noVotes || 0;
  const totalVotes = yesVotes + noVotes;
  const yesPercent = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 50;
  const noPercent = totalVotes > 0 ? 100 - yesPercent : 50;

  const handleCastVote = async (choice) => {
    if (!activeProposal || votingLoading) return;
    setVotingLoading(true);

    const memberKey = currentUser?.userId || currentUser?.phone || 'member';
    setUserVote(choice);
    localStorage.setItem(`sahakari_vote_${activeProposal.proposalCode}_${memberKey}`, choice);

    try {
      const res = await cooperativeAPI.voteProposal(activeProposal.proposalCode, choice);
      if (res.success && res.data) {
        setActiveProposal(res.data);
        setProposals(prev => prev.map(p => p.proposalCode === res.data.proposalCode ? res.data : p));
      }
    } catch (err) {
      console.warn('MongoDB vote sync error:', err.message);
    } finally {
      setVotingLoading(false);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const data = await cooperativeAPI.createProposal({
        title: newTitle,
        description: newDesc,
        quorumRequired: 1,
        closesInDays: 7
      });
      if (data.success) {
        setShowNewModal(false);
        setNewTitle('');
        setNewDesc('');
        fetchProposals();
      }
    } catch (err) {
      alert('Error creating resolution: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER NAVIGATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          {!isAdminView && (
            <button
              type="button"
              onClick={() => navigate('/worker/welfare')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <ArrowLeft size={16} />
              <span>Welfare</span>
            </button>
          )}
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
            Cooperative Governance & Voting
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          {isAdminView && (
            <Button
              variant="outline"
              size="small"
              icon={Plus}
              onClick={() => setShowNewModal(true)}
            >
              Draft Resolution
            </Button>
          )}
          <Badge variant="success" style={{ fontSize: '11px' }}>
            1 Worker = 1 Vote System
          </Badge>
        </div>
      </div>

      {/* 2. DEMOCRACY EXPLANATION BANNER */}
      <div style={{
        background: '#F0FDF4',
        border: '1.5px solid #22C55E',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)'
      }}>
        <Scale size={20} color="#16A34A" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '13px', color: '#15803D', margin: 0, lineHeight: 1.4 }}>
          <strong>Democratic Principle:</strong> In our cooperative society, every registered member holds an equal vote on surplus fund allocation, commission caps, and worker welfare policies.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
          <Loader2 size={24} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-secondary" style={{ fontSize: '13px', marginTop: 8 }}>Loading active resolutions from MongoDB...</p>
        </div>
      ) : !activeProposal ? (
        <EmptyState
          icon={Vote}
          title="No Active Resolutions"
          description="There are currently no active resolutions open for member voting. When the cooperative committee drafts new proposals, they will appear here."
        />
      ) : (
        <>
          {/* 3. ACTIVE RESOLUTION BALLOT CARD */}
          <Card padding="md" style={{ border: '2px solid var(--color-black)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
              <Badge variant="active" style={{ fontSize: '11px' }}>
                Ballot #{activeProposal.proposalCode} • Active Resolution
              </Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                <Clock size={14} />
                <span>Closes in {activeProposal.closesInDays || 3} days</span>
              </div>
            </div>

            <h2 style={{ fontSize: '17px', fontWeight: 'bold', margin: '4px 0 8px', color: 'var(--color-black)', lineHeight: 1.3 }}>
              {activeProposal.title}
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 var(--space-md)' }}>
              {activeProposal.description}
            </p>

            {/* Voting Options (Yes / No) */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', margin: 'var(--space-md) 0' }}>
              <button
                type="button"
                onClick={() => handleCastVote('YES')}
                disabled={votingLoading}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${userVote === 'YES' ? '#22C55E' : 'var(--color-border)'}`,
                  background: userVote === 'YES' ? '#F0FDF4' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ThumbsUp size={18} color={userVote === 'YES' ? '#16A34A' : 'var(--color-black)'} />
                  <span style={{ fontWeight: 'bold', fontSize: '15px', color: userVote === 'YES' ? '#16A34A' : 'var(--color-black)' }}>
                    Vote YES
                  </span>
                </div>
                <span className="text-secondary" style={{ fontSize: '11px' }}>In favor of resolution</span>
              </button>

              <button
                type="button"
                onClick={() => handleCastVote('NO')}
                disabled={votingLoading}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${userVote === 'NO' ? '#EF4444' : 'var(--color-border)'}`,
                  background: userVote === 'NO' ? '#FEF2F2' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ThumbsDown size={18} color={userVote === 'NO' ? '#DC2626' : 'var(--color-black)'} />
                  <span style={{ fontWeight: 'bold', fontSize: '15px', color: userVote === 'NO' ? '#DC2626' : 'var(--color-black)' }}>
                    Vote NO
                  </span>
                </div>
                <span className="text-secondary" style={{ fontSize: '11px' }}>Oppose resolution</span>
              </button>
            </div>

            {/* Voting Status Message */}
            {userVote && (
              <div style={{
                background: userVote === 'YES' ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${userVote === 'YES' ? '#22C55E' : '#EF4444'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: userVote === 'YES' ? '#15803D' : '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <CheckCircle2 size={16} />
                <span>Your ballot has been cast ({userVote}) and saved to the cooperative ledger.</span>
              </div>
            )}

            {/* 4. LIVE AUDITED RESULTS BAR */}
            <div style={{ marginTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: 6 }}>
                <span>YES ({yesVotes} vote{yesVotes === 1 ? '' : 's'} • {yesPercent}%)</span>
                <span>NO ({noVotes} vote{noVotes === 1 ? '' : 's'} • {noPercent}%)</span>
              </div>

              <div style={{ width: '100%', height: 10, borderRadius: 'var(--radius-full)', background: noVotes > 0 ? '#EF4444' : '#E2E8F0', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${yesPercent}%`, background: yesVotes > 0 ? '#22C55E' : '#E2E8F0', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 6 }}>
                <span>Total Ballots: <strong>{totalVotes}</strong></span>
                <span>Quorum: {totalVotes >= (activeProposal.quorumRequired || 1) ? '✓ Met' : `${totalVotes}/${activeProposal.quorumRequired || 1} required`}</span>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* DRAFT NEW RESOLUTION MODAL */}
      {showNewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-md)'
        }}>
          <Card padding="md" style={{ maxWidth: '440px', width: '100%', background: 'white' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px' }}>
              Draft New Cooperative Resolution
            </h3>
            <form onSubmit={handleCreateProposal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Resolution Question / Title</label>
                <input
                  type="text"
                  className="ss-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Should we increase tool subsidy cap to ₹5,000?"
                  required
                  style={{ width: '100%', marginTop: 2 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Resolution Description & Impact</label>
                <textarea
                  rows={3}
                  className="ss-input"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details of the proposal..."
                  style={{ width: '100%', marginTop: 2, resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button variant="outline" size="small" type="button" onClick={() => setShowNewModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="small" type="submit">
                  Publish Resolution
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};

export default CooperativeVoting;

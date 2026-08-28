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
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { cooperativeAPI } from '../../../services/api';

export const CooperativeVoting = ({ isAdminView = false }) => {
  const navigate = useNavigate();

  // Voting state stored in localStorage for persistence across reloads
  const [userVote, setUserVote] = useState(() => {
    return localStorage.getItem('sahakari_proposal_vote_p1') || null;
  });

  const [proposals, setProposals] = useState([]);
  const [activeProposal, setActiveProposal] = useState(null);
  const [yesVotes, setYesVotes] = useState(490);
  const [noVotes, setNoVotes] = useState(190);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await cooperativeAPI.getProposals();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProposals(res.data);
        const p1 = res.data[0];
        setActiveProposal(p1);
        setYesVotes(p1.yesVotes);
        setNoVotes(p1.noVotes);
      }
    } catch (err) {
      console.error('Error fetching proposals from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const totalVotes = yesVotes + noVotes;
  const yesPercent = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 72;
  const noPercent = 100 - yesPercent;

  const handleCastVote = async (choice) => {
    if (userVote) return;
    setUserVote(choice);
    localStorage.setItem('sahakari_proposal_vote_p1', choice);
    if (choice === 'YES') {
      setYesVotes((prev) => prev + 1);
    } else {
      setNoVotes((prev) => prev + 1);
    }

    try {
      const code = activeProposal?.proposalCode || 'PROP-2026-04';
      await cooperativeAPI.voteProposal(code, choice);
    } catch (err) {
      console.warn('MongoDB vote sync error:', err.message);
    }
  };

  const handleResetVote = () => {
    setUserVote(null);
    localStorage.removeItem('sahakari_proposal_vote_p1');
    setYesVotes(490);
    setNoVotes(190);
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
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h1 style={{ fontSize: isAdminView ? '20px' : '22px', fontWeight: 'bold', margin: 0 }}>
                🗳️ Cooperative Democratic Voting
              </h1>
              <Badge variant="active" style={{ fontSize: '11px' }}>
                1 Worker = 1 Vote
              </Badge>
            </div>
            <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
              {isAdminView ? 'Society Member Ballots • Read-Only Audit Ledger' : 'Cast your vote on member proposals and surplus allocations'}
            </p>
          </div>
        </div>

        {/* Dev Reset Vote Tool */}
        {!isAdminView && userVote && (
          <button
            type="button"
            onClick={handleResetVote}
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Vote (Demo)
          </button>
        )}
      </div>

      {/* 2. CURRENT ACTIVE PROPOSAL CARD */}
      <Card padding="lg" style={{ border: '2px solid var(--color-black)', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              background: 'var(--color-black)',
              color: 'white',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '3px 8px',
              borderRadius: '4px'
            }}>
              ACTIVE BALLOT #PROP-2026-04
            </span>
            <span className="text-secondary" style={{ fontSize: '12px' }}>
              Ward 4 Assembly
            </span>
          </div>

          <Badge variant="active" style={{ fontSize: '11px' }}>
            ● Voting Open (Closes in 3 Days)
          </Badge>
        </div>

        {/* The Exact Proposal Title Question */}
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 'var(--space-xs) 0', color: 'var(--color-black)', lineHeight: 1.3 }}>
          "Should 5% of cooperative surplus be allocated to emergency worker assistance?"
        </h2>

        {/* Plain-Language Explanation of the Proposal */}
        <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.5, margin: '0 0 var(--space-md)' }}>
          This resolution authorizes the cooperative committee to earmark 5% of monthly surplus revenues (approx. ₹7,140/mo) into an immediate, zero-interest emergency hardship grant pool for active members facing medical or extreme weather distress.
        </p>

        {/* 3. LARGE YES / NO VOTE RESULT BAR */}
        <div style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#16A34A' }}>
                {yesPercent}% YES
              </span>
              <span className="text-secondary" style={{ fontSize: '12px', marginLeft: '6px' }}>
                ({yesVotes} member votes)
              </span>
            </div>

            <div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                {noPercent}% NO
              </span>
              <span className="text-secondary" style={{ fontSize: '12px', marginLeft: '6px' }}>
                ({noVotes} member votes)
              </span>
            </div>
          </div>

          {/* Progress Bar (72% YES / 28% NO) */}
          <div style={{
            width: '100%',
            height: '20px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div
              style={{
                width: `${yesPercent}%`,
                background: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
                transition: 'width 0.3s ease'
              }}
            >
              {yesPercent}%
            </div>
            <div
              style={{
                width: `${noPercent}%`,
                background: 'var(--color-black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
                transition: 'width 0.3s ease'
              }}
            >
              {noPercent}%
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            <span>Quorum Requirement: 500+ votes</span>
            <span style={{ fontWeight: 'bold', color: '#16A34A' }}>✓ Quorum Achieved ({totalVotes} votes cast)</span>
          </div>
        </div>

        {/* 4. VOTING CONTROLS: WORKER VIEW (TAPPABLE BUTTONS) vs ADMIN VIEW (READ-ONLY) */}
        {!isAdminView ? (
          <div>
            {userVote ? (
              /* Already Voted Confirmation Banner */
              <div style={{
                background: '#F0FDF4',
                border: '1.5px solid #22C55E',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-xs)',
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <CheckCircle2 size={24} color="#16A34A" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#15803D' }}>
                      ✅ Your vote has been recorded
                    </div>
                    <div style={{ fontSize: '12px', color: '#166534' }}>
                      You cast your ballot as: <strong>{userVote}</strong> • Registered under Member ID #CLC-EL-402
                    </div>
                  </div>
                </div>

                <Badge variant="success">Ballot Sealed</Badge>
              </div>
            ) : (
              /* Two Big Tappable Voting Buttons */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <Button
                  variant="primary"
                  size="large"
                  icon={ThumbsUp}
                  style={{
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: '#16A34A',
                    borderColor: '#16A34A'
                  }}
                  onClick={() => handleCastVote('YES')}
                >
                  Vote YES 👍
                </Button>

                <Button
                  variant="outline"
                  size="large"
                  icon={ThumbsDown}
                  style={{
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderColor: 'var(--color-black)',
                    color: 'var(--color-black)'
                  }}
                  onClick={() => handleCastVote('NO')}
                >
                  Vote NO 👎
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Admin Read-Only Message */
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <Lock size={14} />
            <span>Administrator View: Ballots are voted exclusively by verified cooperative members. Results tally live in real time.</span>
          </div>
        )}

      </Card>

      {/* 5. PAST RESOLUTIONS & BALLOT ARCHIVE */}
      <Card padding="md">
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
          Past Member Resolutions & Results
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FAFAFA'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                #PROP-2026-03: Increase monsoon safety tool subsidy pool from ₹2,000 to ₹2,500
              </div>
              <div className="text-secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                Passed on 15 July 2026 • 88% YES (610 votes) • Status: Implemented
              </div>
            </div>
            <Badge variant="success" style={{ fontSize: '10px' }}>Passed & Active</Badge>
          </div>

          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FAFAFA'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                #PROP-2026-02: Partner with Apollo Reach Clinic for 24x7 emergency worker helpline
              </div>
              <div className="text-secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                Passed on 02 June 2026 • 94% YES (722 votes) • Status: Active
              </div>
            </div>
            <Badge variant="success" style={{ fontSize: '10px' }}>Passed & Active</Badge>
          </div>

        </div>
      </Card>

    </div>
  );
};

export default CooperativeVoting;

import React from 'react';
import { Wallet, ArrowDownLeft, CheckCircle2, ShieldCheck, Download, Plus } from 'lucide-react';
import { Button, Card, Badge } from '../../../components';

export const CustomerPayments = () => {
  const transactions = [
    { id: 'TXN-8821', service: 'Electric Repair (Ramesh Patil)', amount: '₹250', date: 'Today, 4:45 PM', method: 'UPI / Cash', status: 'Completed' },
    { id: 'TXN-8790', service: 'Home Cleaning (Sunita Shinde)', amount: '₹350', date: '27 Aug 2026', method: 'Coop Wallet', status: 'Completed' },
    { id: 'TXN-8704', service: 'Plumbing Visit (Santosh More)', amount: '₹300', date: '21 Aug 2026', method: 'UPI', status: 'Completed' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>Payments & Fair Rates</h1>
        <p className="text-secondary" style={{ fontSize: '13px' }}>Transparent cooperative invoices and receipts</p>
      </div>

      {/* Summary Card */}
      <Card style={{ background: 'var(--color-black)', color: 'var(--color-white)' }}>
        <div style={{ fontSize: '13px', color: '#B0B0B0' }}>Total Spent on Community Services</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-white)', margin: '4px 0' }}>₹900</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
          <span style={{ fontSize: '12px', color: '#CCCCCC' }}>3 services booked</span>
          <Badge variant="success">100% Paid Direct to Workers</Badge>
        </div>
      </Card>

      {/* Society Fund Guarantee */}
      <div style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }}>
        <ShieldCheck size={24} color="var(--color-success)" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Cooperative Zero-Commission Policy</div>
          <div className="text-secondary" style={{ fontSize: '12px' }}>
            Workers receive 100% of the service fee. 0% middleman platform deduction.
          </div>
        </div>
      </div>

      {/* Recent Receipts List */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
          Payment History & Receipts
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {transactions.map((txn) => (
            <Card key={txn.id} padding="sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '15px', margin: 0 }}>{txn.service}</h3>
                  <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                    {txn.date} • {txn.method}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{txn.amount}</div>
                  <Badge variant="success" style={{ fontSize: '11px', padding: '1px 6px' }}>{txn.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerPayments;

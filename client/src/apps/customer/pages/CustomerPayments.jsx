import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownLeft, CheckCircle2, ShieldCheck, Download, Plus, Loader2, Calendar } from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';
import { bookingsAPI } from '../../../services/api';

export const CustomerPayments = () => {
  const { user } = useCustomer();
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const activePhone = currentUser?.phone || user?.contact || user?.phone;
        const activeId = currentUser?.userId || user?.userId;
        const activeName = currentUser?.name || user?.name;

        if (!activePhone && !activeId && !activeName) {
          setPayments([]);
          return;
        }

        const query = {};
        if (activePhone) query.customerPhone = activePhone;
        if (activeId) query.customerId = activeId;
        if (activeName && !['Member', 'Customer'].includes(activeName)) query.customerName = activeName;

        const res = await bookingsAPI.getAll(query);
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(b => ({
            id: b.bookingId || b._id,
            service: `${b.serviceCategory || 'Service'} (${b.workerName || 'Assigned Worker'})`,
            amount: `₹${b.amount || 0}`,
            amountNum: Number(b.amount) || 0,
            date: b.dateString || 'Recently',
            method: b.paymentMethod ? b.paymentMethod.toUpperCase() : 'UPI',
            status: ['completed', 'paid', 'rated'].includes(b.status) ? 'Completed' : 'Pending'
          }));
          setPayments(mapped);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.warn('Error fetching customer payments from MongoDB:', err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.contact, user?.phone, currentUser?.phone, currentUser?.userId]);

  const totalSpent = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amountNum, 0);

  const completedCount = payments.filter(p => p.status === 'Completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>Payments & Invoices</h1>
        <p className="text-secondary" style={{ fontSize: '13px' }}>
          Customer: <strong>{user?.name || currentUser?.name || 'Member'}</strong> • Live MongoDB Ledger
        </p>
      </div>

      {/* Summary Card */}
      <Card style={{ background: 'var(--color-black)', color: 'var(--color-white)' }}>
        <div style={{ fontSize: '13px', color: '#B0B0B0' }}>Total Spent on Community Services</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-white)', margin: '4px 0' }}>
          ₹{totalSpent.toLocaleString()}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
          <span style={{ fontSize: '12px', color: '#CCCCCC' }}>
            {completedCount} service{completedCount === 1 ? '' : 's'} completed
          </span>
          <Badge variant="success">100% Direct to Workers</Badge>
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
            Workers receive 100% of the service fee directly. 0% middleman platform deduction.
          </div>
        </div>
      </div>

      {/* Payment History List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
            Payment History & Receipts ({payments.length})
          </h2>
          <span className="text-secondary" style={{ fontSize: '12px' }}>Audited in Database</span>
        </div>

        {loading ? (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <Loader2 size={24} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-secondary" style={{ fontSize: '13px', marginTop: 8 }}>Loading payments from MongoDB...</p>
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No Payment History Yet"
            description="When you complete service bookings, your verified digital invoices and receipts will appear here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {payments.map((txn) => (
              <Card key={txn.id} padding="sm">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 'bold' }}>{txn.service}</h3>
                    <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                      {txn.date} • Paid via {txn.method}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{txn.amount}</div>
                    <Badge
                      variant={txn.status === 'Completed' ? 'success' : 'active'}
                      style={{ fontSize: '11px', padding: '1px 6px', marginTop: 2 }}
                    >
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPayments;

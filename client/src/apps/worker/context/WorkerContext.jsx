import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { workersAPI, authAPI } from '../../../services/api';

const WorkerContext = createContext();

export const WorkerProvider = ({ children }) => {
  const { currentUser, getRoleSession } = useAuth();
  const workerSession = getRoleSession('worker') || (currentUser?.role === 'worker' ? currentUser : null);

  const [worker, setWorker] = useState(() => {
    if (workerSession) {
      return {
        workerId: workerSession.userId,
        name: workerSession.name || 'Worker Member',
        phone: workerSession.phone || '',
        email: workerSession.email || '',
        address: workerSession.locality || 'Ward 4, Adyar, Chennai',
        locality: workerSession.locality || 'Ward 4, Adyar, Chennai',
        serviceRadius: '5 km',
        languages: ['Tamil', 'English'],
        skill: workerSession.skill || 'General Services',
        skills: workerSession.skills || [workerSession.skill || 'General Services'],
        experience: workerSession.experience || '3 years',
        idDocument: 'aadhaar_card_verified.pdf',
        certDocument: 'skill_trade_cert.pdf',
        payoutType: 'upi',
        upiId: `${workerSession.name ? workerSession.name.toLowerCase().replace(/\s+/g, '') : 'worker'}@okaxis`,
        bankDetails: {
          accountNumber: '918273645521',
          ifsc: 'HDFC0001824',
          bankName: 'HDFC Bank Adyar'
        },
        nominee: {
          name: 'Cooperative Nominee',
          relation: 'Family',
          payout: 'nominee@okaxis'
        },
        isRegistered: true,
        verificationStatus: workerSession.status === 'Pending' ? 'pending' : 'verified',
        isOnline: true,
        avatar: workerSession.avatar || 'W',
        completedJobs: 0,
        rating: 5.0
      };
    }
    return {
      workerId: '',
      phone: '',
      name: '',
      address: '',
      locality: 'Ward 4, Chennai',
      serviceRadius: '5 km',
      languages: ['Tamil', 'English'],
      skill: '',
      skills: [],
      experience: '',
      payoutType: 'upi',
      upiId: '',
      bankDetails: {
        accountNumber: '',
        ifsc: '',
        bankName: ''
      },
      nominee: {
        name: '',
        relation: '',
        payout: ''
      },
      isRegistered: false,
      verificationStatus: 'pending',
      isOnline: true,
      avatar: 'W',
      completedJobs: 0,
      rating: 0
    };
  });

  // Sync worker state whenever a new/different worker logs in
  const syncWorkerFromAuthAndDB = useCallback(async () => {
    if (!workerSession) return;

    const baseData = {
      workerId: workerSession.userId,
      name: workerSession.name || 'Worker Member',
      phone: workerSession.phone || '',
      email: workerSession.email || '',
      address: workerSession.locality || 'Ward 4, Adyar, Chennai',
      locality: workerSession.locality || 'Ward 4, Adyar, Chennai',
      serviceRadius: '5 km',
      languages: ['Tamil', 'English'],
      skill: workerSession.skill || 'General Services',
      skills: workerSession.skills || [workerSession.skill || 'General Services'],
      experience: workerSession.experience || '3 years',
      payoutType: 'upi',
      upiId: `${workerSession.name ? workerSession.name.toLowerCase().replace(/\s+/g, '') : 'worker'}@okaxis`,
      isRegistered: true,
      verificationStatus: workerSession.status === 'Pending' ? 'pending' : 'verified',
      isOnline: true,
      avatar: workerSession.avatar || 'W',
      completedJobs: 0,
      rating: 5.0
    };

    setWorker(prev => ({ ...prev, ...baseData }));

    // Try fetching detailed worker record from MongoDB
    try {
      const res = await workersAPI.getById(workerSession.userId);
      if (res.success && res.data) {
        setWorker(prev => ({
          ...prev,
          ...res.data,
          workerId: res.data.workerId || workerSession.userId,
          name: res.data.name || workerSession.name,
          phone: res.data.phone || workerSession.phone,
          skill: res.data.skill || workerSession.skill,
          skills: res.data.skills || [res.data.skill],
          avatar: res.data.avatar || workerSession.avatar,
          verificationStatus: res.data.status === 'Verified' ? 'verified' : 'pending'
        }));
      }
    } catch {
      // Fall back to base session data
    }
  }, [workerSession]);

  useEffect(() => {
    syncWorkerFromAuthAndDB();
  }, [syncWorkerFromAuthAndDB]);

  const updateWorker = async (fields) => {
    setWorker((prev) => ({ ...prev, ...fields }));

    if (worker.workerId) {
      try {
        await workersAPI.update(worker.workerId, fields);
      } catch (e) {
        console.warn('Could not persist worker updates to MongoDB:', e.message);
      }
    }
  };

  const completeRegistration = (data = {}) => {
    setWorker((prev) => ({
      ...prev,
      ...data,
      isRegistered: true,
      verificationStatus: 'pending'
    }));
  };

  const toggleVerification = () => {
    const nextStatus = worker.verificationStatus === 'verified' ? 'pending' : 'verified';
    updateWorker({ verificationStatus: nextStatus, status: nextStatus === 'verified' ? 'Verified' : 'Pending' });
  };

  const toggleAvailability = () => {
    const nextOnline = !worker.isOnline;
    updateWorker({ isOnline: nextOnline });
  };

  const resetWorker = () => {
    setWorker({});
  };

  return (
    <WorkerContext.Provider
      value={{
        worker,
        updateWorker,
        completeRegistration,
        toggleVerification,
        toggleAvailability,
        resetWorker,
        syncWorkerFromAuthAndDB
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within WorkerProvider');
  }
  return context;
};

export default WorkerContext;

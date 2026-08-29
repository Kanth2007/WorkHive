import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookingsAPI, adminAPI, cooperativeAPI } from '../services/api';

const DemoStoreContext = createContext();

const INITIAL_DEMO_STATE = {
  activeBooking: null,
  workerStats: {
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    welfareBalance: 0,
    completedJobsToday: 0,
    recentJobs: []
  },
  adminStats: {
    totalWorkers: 0,
    activeWorkers: 0,
    todayJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    plumbingDemandCount: 0
  }
};

export const DemoStoreProvider = ({ children }) => {
  const [demoState, setDemoState] = useState(() => {
    try {
      const saved = localStorage.getItem('sahakari_demo_store');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_STATE;
    } catch {
      return INITIAL_DEMO_STATE;
    }
  });

  // Fetch live stats from MongoDB on mount
  useEffect(() => {
    const fetchLiveDBState = async () => {
      try {
        const [adminRes, bookingsRes] = await Promise.allSettled([
          adminAPI.getStats(),
          bookingsAPI.getAll({ limit: 5 })
        ]);

        if (adminRes.status === 'fulfilled' && adminRes.value.success) {
          const stats = adminRes.value.data;
          setDemoState(prev => ({
            ...prev,
            adminStats: {
              ...prev.adminStats,
              totalWorkers: stats.totalWorkers || prev.adminStats.totalWorkers,
              activeWorkers: stats.activeWorkers || prev.adminStats.activeWorkers,
              todayJobs: stats.todayJobs || prev.adminStats.todayJobs,
              completedJobs: stats.completedJobs || prev.adminStats.completedJobs,
              pendingJobs: stats.pendingJobs || prev.adminStats.pendingJobs
            }
          }));
        }

        if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && bookingsRes.value.data.length > 0) {
          const latest = bookingsRes.value.data[0];
          if (latest.status !== 'completed' && latest.status !== 'paid' && latest.status !== 'rated') {
            setDemoState(prev => ({
              ...prev,
              activeBooking: {
                id: latest.bookingId,
                customerName: latest.customerName,
                customerPhone: latest.customerPhone,
                customerAddress: latest.customerAddress,
                serviceCategory: latest.serviceCategory,
                serviceDetails: latest.serviceDetails,
                workerId: latest.workerId,
                workerName: latest.workerName,
                amount: latest.amount,
                status: latest.status,
                isLocationSharing: latest.isLocationSharing,
                rating: latest.rating,
                arrivalPin: latest.arrivalPin
              }
            }));
          }
        }
      } catch (err) {
        console.warn('Initial MongoDB sync warning:', err.message);
      }
    };

    fetchLiveDBState();
  }, []);

  // Cross-tab synchronization via storage event and BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('sahakari_demo_channel');
    
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'DEMO_STATE_UPDATE') {
        setDemoState(e.data.payload);
      }
    };

    const handleStorage = (e) => {
      if (e.key === 'sahakari_demo_store' && e.newValue) {
        try {
          setDemoState(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    channel.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
      channel.close();
    };
  }, []);

  const broadcastUpdate = (newState) => {
    setDemoState(newState);
    try {
      localStorage.setItem('sahakari_demo_store', JSON.stringify(newState));
      const channel = new BroadcastChannel('sahakari_demo_channel');
      channel.postMessage({ type: 'DEMO_STATE_UPDATE', payload: newState });
      channel.close();
    } catch (err) {
      console.error('Demo broadcast error:', err);
    }
  };

  // 1. Customer creates a booking (Step 5)
  const createBooking = async ({
    serviceCategory = 'Plumbing',
    serviceDetails = 'Kitchen pipe leakage under sink',
    workerId = 'ravi-kumar',
    workerName = 'Ravi Kumar',
    amount = 450
  }) => {
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: bookingId,
      bookingId,
      customerName: 'Priya Sundaram',
      customerPhone: '+91 98401 23456',
      customerAddress: 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar, Chennai',
      serviceCategory,
      serviceDetails,
      workerId,
      workerName,
      amount,
      status: 'pending',
      isLocationSharing: false,
      rating: 0,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextState = {
      ...demoState,
      activeBooking: newBooking,
      adminStats: {
        ...demoState.adminStats,
        todayJobs: demoState.adminStats.todayJobs + 1,
        pendingJobs: demoState.adminStats.pendingJobs + 1,
        plumbingDemandCount: demoState.adminStats.plumbingDemandCount + 1
      }
    };

    broadcastUpdate(nextState);

    // Save to MongoDB asynchronously
    try {
      await bookingsAPI.create({
        bookingId,
        customerName: newBooking.customerName,
        customerPhone: newBooking.customerPhone,
        customerAddress: newBooking.customerAddress,
        serviceCategory,
        serviceDetails,
        workerId,
        workerName,
        amount
      });
    } catch (err) {
      console.warn('MongoDB booking create sync warning:', err.message);
    }

    return newBooking;
  };

  // 2. Worker updates booking status (Steps 7, 8, 9)
  const updateBookingStatus = async (status, extra = {}) => {
    if (!demoState.activeBooking) return;

    let updatedBooking = {
      ...demoState.activeBooking,
      status,
      ...extra
    };

    let nextState = {
      ...demoState,
      activeBooking: updatedBooking
    };

    // When worker reaches 'completed', prepare earnings and admin stats
    if (status === 'completed') {
      const gross = updatedBooking.amount;
      const workerShare = Math.round(gross * 0.9);
      const welfareShare = gross - workerShare;

      nextState = {
        ...nextState,
        workerStats: {
          ...nextState.workerStats,
          todayEarnings: nextState.workerStats.todayEarnings + workerShare,
          weekEarnings: nextState.workerStats.weekEarnings + workerShare,
          monthEarnings: nextState.workerStats.monthEarnings + workerShare,
          welfareBalance: nextState.workerStats.welfareBalance + welfareShare,
          completedJobsToday: nextState.workerStats.completedJobsToday + 1,
          recentJobs: [
            {
              id: 'JOB-' + Math.floor(1000 + Math.random() * 9000),
              date: 'Just now',
              service: updatedBooking.serviceDetails || 'Kitchen pipe leakage',
              customer: updatedBooking.customerName,
              earned: workerShare,
              gross,
              welfare: welfareShare
            },
            ...nextState.workerStats.recentJobs
          ]
        },
        adminStats: {
          ...nextState.adminStats,
          completedJobs: nextState.adminStats.completedJobs + 1,
          pendingJobs: Math.max(0, nextState.adminStats.pendingJobs - 1)
        }
      };
    }

    broadcastUpdate(nextState);

    // Persist status change to MongoDB
    try {
      const bId = updatedBooking.bookingId || updatedBooking.id;
      if (bId) {
        await bookingsAPI.updateStatus(bId, { status, ...extra });
      }
    } catch (err) {
      console.warn('MongoDB booking update sync warning:', err.message);
    }
  };

  // 3. Toggle Location Sharing
  const setLocationSharing = async (isSharing) => {
    if (!demoState.activeBooking) return;
    const nextState = {
      ...demoState,
      activeBooking: {
        ...demoState.activeBooking,
        isLocationSharing: isSharing
      }
    };
    broadcastUpdate(nextState);

    try {
      const bId = demoState.activeBooking.bookingId || demoState.activeBooking.id;
      if (bId) {
        await bookingsAPI.updateStatus(bId, { isLocationSharing: isSharing });
      }
    } catch (err) {
      console.warn('MongoDB location sharing sync warning:', err.message);
    }
  };

  // 4. Customer submits rating & feedback (Step 11)
  const submitRating = async (ratingScore, feedbackText = '') => {
    if (!demoState.activeBooking) return;
    const nextState = {
      ...demoState,
      activeBooking: {
        ...demoState.activeBooking,
        status: 'rated',
        rating: ratingScore,
        feedback: feedbackText
      }
    };
    broadcastUpdate(nextState);

    try {
      const bId = demoState.activeBooking.bookingId || demoState.activeBooking.id;
      if (bId) {
        await bookingsAPI.updateStatus(bId, { status: 'rated', rating: ratingScore, feedback: feedbackText });
      }
    } catch (err) {
      console.warn('MongoDB rating submit sync warning:', err.message);
    }
  };

  // 5. Reset Demo Data Tool (Step 15)
  const resetDemoData = async () => {
    localStorage.removeItem('sahakari_proposal_vote_p1');
    localStorage.removeItem('sahakari_location_sharing');
    broadcastUpdate(INITIAL_DEMO_STATE);

    try {
      await adminAPI.resetDemo();
    } catch (err) {
      console.warn('MongoDB resetDemo sync warning:', err.message);
    }
  };

  return (
    <DemoStoreContext.Provider value={{
      demoState,
      activeBooking: demoState.activeBooking,
      workerStats: demoState.workerStats,
      adminStats: demoState.adminStats,
      createBooking,
      updateBookingStatus,
      setLocationSharing,
      submitRating,
      resetDemoData
    }}>
      {children}
    </DemoStoreContext.Provider>
  );
};

export const useDemoStore = () => {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error('useDemoStore must be used within a DemoStoreProvider');
  }
  return context;
};

export default DemoStoreContext;

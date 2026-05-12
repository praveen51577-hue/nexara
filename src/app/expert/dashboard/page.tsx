"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Users, CalendarCheck, MessageSquare, Search, Filter, MoreHorizontal, LogOut, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ExpertDashboard() {
  const router = useRouter();
  const [expert, setExpert] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalClients: 0, totalBookings: 0, activeConsultations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().role === 'expert') {
          setExpert(user);
          loadDashboardData();
        } else {
          router.push('/expert-auth');
        }
      } else {
        router.push('/expert-auth');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadDashboardData = () => {
    // Fetch all bookings (queries)
    const qBookings = query(collection(db, "bookings"), orderBy("timestamp", "desc"));
    onSnapshot(qBookings, (snapshot) => {
      const bookingsData: any[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setBookings(bookingsData);
      
      // Calculate stats based on real queries
      const uniqueClients = new Set(bookingsData.map(b => b.email || b.userId)).size;
      
      setStats({
        totalClients: uniqueClients,
        totalBookings: bookingsData.length,
        activeConsultations: bookingsData.filter(b => b.status === 'active' || b.status === 'in-progress').length
      });
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Expert Workspace...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingBottom: '5rem' }}>
      <Navbar />
      <div className="hero-glow" style={{ top: '-30%' }}></div>
      
      <div className="container" style={{ paddingTop: '10rem' }}>
        <div className="flex-between" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 className="text-title" style={{ marginBottom: '0.5rem' }}>Expert Workspace</h1>
            <p className="text-subtitle" style={{ marginLeft: 0 }}>Welcome back, <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{expert?.displayName || expert?.email?.split('@')[0]}</span></p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.6rem 1.2rem', borderRadius: '100px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              ADMIN VERIFIED
            </div>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#fee2e2' }}>
              <LogOut size={16} /> Exit
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-3" style={{ marginBottom: '4rem' }}>
          <div className="premium-card">
            <div className="icon-box"><Users size={24} /></div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Outfit', lineHeight: 1, marginBottom: '0.5rem' }}>{stats.totalClients}</div>
            <div className="text-small-caps" style={{ margin: 0, color: 'var(--text-secondary)' }}>Active Clients</div>
          </div>
          <div className="premium-card">
            <div className="icon-box" style={{ color: '#059669', backgroundColor: '#ecfdf5' }}><CalendarCheck size={24} /></div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Outfit', lineHeight: 1, marginBottom: '0.5rem' }}>{stats.totalBookings}</div>
            <div className="text-small-caps" style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Queries</div>
          </div>
          <div className="premium-card">
            <div className="icon-box" style={{ color: '#2563eb', backgroundColor: '#eff6ff' }}><MessageSquare size={24} /></div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Outfit', lineHeight: 1, marginBottom: '0.5rem' }}>{stats.activeConsultations}</div>
            <div className="text-small-caps" style={{ margin: 0, color: 'var(--text-secondary)' }}>Ongoing Cases</div>
          </div>
        </div>

        {/* Client Queries List */}
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageSquare size={24} style={{ color: 'var(--accent)' }} /> Client Queries & Consultations
          </h3>
          <div className="flex-row" style={{ gap: '1rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Search queries..." style={{ padding: '0.75rem 1.5rem 0.75rem 3rem', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <button style={{ padding: '0.75rem', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="flex-col" style={{ gap: '1rem' }}>
          {bookings.length > 0 ? bookings.map((booking) => (
            <div key={booking.id} className="flex-row premium-card" style={{ padding: '1.5rem', flexDirection: 'row', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', borderLeft: '4px solid var(--accent)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', flexShrink: 0 }}>
                {booking.userName ? booking.userName[0].toUpperCase() : 'C'}
              </div>
              
              {/* Client Info */}
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{booking.userName || 'Anonymous Client'}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{booking.email || 'No email provided'}</div>
              </div>

              {/* Query Info */}
              <div style={{ flex: '2', minWidth: '250px', padding: '0 1rem', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                <div className="text-small-caps" style={{ margin: 0, color: 'var(--accent)', marginBottom: '0.25rem' }}>Service Requested</div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{booking.service || 'General Consultation'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} /> Scheduled for {booking.date || 'TBD'} at {booking.time || 'TBD'}
                </div>
              </div>

              {/* Status */}
              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <div className="text-small-caps" style={{ margin: 0, color: 'var(--text-tertiary)' }}>Submitted</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>{booking.timestamp ? new Date(booking.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</div>
                <div style={{ display: 'inline-flex', padding: '0.3rem 0.8rem', borderRadius: '100px', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {booking.status || 'Pending'}
                </div>
              </div>

              <div className="flex-row" style={{ gap: '0.5rem' }}>
                <button className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}>
                  Review Case
                </button>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
              <MessageSquare style={{ color: 'var(--border-strong)', margin: '0 auto 1rem auto' }} size={48} />
              <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>No client queries have been submitted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

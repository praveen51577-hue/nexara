"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar, Clock, Activity, LogOut, User, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [booking, setBooking] = useState({ service: '', date: '', time: '10:00 AM' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadMyBookings(u.uid);
      } else {
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, []);

  const loadMyBookings = (uid: string) => {
    const q = query(
      collection(db, "bookings"), 
      where("userId", "==", uid)
    );
    
    onSnapshot(q, (snapshot) => {
      // Sort in memory because Firestore requires a composite index for where() + orderBy()
      const fetchedBookings: any[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      fetchedBookings.sort((a: any, b: any) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });
      setMyBookings(fetchedBookings);
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userName: user.displayName || user.email,
        email: user.email,
        ...booking,
        status: 'pending',
        timestamp: serverTimestamp()
      });

      alert("Consultation Scheduled Successfully!");
      setBooking({ service: '', date: '', time: '10:00 AM' });
    } catch (error: any) {
      alert("Booking failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!user) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Workspace...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingBottom: '5rem' }}>
      <Navbar />
      <div className="hero-glow" style={{ top: '-30%', left: '20%' }}></div>
      
      <div className="container" style={{ paddingTop: '10rem' }}>
        <h1 className="text-title" style={{ marginBottom: '3rem' }}>Client Workspace</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'start' }}>
          
          {/* Left Sidebar: Profile Information */}
          <div className="premium-card flex-col" style={{ gap: '2rem', textAlign: 'center', position: 'sticky', top: '100px' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', 
              color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '3rem', fontWeight: 'bold', margin: '0 auto', border: '4px solid var(--surface)' 
            }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()
              )}
            </div>
            
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {user.displayName || 'Valued Client'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {user.email}
              </p>
              <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '100px', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                VERIFIED PROFILE
              </div>
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border)' }}></div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Briefcase size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{myBookings.length} Total Bookings</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <User size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Active Account</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="btn-secondary" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: '#ef4444', borderColor: '#fee2e2', backgroundColor: '#fef2f2' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Right Main Content */}
          <div className="flex-col" style={{ gap: '3rem' }}>
            
            {/* Booking Form */}
            <div className="premium-card">
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: '600', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={24} style={{ color: 'var(--accent)' }} /> Book New Consultation
              </h3>
              
              <form onSubmit={handleBooking} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                <div>
                  <label className="text-small-caps" style={{ marginBottom: '0.5rem' }}>Service</label>
                  <select 
                    required
                    value={booking.service}
                    onChange={(e) => setBooking({ ...booking, service: e.target.value })}
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="">Select Service</option>
                    <option>Virtual CFO</option>
                    <option>GST Compliance</option>
                    <option>Income Tax Planning</option>
                    <option>Business Valuation</option>
                  </select>
                </div>
                <div>
                  <label className="text-small-caps" style={{ marginBottom: '0.5rem' }}>Preferred Date</label>
                  <input 
                    type="date" 
                    required
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label className="text-small-caps" style={{ marginBottom: '0.5rem' }}>Preferred Time</label>
                  <select 
                    required
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:30 PM</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: isSubmitting ? 0.5 : 1, padding: '1rem' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Request'}
                </button>
              </form>
            </div>

            {/* Past Bookings */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={20} style={{ color: 'var(--text-secondary)' }} /> Your Booking History
              </h3>
              
              <div className="flex-col" style={{ gap: '1rem' }}>
                {myBookings.length > 0 ? myBookings.map((item) => (
                  <div key={item.id} className="premium-card flex-between" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        {item.service}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Requested for: <strong>{item.date}</strong> at <strong>{item.time}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="text-small-caps" style={{ margin: 0, color: 'var(--text-tertiary)' }}>Submitted</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                          {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </div>
                      </div>
                      <div style={{ 
                        padding: '0.4rem 1rem', borderRadius: '100px', 
                        backgroundColor: item.status === 'pending' ? '#fffbeb' : '#f0fdf4', 
                        color: item.status === 'pending' ? '#d97706' : '#166534',
                        border: `1px solid ${item.status === 'pending' ? '#fde68a' : '#bbf7d0'}`,
                        fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' 
                      }}>
                        {item.status || 'Pending'}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                    <Activity style={{ color: 'var(--border-strong)', margin: '0 auto 1rem auto' }} size={40} />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>You have no consultation history yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

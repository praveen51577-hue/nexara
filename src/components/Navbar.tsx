"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, LogOut, ChevronRight, Calendar, Clock } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const q = query(collection(db, "bookings"), where("userId", "==", u.uid));
        onSnapshot(q, (snapshot) => {
          const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          fetched.sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
          setMyBookings(fetched);
        });
      }
    });

    const handleOpenDrawer = () => setIsSidebarOpen(true);
    window.addEventListener('open-client-drawer', handleOpenDrawer);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('open-client-drawer', handleOpenDrawer);
      unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = async () => {
    setIsSidebarOpen(false);
    await signOut(auth);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [booking, setBooking] = useState({ service: '', date: '', time: '10:00 AM' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert("Consultation Requested!");
      setBooking({ service: '', date: '', time: '10:00 AM' });
    } catch (error: any) {
      alert("Booking failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
      padding: isScrolled ? '1rem 5%' : '2rem 5%',
      backgroundColor: isScrolled ? 'var(--surface)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div className="flex-between" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/" className="flex-row" style={{ gap: '1rem', textDecoration: 'none' }}>
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="flex-center"
            style={{ width: '40px', height: '40px', backgroundColor: 'var(--accent)', borderRadius: '12px' }}
          >
            <svg width="20" height="20" viewBox="0 0 54 54" fill="none">
              <polyline points="10,42 22,28 32,35 46,14" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </motion.div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
            <span style={{ color: 'var(--accent)' }}>Nexara</span>
          </div>
        </Link>

        <ul className="flex-row nav-links-desktop" style={{ gap: '3rem' }}>
          {[
            { name: 'Genesis', id: 'about' },
            { name: 'Expertise', id: 'services' },
            { name: 'Partners', id: 'team' }
          ].map((item) => (
            <li key={item.id}>
              <Link 
                href={`/#${item.id}`} 
                style={{ margin: 0, opacity: 0.65, cursor: 'pointer', transition: 'opacity 0.3s', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--text)' }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.65'}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex-row" style={{ gap: '1.5rem' }}>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme} 
            className="icon-box"
            style={{ margin: 0, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
          
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div 
                key="user"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-row"
                style={{ gap: '1rem' }}
              >
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, border: '2px solid var(--accent)', overflow: 'hidden', cursor: 'pointer', backgroundColor: 'var(--surface)' }}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 'bold' }}>
                      {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="guest"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-row"
                style={{ gap: '1.5rem' }}
              >
                <Link href="/expert-auth" className="text-small-caps" style={{ margin: 0 }}>
                  Expert Access
                </Link>
                <Link href="/auth?role=client" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}>
                  Login <ChevronRight size={14} />
             </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Profile Sidebar / Drawer */}
      <AnimatePresence>
        {user && isSidebarOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
            <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}></div>
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--surface)', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', overflowY: 'auto' }}
            >
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '100px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                    CLIENT PROFILE
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    ✕ Close
                  </button>
                </div>
                <div className="flex-row" style={{ gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', flexShrink: 0 }}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{user.displayName || 'Client'}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{user.email}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '2rem', flexGrow: 1 }}>
                <div className="premium-card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} style={{ color: 'var(--accent)' }} /> Book Appointment
                  </h3>
                  <form onSubmit={handleBooking} className="flex-col" style={{ gap: '0.75rem' }}>
                    <select required value={booking.service} onChange={(e) => setBooking({ ...booking, service: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}>
                      <option value="">Select Service</option>
                      <option>Virtual CFO</option>
                      <option>GST Compliance</option>
                      <option>Income Tax</option>
                    </select>
                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      <input type="date" required value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
                      <select required value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}>
                        <option>10:00 AM</option>
                        <option>11:30 AM</option>
                        <option>02:00 PM</option>
                      </select>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem' }}>
                      {isSubmitting ? '...' : 'Request Slot'}
                    </button>
                  </form>
                </div>

                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: 'var(--text-secondary)' }} /> Appointments ({myBookings.length})
                  </h3>
                  <div className="flex-col" style={{ gap: '0.75rem' }}>
                    {myBookings.map((item) => (
                      <div key={item.id} className="premium-card" style={{ padding: '0.75rem', borderLeft: '3px solid var(--accent)' }}>
                        <div className="flex-between">
                          <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{item.service}</span>
                          <span style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', borderRadius: '4px', backgroundColor: item.status === 'pending' ? '#fffbeb' : '#f0fdf4', color: item.status === 'pending' ? '#d97706' : '#166534', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.status || 'Pending'}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                          {item.date} at {item.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
                <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#fee2e2', backgroundColor: '#fef2f2' }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}

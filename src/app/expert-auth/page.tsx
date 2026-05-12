"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '@/components/Navbar';

export default function ExpertAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExpertLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      
      // Auto-create the expert profile in Firestore if it's their first time logging in!
      if (!snap.exists()) {
        const { setDoc, serverTimestamp } = await import('firebase/firestore');
        await setDoc(userRef, {
          email: user.email,
          role: 'expert',
          createdAt: serverTimestamp()
        });
        router.push('/expert/dashboard');
      } else if (snap.data().role === 'expert') {
        router.push('/expert/dashboard');
      } else {
        alert("Access denied. You are registered as a Client, not an Expert.");
        await auth.signOut();
      }
    } catch (error: any) {
      alert("Expert Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Navbar />
      <div className="hero-glow"></div>
      
      <div className="premium-card text-center" style={{ width: '100%', maxWidth: '450px', zIndex: 10, padding: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif', color: 'var(--accent)' }}>
          Expert Portal
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
          Secure access for authorized consultants
        </p>
        
        <form onSubmit={handleExpertLogin} className="flex-col" style={{ textAlign: 'left', gap: '1.5rem' }}>
          <div>
            <label className="text-small-caps" style={{ marginBottom: '0.5rem' }}>Professional Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="consultant@nexara.com" 
              required 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <div>
            <label className="text-small-caps" style={{ marginBottom: '0.5rem' }}>Security Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.5 : 1, marginTop: '1rem' }}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

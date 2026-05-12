"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Navbar from '@/components/Navbar';

function AuthContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);



  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: 'client',
          createdAt: new Date()
        });
      }
      
      router.push('/');
    } catch (error: any) {
      alert("Login failed: " + error.message);
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
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
          Client Login
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
          Access your collaborative workspace
        </p>
        
        <div className="flex-col" style={{ gap: '1.5rem' }}>
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px',
              backgroundColor: 'var(--surface)', color: 'var(--text-primary)', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.3s ease', opacity: loading ? 0.5 : 1
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
            Continue with Google
          </button>
          
          <div className="flex-center" style={{ gap: '1rem', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
            <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border)' }}></div>
            OR
            <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border)' }}></div>
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <label className="text-small-caps" style={{ marginBottom: '0.5rem' }}>Mobile Number</label>
            <input type="tel" placeholder="+91 00000 00000" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.5 : 1 }} onClick={() => alert('Mobile login simulation: Please use Google')}>
            Continue with Mobile
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}

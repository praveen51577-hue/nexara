"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, Activity, Briefcase, Star, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ExpertisePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main style={{ overflowX: 'hidden' }}>
      <Navbar />
      <div className="hero-glow" style={{ top: '-20%' }}></div>
      
      <section className="section-pad" style={{ paddingTop: '12rem', paddingBottom: '4rem' }}>
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <span className="text-small-caps">Domains</span>
            <h1 className="text-hero" style={{ marginBottom: '2rem' }}>
              Our <span className="text-gradient">Expertise</span>
            </h1>
            <p className="text-subtitle">
              Comprehensive financial, taxation, and compliance solutions designed to secure and accelerate your business growth.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <motion.div 
            className="grid-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {[
              { icon: <TrendingUp size={24} />, title: 'Virtual CFO', desc: 'Executive financial leadership for scaling enterprises. Strategy, MIS, and cash-flow optimization.' },
              { icon: <Zap size={24} />, title: 'GST Compliance', desc: 'End-to-end management from registration to litigation support and notice handling.' },
              { icon: <Shield size={24} />, title: 'Income Tax', desc: 'Strategic planning and specialized litigation support for complex tax scenarios.' },
              { icon: <Activity size={24} />, title: 'Assurance', desc: 'High-integrity internal and statutory audits to ensure stakeholder confidence.' },
              { icon: <Briefcase size={24} />, title: 'Cloud Accounting', desc: 'Modern bookkeeping using Tally Prime & Zoho for real-time financial visibility.' },
              { icon: <Star size={24} />, title: 'FEMA & FDI', desc: 'Expert navigation of cross-border regulations and foreign exchange compliance.' },
            ].map((svc, i) => (
              <motion.div key={i} className="premium-card" variants={fadeInUp}>
                <div className="icon-box">
                  {svc.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{svc.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flexGrow: 1 }}>{svc.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="text-center" style={{ marginTop: '5rem' }} {...fadeInUp}>
             <Link href="/auth?role=client" className="btn-primary">
                Book a Consultation <ArrowRight size={18} />
              </Link>
          </motion.div>
        </div>
      </section>

      <footer className="section-pad text-center" style={{ borderTop: '1px solid var(--border)', paddingBottom: '3rem', marginTop: '4rem' }}>
        <div className="container">
          <motion.div style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }} {...fadeInUp}>
            <span style={{ color: 'var(--accent)' }}>Nexara</span> Consultants
          </motion.div>
          <p className="text-small-caps" style={{ color: 'var(--text-secondary)' }}>Your Growth, Our Commitment</p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '2rem' }}>&copy; 2026 Nexara Consultants. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

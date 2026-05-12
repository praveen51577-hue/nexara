"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, TrendingUp, Zap, Activity, Briefcase, Heart, Target, Clock, ShieldCheck, Mail, Phone, MapPin, ChevronRight, Calendar, LogOut, User } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  const [user, setUser] = React.useState<any>(null);
  const [areAllServicesExpanded, setAreAllServicesExpanded] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="hero-glow"></div>

      {/* Hero Section - Always Visible */}
      <section id="home" className="section-pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="badge"
              style={{ marginBottom: '2rem' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Star size={14} /> Premier Financial Consultancy
            </motion.div>

            <h1 className="text-hero" style={{ marginBottom: '2rem' }}>
              Strategic Advisory for <br />
              <span className="text-gradient">Modern Enterprise</span>
            </h1>

            <p className="text-subtitle">
              "Your Growth, Our Commitment." Nexara brings executive-grade finance, tax, and compliance solutions to high-growth businesses.
            </p>

            <motion.div
              className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {!user && (
                <Link href="/auth?role=client" className="btn-primary">
                  Initiate Consultation <ArrowRight size={18} />
                </Link>
              )}
              <Link href="#services" className="btn-secondary">
                Our Expertise <ChevronRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-pad" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <motion.div className="grid-2" style={{ marginBottom: '5rem' }} {...fadeInUp}>
            <div>
              <span className="text-small-caps" style={{ fontSize: '1.15rem', letterSpacing: '0.2em' }}>Genesis</span>
              <h2 className="text-title">A New Standard in Financial Partnership</h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                <p style={{ marginBottom: '1rem' }}>Nexara Consultants was established to bridge the gap between complex regulatory requirements and practical, high-impact business growth.</p>
                <p>We provide senior-level expertise without the traditional friction of large-scale firms, offering personalized, proactive guidance that scales with your ambition.</p>
              </div>

              <div className="flex-row" style={{ gap: '3rem', marginTop: '3rem' }}>
                <div>
                  <div style={{ fontSize: '3rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1 }}>100%</div>
                  <div className="text-small-caps" style={{ margin: 0, marginTop: '0.5rem' }}>Client Focus</div>
                </div>
                <div style={{ width: '1px', height: '50px', backgroundColor: 'var(--border-strong)' }}></div>
                <div>
                  <div style={{ fontSize: '3rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1 }}>6+</div>
                  <div className="text-small-caps" style={{ margin: 0, marginTop: '0.5rem' }}>Domains</div>
                </div>
              </div>
            </div>

            <motion.div
              className="premium-card-dark"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Foundational Values</h3>
              <div className="flex-col" style={{ gap: '2rem' }}>
                {[
                  { icon: <Shield size={20} />, title: 'Uncompromising Integrity', desc: 'Absolute transparency in every engagement.' },
                  { icon: <Zap size={20} />, title: 'Operational Excellence', desc: 'Precision-driven delivery across all service lines.' },
                  { icon: <Target size={20} />, title: 'Strategic Growth', desc: 'We measure our success by your market stability.' },
                  { icon: <ShieldCheck size={20} />, title: 'Absolute Reliability', desc: 'Consistency you can rely on, month after month.' },
                ].map((val, i) => (
                  <div key={i} className="flex-row" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--accent)' }}>
                      {val.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{val.title}</h4>
                      <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Executive Stats */}
          <motion.div
            className="grid-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {[
              { value: 'Premium', label: 'Service Quality' },
              { value: '3', label: 'Strategic Partners' },
              { value: 'Qualified', label: 'Consultants' },
              { value: 'Proactive', label: 'Compliance' },
            ].map((stat, i) => (
              <motion.div key={i} className="premium-card text-center" style={{ padding: '2rem' }} variants={fadeInUp}>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.value}</div>
                <div className="text-small-caps" style={{ margin: 0, color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-pad">
        <div className="container">
          <motion.div className="text-center" style={{ marginBottom: '4rem' }} {...fadeInUp}>
            <span className="text-small-caps" style={{ fontSize: '1.15rem', letterSpacing: '0.2em' }}>Expertise</span>
            <h2 className="text-title">Full-Spectrum Advisory</h2>
          </motion.div>

          <motion.div
            className="grid-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {[
              { icon: <TrendingUp size={24} />, title: 'Virtual CFO', desc: 'Executive financial leadership for scaling enterprises. Strategy, MIS, and cash-flow optimization.', details: ['Financial Modeling & Forecasting', 'Board Reporting & MIS', 'Cash Flow Management', 'Fundraising Support'] },
              { icon: <Zap size={24} />, title: 'GST Compliance', desc: 'End-to-end management from registration to litigation support and notice handling.', details: ['Monthly Return Filing', 'Annual Audits & Reconciliations', 'Notice & Litigation Handling', 'Input Tax Credit Optimization'] },
              { icon: <Shield size={24} />, title: 'Income Tax', desc: 'Strategic planning and specialized litigation support for complex tax scenarios.', details: ['Corporate Tax Planning', 'Transfer Pricing', 'Assessment & Appeals', 'TDS & Withholding Tax'] },
              { icon: <Activity size={24} />, title: 'Assurance', desc: 'High-integrity internal and statutory audits to ensure stakeholder confidence.', details: ['Statutory Audits', 'Internal Controls Review', 'Forensic Accounting', 'Due Diligence'] },
              { icon: <Briefcase size={24} />, title: 'Cloud Accounting', desc: 'Modern bookkeeping using Tally Prime & Zoho for real-time financial visibility.', details: ['Daily Bookkeeping', 'Payroll Processing', 'Accounts Payable/Receivable', 'Cloud Migration'] },
              { icon: <Star size={24} />, title: 'FEMA & FDI', desc: 'Expert navigation of cross-border regulations and foreign exchange compliance.', details: ['FDI Structuring', 'RBI Compliances', 'Cross-Border Mergers', 'Overseas Direct Investment'] },
            ].map((svc, i) => (
              <motion.div key={i} className="premium-card" variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="icon-box">
                  {svc.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{svc.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: areAllServicesExpanded ? 0 : 1 }}>{svc.desc}</p>

                {areAllServicesExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '1.5rem', flexGrow: 1 }}>
                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                      {svc.details.map((detail, idx) => (
                        <li key={idx} style={{ marginBottom: '0.5rem' }}>{detail}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <button
                  onClick={() => setAreAllServicesExpanded(!areAllServicesExpanded)}
                  className="text-small-caps"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: 0, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
                >
                  {areAllServicesExpanded ? 'Show Less' : 'Learn More'} <ArrowRight size={14} style={{ transform: areAllServicesExpanded ? 'rotate(-90deg)' : 'rotate(0)' }} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-pad" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <motion.div className="text-center" style={{ marginBottom: '4rem' }} {...fadeInUp}>
            <span className="text-small-caps" style={{ fontSize: '1.15rem', letterSpacing: '0.2em' }}>Partners</span>
            <h2 className="text-title">Executive Leadership</h2>
          </motion.div>

          <motion.div
            className="grid-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {[
              {
                initials: 'NSK',
                name: 'Navya Sree Kommineni',
                role: 'B.Com · CA & CMA Finalist',
                bio: 'Specialist in Income Tax litigation. Manages end-to-end corporate compliances and entity incorporations.',
                tags: ['TAX LITIGATION', 'COMPLIANCE']
              },
              {
                initials: 'VSM',
                name: 'Voggu Sri Meghana',
                role: 'B.Com · CA Finalist',
                bio: 'Expert in Virtual CFO services, streamlining financial operations and supporting data-driven decision making.',
                tags: ['VIRTUAL CFO', 'AUDIT']
              },
              {
                initials: 'LP',
                name: 'Lavanya Payyavula',
                role: 'B.Com · CA & CMA Finalist',
                bio: 'Proficient in modern cloud accounting. Bridges the gap between complex regulation and practical business.',
                tags: ['CLOUD ACCT', 'ROC']
              },
            ].map((expert, i) => (
              <motion.div key={i} className="premium-card text-center" style={{ alignItems: 'center' }} variants={fadeInUp}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                  {expert.initials}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{expert.name}</h3>
                <div className="text-small-caps" style={{ color: 'var(--text-tertiary)' }}>{expert.role}</div>
                <p style={{ color: 'var(--text-secondary)', margin: '1.5rem 0', flexGrow: 1 }}>{expert.bio}</p>
                <div className="flex-row" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  {expert.tags.map((tag, j) => (
                    <span key={j} className="pill">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-pad">
        <div className="container grid-2">
          <motion.div {...fadeInUp}>
            <span className="text-small-caps">Inquiry</span>
            <h2 className="text-title">Connect with our Team.</h2>
            <p className="text-subtitle" style={{ marginLeft: 0 }}>Let's discuss how our strategic financial solutions can drive your next phase of growth.</p>

            <div className="flex-col" style={{ gap: '1.5rem' }}>
              {[
                { icon: <Mail size={20} />, label: 'Email', value: 'info@nexara.com' },
                { icon: <Phone size={20} />, label: 'Hotline', value: '+91 81213 66555' },
                { icon: <MapPin size={20} />, label: 'Hub', value: 'Hyderabad, India' },
              ].map((item, i) => (
                <div key={i} className="flex-row" style={{ padding: '0.75rem 0', gap: '1rem' }}>
                  <div style={{ color: 'var(--accent)' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{item.value}</div>
                    <div className="text-small-caps" style={{ margin: 0, color: 'var(--text-secondary)' }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="premium-card text-center"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem 3rem' }}
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Calendar size={48} style={{ color: 'var(--accent)', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Secure Your Slot</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              {user ? "You are securely logged in. Click below to open your booking form." : "Log in to your personalized client profile to view available experts and schedule your consultation instantly."}
            </p>
            {user ? (
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-client-drawer'))} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.25rem', fontSize: '1.1rem' }}>
                Book Consultation <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </button>
            ) : (
              <Link href="/auth?role=client" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.25rem', fontSize: '1.1rem' }}>
                Sign In to Book Appointment <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-pad text-center" style={{ borderTop: '1px solid var(--border)', paddingBottom: '3rem' }}>
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

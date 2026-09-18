'use client';

import { Suspense } from 'react';
import { AlertTriangle, Calendar, FileText, PhoneCall, ShieldAlert, CheckCircle2, MessageCircle, Clock, ExternalLink } from 'lucide-react';

function HomeContent() {
  const whatsappNumber = '917845156784';
  const whatsappDisplay = '+91 78451 56784';
  const rawWhatsappNumber = '7845156784';
  const defaultMsg = encodeURIComponent(
    'Hello Only Gadjets Team,\n\nI am reaching out regarding my pending order / refund.\n\nMy Details:\n- Name:\n- Contact Number:\n- Order/Invoice Info:\n\nAttached is my payment slip / invoice screenshot.'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${defaultMsg}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #1a2642 0%, #0b1329 70%, #050a17 100%)',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '32px 16px 60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <div style={{
        maxWidth: '820px',
        width: '100%',
        margin: '0 auto',
      }}>

        {/* Top Emergency Badge */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            padding: '8px 18px',
            borderRadius: '99px',
            fontSize: '13px',
            fontWeight: '800',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
          }}>
            <ShieldAlert size={16} className="pulse-icon" />
            <span>Official Operational Announcement</span>
          </div>
        </div>

        {/* Hero Card Container */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.08)',
          overflow: 'hidden',
          marginBottom: '24px',
        }}>
          
          {/* Header Accent Bar */}
          <div style={{
            height: '6px',
            background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #3b82f6 100%)',
          }} />

          <div style={{ padding: '32px 24px 28px' }}>
            
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '12px',
                borderRadius: '16px',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={28} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  lineHeight: '1.3',
                  margin: 0,
                  letterSpacing: '-0.3px',
                }}>
                  Urgent Notice to Our Valued Customers
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                  marginTop: '4px',
                  marginBottom: 0
                }}>
                  Only Gadjets Sales & Operations Department
                </p>
              </div>
            </div>

            {/* Official Announcement Text Box */}
            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              fontSize: '15px',
              lineHeight: '1.75',
              color: '#cbd5e1',
              marginBottom: '28px',
              position: 'relative',
            }}>
              <p style={{ margin: '0 0 16px', fontWeight: '700', color: '#f8fafc', fontSize: '16px' }}>
                Dear customers,
              </p>
              
              <p style={{ margin: '0 0 14px' }}>
                Due to unfortunate circumstances, the person who was handling our sales operations had a major accident. Due to this, we currently do not have access to customer records or information regarding payments made to us.
              </p>

              <p style={{ margin: '0 0 14px' }}>
                A few customer products have arrived and are yet to be delivered. Many customers were promised refunds, but refunds could not be initiated from our side. Our 15 years of experience became a black mark on us over the last 16 days as many customers tried to reach us across different platforms.
              </p>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderLeft: '4px solid #f59e0b',
                padding: '14px 16px',
                borderRadius: '8px',
                margin: '18px 0',
                color: '#fbbf24',
                fontWeight: '600'
              }}>
                📌 <strong>Resolution Timeline:</strong> Pending refunds and pending product deliveries shall commence from <strong>September 25 to October 5</strong>.
              </div>

              <p style={{ margin: 0 }}>
                To help us verify and resolve your order/refund quickly, kindly share your <strong>contact number, payment slip, and invoice</strong> via WhatsApp to <strong style={{ color: '#25D366' }}>{rawWhatsappNumber}</strong>.
              </p>
            </div>

            {/* Highlighted Action Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '14px',
              marginBottom: '28px',
            }}>

              {/* Card 1: Resolution Window */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: '700', fontSize: '14px' }}>
                  <Calendar size={18} />
                  <span>Processing Window</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff' }}>
                  Sept 25 – Oct 5
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Deliveries & refund processing timeline.
                </div>
              </div>

              {/* Card 2: Required Documents */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '16px',
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: '700', fontSize: '14px' }}>
                  <FileText size={18} />
                  <span>Required Details</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', lineHeight: '1.4' }}>
                  • Contact Number<br />
                  • Payment Slip / Screenshot<br />
                  • Order Invoice
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Send all 3 items to facilitate verification.
                </div>
              </div>

              {/* Card 3: WhatsApp Helpline */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                borderRadius: '16px',
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: '700', fontSize: '14px' }}>
                  <PhoneCall size={18} />
                  <span>Official Support WhatsApp</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#25D366' }}>
                  {whatsappDisplay}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Direct support contact for faster response.
                </div>
              </div>

            </div>

            {/* Direct WhatsApp CTA Button */}
            <div style={{ textAlign: 'center' }}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  maxWidth: '480px',
                  padding: '16px 28px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px -5px rgba(37, 211, 102, 0.4), 0 0 15px rgba(37, 211, 102, 0.2)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <MessageCircle size={22} />
                <span>Send Documents on WhatsApp ({rawWhatsappNumber})</span>
                <ExternalLink size={16} style={{ opacity: 0.8 }} />
              </a>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
                Click to open WhatsApp directly with pre-formatted message
              </div>
            </div>

          </div>
        </div>

        {/* Instructions / Guidance Step-by-Step */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#f8fafc',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={18} color="#f59e0b" />
            Steps for Affected Customers
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { num: '1', title: 'Gather Payment Proof', desc: 'Find your UPI screenshot, bank transfer receipt, or payment slip.' },
              { num: '2', title: 'Locate Invoice / Order Details', desc: 'Copy your invoice copy or screenshot of your order conversation.' },
              { num: '3', title: 'Send to Official WhatsApp', desc: `Send all documents to ${rawWhatsappNumber} with your active mobile number.` },
              { num: '4', title: 'Track Resolution', desc: 'Our team will process deliveries and refunds between Sept 25 and Oct 5.' },
            ].map((step, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(2, 6, 23, 0.4)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  fontSize: '12px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>{step.title}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', padding: '12px 0' }}>
          © {new Date().getFullYear()} Only Gadjets. All rights reserved. Operational Announcement.
        </div>

      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0b1329', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading Announcement...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}


'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import WhatsAppButton from '@/components/WhatsAppButton';
import { CartProvider } from '@/context/CartContext';
import FranchiseNetwork from '@/components/FranchiseNetwork';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <CartProvider>
      {!isAdmin && <Header />}
      
      <main className={isAdmin ? '' : 'page-wrapper'}>
        {children}
      </main>
      
      {!isAdmin && <WhatsAppButton />}
      
      {!isAdmin && (
        <footer style={{
          background: 'var(--bg-footer)',
          color: 'rgba(255,255,255,0.7)',
          padding: '32px 16px',
          textAlign: 'center',
          fontSize: 13,
          marginTop: 48,
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontWeight: 800, color: '#fff', fontSize: 18, marginBottom: 8, letterSpacing: '-0.5px' }}>ONLY GADJETS</div>
          <div style={{ fontSize: 14 }}>India's Premium Wholesale Mobile Dealer</div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: 18, flexWrap: 'wrap' }}>
            <Link href="/" style={{ 
              display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: '20px', 
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', 
              color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' 
            }}>Home</Link>
            <Link href="/about" style={{ 
              display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: '20px', 
              background: 'rgba(244, 167, 36, 0.18)', border: '1px solid rgba(244, 167, 36, 0.35)', 
              color: '#f4a724', textDecoration: 'none', fontWeight: 700, fontSize: 13, transition: 'all 0.2s' 
            }}>About Us</Link>
            <Link href="/track" style={{ 
              display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: '20px', 
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', 
              color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' 
            }}>Track Shipment</Link>
          </div>
          <div style={{ 
            marginTop: 32, 
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)', 
            padding: '32px 24px', 
            borderRadius: '16px', 
            maxWidth: '700px', 
            margin: '32px auto 0',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 18, letterSpacing: '-0.5px' }}>Contact Us</h3>
            
            <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <a href="mailto:gadjetsonly@gmail.com"
                style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  padding: '14px 28px',
                  borderRadius: 36,
                  textDecoration: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 0 25px rgba(37, 99, 235, 0.45)',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                <span style={{ fontSize: 20 }}>✉️</span>
                <span>Email Support:</span>
                <span style={{
                  background: '#fef08a',
                  color: '#0f172a',
                  fontWeight: 900,
                  fontSize: '17px',
                  padding: '4px 14px',
                  borderRadius: '10px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  display: 'inline-block',
                }}>
                  gadjetsonly@gmail.com
                </span>
              </a>
              <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600 }}>
                ⚡ Official Support &amp; Order Enquiries
              </span>
            </div>
          </div>
          
          <FranchiseNetwork />
          
          <div suppressHydrationWarning style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Only Gadjets. All rights reserved. Developed by Saul Goodman.
          </div>
        </footer>
      )}
    </CartProvider>
  );
}

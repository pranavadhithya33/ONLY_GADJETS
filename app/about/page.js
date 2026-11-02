import Link from 'next/link';
import { ShieldCheck, TrendingDown, Truck, CheckCircle2, ArrowLeft, Mail, MapPin, Clock, FileText, RefreshCw, Headphones } from 'lucide-react';

export const metadata = {
  title: 'About Us - Only Gadjets | Genuine Electronics at Direct Wholesale Prices',
  description: 'Learn about Only Gadjets, India\'s trusted destination for genuine smartphones and consumer electronics at direct wholesale rates.',
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 16px 80px', color: '#0a1628' }}>
      {/* Back button */}
      <Link href="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '600',
        textDecoration: 'none',
        marginBottom: '28px',
        transition: 'color 0.2s'
      }}>
        <ArrowLeft size={16} /> Back to Store
      </Link>

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #1e293b 100%)',
        borderRadius: '24px',
        padding: '48px 32px',
        color: '#ffffff',
        marginBottom: '36px',
        boxShadow: '0 20px 40px rgba(10, 22, 40, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(244, 167, 36, 0.15)',
          color: '#f4a724',
          border: '1px solid rgba(244, 167, 36, 0.3)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '16px',
          letterSpacing: '0.5px'
        }}>
          Direct Wholesale Electronics
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 38px)',
          fontWeight: '900',
          lineHeight: '1.2',
          letterSpacing: '-0.5px',
          marginBottom: '16px',
          color: '#ffffff'
        }}>
          About <span style={{ color: '#f4a724' }}>Onlygadjets</span>
        </h1>
        <p style={{
          fontSize: '17px',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.85)',
          maxWidth: '800px',
          margin: 0
        }}>
          Welcome to Onlygadjets, your trusted destination for genuine smartphones, mobile accessories, and consumer electronics across India. We were founded on a simple principle: cutting out middlemen so tech lovers, smart shoppers, and business owners get high-quality mobile devices at authentic wholesale rates.
        </p>
      </div>

      {/* Who We Are */}
      <section style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '36px 32px',
        border: '1px solid #e2e8f0',
        marginBottom: '36px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '14px', color: '#0a1628', letterSpacing: '-0.5px' }}>
          Who We Are
        </h2>
        <p style={{ fontSize: '15.5px', lineHeight: '1.7', color: '#334155', marginBottom: '16px' }}>
          At Onlygadjets, we operate as a direct bridge between major supply channels and direct buyers. By eliminating multi-tier distributor markups, retail store overheads, and third-party platform commissions, we pass the real savings directly to you.
        </p>
        <p style={{ fontSize: '15.5px', lineHeight: '1.7', color: '#334155', margin: 0 }}>
          Whether you are an individual upgrading your personal smartphone or a retailer seeking reliable stock, we make purchasing mobile technology transparent, affordable, and stress-free.
        </p>
      </section>

      {/* Why Buy From Onlygadjets? */}
      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#0a1628', letterSpacing: '-0.5px' }}>
          Why Buy From Onlygadjets?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* Feature 1 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
              color: '#059669'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>
              1. 100% Genuine &amp; Quality-Tested Devices
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
              Every product listed on our platform undergoes strict quality control checks. From brand-new smartphones carrying full manufacturer warranties to verified stock, we ensure what you see on our storefront is exactly what arrives at your doorstep.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
              color: '#d97706'
            }}>
              <TrendingDown size={24} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>
              2. Transparent Pricing — Zero Hidden Markups
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
              What you see is what you pay. We maintain absolute transparency in our pricing structure, including clear product grading, standard GST invoicing for business tax credits, and clear delivery timelines.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
              color: '#2563eb'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>
              3. Secure Shopping with "Half-COD" Assurance
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
              We understand the hesitation of purchasing electronics online. That is why we offer flexible checkout options, including our Half-COD policy. Pay a nominal advance token to confirm your dispatch, and pay the remaining balance to the courier delivery partner only after inspectable doorstep delivery.
            </p>
          </div>

          {/* Feature 4 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
              color: '#0284c7'
            }}>
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>
              4. Fast, Trackable Nationwide Shipping
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
              We partner with India’s leading logistics providers to ensure safe, fully insured, and trackable shipment of high-value electronics right to your location, complete with live order tracking updates.
            </p>
          </div>
        </div>
      </section>

      {/* Our Commitment to Trust & Support */}
      <section style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '36px 32px',
        border: '1px solid #e2e8f0',
        marginBottom: '36px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#0a1628', letterSpacing: '-0.5px' }}>
          Our Commitment to Trust &amp; Support
        </h2>
        <p style={{ fontSize: '15.5px', color: '#475569', marginBottom: '24px' }}>
          Purchasing mobile tech shouldn't feel like a gamble. We prioritize post-purchase confidence through:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a1628',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <Headphones size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Dedicated Customer Care</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                Real humans, fast responses. Reach out to our team via email (<a href="mailto:gadjetsonly@gmail.com" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>gadjetsonly@gmail.com</a>) for order queries or technical guidance.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a1628',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <RefreshCw size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Simple Returns &amp; Replacements</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                Clear guidelines backed by DOA (Dead on Arrival) replacements and comprehensive warranty support.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a1628',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>GST Invoice Advantage</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                Complete tax invoicing for corporate orders and GST compliance with instant downloadable invoices.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Business Verification */}
      <section style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '36px 32px',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
          Contact &amp; Business Verification
        </h2>
        <p style={{ fontSize: '14.5px', color: '#94a3b8', marginBottom: '24px' }}>
          Have a question about a product, bulk orders, or your ongoing shipment? Get in touch with our customer success team directly:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(37, 99, 235, 0.2)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa'
            }}>
              <Mail size={18} />
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#94a3b8', display: 'block' }}>Email Us</span>
              <a href="mailto:gadjetsonly@gmail.com" style={{ color: '#fef08a', fontSize: '15px', fontWeight: '700', textDecoration: 'none' }}>
                gadjetsonly@gmail.com
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(244, 167, 36, 0.2)',
              border: '1px solid rgba(244, 167, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f4a724'
            }}>
              <MapPin size={18} />
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#94a3b8', display: 'block' }}>Office / Warehouse Address</span>
              <span style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600' }}>
                Madambakkam, Chennai
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <Clock size={18} />
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#94a3b8', display: 'block' }}>Support Hours</span>
              <span style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600' }}>
                Monday – Saturday | 10:00 AM – 7:00 PM IST
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f4a724',
            color: '#0a1628',
            padding: '12px 28px',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '15px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(244, 167, 36, 0.3)',
            transition: 'transform 0.15s ease'
          }}>
            Explore Wholesale Products →
          </Link>
        </div>
      </section>
    </div>
  );
}

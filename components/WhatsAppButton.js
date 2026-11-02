'use client';
// components/WhatsAppButton.js
import { Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const url = 'mailto:gadjetsonly@gmail.com?subject=Support%20Enquiry%20-%20Only%20Gadjets';

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <a
      href={url}
      id="contact-float-btn"
      aria-label="Contact us at gadjetsonly@gmail.com"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 20,
        zIndex: 999,
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: '#fff',
        width: 54,
        height: 54,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,99,235,0.45)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.12)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(37,99,235,0.55)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.45)';
      }}
    >
      <Mail size={24} strokeWidth={2.2} />
    </a>
  );
}

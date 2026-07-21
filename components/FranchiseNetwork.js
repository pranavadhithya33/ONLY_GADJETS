'use client';

import React, { useState, useEffect } from 'react';

// Coordinates defined on a 100 x 130 grid to match the natural tall aspect ratio of Tamil Nadu.
const franchises = [
  { id: 1, name: 'Shanmugapriya', location: 'Mudichur, Chennai', x: 80, y: 18 },
  { id: 2, name: 'Kamaraj', location: 'Kolathur, Chennai', x: 82, y: 13 },
  { id: 3, name: 'Sivagami', location: 'Kumbakonam', x: 74, y: 62 },
  { id: 4, name: 'Imthiyas', location: 'Thiruvanamalai', x: 65, y: 35 },
  { id: 5, name: 'Senthilmurugan', location: 'Jeyamkondan', x: 70, y: 57 },
  { id: 6, name: 'Ahamed', location: 'Thondi, Ramanathapuram', x: 67, y: 88 },
  { id: 7, name: 'Dinesh', location: 'Coimbatore (div 1)', x: 18, y: 65 },
  { id: 8, name: 'Jaganraj', location: 'Attur', x: 55, y: 45 },
  { id: 9, name: 'JK Yashwanth Raj', location: 'Rajapalayam', x: 38, y: 98 },
  { id: 10, name: 'Karthick C', location: 'Hosur', x: 34, y: 12 },
  { id: 11, name: 'Lawrence', location: 'Taramani, Chennai', x: 83, y: 16 },
  { id: 12, name: 'Mohamed', location: 'Cumbum (Theni)', x: 30, y: 92 },
  { id: 13, name: 'Pandi Rithika Sai', location: 'Tuticorin', x: 57, y: 110 },
  { id: 14, name: 'Rathina', location: 'Tenkasi', x: 36, y: 108 },
  { id: 15, name: 'Sakthivel', location: 'Kattupakkam, Chennai', x: 81, y: 15 },
  { id: 16, name: 'Saran', location: 'Salem (div 1)', x: 48, y: 45 },
  { id: 17, name: 'Saravanan', location: 'Manachanallur', x: 61, y: 62 },
  { id: 18, name: 'Sarbudeen', location: 'Trichy Central', x: 62, y: 68 },
  { id: 19, name: 'Sevagan', location: 'Thitakudi, Cuddalore', x: 68, y: 50 },
  { id: 20, name: 'Vasanth', location: 'Madurai (div 1)', x: 48, y: 85 },
  { id: 21, name: 'Vinothini', location: 'Lalgudi', x: 64, y: 65 },
  { id: 22, name: 'Eshwari', location: 'Mylapore, Chennai', x: 84, y: 15 },
  { id: 23, name: 'Vignesh', location: 'Coimbatore (div 2)', x: 20, y: 68 },
  { id: 24, name: 'Ramamoorthy', location: 'Madurai (div 2)', x: 50, y: 88 },
  { id: 25, name: 'M L Sanjeev', location: 'Ranipet', x: 72, y: 22 },
];

export default function FranchiseNetwork() {
  const [activeNode, setActiveNode] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="franchise-container" style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '64px auto',
      padding: '0 20px',
      fontFamily: 'var(--font-inter), sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-1px',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #a5a5a5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Our Growing Network
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '16px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          25 premium Cash on Delivery hubs across Tamil Nadu. Empowering local business with Trillion-Dollar infrastructure.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        alignItems: 'center'
      }}>


        {/* Glassmorphic Roster Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
          width: '100%',
          marginTop: '32px'
        }}>
          {franchises.map((f, i) => (
            <div
              key={`roster-${f.id}`}
              onMouseEnter={() => setActiveNode(f)}
              onMouseLeave={() => setActiveNode(null)}
              className="franchise-card"
              style={{
                background: activeNode?.id === f.id ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeNode?.id === f.id ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                padding: '16px 20px',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '16px',
                cursor: 'pointer',
                transform: activeNode?.id === f.id ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isLoaded ? 1 : 0,
                animation: isLoaded ? `fade-in-up 0.5s ease forwards ${i * 0.05}s` : 'none'
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                minWidth: '8px',
                borderRadius: '50%',
                background: activeNode?.id === f.id ? '#00ffff' : 'rgba(255,255,255,0.2)',
                boxShadow: activeNode?.id === f.id ? '0 0 10px #00ffff' : 'none',
                transition: 'all 0.3s ease'
              }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: activeNode?.id === f.id ? '#fff' : 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '14px', transition: 'color 0.3s' }}>
                  {f.name}
                </div>
                <div style={{ color: activeNode?.id === f.id ? '#00ffff' : 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px', transition: 'color 0.3s' }}>
                  {f.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

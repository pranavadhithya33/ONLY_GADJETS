'use client';

import React, { useState, useEffect } from 'react';

const franchises = [
  { id: 1, name: 'Shanmugapriya', location: 'Mudichur, Chennai', x: 84, y: 16 },
  { id: 2, name: 'Kamaraj', location: 'Kolathur, Chennai', x: 83, y: 13 },
  { id: 3, name: 'Sivagami', location: 'Kumbakonam', x: 68, y: 56 },
  { id: 4, name: 'Imthiyas', location: 'Thiruvanamalai', x: 65, y: 30 },
  { id: 5, name: 'Senthilmurugan', location: 'Jeyamkondan', x: 64, y: 51 },
  { id: 6, name: 'Ahamed', location: 'Thondi, Ramanathapuram', x: 58, y: 75 },
  { id: 7, name: 'Dinesh', location: 'Coimbatore (div 1)', x: 25, y: 50 },
  { id: 8, name: 'Jaganraj', location: 'Attur', x: 55, y: 40 },
  { id: 9, name: 'JK Yashwanth Raj', location: 'Rajapalayam', x: 35, y: 82 },
  { id: 10, name: 'Karthick C', location: 'Hosur', x: 35, y: 25 },
  { id: 11, name: 'Lawrence', location: 'Taramani, Chennai', x: 85, y: 14 },
  { id: 12, name: 'Mohamed', location: 'Cumbum (Theni)', x: 38, y: 78 },
  { id: 13, name: 'Pandi Rithika Sai', location: 'Tuticorin', x: 52, y: 88 },
  { id: 14, name: 'Rathina', location: 'Tenkasi', x: 36, y: 87 },
  { id: 15, name: 'Sakthivel', location: 'Kattupakkam, Chennai', x: 82, y: 15 },
  { id: 16, name: 'Saran', location: 'Salem (div 1)', x: 48, y: 38 },
  { id: 17, name: 'Saravanan', location: 'Manachanallur', x: 58, y: 53 },
  { id: 18, name: 'Sarbudeen', location: 'Trichy Central', x: 59, y: 55 },
  { id: 19, name: 'Sevagan', location: 'Thitakudi, Cuddalore', x: 68, y: 46 },
  { id: 20, name: 'Vasanth', location: 'Madurai (div 1)', x: 45, y: 74 },
  { id: 21, name: 'Vinothini', location: 'Lalgudi', x: 60, y: 54 },
  { id: 22, name: 'Eshwari', location: 'Mylapore, Chennai', x: 86, y: 15 },
  { id: 23, name: 'Vignesh', location: 'Coimbatore (div 2)', x: 27, y: 51 },
  { id: 24, name: 'Ramamoorthy', location: 'Madurai (div 2)', x: 46, y: 76 },
  { id: 25, name: 'M L Sanjeev', location: 'Ranipet', x: 75, y: 20 },
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
        {/* Interactive Map Section */}
        <div className={`map-wrapper ${isLoaded ? 'loaded' : ''}`} style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          aspectRatio: '3/4',
          background: 'radial-gradient(circle at center, rgba(37, 211, 102, 0.05) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 0 60px rgba(37, 211, 102, 0.03)',
          overflow: 'hidden'
        }}>
          {/* Abstract stylized Tamil Nadu outline */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            pointerEvents: 'none'
          }}>
            <polygon 
              points="30,20 75,10 88,15 85,35 80,45 70,60 60,85 55,95 40,95 30,85 15,50 25,30" 
              fill="none" 
              stroke="#25d366" 
              strokeWidth="0.5" 
              strokeDasharray="2,2"
            />
            {/* Grid overlay */}
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>

          {/* Map Nodes */}
          {franchises.map((f, i) => (
            <div
              key={f.id}
              onMouseEnter={() => setActiveNode(f)}
              onMouseLeave={() => setActiveNode(null)}
              style={{
                position: 'absolute',
                left: `${f.x}%`,
                top: `${f.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: activeNode?.id === f.id ? 10 : 1,
                opacity: isLoaded ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.03}s, transform 0.2s ease`
              }}
            >
              {/* Pulsing core */}
              <div style={{
                width: activeNode?.id === f.id ? '12px' : '8px',
                height: activeNode?.id === f.id ? '12px' : '8px',
                backgroundColor: '#25d366',
                borderRadius: '50%',
                boxShadow: `0 0 ${activeNode?.id === f.id ? '20px' : '10px'} #25d366`,
                transition: 'all 0.3s ease'
              }} />
              
              {/* Radar ripple */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '1px solid #25d366',
                animation: `pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite ${i * 0.1}s`,
                pointerEvents: 'none'
              }} />

              {/* Tooltip */}
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: `translateX(-50%) translateY(${activeNode?.id === f.id ? '-12px' : '0px'})`,
                opacity: activeNode?.id === f.id ? 1 : 0,
                visibility: activeNode?.id === f.id ? 'visible' : 'hidden',
                background: 'rgba(20,20,20,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '8px 16px',
                borderRadius: '12px',
                whiteSpace: 'nowrap',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none'
              }}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}>{f.name}</div>
                <div style={{ color: '#25d366', fontSize: '11px', marginTop: '2px' }}>{f.location}</div>
              </div>
            </div>
          ))}
        </div>

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
                background: activeNode?.id === f.id ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeNode?.id === f.id ? 'rgba(37, 211, 102, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                padding: '16px 20px',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
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
                borderRadius: '50%',
                background: activeNode?.id === f.id ? '#25d366' : 'rgba(255,255,255,0.2)',
                boxShadow: activeNode?.id === f.id ? '0 0 10px #25d366' : 'none',
                transition: 'all 0.3s ease'
              }} />
              <div>
                <div style={{ color: activeNode?.id === f.id ? '#fff' : 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '14px', transition: 'color 0.3s' }}>
                  {f.name}
                </div>
                <div style={{ color: activeNode?.id === f.id ? '#25d366' : 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px', transition: 'color 0.3s' }}>
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

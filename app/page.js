'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  RotateCcw, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Star, 
  Truck, 
  HeartHandshake, 
  ArrowRight,
  Gift,
  HelpCircle
} from 'lucide-react';
import ReviewsSection from '@/components/ReviewsSection';
import VideoReviewCarousel from '@/components/VideoReviewCarousel';

function HomeContent() {
  const [copied, setCopied] = useState(false);
  const [videos, setVideos] = useState([]);

  const whatsappNumber = '917845156784';
  const whatsappDisplay = '+91 78451 56784';
  const rawWhatsappNumber = '7845156784';

  const defaultMsg = encodeURIComponent(
    'Hello Only Gadjets Helpline,\n\nI am reaching out regarding my pending order / refund status.\n\nPlease share my scheduled payment or delivery date.\n\nMy Details:\n• Name:\n• Contact Number:\n• Order / Payment Slip Screenshot:'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${defaultMsg}`;

  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.json())
      .then((data) => setVideos(data || []))
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(rawWhatsappNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const scrollToReviews = () => {
    const btn = document.querySelector('#reviews-section button');
    if (btn) btn.click();
    const el = document.getElementById('reviews-section');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #132247 0%, #0a1329 50%, #030712 100%)',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '36px 16px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient decorative glows */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.15), transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: '400px',
        right: '-100px',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.08), transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: '800px',
        left: '-100px',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.08), transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '860px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Top Operational Status Pill */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 95, 70, 0.25) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            color: '#34d399',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 10px #10b981',
            }} />
            <span>Official Progress & Order Resolution Update</span>
          </div>
        </div>

        {/* Hero Card Container */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(59, 130, 246, 0.1)',
          overflow: 'hidden',
          marginBottom: '32px',
        }}>
          {/* Header Accent Bar */}
          <div style={{
            height: '6px',
            background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #f59e0b 100%)',
          }} />

          <div style={{ padding: '36px 28px 32px' }}>
            
            {/* Title & Organization Subheading */}
            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#60a5fa',
                marginBottom: '16px',
              }}>
                <ShieldCheck size={30} color="#38bdf8" />
              </div>

              <h1 style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: '1.25',
                margin: 0,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                To Our Valued Only Gadjets Customers,
              </h1>

              <p style={{
                fontSize: '16px',
                color: '#94a3b8',
                marginTop: '8px',
                fontWeight: '500',
              }}>
                We are pleased to share an update on our ongoing progress.
              </p>
            </div>

            {/* Key Progress Stat Counters */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              marginBottom: '32px',
            }}>
              
              {/* Stat 1: 58 Pending Orders Fulfilled */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.25) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '18px',
                padding: '20px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  marginBottom: '4px',
                }}>
                  <CheckCircle2 size={24} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', lineHeight: 1 }}>
                  58
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#34d399' }}>
                  Orders Fulfilled
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.3 }}>
                  Pending deliveries completed & dispatched
                </div>
              </div>

              {/* Stat 2: 8 Full Refunds Processed */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.12) 0%, rgba(3, 105, 161, 0.25) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '18px',
                padding: '20px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  marginBottom: '4px',
                }}>
                  <RotateCcw size={22} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', lineHeight: 1 }}>
                  8
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>
                  Full Refunds Processed
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.3 }}>
                  100% processed for interim alternative buyers
                </div>
              </div>

              {/* Stat 3: Over Half Backlog Cleared */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.12) 0%, rgba(180, 83, 9, 0.25) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '18px',
                padding: '20px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  marginBottom: '4px',
                }}>
                  <TrendingUp size={22} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', lineHeight: 1 }}>
                  &gt; 50%
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fbbf24' }}>
                  Pending Orders Cleared
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.3 }}>
                  Over half of the backlog already cleared
                </div>
              </div>

              {/* Stat 4: 15,000+ Customers Served */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(168, 85, 247, 0.12) 0%, rgba(107, 33, 168, 0.25) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '18px',
                padding: '20px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  marginBottom: '4px',
                }}>
                  <Award size={22} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', lineHeight: 1 }}>
                  15,000+
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#c084fc' }}>
                  Customers Served
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.3 }}>
                  Proudly serving India for over 5 years
                </div>
              </div>

            </div>

            {/* Official Announcement Narrative Card */}
            <div style={{
              background: 'rgba(2, 6, 23, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '28px 24px',
              fontSize: '15.5px',
              lineHeight: '1.8',
              color: '#cbd5e1',
              marginBottom: '32px',
            }}>
              
              <p style={{ margin: '0 0 16px', fontSize: '16px' }}>
                <strong style={{ color: '#f8fafc' }}>As promised</strong>, we have recently fulfilled <strong style={{ color: '#34d399', fontWeight: 800 }}>58 pending orders</strong> and processed <strong style={{ color: '#38bdf8', fontWeight: 800 }}>8 full refunds</strong> for customers who chose to purchase elsewhere in the interim.
              </p>

              {/* Patient Customers Appreciation Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%)',
                borderLeft: '4px solid #f59e0b',
                borderRight: '1px solid rgba(245, 158, 11, 0.2)',
                borderTop: '1px solid rgba(245, 158, 11, 0.2)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '14px',
                padding: '18px 20px',
                margin: '22px 0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
              }}>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderRadius: '10px',
                  padding: '8px',
                  color: '#fbbf24',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#fef08a', marginBottom: '4px' }}>
                    To Our Patient Customers:
                  </div>
                  <div style={{ color: '#fed7aa', fontSize: '14.5px', lineHeight: '1.65' }}>
                    Thank you for your continued trust and loyalty during this time. As a gesture of our appreciation, <strong>we have applied maximum discounts to your existing purchases</strong>.
                  </div>
                </div>
              </div>

              {/* Core Mission & Heritage */}
              <p style={{ margin: '0 0 16px' }}>
                Over the past <strong style={{ color: '#f8fafc' }}>5 years</strong>, Only Gadjets has proudly served over <strong style={{ color: '#f8fafc' }}>15,000 customers</strong>.
              </p>

              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '14px 18px',
                margin: '18px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <Sparkles size={20} color="#60a5fa" style={{ flexShrink: 0 }} />
                <span style={{ color: '#e2e8f0', fontSize: '14.5px' }}>
                  <strong>Our core mission remains unchanged:</strong> bringing B2B wholesale pricing directly to you. Despite recent operational challenges, we have already cleared over half of our pending orders.
                </span>
              </div>

              {/* October 15th Highlight Milestone */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '16px',
                padding: '20px',
                marginTop: '24px',
                textAlign: 'center',
                boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.2)',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#34d399',
                  fontSize: '13px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                }}>
                  <Calendar size={16} />
                  <span>Key Target Milestone</span>
                </div>

                <div style={{
                  fontSize: 'clamp(20px, 3.5vw, 24px)',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '8px',
                }}>
                  October 15th — Complete Resolution & Reopening
                </div>

                <div style={{
                  color: '#94a3b8',
                  fontSize: '14.5px',
                  maxWidth: '650px',
                  margin: '0 auto',
                  lineHeight: '1.6',
                }}>
                  We are <strong style={{ color: '#f8fafc' }}>fully committed to resolving all remaining orders by October 15th</strong>, and we will <strong style={{ color: '#34d399' }}>officially resume accepting new orders on the same day</strong>.
                </div>
              </div>

            </div>

            {/* Helpline Section — Still Waiting for Outstanding Order or Refund */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(18, 140, 126, 0.15) 100%)',
              border: '1px solid rgba(37, 211, 102, 0.35)',
              borderRadius: '20px',
              padding: '28px 24px',
              marginBottom: '32px',
              textAlign: 'center',
            }}>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(37, 211, 102, 0.2)',
                color: '#25D366',
                marginBottom: '14px',
              }}>
                <MessageCircle size={26} />
              </div>

              <h2 style={{
                fontSize: '20px',
                fontWeight: '900',
                color: '#ffffff',
                marginBottom: '8px',
              }}>
                Still Waiting for an Outstanding Order or Refund?
              </h2>

              <p style={{
                fontSize: '15px',
                color: '#cbd5e1',
                maxWidth: '600px',
                margin: '0 auto 20px',
                lineHeight: '1.6',
              }}>
                Please reach out directly to our helpline WhatsApp. Our team will promptly provide you with your scheduled payment or delivery date.
              </p>

              {/* Action Buttons: WhatsApp & Copy */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '560px',
                margin: '0 auto',
              }}>
                
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    flex: '1 1 280px',
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
                  <span>Chat on Helpline WhatsApp</span>
                  <ExternalLink size={16} style={{ opacity: 0.8 }} />
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f8fafc',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copied ? <Check size={18} color="#34d399" /> : <Copy size={18} />}
                  <span>{copied ? 'Copied Number!' : rawWhatsappNumber}</span>
                </button>

              </div>

              {/* Subtext info */}
              <div style={{
                fontSize: '12.5px',
                color: '#94a3b8',
                marginTop: '14px',
              }}>
                Dedicated Helpline: <strong>{whatsappDisplay}</strong> • Operating to assist affected customers
              </div>
            </div>

            {/* Customer Review Callout Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '14px',
              marginBottom: '16px',
            }}>
              
              <div style={{ display: 'flex', gap: '4px', color: '#fbbf24' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>

              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: '0 0 6px',
                }}>
                  Recently Received Your Product?
                </h3>
                <p style={{
                  fontSize: '14.5px',
                  color: '#cbd5e1',
                  maxWidth: '580px',
                  margin: 0,
                  lineHeight: '1.6',
                }}>
                  Your feedback means everything to us right now—please take a moment to share your review on our website.
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToReviews}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#0a1628',
                  fontSize: '14px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                }}
              >
                <span>Share Your Review</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Closing Signature Statement */}
            <div style={{
              padding: '24px 16px 8px',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: '17px',
                fontWeight: '700',
                color: '#f8fafc',
                margin: '0 0 6px',
                fontStyle: 'italic',
              }}>
                "Thank you for standing by us as we rebuild stronger."
              </p>
              <p style={{
                fontSize: '13px',
                color: '#94a3b8',
                margin: 0,
                fontWeight: '500',
              }}>
                — The Only Gadjets Team
              </p>
            </div>

          </div>
        </div>

        {/* Video Reviews Carousel (if available) */}
        {videos.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <VideoReviewCarousel videos={videos} />
          </div>
        )}

        {/* Customer Reviews Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
          color: '#0f172a',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e2e8f0',
          }}>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#0f172a',
                margin: '0 0 4px',
              }}>
                Customer Feedback & Experience
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Real reviews from our verified customers across India
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToReviews}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#0a1628',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>Write a Review</span>
            </button>
          </div>

          <ReviewsSection productId="store" />
        </div>

        {/* Track Order CTA */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '46px',
            height: '46px',
            background: 'rgba(56, 189, 248, 0.15)',
            borderRadius: '12px',
            marginBottom: '12px',
            color: '#38bdf8',
          }}>
            <Truck size={24} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 6px', color: '#f8fafc' }}>
            Looking to Track an Active Shipment?
          </h3>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 16px', maxWidth: '480px', marginInline: 'auto' }}>
            Check real-time delivery status, courier tracking, and order updates anytime.
          </p>
          <Link
            href="/track"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span>Track Order Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Footer Note */}
        <div style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '12px',
          padding: '12px 0',
        }}>
          © {new Date().getFullYear()} Only Gadjets. All rights reserved. • B2B Wholesale Since 2021
        </div>

      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: '#0a1329',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: '15px',
        fontWeight: '600'
      }}>
        Loading Progress Update...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

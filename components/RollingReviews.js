'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle, ChevronRight } from 'lucide-react';
import styles from '@/styles/RollingReviews.module.css';

export default function RollingReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const timerRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetch('/api/reviews?productId=store')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter to show high-quality reviews (rating >= 4) with comments first
          const highQuality = data.filter(r => r.rating >= 4 && r.comment && r.comment.trim().length > 5);
          const backup = data.filter(r => r.comment && r.comment.trim().length > 0);
          
          if (highQuality.length > 0) {
            setReviews(highQuality);
          } else if (backup.length > 0) {
            setReviews(backup);
          } else {
            setReviews(data);
          }
        }
      })
      .catch(err => console.error('Failed to fetch rolling reviews', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (reviews.length <= 1 || isDragging || isHovered) return;

    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
      }, 4000);
    };

    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reviews, isDragging, isHovered]);

  const handleDotClick = (index) => {
    if (index === activeIndex) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setActiveIndex(index);
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (reviews.length <= 1) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    
    // Apply resistance at boundaries
    if ((activeIndex === 0 && diff > 0) || (activeIndex === reviews.length - 1 && diff < 0)) {
      setDragOffset(diff * 0.4);
    } else {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = currentXRef.current - startXRef.current;
    const threshold = 60;

    if (diff < -threshold && activeIndex < reviews.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else if (diff > threshold && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
    setDragOffset(0);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    if (reviews.length <= 1) return;
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    if (timerRef.current) clearInterval(timerRef.current);
    
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    currentXRef.current = e.clientX;
    const diff = currentXRef.current - startXRef.current;
    
    if ((activeIndex === 0 && diff > 0) || (activeIndex === reviews.length - 1 && diff < 0)) {
      setDragOffset(diff * 0.4);
    } else {
      setDragOffset(diff);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = currentXRef.current - startXRef.current;
    const threshold = 60;

    if (diff < -threshold && activeIndex < reviews.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else if (diff > threshold && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="skeleton" style={{ height: 130, borderRadius: 16 }} />
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div 
        className={styles.card}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.cardHeader}>
          <div className={styles.ratingWrapper}>
            <div className={styles.ratingBadge}>
              {reviews[activeIndex].rating} <Star size={12} fill="currentColor" />
            </div>
            <span className={styles.ratingLabel}>Customer Review</span>
          </div>
          <button onClick={scrollToReviews} className={styles.moreReviewsBtn}>
            More Reviews <ChevronRight size={14} />
          </button>
        </div>

        <div 
          className={styles.sliderWrapper}
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ touchAction: 'pan-y' }}
        >
          <div 
            className={styles.sliderTrack}
            style={{
              transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {reviews.map((review, idx) => {
              const formattedDate = review.created_at
                ? new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                : '';

              return (
                <div key={review.id || idx} className={styles.slide}>
                  <div className={styles.reviewContent}>
                    {review.comment ? (
                      <p className={styles.comment}>
                        "{review.comment}"
                      </p>
                    ) : (
                      <p className={styles.comment} style={{ fontStyle: 'normal', color: 'var(--text-muted)' }}>
                        Rated this product {review.rating} out of 5 stars.
                      </p>
                    )}
                    <div className={styles.meta}>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{review.user_name}</span>
                        <span className={styles.verifiedBadge}>
                          <CheckCircle size={11} color="var(--text-muted)" /> Certified Buyer
                        </span>
                      </div>
                      {formattedDate && <span className={styles.date}>{formattedDate}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {reviews.length > 1 && (
          <div className={styles.dotsWrapper}>
            {reviews.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ''}`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

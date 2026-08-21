'use client';

import { useEffect } from 'react';
import { formatINR } from '@/lib/utils';
import styles from '@/styles/LivePrice.module.css';

export default function LivePriceDisplay({ product, onPriceUpdate, onStockUpdate }) {
  const amazonPrice = Number(product.amazon_price) || 0;
  const flipkartPrice = Number(product.flipkart_price) || 0;
  const onlinePrice = Number(product.online_price) || 0;
  const adminOurPrice = Number(product.our_price) || 0;

  // Maximum competitor/market price to show comparison
  const maxCompetitorPrice = Math.max(amazonPrice, flipkartPrice, onlinePrice);
  
  // Use admin's custom our_price if set (> 0), otherwise fallback to 10% off market price
  const displayOurPrice = adminOurPrice > 0 
    ? adminOurPrice 
    : (maxCompetitorPrice > 0 ? Math.round(maxCompetitorPrice * 0.9) : 0);

  useEffect(() => {
    if (onPriceUpdate && displayOurPrice > 0) {
      onPriceUpdate(displayOurPrice);
    }
  }, [displayOurPrice, onPriceUpdate]);

  const savings = maxCompetitorPrice > displayOurPrice ? maxCompetitorPrice - displayOurPrice : 0;
  const savingsPercent = maxCompetitorPrice > 0 && savings > 0 
    ? Math.round((savings / maxCompetitorPrice) * 100) 
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.pricesRow}>
        <div className={styles.competitorPrices} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {amazonPrice > 0 && (
            <div className={styles.compPriceItem}>
              <span className={styles.compLabel}>Amazon Price:</span>
              <span className={styles.strikethrough}>{formatINR(amazonPrice)}</span>
            </div>
          )}
          {flipkartPrice > 0 && (
            <div className={styles.compPriceItem}>
              <span className={styles.compLabel}>Flipkart Price:</span>
              <span className={styles.strikethrough}>{formatINR(flipkartPrice)}</span>
            </div>
          )}
          {onlinePrice > 0 && (
            <div className={styles.compPriceItem}>
              <span className={styles.compLabel}>Online MRP:</span>
              <span className={styles.strikethrough}>{formatINR(onlinePrice)}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.ourPriceBox}>
        <div className={styles.ourPriceLabel}>Our Wholesale Price</div>
        <div className={styles.ourPriceValue}>
          {formatINR(displayOurPrice)}
          {savingsPercent > 0 && (
            <span className={styles.discountBadge}>-{savingsPercent}%</span>
          )}
        </div>
        
        {savings > 0 && (
          <div className={styles.savingsText}>
            You Save: <span className={styles.savingsAmount}>{formatINR(savings)}</span>
          </div>
        )}
      </div>
      
      {(product.amazon_url || product.flipkart_url) && (
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span> Market Prices Synced
        </div>
      )}
    </div>
  );
}

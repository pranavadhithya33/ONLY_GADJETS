'use client';

import { useState, useEffect } from 'react';
import { formatINR } from '@/lib/utils';
import styles from '@/styles/LivePrice.module.css';

export default function LivePriceDisplay({ product, onPriceUpdate, onStockUpdate }) {
  const [prices, setPrices] = useState({
    amazon: product.amazon_price || product.online_price || 0,
    flipkart: product.flipkart_price || product.online_price || 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use stored product prices from database (updated via admin / periodic sync)
    setPrices({
      amazon: product.amazon_price || product.online_price || 0,
      flipkart: product.flipkart_price || product.online_price || 0,
    });
    setIsLoading(false);
  }, [product.amazon_price, product.flipkart_price, product.online_price]);

  // Determine highest competitor price to calculate maximum savings
  const maxCompetitorPrice = Math.max(prices.amazon, prices.flipkart);
  const calculatedOurPrice = maxCompetitorPrice > 0 ? Math.round(maxCompetitorPrice * 0.9) : product.our_price;
  
  useEffect(() => {
    if (onPriceUpdate && calculatedOurPrice !== product.our_price) {
      onPriceUpdate(calculatedOurPrice);
    }
  }, [calculatedOurPrice, product.our_price, onPriceUpdate]);

  const savings = maxCompetitorPrice > calculatedOurPrice ? maxCompetitorPrice - calculatedOurPrice : 0;
  const savingsPercent = 10; // Forced to 10% by new rule

  return (
    <div className={styles.container}>
      <div className={styles.pricesRow}>
        <div className={styles.competitorPrices}>
          {maxCompetitorPrice > 0 && (
            <div className={styles.compPriceItem}>
              <span className={styles.compLabel}>Online Price:</span>
              <span className={styles.strikethrough}>{formatINR(maxCompetitorPrice)}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.ourPriceBox}>
        <div className={styles.ourPriceLabel}>Our Wholesale Price</div>
        <div className={styles.ourPriceValue}>
          {formatINR(calculatedOurPrice)}
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
      
      {isLoading && (
        <div className={styles.loadingText}>Fetching live market prices...</div>
      )}
      {!isLoading && (product.amazon_url || product.flipkart_url) && (
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span> Live Prices Updated
        </div>
      )}
    </div>
  );
}

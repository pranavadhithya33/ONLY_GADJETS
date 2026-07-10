'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard, { SkeletonCard } from '@/components/ProductCard';
import VideoReviewCarousel from '@/components/VideoReviewCarousel';
import ReviewsSection from '@/components/ReviewsSection';
import RollingReviews from '@/components/RollingReviews';
import { Smartphone, Tag, Star, TrendingUp, ChevronRight, Zap, Truck, Filter, X, Check } from 'lucide-react';
// Helper to normalize brand names
const formatBrand = (rawBrand) => {
  if (!rawBrand) return 'Other';
  const lower = rawBrand.toLowerCase();
  const overrides = {
    'iqoo': 'iQOO',
    'oneplus': 'OnePlus',
    'realme': 'Realme',
    'poco': 'POCO',
    'cmf': 'CMF',
    'redmi': 'Redmi',
    'vivo': 'Vivo',
    'oppo': 'OPPO',
    'motorola': 'Motorola',
    'apple': 'Apple',
    'samsung': 'Samsung',
    'nothing': 'Nothing',
    'infinix': 'Infinix',
    'google': 'Google'
  };
  return overrides[lower] || (rawBrand.charAt(0).toUpperCase() + lower.slice(1));
};

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('cat') || searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleSearch = (e) => {
      setSearchQuery(e.detail || '');
    };
    window.addEventListener('global-search', handleSearch);
    return () => window.removeEventListener('global-search', handleSearch);
  }, []);

  // Derive available brands
  const availableBrands = [...new Set(products.map(p => {
    let rawBrand = p.brand;
    if (!rawBrand) {
      const nameParts = p.name?.split(' ') || [];
      if (nameParts.length > 0) rawBrand = nameParts[0];
    }
    return formatBrand(rawBrand);
  }))].filter(b => b !== 'Other').sort();

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Client-side sorting and filtering logic
  const filteredProducts = products.filter(p => p.stock > 0).filter(p => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(searchLower);
      const matchBrand = (p.brand || '').toLowerCase().includes(searchLower);
      if (!matchName && !matchBrand) return false;
    }

    if (selectedBrands.length > 0) {
      let rawBrand = p.brand;
      if (!rawBrand) {
        const nameParts = p.name?.split(' ') || [];
        if (nameParts.length > 0) rawBrand = nameParts[0];
      }
      const pBrand = formatBrand(rawBrand);
      if (!selectedBrands.includes(pBrand)) return false;
    }
    
    if (priceRange === 'under-15k') return p.our_price < 15000;
    if (priceRange === '15k-30k') return p.our_price >= 15000 && p.our_price <= 30000;
    if (priceRange === '30k-50k') return p.our_price > 30000 && p.our_price <= 50000;
    if (priceRange === 'above-50k') return p.our_price > 50000;
    
    return true;
  });

  const displayedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.our_price - b.our_price;
    }
    if (sortBy === 'price-desc') {
      return b.our_price - a.our_price;
    }
    if (sortBy === 'newest') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
    // Default 'featured': featured first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  // Sync state with URL params
  useEffect(() => {
    setActiveCategory(categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = fetch(activeCategory ? `/api/products?category=${encodeURIComponent(activeCategory)}` : '/api/products').then(r => r.json());
    const fetchCategories = fetch('/api/categories').then(r => r.json());
    const fetchVideos = fetch('/api/videos').then(r => r.json()).catch(() => []);

    Promise.all([fetchProducts, fetchCategories, fetchVideos])
      .then(([prodData, catData, vidData]) => {
        setProducts(prodData || []);
        const excludedSlugs = ['smartphones', 'tablets', 'tablet', 'accessories'];
        const filteredCats = (catData || []).filter(c => !excludedSlugs.includes(c.slug.toLowerCase()));
        setCategories(filteredCats);
        setVideos(vidData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #1a3a6e 60%, #0a1628 100%)',
        padding: '28px 16px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(244,167,36,0.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-30, left:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
            <span style={{ background:'#f4a724', color:'#0a1628', fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:99, letterSpacing:'0.8px', textTransform:'uppercase' }}>
              ⚡ Wholesale Price
            </span>
            <span style={{ background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.8)', fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:99 }}>
              Direct from Dealer
            </span>
          </div>
          <h1 style={{ fontSize:26, fontWeight:900, color:'#fff', lineHeight:1.2, letterSpacing:'-0.5px', marginBottom:8 }}>
            Best Prices on<br />
            <span style={{ color:'#f4a724' }}>Top Smartphones</span>
          </h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.7)', marginBottom:20, lineHeight:1.5 }}>
            Wholesale deals · Half COD available · Full prepaid gets extra savings
          </p>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <a href="#products" style={{
              background:'#f4a724', color:'#0a1628', padding:'11px 22px',
              borderRadius:12, fontWeight:800, fontSize:14, display:'inline-flex',
              alignItems:'center', gap:6, textDecoration:'none'
            }}>
              <Zap size={15} strokeWidth={2.5} />
              Shop Now
            </a>
            <a href={`https://wa.me/917397189222?text=${encodeURIComponent('Hi! I want to know about your deals.')}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                background:'rgba(37,211,102,0.15)', color:'#25d366', padding:'11px 22px',
                borderRadius:12, fontWeight:700, fontSize:14, display:'inline-flex',
                alignItems:'center', gap:6, border:'1px solid rgba(37,211,102,0.3)', textDecoration:'none'
              }}>
              📱 WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* USP Strip */}
      <div style={{
        background:'#fff', borderBottom:'1px solid #e2e8f0',
        display:'flex', overflowX:'auto', scrollbarWidth:'none'
      }}>
        {[
          { icon:'🏷️', text:'Wholesale Rates' },
          { icon:'🚚', text:'Pan India Delivery' },
          { icon:'💳', text:'Half COD Option' },
          { icon:'✅', text:'Genuine Products' },
        ].map((item, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'10px 16px', whiteSpace:'nowrap', flexShrink:0,
            borderRight: i < 3 ? '1px solid #e2e8f0' : 'none'
          }}>
            <span style={{ fontSize:15 }}>{item.icon}</span>
            <span style={{ fontSize:12, fontWeight:600, color:'#4a5568' }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Rolling Reviews Segment */}
      <RollingReviews />

      {/* Top Selling Section */}
      {!loading && products.some(p => p.featured && p.stock > 0) && (
        <div style={{ padding: '0 16px', marginTop: 20 }}>
          <div className="section-header" style={{ marginBottom: 12 }}>
            <h2 className="section-title">🔥 Top <span>Selling</span></h2>
          </div>
          <div className="product-grid" style={{ marginBottom: 20 }}>
            {products
              .filter(p => p.featured && p.stock > 0)
              .slice(0, 4)
              .map(p => <ProductCard key={`featured-${p.id}`} product={p} />)
            }
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div style={{ padding:'16px 16px 8px' }}>
          <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', paddingBottom:4 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? '' : cat.slug)}
                style={{
                  padding:'7px 16px', borderRadius:99, fontSize:13, fontWeight:600,
                  border:'none', cursor:'pointer', flexShrink:0, transition:'all 0.2s',
                  background: activeCategory === cat.slug ? '#0a1628' : '#fff',
                  color: activeCategory === cat.slug ? '#fff' : '#4a5568',
                  boxShadow: activeCategory === cat.slug ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                {cat.icon && <span style={{ marginRight:4 }}>{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div id="products" style={{ padding:'12px 12px 0' }}>
        <div className="section-header" style={{ padding:'0 4px', marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <h2 className="section-title" style={{ margin:0 }}>
            {activeCategory
              ? categories.find(c => c.slug === activeCategory)?.name || 'Products'
              : <>All <span>Products</span></>
            }
          </h2>
          {!loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, display:'inline-block' }}>
                {displayedProducts.length} item{displayedProducts.length !== 1 ? 's' : ''}
              </span>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px',
                  background: isFilterOpen || selectedBrands.length > 0 || priceRange ? '#0a1628' : '#fff',
                  color: isFilterOpen || selectedBrands.length > 0 || priceRange ? '#fff' : '#4a5568',
                  border: isFilterOpen || selectedBrands.length > 0 || priceRange ? '1px solid #0a1628' : '1px solid #e2e8f0',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                {isFilterOpen ? <X size={14} /> : <Filter size={14} />}
                <span>Filters {(selectedBrands.length > 0 || priceRange) && `(${(selectedBrands.length > 0 ? 1 : 0) + (priceRange ? 1 : 0)})`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Expandable Filter Section */}
        {isFilterOpen && !loading && (
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '16px',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            transition: 'all 0.3s ease-in-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0a1628', margin: 0 }}>Advanced Filters</h3>
              {(selectedBrands.length > 0 || priceRange || sortBy !== 'featured') && (
                <button 
                  onClick={() => { setSelectedBrands([]); setPriceRange(''); setSortBy('featured'); }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                >
                  Clear All
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Sort By */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort By</div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
                  {[
                    { id: 'featured', label: 'Featured' },
                    { id: 'newest', label: 'Newest' },
                    { id: 'price-asc', label: 'Price: Low to High' },
                    { id: 'price-desc', label: 'Price: High to Low' },
                  ].map(sortOpt => (
                    <button
                      key={sortOpt.id}
                      onClick={() => setSortBy(sortOpt.id)}
                      style={{
                        padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                        border: sortBy === sortOpt.id ? '1px solid #0a1628' : '1px solid #e2e8f0',
                        background: sortBy === sortOpt.id ? '#f8fafc' : '#fff',
                        color: sortBy === sortOpt.id ? '#0a1628' : '#475569',
                        cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                        transition: 'all 0.1s'
                      }}
                    >
                      {sortOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Range</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                  {[
                    { id: '', label: 'Any Price' },
                    { id: 'under-15k', label: 'Under ₹15,000' },
                    { id: '15k-30k', label: '₹15k - ₹30k' },
                    { id: '30k-50k', label: '₹30k - ₹50k' },
                    { id: 'above-50k', label: 'Above ₹50k' },
                  ].map(priceOpt => (
                    <button
                      key={priceOpt.id}
                      onClick={() => setPriceRange(priceOpt.id)}
                      style={{
                        padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                        border: priceRange === priceOpt.id ? '1px solid #0ea5e9' : '1px solid #e2e8f0',
                        background: priceRange === priceOpt.id ? '#f0f9ff' : '#fff',
                        color: priceRange === priceOpt.id ? '#0369a1' : '#475569',
                        cursor: 'pointer', textAlign: 'center',
                        transition: 'all 0.1s'
                      }}
                    >
                      {priceOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Brands</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {availableBrands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', borderRadius: '99px', fontSize: '13px', fontWeight: '600',
                          border: selectedBrands.includes(brand) ? '1px solid transparent' : '1px solid #e2e8f0',
                          background: selectedBrands.includes(brand) ? '#0a1628' : '#fff',
                          color: selectedBrands.includes(brand) ? '#fff' : '#475569',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {selectedBrands.includes(brand) && <Check size={14} color="#fff" />}
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign:'center', padding:'48px 16px',
            background:'#fff', borderRadius:16, margin:'0 4px'
          }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📱</div>
            <div style={{ fontWeight:700, fontSize:16, color:'#0a1628', marginBottom:6 }}>
              No products found
            </div>
            <div style={{ fontSize:13, color:'#9aa3b2' }}>
              {activeCategory ? 'No products in this category yet.' : 'Products will appear here once added.'}
            </div>
            {activeCategory && (
              <button onClick={() => setActiveCategory('')}
                style={{ marginTop:16, padding:'10px 20px', background:'#f4a724', color:'#0a1628', border:'none', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {displayedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div style={{ padding:'24px 16px 0' }}>
        <div style={{ background:'linear-gradient(135deg, #0a1628, #1a3a6e)', borderRadius:20, padding:'20px 16px' }}>
          <h2 style={{ color:'#fff', fontWeight:800, fontSize:18, marginBottom:16, textAlign:'center' }}>
            Why <span style={{ color:'#f4a724' }}>Only Gadjets?</span>
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { icon:'💰', title:'Best Wholesale Rates', desc:'No middlemen, direct savings' },
              { icon:'🚚', title:'Pan India Delivery', desc:'Fast & reliable shipping' },
              { icon:'📦', title:'Half COD Available', desc:'Pay 50% advance, rest on delivery' },
              { icon:'⭐', title:'Genuine Products', desc:'100% authentic, verified stock' },
            ].map((item, i) => (
              <div key={i} style={{
                background:'rgba(255,255,255,0.07)', borderRadius:12,
                padding:'14px 12px', border:'1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{item.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:3 }}>{item.title}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Reviews */}
      {!loading && videos.length > 0 && (
        <VideoReviewCarousel videos={videos} />
      )}

      {/* Store Reviews */}
      <div style={{ padding: '0 16px' }}>
        <ReviewsSection productId="store" />
      </div>

      {/* Track Order CTA */}
      <div style={{ padding:'24px 16px 0' }}>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, padding:'24px', textAlign:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:48, height:48, background:'#e0f2fe', borderRadius:12, marginBottom:16 }}>
            <Truck size={24} color="#0ea5e9" />
          </div>
          <h2 style={{ fontSize:18, fontWeight:800, marginBottom:8, color:'#0a1628' }}>Track Your Shipment</h2>
          <p style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Check your delivery status and download your invoice instantly.</p>
          <Link href="/track" style={{ 
            display:'block', width:'100%', padding:'14px', background:'#0a1628', color:'#fff', 
            borderRadius:12, fontWeight:700, fontSize:14, textDecoration:'none' 
          }}>
            Track Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ padding:16 }}>
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

// Trigger deploy

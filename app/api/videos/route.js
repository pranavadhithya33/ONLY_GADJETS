import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Fallback data if table doesn't exist yet
const FALLBACK_VIDEOS = [
  { id: '1', url: '/videos/4.mp4', thumbnail_url: '/videos/thumbnails/4.jpg', customer_name: 'Verified Customer', active: true },
  { id: '2', url: '/videos/WhatsApp Video 2026-06-06 at 9.37.31 PM.mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.37.31 PM.jpg', customer_name: 'Verified Customer', active: true },
  { id: '3', url: '/videos/WhatsApp Video 2026-06-06 at 9.37.32 PM.mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.37.32 PM.jpg', customer_name: 'Verified Customer', active: true },
  { id: '4', url: '/videos/WhatsApp Video 2026-06-06 at 9.37.33 PM.mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.37.33 PM.jpg', customer_name: 'Verified Customer', active: true },
  { id: '5', url: '/videos/WhatsApp Video 2026-06-06 at 9.37.34 PM (1).mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.37.34 PM (1).jpg', customer_name: 'Verified Customer', active: true },
  { id: '6', url: '/videos/WhatsApp Video 2026-06-06 at 9.37.34 PM (2).mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.37.34 PM (2).jpg', customer_name: 'Verified Customer', active: true },
  { id: '7', url: '/videos/WhatsApp Video 2026-06-06 at 9.37.34 PM.mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.37.34 PM.jpg', customer_name: 'Verified Customer', active: true },
  { id: '8', url: '/videos/WhatsApp Video 2026-06-06 at 9.37.35 PM.mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.37.35 PM.jpg', customer_name: 'Verified Customer', active: true },
  { id: '9', url: '/videos/WhatsApp Video 2026-06-06 at 9.38.33 PM.mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.38.33 PM.jpg', customer_name: 'Verified Customer', active: true },
  { id: '10', url: '/videos/WhatsApp Video 2026-06-06 at 9.39.34 PM.mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-06-06 at 9.39.34 PM.jpg', customer_name: 'Verified Customer', active: true },
  { id: '11', url: '/videos/WhatsApp Video 2026-07-01 at 12.23.23 PM.mp4', thumbnail_url: '/videos/thumbnails/WhatsApp Video 2026-07-01 at 12.23.23 PM.jpg', customer_name: 'Verified Customer', active: true }
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const adminMode = searchParams.get('admin') === 'true';

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    let query = supabase.from('video_reviews').select('*').order('created_at', { ascending: false });
    if (!adminMode) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;
    
    // If the table doesn't exist yet, return fallback
    if (error && error.code === '42P01') {
      return NextResponse.json(adminMode ? FALLBACK_VIDEOS : FALLBACK_VIDEOS.filter(v => v.active));
    }
    
    if (error) throw error;
    
    // If the table is empty (user created table but didn't insert rows yet)
    if (!data || data.length === 0) {
      return NextResponse.json(adminMode ? FALLBACK_VIDEOS : FALLBACK_VIDEOS.filter(v => v.active));
    }
    
    // Ensure every record has a valid thumbnail_url
    const enrichedData = data.map(v => {
      let thumb = v.thumbnail_url;
      if (!thumb && v.url && v.url.startsWith('/videos/')) {
        const base = v.url.split('/').pop().replace(/\.(mp4|webm|mov)$/i, '.jpg');
        thumb = `/videos/thumbnails/${base}`;
      }
      return { ...v, thumbnail_url: thumb || '/videos/thumbnails/4.jpg' };
    });
    
    return NextResponse.json(enrichedData);
  } catch (err) {
    return NextResponse.json(adminMode ? FALLBACK_VIDEOS : FALLBACK_VIDEOS.filter(v => v.active));
  }
}

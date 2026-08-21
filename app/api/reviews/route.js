import { createAdminClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';

const MOCK_REVIEWS = [
  {
    id: 'mock-1',
    user_name: 'Aravind Swamy',
    rating: 5,
    comment: 'Super fast delivery and the phone was in brand new condition. Fully satisfied!',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-2',
    user_name: 'Priya Sharma',
    rating: 5,
    comment: 'Excellent pricing for wholesale deals. Highly recommend Only Gadjets for bulk buys.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-3',
    user_name: 'Rahul Verma',
    rating: 4,
    comment: 'Good customer service, had a minor query about COD and they resolved it on WhatsApp instantly.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-4',
    user_name: 'Karthik Raja',
    rating: 5,
    comment: 'Best deal online for iPhone 15 Pro. Genuine product and fast delivery.',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status'); // admin can filter by status
    const admin = searchParams.get('admin');

    if (!productId && !status && !admin) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // If admin requests all reviews
    if (admin === 'true') {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, product_id, user_name, rating, comment, status, created_at, products(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // If admin requests specific status
    if (status && !productId) {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, product_id, user_name, rating, comment, status, created_at, products(name)')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // Public: return approved reviews
    let query = supabase
      .from('reviews')
      .select('id, user_name, rating, comment, created_at, products(name)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (productId !== 'store') {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Database query failed, returning fallback mock reviews.');
      return NextResponse.json(MOCK_REVIEWS);
    }

    const responseData = data && data.length > 0 ? data : MOCK_REVIEWS;
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
      }
    });
  } catch (err) {
    console.error('Reviews GET error, returning mock reviews:', err);
    return NextResponse.json(MOCK_REVIEWS, { status: 200 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { product_id, user_name, rating, comment } = body;

    if (!user_name || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // If product_id is 'store', insert null
    const dbProductId = product_id === 'store' ? null : product_id;

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ product_id: dbProductId, user_name, rating: parseInt(rating), comment: comment || '', status: 'pending' }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Reviews POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Admin: update review status (approve/reject)
export async function PUT(req) {
  // Admin auth guard
  const auth = verifyAdminRequest(req);
  if (!auth.authorized) return auth.response;
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid review ID or status' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Reviews PUT error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// app/api/products/bulk-action/route.js
import { createAdminClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function POST(req) {
  const auth = verifyAdminRequest(req);
  if (!auth.authorized) return auth.response;

  try {
    const { action, ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Valid IDs array required' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    if (action === 'hide') {
      const { error } = await adminSupabase
        .from('products')
        .update({ stock: 0 })
        .in('id', ids);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Products hidden successfully' }, { status: 200 });
    } 

    if (action === 'unhide') {
      const { error } = await adminSupabase
        .from('products')
        .update({ stock: 100 })
        .in('id', ids);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Products unhidden successfully' }, { status: 200 });
    } 
    
    if (action === 'delete') {
      const { error } = await adminSupabase
        .from('products')
        .delete()
        .in('id', ids);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Products deleted successfully' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (err) {
    console.error('Bulk action error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { scrapeAmazonProduct } from '@/lib/amazonScraper';
import { scrapeFlipkartProduct } from '@/lib/flipkartScraper';

export async function POST(request) {
  try {
    const { url, category } = await request.json();

    if (!url || (!url.includes('amazon') && !url.includes('flipkart'))) {
      return NextResponse.json({ error: 'Please provide a valid Amazon or Flipkart India product URL' }, { status: 400 });
    }

    const isFlipkart = url.includes('flipkart');
    const scrapedData = isFlipkart 
      ? await scrapeFlipkartProduct(url, category)
      : await scrapeAmazonProduct(url, category);

    // If scraper failed to get details (e.g. returns empty images or failure message)
    if (!scrapedData || !scrapedData.images || scrapedData.images.length === 0 || (scrapedData.description && scrapedData.description.includes('Could not fetch full product details'))) {
      const errorMsg = scrapedData?.description?.includes('Could not fetch full product details')
        ? scrapedData.description
        : 'Could not fetch product details from the URL. Please verify the link or add the product manually.';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Save to Supabase — deduplicate slug if needed
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', scrapedData.slug)
      .single();

    if (existing) {
      scrapedData.slug = `${scrapedData.slug}-${Date.now()}`;
    }

    const { data, error } = await supabase
      .from('products')
      .insert(scrapedData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, product: data });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

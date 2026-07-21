// app/api/products/bulk/route.js
import { createAdminClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function POST(req) {
  // Admin auth guard
  const auth = verifyAdminRequest(req);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { products } = body;

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Products must be an array' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();
    const results = {
      total: products.length,
      successCount: 0,
      failedCount: 0,
      inserted: [],
      errors: []
    };

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        const {
          name,
          category,
          our_price,
          online_price,
          amazon_price,
          flipkart_price,
          amazon_url,
          flipkart_url,
          description,
          images,
          featured,
          prepaid_discount_pct,
          variants
        } = product;

        // Basic validation
        if (!name || !name.trim()) {
          throw new Error('Product name is required');
        }
        if (!our_price || isNaN(our_price) || Number(our_price) <= 0) {
          throw new Error(`Invalid Our Price: ${our_price}`);
        }
        if (!category || !category.trim()) {
          throw new Error('Category is required');
        }

        // Generate base slug
        const baseSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        let slug = baseSlug || 'product';

        // Check if product exists by ID (if provided) or slug
        let existingProduct = null;
        if (product.id) {
          const { data } = await adminSupabase.from('products').select('id, slug').eq('id', product.id).maybeSingle();
          existingProduct = data;
        } else {
          const { data } = await adminSupabase.from('products').select('id, slug').eq('slug', slug).maybeSingle();
          existingProduct = data;
        }

        // Parse images
        let imagesArray = [];
        if (Array.isArray(images)) {
          imagesArray = images.filter(Boolean);
        } else if (typeof images === 'string') {
          imagesArray = images
            .split(',')
            .map(url => url.trim())
            .filter(Boolean);
        }

        // Parse variants
        let parsedVariants = [];
        if (Array.isArray(variants)) {
          parsedVariants = variants;
        } else if (typeof variants === 'string') {
          const parts = variants.split(',').map(p => p.trim()).filter(Boolean);
          for (const part of parts) {
            const match = part.match(/^\s*(\d+)\s*\/\s*(\d+)\s*:\s*(\d+)\s*$/);
            if (match) {
              parsedVariants.push({
                ram: Number(match[1]),
                storage: Number(match[2]),
                price: Number(match[3]),
                enabled: true
              });
            }
          }
        }

        const productData = {
          name: name.trim(),
          slug: existingProduct ? existingProduct.slug : slug,
          images: imagesArray,
          online_price: Number(online_price) || 0,
          amazon_price: Number(amazon_price) || 0,
          flipkart_price: Number(flipkart_price) || 0,
          amazon_url: amazon_url || '',
          flipkart_url: flipkart_url || '',
          our_price: Number(our_price),
          description: description || '',
          stock: 100, // Default to in stock
          category: category.trim().toLowerCase(),
          featured: featured === true || String(featured).toLowerCase() === 'true' || featured === 1,
          prepaid_discount_pct: Number(prepaid_discount_pct) || 3
        };

        let insertedProduct;
        
        if (existingProduct) {
          // Update existing product
          const { data, error: productError } = await adminSupabase
            .from('products')
            .update(productData)
            .eq('id', existingProduct.id)
            .select()
            .single();
          if (productError) throw productError;
          insertedProduct = data;
          
          // Optionally delete existing variants so we can replace them
          if (parsedVariants.length > 0) {
             await adminSupabase.from('product_variants').delete().eq('product_id', existingProduct.id);
          }
        } else {
          // Insert new product
          const { data, error: productError } = await adminSupabase
            .from('products')
            .insert([productData])
            .select()
            .single();
          if (productError) throw productError;
          insertedProduct = data;
        }

        // Insert variants if any
        if (parsedVariants.length > 0) {
          const toInsert = parsedVariants.map(v => ({
            product_id: insertedProduct.id,
            ram: Number(v.ram),
            storage: Number(v.storage),
            price: Number(v.price),
            enabled: v.enabled !== false
          }));

          const { error: variantError } = await adminSupabase
            .from('product_variants')
            .insert(toInsert);

          if (variantError) {
            console.error(`Failed to insert variants for ${name}:`, variantError);
          }
        }

        results.successCount++;
        results.inserted.push({ id: insertedProduct.id, name: insertedProduct.name });
      } catch (err) {
        results.failedCount++;
        results.errors.push({
          index: i,
          name: product.name || `Row ${i + 1}`,
          error: err.message
        });
      }
    }

    return NextResponse.json(results, { status: 200 });
  } catch (err) {
    console.error('Bulk upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

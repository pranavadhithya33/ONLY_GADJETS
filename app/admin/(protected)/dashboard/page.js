'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Admin.module.css';
import { formatINR, calcPaymentDetails } from '@/lib/utils';
import {
  Smartphone, Package, ShoppingBag, Plus, Edit2, Trash2,
  LogOut, RefreshCw, Star, MessageSquare, Check, X, User, Phone, MapPin, Search
} from 'lucide-react';
import { generateInvoice } from '@/lib/invoiceGenerator';
import * as XLSX from 'xlsx';

const CATEGORIES = [
  { label: 'Smartphones', value: 'smartphones' },
  { label: 'Tablets', value: 'tablets' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Smartwatches', value: 'smartwatches' },
  { label: 'Audio', value: 'audio' },
  { label: 'Other', value: 'other' }
];

const RAM_OPTIONS = [4, 6, 8, 12];
const STORAGE_OPTIONS = [64, 128, 256, 512];

// Build the default 16-combo variant grid
const buildEmptyVariants = () =>
  RAM_OPTIONS.flatMap(ram =>
    STORAGE_OPTIONS.map(storage => ({ ram, storage, price: '', enabled: false }))
  );

const EMPTY_PRODUCT = {
  name: '', images: [''], online_price: '', amazon_price: '', flipkart_price: '',
  amazon_url: '', flipkart_url: '', our_price: '',
  description: '', category: 'smartphones',
  featured: false, prepaid_discount_pct: 3,
  variants: buildEmptyVariants(),
};

// Helper: get admin auth headers for API calls
function getAdminHeaders(extra = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('og_admin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'x-admin-token': token } : {}),
    ...extra
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  
  const [productSortBy, setProductSortBy] = useState('newest');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  
  const filteredProducts = products.filter(p => {
    if (visibilityFilter === 'visible' && p.stock <= 0) return false;
    if (visibilityFilter === 'hidden' && p.stock > 0) return false;

    if (!productSearchQuery) return true;
    const query = productSearchQuery.toLowerCase().trim();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query)
    );
  }).sort((a, b) => {
    if (productSortBy === 'price-asc') return a.our_price - b.our_price;
    if (productSortBy === 'price-desc') return b.our_price - a.our_price;
    if (productSortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (productSortBy === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    // Default 'newest'
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Bulk Importer state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkPreviewData, setBulkPreviewData] = useState([]);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkImportMsg, setBulkImportMsg] = useState('');
  
  // Importer state
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  // Manual Order state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    fullName: '', phone: '', address: '', pincode: '',
    productName: '', productSlug: 'offline',
    paymentOption: 'half_cod',
    finalPrice: '', advanceAmount: ''
  });
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Route Editor state
  const [expandedRouteOrderId, setExpandedRouteOrderId] = useState(null);
  const [routeEditForm, setRouteEditForm] = useState({
    step1: '',
    step2: '',
    step3: '',
    step4: '',
    step5: '',
    step6: '',
    step7: '',
    step8: '',
    estimated_delivery_date: '',
    current_step: 1
  });

  // Reviews moderation state
  const [allReviews, setAllReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Videos state
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('og_admin');
      const token = sessionStorage.getItem('og_admin_token');
      if (!auth || !token) {
        sessionStorage.removeItem('og_admin');
        router.replace('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  // Fetch data
  const fetchProducts = () => {
    return fetch('/api/products').then(r => r.json()).then(setProducts);
  };
  const fetchOrders = () => {
    return fetch('/api/orders').then(r => r.json()).then(setOrders);
  };
  const fetchReviewsAdmin = () => {
    setReviewsLoading(true);
    return fetch('/api/reviews?admin=true', { headers: getAdminHeaders() })
      .then(r => r.json())
      .then(data => setAllReviews(Array.isArray(data) ? data : []))
      .catch(() => setAllReviews([]))
      .finally(() => setReviewsLoading(false));
  };
  const fetchVideosAdmin = () => {
    setVideosLoading(true);
    return fetch('/api/videos?admin=true', { headers: getAdminHeaders() })
      .then(r => r.json())
      .then(data => setVideos(Array.isArray(data) ? data : []))
      .catch(() => setVideos([]))
      .finally(() => setVideosLoading(false));
  };

  useEffect(() => {
    // setLoading(true); // Avoid calling setState synchronously in effect body
    Promise.all([fetchProducts(), fetchOrders(), fetchReviewsAdmin(), fetchVideosAdmin()]).finally(() => setLoading(false));
  }, []);

  // Bulk Import Handlers
  const downloadTemplate = () => {
    const headers = [
      "Name",
      "Category",
      "Our Price (INR)",
      "Online Price (INR)",
      "Amazon Price (INR)",
      "Flipkart Price (INR)",
      "Amazon URL",
      "Flipkart URL",
      "Description",
      "Images (Comma-separated URLs)",
      "Featured (TRUE/FALSE)",
      "Prepaid Discount %",
      "Variants (RAM/Storage:Price, ...)"
    ];
    
    const sampleRows = [
      [
        "Samsung Galaxy S24 Ultra (12GB/256GB)",
        "smartphones",
        "114999",
        "129999",
        "124999",
        "123999",
        "https://www.amazon.in/dp/B0CSZHDCD9",
        "",
        "Galaxy S24 Ultra with Snapdragon 8 Gen 3, AI features, 200MP camera.",
        "https://m.media-amazon.com/images/I/71RMRX1XSBL._SX679_.jpg",
        "TRUE",
        "3",
        "12/256:114999, 12/512:124999, 12/1024:139999"
      ],
      [
        "OnePlus 12R 5G (8GB/128GB)",
        "smartphones",
        "35999",
        "39999",
        "39999",
        "39500",
        "https://www.amazon.in/dp/B0CR8GFFC6",
        "",
        "OnePlus 12R with Snapdragon 8 Gen 2, 50MP Camera, 5500mAh.",
        "https://m.media-amazon.com/images/I/61dVNfNz7qL._SX679_.jpg",
        "FALSE",
        "3",
        "8/128:35999, 12/256:40999"
      ]
    ];

    const worksheetData = [headers, ...sampleRows];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "bulk_product_import_template.xlsx");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rows.length === 0) {
          alert('Excel file is empty');
          return;
        }

        const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
        const dataRows = rows.slice(1);

        const getColIndex = (aliases) => {
          return headers.findIndex(h => aliases.includes(h));
        };

        const colIndices = {
          id: getColIndex(['id', 'uuid', 'product_id']),
          slug: getColIndex(['slug', 'url slug']),
          name: getColIndex(['name', 'product name', 'title']),
          category: getColIndex(['category']),
          our_price: getColIndex(['our price (inr)', 'our price', 'our_price', 'price']),
          online_price: getColIndex(['online price (inr)', 'online price', 'online_price', 'market price']),
          amazon_price: getColIndex(['amazon price (inr)', 'amazon price', 'amazon_price']),
          flipkart_price: getColIndex(['flipkart price (inr)', 'flipkart price', 'flipkart_price']),
          amazon_url: getColIndex(['amazon url', 'amazon_url']),
          flipkart_url: getColIndex(['flipkart url', 'flipkart_url']),
          description: getColIndex(['description', 'specs']),
          images: getColIndex(['images (comma-separated urls)', 'images', 'image urls', 'image']),
          featured: getColIndex(['featured (true/false)', 'featured']),
          prepaid_discount_pct: getColIndex(['prepaid discount %', 'prepaid discount', 'prepaid_discount_pct']),
          variants: getColIndex(['variants (ram/storage:price, ...)', 'variants'])
        };

        const parsed = [];
        dataRows.forEach((row) => {
          if (row.length === 0 || row.every(val => val === null || val === '')) return;

          const getValue = (colIndex, defaultValue = '') => {
            if (colIndex === -1 || colIndex >= row.length) return defaultValue;
            const val = row[colIndex];
            return val !== undefined && val !== null ? String(val).trim() : defaultValue;
          };

          const id = getValue(colIndices.id);
          const slug = getValue(colIndices.slug);
          const name = getValue(colIndices.name);
          const category = getValue(colIndices.category, 'smartphones');
          const our_price = Number(getValue(colIndices.our_price)) || 0;
          const online_price = Number(getValue(colIndices.online_price)) || 0;
          const amazon_price = Number(getValue(colIndices.amazon_price)) || 0;
          const flipkart_price = Number(getValue(colIndices.flipkart_price)) || 0;
          const amazon_url = getValue(colIndices.amazon_url);
          const flipkart_url = getValue(colIndices.flipkart_url);
          const description = getValue(colIndices.description);
          const images = getValue(colIndices.images);
          const featuredVal = getValue(colIndices.featured);
          const featured = featuredVal.toLowerCase() === 'true' || featuredVal === '1';
          const prepaid_discount_pct = Number(getValue(colIndices.prepaid_discount_pct)) || 3;
          const variants = getValue(colIndices.variants);

          const validationErrors = [];
          if (!name) validationErrors.push('Missing name');
          if (!our_price || our_price <= 0) validationErrors.push('Invalid price');
          if (!category) validationErrors.push('Missing category');

          parsed.push({
            id,
            slug,
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
            variants,
            errors: validationErrors
          });
        });

        setBulkPreviewData(parsed);
      } catch (err) {
        alert('Failed to parse Excel file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkImportSubmit = async () => {
    if (bulkPreviewData.length === 0) return;
    
    const hasErrors = bulkPreviewData.some(p => p.errors.length > 0);
    if (hasErrors) {
      if (!confirm('Some products have validation errors (marked in red). Do you want to proceed anyway?')) {
        return;
      }
    }

    setBulkImporting(true);
    setBulkImportMsg('⏳ Importing products to database... please wait.');
    
    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ products: bulkPreviewData })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Import failed');
      
      let msg = `✅ Import Complete! Successfully inserted: ${data.successCount} products.`;
      if (data.failedCount > 0) {
        msg += ` Failed: ${data.failedCount}. Check browser console for errors.`;
        console.error('Bulk import errors:', data.errors);
      }
      setBulkImportMsg(msg);
      await fetchProducts();
      
      if (data.failedCount === 0) {
        setTimeout(() => {
          setBulkPreviewData([]);
          setShowBulkModal(false);
          setBulkImportMsg('');
        }, 4000);
      }
    } catch (err) {
      setBulkImportMsg(`❌ Import Error: ${err.message}`);
    } finally {
      setBulkImporting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('og_admin');
    sessionStorage.removeItem('og_admin_token');
    router.replace('/admin/login');
  };

  // Product Modal
  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setSaveError('');
    setShowModal(true);
  };

  const openEdit = async (p) => {
    setEditProduct(p);
    // Start with empty grid, then overlay existing saved variants
    const grid = buildEmptyVariants();
    try {
      const res = await fetch(`/api/products/${p.id}/variants?all=true`);
      const saved = await res.json();
      if (Array.isArray(saved)) {
        saved.forEach(sv => {
          const idx = grid.findIndex(g => g.ram === sv.ram && g.storage === sv.storage);
          if (idx !== -1) {
            grid[idx] = { ram: sv.ram, storage: sv.storage, price: sv.price, enabled: sv.enabled };
          }
        });
      }
    } catch { /* ignore, keep empty grid */ }

    setForm({
      name: p.name || '',
      images: p.images?.length ? p.images : [''],
      online_price: p.online_price || '',
      amazon_price: p.amazon_price || '',
      flipkart_price: p.flipkart_price || '',
      amazon_url: p.amazon_url || '',
      flipkart_url: p.flipkart_url || '',
      our_price: p.our_price || '',
      description: p.description || '',
      category: p.category || 'smartphones',
      featured: p.featured || false,
      prepaid_discount_pct: p.prepaid_discount_pct || 3,
      variants: grid,
    });
    setSaveError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditProduct(null); setSaveError(''); };

  const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageChange = (idx, value) => {
    const imgs = [...form.images];
    imgs[idx] = value;
    setForm(prev => ({ ...prev, images: imgs }));
  };

  const handleFileUpload = async (idx, file) => {
    if (!file) return;
    setUploadingImage(true);
    setSaveError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      handleImageChange(idx, data.url);
    } catch (err) {
      setSaveError('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };
  const addImageField = () => setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  const removeImageField = (idx) => {
    if (form.images.length <= 1) return;
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setSaveError('Product name is required'); return; }
    if (!form.our_price || isNaN(form.our_price)) { setSaveError('Our price is required'); return; }

    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        ...form,
        images: form.images.filter(Boolean),
        online_price: Number(form.online_price) || 0,
        amazon_price: Number(form.amazon_price) || 0,
        flipkart_price: Number(form.flipkart_price) || 0,
        amazon_url: form.amazon_url || '',
        flipkart_url: form.flipkart_url || '',
        our_price: Number(form.our_price),
        stock: Number(form.stock) || 0,
        prepaid_discount_pct: Number(form.prepaid_discount_pct) || 3,
      };
      // Don't send variants in the product payload
      delete payload.variants;

      const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products';
      const method = editProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      // Save variants
      const productId = data.id || editProduct?.id;
      if (productId && form.variants?.length) {
        const varRes = await fetch(`/api/products/${productId}/variants`, {
          method: 'POST',
          headers: getAdminHeaders(),
          body: JSON.stringify({ variants: form.variants }),
        });
        const varData = await varRes.json().catch(() => ({}));
        if (!varRes.ok) {
          throw new Error(varData.error || 'Failed to save variants');
        }
      }

      await fetchProducts();
      closeModal();
    } catch (err) {
      setSaveError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: getAdminHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete product from database.');
      }
      await fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleImport = async () => {
    const isAmazon = importUrl.includes('amazon');
    const isFlipkart = importUrl.includes('flipkart');

    if (!importUrl.trim() || (!isAmazon && !isFlipkart)) {
      setImportMsg('⚠ Please enter a valid Amazon or Flipkart product URL');
      return;
    }
    setImporting(true);
    setImportMsg(`⏳ Extracting product data from ${isFlipkart ? 'Flipkart' : 'Amazon'}...`);
    
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl.trim() })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Import failed');
      
      setImportMsg(`✅ Successfully imported: ${data.product.name.slice(0, 30)}...`);
      setImportUrl('');
      await fetchProducts();
      
      setTimeout(() => setImportMsg(''), 4000);
    } catch (err) {
      setImportMsg(`❌ Import Error: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchOrders();
    } catch {
      alert('Failed to update order status');
      await fetchOrders(); // Revert on failure
    }
  };

  const toggleManageRoute = (o) => {
    if (expandedRouteOrderId === o.id) {
      setExpandedRouteOrderId(null);
    } else {
      setExpandedRouteOrderId(o.id);
      setRouteEditForm({
        step1: o.step1 || '',
        step2: o.step2 || '',
        step3: o.step3 || '',
        step4: o.step4 || '',
        step5: o.step5 || '',
        step6: o.step6 || '',
        step7: o.step7 || '',
        step8: o.step8 || '',
        estimated_delivery_date: o.estimated_delivery_date || '',
        current_step: o.current_step || 1
      });
    }
  };

  const handleSaveRoute = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          step1: routeEditForm.step1,
          step2: routeEditForm.step2,
          step3: routeEditForm.step3,
          step4: routeEditForm.step4,
          step5: routeEditForm.step5,
          step6: routeEditForm.step6,
          step7: routeEditForm.step7,
          step8: routeEditForm.step8,
          estimated_delivery_date: routeEditForm.estimated_delivery_date,
          current_step: routeEditForm.current_step,
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed');
      }
      alert('Shipment route updated successfully!');
      setExpandedRouteOrderId(null);
      await fetchOrders();
    } catch (err) {
      alert('Failed to update shipment route: ' + err.message);
    }
  };

  // Manual Order Handlers
  const openAddOrder = () => {
    console.log('Opening Add Order modal...');
    setOrderForm({
      fullName: '', phone: '', address: '', pincode: '',
      productName: '', productSlug: 'offline',
      paymentOption: 'half_cod',
      finalPrice: '', advanceAmount: ''
    });
    setOrderError('');
    setShowOrderModal(true);
  };

  const handleOrderFormChange = (field, value) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBulkHide = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Hide ${selectedProducts.length} products (set stock to 0)?`)) return;
    try {
      const res = await fetch('/api/products/bulk-action', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ action: 'hide', ids: selectedProducts })
      });
      if (!res.ok) throw new Error('Failed to hide products');
      setSelectedProducts([]);
      await fetchProducts();
    } catch (err) { alert(err.message); }
  };

  const handleBulkUnhide = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Unhide ${selectedProducts.length} products (set stock to 100)?`)) return;
    try {
      const res = await fetch('/api/products/bulk-action', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ action: 'unhide', ids: selectedProducts })
      });
      if (!res.ok) throw new Error('Failed to unhide products');
      setSelectedProducts([]);
      await fetchProducts();
    } catch (err) { alert(err.message); }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Permanently delete ${selectedProducts.length} products?`)) return;
    try {
      const res = await fetch('/api/products/bulk-action', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ action: 'delete', ids: selectedProducts })
      });
      if (!res.ok) throw new Error('Failed to delete products');
      setSelectedProducts([]);
      await fetchProducts();
    } catch (err) { alert(err.message); }
  };

  const exportToExcel = () => {
    if (products.length === 0) return;
    const headers = [
      "ID", "Slug", "Name", "Category", "Our Price (INR)", "Online Price (INR)", 
      "Amazon Price (INR)", "Flipkart Price (INR)", "Amazon URL", "Flipkart URL", 
      "Description", "Images (Comma-separated URLs)", "Featured (TRUE/FALSE)", 
      "Prepaid Discount %"
    ];
    
    const rows = products.map(p => [
      p.id, p.slug, p.name, p.category, p.our_price, p.online_price,
      p.amazon_price, p.flipkart_price, p.amazon_url, p.flipkart_url,
      p.description, (p.images || []).join(', '), p.featured ? 'TRUE' : 'FALSE',
      p.prepaid_discount_pct || 3
    ]);

    const worksheetData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "all_products_export.xlsx");
  };

  const handleOrderSave = async () => {
    const { fullName, phone, address, pincode, productName, finalPrice } = orderForm;
    if (!productName?.trim()) {
      setOrderError('Product Name / Phone Model is required');
      return;
    }
    if (!fullName?.trim()) {
      setOrderError('Customer Name is required');
      return;
    }
    if (!phone || phone.length < 10) {
      setOrderError('Valid 10-digit Phone Number is required');
      return;
    }
    if (!address?.trim()) {
      setOrderError('Delivery Address is required');
      return;
    }
    const cleanPincode = (pincode || '').trim() || '600001';
    if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
      setOrderError('Pincode must be 6 digits (e.g. 600001)');
      return;
    }
    const priceNum = Number(finalPrice);
    if (!finalPrice || isNaN(priceNum) || priceNum <= 0) {
      setOrderError('Please enter a valid price');
      return;
    }

    setOrderSaving(true);
    setOrderError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          pincode: cleanPincode,
          product_id: null,
          product_name: productName.trim(),
          product_slug: orderForm.productSlug || 'offline',
          payment_option: orderForm.paymentOption || 'half_cod',
          base_price: priceNum,
          discount_amount: 0,
          final_price: priceNum,
          advance_amount: Number(orderForm.advanceAmount) || 0,
          status: 'confirmed', // Offline orders usually confirmed
          current_step: 1
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      alert(`Order created successfully! ID: #${data.id.slice(0, 8).toUpperCase()}`);
      await fetchOrders();
      setShowOrderModal(false);
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setOrderSaving(false);
    }
  };

  const handleDeleteOrder = async (id, shortId) => {
    console.log('Attempting to delete order:', id, shortId);
    if (!confirm(`Permanently delete order #${shortId}?`)) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE', headers: getAdminHeaders() });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete from API');
      }
      console.log('Order deleted successfully');
      await fetchOrders();
    } catch (err) {
      console.error('Delete order error:', err);
      alert(`Failed to delete order: ${err.message}`);
    }
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.final_price || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (!isAuthenticated) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div className={styles.adminPage}>
      {/* Modals at Top to prevent stacking issues */}
      {showModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 9999 }}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {editProduct ? <><Edit2 size={18} /> Edit Product</> : <><Plus size={18} /> Add Product</>}
            </h2>

            <div className={styles.modalForm}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input type="text" className="form-input" placeholder="e.g. Samsung Galaxy A55 5G"
                  value={form.name} onChange={e => handleFormChange('name', e.target.value)} />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={e => handleFormChange('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Prices */}
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Our Price (₹) *</label>
                  <input type="number" className="form-input" placeholder="e.g. 21999"
                    value={form.our_price} onChange={e => handleFormChange('our_price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Online Price (General)</label>
                  <input type="number" className="form-input" placeholder="e.g. 26999"
                    value={form.online_price} onChange={e => handleFormChange('online_price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Amazon Price (Fallback)</label>
                  <input type="number" className="form-input" placeholder="e.g. 25999"
                    value={form.amazon_price} onChange={e => handleFormChange('amazon_price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Flipkart Price (Fallback)</label>
                  <input type="number" className="form-input" placeholder="e.g. 24999"
                    value={form.flipkart_price} onChange={e => handleFormChange('flipkart_price', e.target.value)} />
                </div>
              </div>

              {/* Scraper URLs */}
              <div className={styles.formGrid}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Amazon URL (For live scraping)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="url" className="form-input" placeholder="https://amazon.in/dp/..."
                      value={form.amazon_url} onChange={e => handleFormChange('amazon_url', e.target.value)} />
                    <button type="button" className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: 12 }} 
                      onClick={async () => {
                        if (!form.amazon_url) return alert('Enter URL first');
                        setImporting(true);
                        try {
                          const res = await fetch('/api/import', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: form.amazon_url, category: form.category })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error);
                          // Update form with fetched data
                          setForm(prev => ({
                            ...prev,
                            name: data.product.name,
                            amazon_price: data.product.amazon_price,
                            online_price: data.product.amazon_price,
                            our_price: data.product.our_price,
                            description: data.product.description,
                            images: data.product.images?.length ? data.product.images : prev.images,
                            stock: data.product.stock
                          }));
                          alert('Data fetched successfully!');
                        } catch (err) { alert('Fetch failed: ' + err.message); }
                        finally { setImporting(false); }
                      }}
                      disabled={importing}
                    >
                      {importing ? '...' : 'Fetch'}
                    </button>
                  </div>
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Flipkart URL (For live scraping)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="url" className="form-input" placeholder="https://flipkart.com/..."
                      value={form.flipkart_url} onChange={e => handleFormChange('flipkart_url', e.target.value)} />
                    <button type="button" className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: 12 }} 
                      onClick={async () => {
                        if (!form.flipkart_url) return alert('Enter URL first');
                        setImporting(true);
                        try {
                          const res = await fetch('/api/import', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: form.flipkart_url, category: form.category })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error);
                          // Update form with fetched data
                          setForm(prev => ({
                            ...prev,
                            name: data.product.name,
                            flipkart_price: data.product.flipkart_price || prev.flipkart_price,
                            online_price: data.product.flipkart_price || prev.online_price,
                            our_price: data.product.our_price || prev.our_price,
                            description: data.product.description,
                            images: data.product.images?.length ? data.product.images : prev.images,
                            stock: data.product.stock
                          }));
                          alert('Data fetched successfully!');
                        } catch (err) { alert('Fetch failed: ' + err.message); }
                        finally { setImporting(false); }
                      }}
                      disabled={importing}
                    >
                      {importing ? '...' : 'Fetch'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={4} placeholder="Product description..."
                  value={form.description} onChange={e => handleFormChange('description', e.target.value)} />
              </div>

              {/* Prepaid Discount */}
              <div className="form-group">
                <label className="form-label">Prepaid Discount %</label>
                <input type="number" className="form-input" min="0" max="20" placeholder="3"
                  value={form.prepaid_discount_pct} onChange={e => handleFormChange('prepaid_discount_pct', e.target.value)} />
              </div>

              {/* Images */}
              <div className="form-group">
                <label className="form-label">Product Images</label>
                <div className={styles.imageUrlList}>
                  {form.images.map((img, idx) => (
                    <div key={idx} className={styles.imageUrlRow} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {img ? (
                        <div style={{ position: 'relative', width: 60, height: 60, borderRadius: 8, overflow: 'hidden', border: '1px solid #ddd' }}>
                          <img src={img} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: 60, height: 60, borderRadius: 8, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 10, color: '#999' }}>No Img</span>
                        </div>
                      )}
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <input type="file" accept="image/*" disabled={uploadingImage}
                          onChange={e => handleFileUpload(idx, e.target.files[0])}
                          style={{ fontSize: 13 }} />
                        <input 
                          type="text" 
                          className="form-input" 
                          style={{ padding: '4px 8px', fontSize: 12 }} 
                          placeholder="Or paste image URL..."
                          value={img} 
                          onChange={e => handleImageChange(idx, e.target.value)} 
                        />
                      </div>

                      <button type="button" className={styles.removeImgBtn} disabled={uploadingImage}
                        onClick={() => removeImageField(idx)} aria-label="Remove image">×</button>
                    </div>
                  ))}
                  <button type="button" className={styles.addImgBtn} onClick={addImageField} disabled={uploadingImage}>
                    {uploadingImage ? 'Uploading...' : '+ Add Another Image'}
                  </button>
                </div>
              </div>

              {/* Stock and Featured */}
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Stock Status</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className={`${styles.stockToggle} ${form.stock > 0 ? styles.stockToggleActive : ''}`}
                      onClick={() => handleFormChange('stock', 100)}>In Stock</button>
                    <button type="button" className={`${styles.stockToggle} ${form.stock === 0 ? styles.stockToggleInactive : ''}`}
                      onClick={() => handleFormChange('stock', 0)}>Out of Stock</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Featured Product</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '8px' }}>
                    <input type="checkbox" checked={form.featured} onChange={e => handleFormChange('featured', e.target.checked)} />
                    Show in home page
                  </label>
                </div>
              </div>

              {/* Variants Section */}
              <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--brand-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  📦 RAM &amp; Storage Variants
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>
                  Set a price for each combination. Toggle the eye icon to show/hide that combo from customers. Leave price empty to skip.
                </p>

                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 44px', gap: 6, marginBottom: 6, padding: '0 4px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>RAM</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Storage</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price (₹)</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Show</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
                  {(form.variants || buildEmptyVariants()).map((v, idx) => (
                    <div
                      key={`${v.ram}-${v.storage}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 110px 44px',
                        gap: 6,
                        alignItems: 'center',
                        padding: '6px 8px',
                        borderRadius: 8,
                        background: v.enabled ? 'rgba(244,167,36,0.06)' : '#fff',
                        border: v.enabled ? '1px solid rgba(244,167,36,0.25)' : '1px solid var(--border)',
                        opacity: v.price ? 1 : 0.65,
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{v.ram} GB</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{v.storage} GB</span>
                      <input
                        type="number"
                        className="form-input"
                        style={{ padding: '5px 8px', fontSize: 13, height: 34 }}
                        placeholder="e.g. 21999"
                        value={v.price}
                        onChange={e => {
                          const updated = [...(form.variants || buildEmptyVariants())];
                          updated[idx] = { ...updated[idx], price: e.target.value };
                          handleFormChange('variants', updated);
                        }}
                      />
                      <button
                        type="button"
                        title={v.enabled ? 'Visible to customers — click to hide' : 'Hidden from customers — click to show'}
                        onClick={() => {
                          const updated = [...(form.variants || buildEmptyVariants())];
                          updated[idx] = { ...updated[idx], enabled: !v.enabled };
                          handleFormChange('variants', updated);
                        }}
                        style={{
                          background: v.enabled ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: v.enabled ? '#fff' : 'var(--text-muted)',
                          border: 'none',
                          borderRadius: 6,
                          height: 34,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {v.enabled ? '👁' : '🚫'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {saveError && <div className="notice notice-error">⚠ {saveError}</div>}

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={closeModal}>Cancel</button>
                <button type="button" className={styles.modalSaveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : editProduct ? '✓ Save Changes' : '+ Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 9999 }}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              <ShoppingBag size={18} /> Add Manual Order
            </h2>

            <div className={styles.modalForm}>
              {/* Product Name / Model */}
              <div className="form-group">
                <label className="form-label">Product Name / Model *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Type product name or phone model manually"
                  value={orderForm.productName}
                  onChange={(e) => handleOrderFormChange('productName', e.target.value)}
                />
              </div>

              {/* Customer Name & Phone */}
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Customer Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Type customer name"
                    value={orderForm.fullName}
                    onChange={(e) => handleOrderFormChange('fullName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    maxLength={10}
                    placeholder="Type 10-digit mobile number"
                    value={orderForm.phone}
                    onChange={(e) => handleOrderFormChange('phone', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea 
                  className={styles.formTextarea} 
                  rows={2}
                  placeholder="Type complete delivery address"
                  value={orderForm.address}
                  onChange={(e) => handleOrderFormChange('address', e.target.value)}
                />
              </div>

              {/* Product Price & Advance */}
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Type product price manually"
                    value={orderForm.finalPrice}
                    onChange={(e) => handleOrderFormChange('finalPrice', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    maxLength={6}
                    placeholder="Pincode (default 600001)"
                    value={orderForm.pincode}
                    onChange={(e) => handleOrderFormChange('pincode', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              {orderError && <div className="notice notice-error">⚠ {orderError}</div>}

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={() => setShowOrderModal(false)}>Cancel</button>
                <button type="button" className={styles.modalSaveBtn} onClick={handleOrderSave} disabled={orderSaving}>
                  {orderSaving ? 'Creating Order...' : '✓ Create Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderTitle}>
          <Smartphone size={20} color="#f4a724" />
          Only <span>Gadjets</span> Admin
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={14} style={{ display:'inline', marginRight:5, verticalAlign:'middle' }} />
          Logout
        </button>
      </div>

      <div className={styles.adminBody}>
        {/* Stats Bar Removed */}

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={15} /> Products
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={15} /> Orders ({orders.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab('reviews'); fetchReviewsAdmin(); }}
          >
            <MessageSquare size={15} /> Reviews {allReviews.filter(r => r.status === 'pending').length > 0 && <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 99, marginLeft: 4 }}>{allReviews.filter(r => r.status === 'pending').length}</span>}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'videos' ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab('videos'); fetchVideosAdmin(); }}
          >
            🎬 Video Reviews
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Products</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => {
                    setBulkPreviewData([]);
                    setBulkImportMsg('');
                    setShowBulkModal(true);
                  }} 
                  className="btn btn-outline" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  📥 Bulk Import (Excel)
                </button>
                <button 
                  onClick={exportToExcel}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  📤 Export to Excel
                </button>
                <button onClick={openAdd} className={styles.addBtn} id="add-product-btn">
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>
                  {selectedProducts.length} product(s) selected
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleBulkUnhide} className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '13px' }}>
                    Unhide Selected
                  </button>
                  <button onClick={handleBulkHide} className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '13px' }}>
                    Hide Selected
                  </button>
                  <button onClick={handleBulkDelete} className={styles.deleteBtn} style={{ padding: '8px 12px', fontSize: '13px' }}>
                    Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* Amazon Quick Importer */}
            <div style={{ background: 'var(--bg-highlight)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-focus)' }}>
              <div style={{ fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '12px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={18} className={importing ? 'spin' : ''} />
                One-Click Auto-Upload from Amazon/Flipkart
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Paste any Amazon India or Flipkart product URL. We will automatically fetch the <b>Title, High-Res Images, Live Price, and Specs</b>, apply your 10% discount, and add it to your store.
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="url" 
                  className="form-input" 
                  style={{ flex: 1, minWidth: '200px' }} 
                  placeholder="Paste Amazon or Flipkart product URL here..."
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                />
                <button 
                  onClick={handleImport} 
                  disabled={importing}
                  className="btn btn-primary" 
                  style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}
                >
                  {importing ? 'Importing...' : 'Fetch & Add'}
                </button>
              </div>
              {importMsg && (
                <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 600, color: importMsg.includes('❌') || importMsg.includes('⚠') ? 'var(--error)' : 'var(--success)' }}>
                  {importMsg}
                </div>
              )}
            </div>

            {/* Bulk Refresh Button */}
            <button 
              className="btn btn-outline"
              style={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', border: '1px solid var(--border)' }}
              onClick={async () => {
                if (!confirm('This will refresh prices for all products in our master list. This may take several minutes. Proceed?')) return;
                setImporting(true);
                setImportMsg('⏳ Refreshing all products... please wait.');
                try {
                  const res = await fetch('/api/refresh-prices');
                  const data = await res.json();
                  setImportMsg(`✅ Refresh Complete! Updated: ${data.updated}, New: ${data.inserted}, Skipped: ${data.skipped}`);
                  fetchProducts();
                } catch (err) {
                  setImportMsg('❌ Refresh failed: ' + err.message);
                } finally {
                  setImporting(false);
                }
              }}
              disabled={importing}
            >
              <RefreshCw size={18} className={importing ? 'spin' : ''} />
              {importing ? 'Syncing Catalog...' : 'Manual Bulk Refresh (10-Day Sync)'}
            </button>

            {/* Product Search Bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '38px', width: '100%' }} 
                  placeholder="Search products by name or category..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    if (e.target.value === '') {
                      setProductSearchQuery('');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setProductSearchQuery(productSearch);
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Visibility:</span>
                <select 
                  className="form-input" 
                  style={{ padding: '10px 16px', width: 'auto' }}
                  value={visibilityFilter}
                  onChange={(e) => setVisibilityFilter(e.target.value)}
                >
                  <option value="all">All Products</option>
                  <option value="visible">Visible Only</option>
                  <option value="hidden">Hidden Only</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Sort by:</span>
                <select 
                  className="form-input" 
                  style={{ padding: '10px 16px', width: 'auto' }}
                  value={productSortBy}
                  onChange={(e) => setProductSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
              <button 
                onClick={() => setProductSearchQuery(productSearch)}
                className="btn btn-primary"
                style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Search size={16} /> Search
              </button>
              {productSearchQuery && (
                <button 
                  onClick={() => {
                    setProductSearch('');
                    setProductSearchQuery('');
                  }}
                  className="btn btn-outline"
                  style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}
                >
                  Clear
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>Loading…</div>
            ) : products.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize:40, marginBottom:12 }}>📱</div>
                <p>No products yet. Click &quot;Add Product&quot; to get started.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                <p>No products found matching &quot;{productSearchQuery}&quot;.</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input 
                          type="checkbox" 
                          checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(filteredProducts.map(p => p.id));
                            } else {
                              setSelectedProducts([]);
                            }
                          }}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
                        />
                      </th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Market Price</th>
                      <th>Our Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td data-label="Select">
                          <input 
                            type="checkbox"
                            checked={selectedProducts.includes(p.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts(prev => [...prev, p.id]);
                              } else {
                                setSelectedProducts(prev => prev.filter(id => id !== p.id));
                              }
                            }}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
                          />
                        </td>
                        <td data-label="Image">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className={styles.productThumb} />
                          ) : (
                            <div className={styles.productThumbPlaceholder}>
                              <Smartphone size={18} color="#9aa3b2" />
                            </div>
                          )}
                        </td>
                        <td data-label="Name" style={{ fontWeight:600, maxWidth:180 }}>
                          <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                          {p.featured && <span style={{ fontSize:10, background:'#fef3d0', color:'#d4890a', padding:'1px 6px', borderRadius:99, fontWeight:700, marginRight: 4 }}>Featured</span>}
                          {p.stock <= 0 && <span style={{ fontSize:10, background:'#fee2e2', color:'#ef4444', padding:'1px 6px', borderRadius:99, fontWeight:700 }}>Hidden</span>}
                        </td>
                        <td data-label="Category" style={{ fontSize:13, color:'var(--text-secondary)' }}>{p.category || '—'}</td>
                        <td data-label="Market Price" style={{ fontSize:13, color:'#9aa3b2', textDecoration:'line-through' }}>
                          {Math.max(p.amazon_price || 0, p.flipkart_price || 0, p.online_price || 0) > 0 
                            ? formatINR(Math.max(p.amazon_price || 0, p.flipkart_price || 0, p.online_price || 0)) 
                            : '—'}
                        </td>
                        <td data-label="Our Price" style={{ fontWeight:700 }}>{formatINR(p.our_price)}</td>
                        <td data-label="Actions">
                          <div className={styles.actionBtns}>
                            <button onClick={() => openEdit(p)} className={styles.editBtn}>
                              <Edit2 size={12} style={{ display:'inline', marginRight:3 }} /> Edit
                            </button>
                            <button onClick={() => handleDelete(p.id, p.name)} className={styles.deleteBtn}>
                              <Trash2 size={12} style={{ display:'inline', marginRight:3 }} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>All Orders</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={() => fetchOrders()} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:600 }}>
                  <RefreshCw size={14} /> Refresh
                </button>
                <button 
                  onClick={() => openAddOrder()} 
                  className={styles.addBtn} 
                  style={{ padding: '8px 16px', fontSize: '13px', position: 'relative', zIndex: 100 }}
                  id="add-manual-order-btn"
                >
                  <Plus size={16} /> Add Manual Order
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>Loading…</div>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Payment</th>
                      <th>Amount</th>
                      <th>Active Destination</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <Fragment key={o.id}>
                        <tr style={{ background: expandedRouteOrderId === o.id ? 'rgba(244, 167, 36, 0.03)' : 'transparent' }}>
                          <td data-label="Order ID" style={{ fontFamily:'monospace', fontSize:12, color:'var(--text-muted)' }}>
                            #{o.id?.slice(0,8)?.toUpperCase()}
                          </td>
                          <td data-label="Customer">
                            <div style={{ fontWeight:600, fontSize:14 }}>{o.full_name}</div>
                            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{o.phone}</div>
                          </td>
                          <td data-label="Product" style={{ fontSize:13, maxWidth:150 }}>
                            <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.product_name}</div>
                          </td>
                          <td data-label="Payment">
                            <span style={{
                              fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:99,
                              background: o.payment_option === 'full_prepaid' ? 'var(--success-bg)' : 'var(--info-bg)',
                              color: o.payment_option === 'full_prepaid' ? 'var(--success)' : 'var(--info)',
                            }}>
                              {o.payment_option === 'full_prepaid' ? '✅ Prepaid' : '🚚 Half COD'}
                            </span>
                          </td>
                          <td data-label="Amount" style={{ fontWeight:700 }}>{formatINR(o.final_price)}</td>
                          <td data-label="Active Destination">
                            <div style={{ fontWeight: 700, color: 'var(--brand-accent-dark)', fontSize: 13 }}>
                              {o[`step${o.current_step || 1}`] || 'Order Placed'}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              Step {o.current_step || 1} of 6
                            </div>
                          </td>
                          <td data-label="Date" style={{ fontSize:12, color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                            {new Date(o.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' })}
                          </td>
                          <td data-label="Actions">
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleManageRoute(o);
                                }}
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, borderRadius: 8, height: 'auto' }}
                              >
                                {expandedRouteOrderId === o.id ? 'Close Route' : 'Manage Route'}
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrder(o.id, o.id ? o.id.slice(0,8).toUpperCase() : '???');
                                }} 
                                className={styles.deleteBtn}
                                style={{ padding: '6px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 100 }}
                                title="Delete Order"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* Reviews Moderation Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Review Moderation</h2>
              <button onClick={fetchReviewsAdmin} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:600 }}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {reviewsLoading ? (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>Loading…</div>
            ) : allReviews.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
                <p>No reviews found.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {allReviews.map(review => (
                  <div key={review.id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                          <div style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>{review.user_name}</div>
                          <span style={{ 
                            fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                            background: review.status === 'approved' ? '#dcfce7' : review.status === 'pending' ? '#fef3c7' : '#fee2e2',
                            color: review.status === 'approved' ? '#166534' : review.status === 'pending' ? '#92400e' : '#991b1b',
                            textTransform: 'uppercase'
                          }}>
                            {review.status}
                          </span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={14} fill={s <= review.rating ? '#facc15' : '#e5e7eb'} color={s <= review.rating ? '#facc15' : '#e5e7eb'} />
                          ))}
                          <span style={{ fontSize:12, color:'var(--text-muted)', marginLeft:6 }}>
                            {new Date(review.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {review.status !== 'approved' && (
                          <button
                            onClick={async () => {
                              await fetch('/api/reviews', {
                                method: 'PUT',
                                headers: getAdminHeaders(),
                                body: JSON.stringify({ id: review.id, status: 'approved' })
                              });
                              fetchReviewsAdmin();
                            }}
                            style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 14px', background:'#16a34a', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' }}
                          >
                            <Check size={14} /> Approve
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button
                            onClick={async () => {
                              await fetch('/api/reviews', {
                                method: 'PUT',
                                headers: getAdminHeaders(),
                                body: JSON.stringify({ id: review.id, status: 'rejected' })
                              });
                              fetchReviewsAdmin();
                            }}
                            style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 14px', background:'#ef4444', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' }}
                          >
                            <X size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </div>
                    {review.comment && (
                      <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5, background:'#f8fafc', padding:'10px 12px', borderRadius:8, border:'1px solid #f1f5f9' }}>
                        &quot;{review.comment}&quot;
                      </div>
                    )}
                    {review.product_id ? (
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:8 }}>
                        Bought: <span style={{ fontWeight: 600 }}>{review.products?.name || review.product_id.slice(0,8)}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:8, fontWeight: 600 }}>
                        Store Review (Homepage)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Video Reviews</h2>
              <button onClick={fetchVideosAdmin} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
                <RefreshCw size={14} style={{ display:'inline', marginRight: 5 }} /> Refresh
              </button>
            </div>
            
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Toggle the visibility of your hardcoded video reviews, and update customer names.
              The video files themselves are served from the Vercel CDN via the repository.
            </p>

            {videosLoading ? (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>Loading videos...</div>
            ) : videos.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize:40, marginBottom:12 }}>🎥</div>
                <p>No videos found. Did you run the SQL script?</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Video File</th>
                      <th>Customer Name</th>
                      <th>Visible</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map(v => (
                      <tr key={v.id}>
                        <td data-label="Video File" style={{ fontFamily:'monospace', fontSize:12, color:'var(--brand-secondary)' }}>
                          {v.url}
                        </td>
                        <td data-label="Customer Name">
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ padding: '6px 12px', fontSize: 13 }}
                            defaultValue={v.customer_name}
                            id={`customer_name_${v.id}`}
                          />
                        </td>
                        <td data-label="Visible">
                          <input 
                            type="checkbox" 
                            defaultChecked={v.active} 
                            id={`active_${v.id}`}
                            style={{ width: 18, height: 18, accentColor: 'var(--brand-accent)' }}
                          />
                        </td>
                        <td data-label="Actions">
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '6px 12px', fontSize: 12 }}
                            onClick={async (e) => {
                              const btn = e.target;
                              btn.textContent = 'Saving...';
                              const name = document.getElementById(`customer_name_${v.id}`).value;
                              const active = document.getElementById(`active_${v.id}`).checked;
                              try {
                                const res = await fetch(`/api/videos/${v.id}`, {
                                  method: 'PUT',
                                  headers: getAdminHeaders(),
                                  body: JSON.stringify({ customer_name: name, active })
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error);
                                btn.textContent = '✓ Saved';
                                setTimeout(() => btn.textContent = 'Save', 2000);
                              } catch(err) {
                                alert(err.message);
                                btn.textContent = 'Save';
                              }
                            }}
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>


      {/* Manual Order Modal */}
      {showOrderModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              <ShoppingBag size={18} /> Add Manual Order
            </h2>

            <div className={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Select Product *</label>
                <select 
                  className="form-input" 
                  value={orderForm.productId}
                  onChange={(e) => handleOrderFormChange('productId', e.target.value)}
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {formatINR(p.our_price)}</option>
                  ))}
                  <option value="custom">-- Custom Item --</option>
                </select>
              </div>

              {orderForm.productId === 'custom' && (
                <div className="form-group">
                  <label className="form-label">Item Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter custom item name"
                    value={orderForm.productName}
                    onChange={(e) => handleOrderFormChange('productName', e.target.value)}
                  />
                </div>
              )}

              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Customer Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={orderForm.fullName}
                    onChange={(e) => handleOrderFormChange('fullName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    maxLength={10}
                    value={orderForm.phone}
                    onChange={(e) => handleOrderFormChange('phone', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea 
                  className={styles.formTextarea} 
                  rows={2}
                  value={orderForm.address}
                  onChange={(e) => handleOrderFormChange('address', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  maxLength={6}
                  value={orderForm.pincode}
                  onChange={(e) => handleOrderFormChange('pincode', e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method *</label>
                <select 
                  className="form-input"
                  value={orderForm.paymentOption}
                  onChange={(e) => handleOrderFormChange('paymentOption', e.target.value)}
                >
                  <option value="half_cod">Half COD (50% Advance)</option>
                  <option value="full_prepaid">Full Prepaid</option>
                  <option value="token_advance">Token Advance (30%)</option>
                </select>
              </div>

              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Final Price (₹) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={orderForm.finalPrice}
                    onChange={(e) => handleOrderFormChange('finalPrice', Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Advance (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={orderForm.advanceAmount}
                    onChange={(e) => handleOrderFormChange('advanceAmount', Number(e.target.value))}
                  />
                </div>
              </div>

              {orderError && <div className="notice notice-error">⚠ {orderError}</div>}

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={() => setShowOrderModal(false)}>Cancel</button>
                <button type="button" className={styles.modalSaveBtn} onClick={handleOrderSave} disabled={orderSaving}>
                  {orderSaving ? 'Creating...' : '✓ Create Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Manage Route Modal */}
      {expandedRouteOrderId && (
        <div className={styles.modalOverlay} style={{ zIndex: 9999 }}>
          <div className={styles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-primary)', margin: 0 }}>
                🗺️ Manage Shipment Route
              </h3>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-accent-dark)', background: 'var(--brand-accent-light)', padding: '4px 10px', borderRadius: '12px' }}>
                Order #{expandedRouteOrderId.slice(0,8).toUpperCase()}
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Customize the destination name for each milestone of this shipment. Choose which step is the current package location.
            </p>

            <div className="admin-route-grid">
              <div style={{ gridColumn: '1 / -1', marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Estimated Delivery Date (Optional)</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: 13, height: '36px' }}
                  value={routeEditForm.estimated_delivery_date || ''}
                  onChange={(e) => setRouteEditForm(prev => ({ ...prev, estimated_delivery_date: e.target.value }))}
                />
              </div>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div key={num} className={`admin-route-step-card ${routeEditForm.current_step === num ? 'active' : ''}`}>
                  <div className="admin-route-radio-wrapper">
                    <input
                      type="radio"
                      name={`active-step-${expandedRouteOrderId}`}
                      className="admin-route-radio"
                      checked={routeEditForm.current_step === num}
                      onChange={() => setRouteEditForm(prev => ({ ...prev, current_step: num }))}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                        Step {num}
                      </label>
                      {routeEditForm.current_step === num && (
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-accent-dark)' }}>
                          📍 Currently Here
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: 13, height: '36px' }}
                      placeholder={
                        num === 1 ? "Payment received" : 
                        num === 2 ? "Order scanned at howrah" :
                        num === 3 ? "Scanned at delhi" :
                        num === 4 ? "Shipped to Bengaluru" :
                        num === 5 ? "Final billing at Bengaluru" :
                        num === 6 ? "Shipped to chennai" :
                        num === 7 ? "Arrived at chennai" :
                        "Out for final delivery"
                      }
                      value={routeEditForm[`step${num}`] || ''}
                      onChange={(e) => setRouteEditForm(prev => ({ ...prev, [`step${num}`]: e.target.value }))}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '13px', height: '36px', display: 'flex', alignItems: 'center' }}
                onClick={() => setExpandedRouteOrderId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '8px 24px', fontSize: '13px', height: '36px', display: 'flex', alignItems: 'center' }}
                onClick={() => handleSaveRoute(expandedRouteOrderId)}
              >
                ✓ Save Steps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 9999 }}>
          <div className={styles.modal} style={{ maxWidth: '800px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                📥 Bulk Product Import
              </h3>
              <button 
                onClick={() => {
                  if (bulkImporting) return;
                  setShowBulkModal(false);
                }} 
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Upload an Excel (.xlsx, .xls) or CSV file containing multiple products. You can specify variants using the format: <code>RAM/Storage:Price</code> (e.g. <code>8/128:24999, 12/256:29999</code>).
            </p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={downloadTemplate} 
                className="btn btn-outline" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px' }}
              >
                📊 Download Excel Template
              </button>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="bulk-file-input"
                  disabled={bulkImporting}
                />
                <label 
                  htmlFor="bulk-file-input"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px', cursor: 'pointer', margin: 0 }}
                >
                  📁 Select Excel / CSV File
                </label>
              </div>
            </div>

            {bulkPreviewData.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Previewing {bulkPreviewData.length} Products
                  </h4>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--success)', marginRight: '10px' }}>
                      ✓ {bulkPreviewData.filter(p => p.errors.length === 0).length} Valid
                    </span>
                    {bulkPreviewData.some(p => p.errors.length > 0) && (
                      <span style={{ color: 'var(--error)' }}>
                        ⚠ {bulkPreviewData.filter(p => p.errors.length > 0).length} Errors
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '8px 12px', fontWeight: 700 }}>Name</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700 }}>Category</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700 }}>Our Price</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700 }}>Variants</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkPreviewData.map((prod, idx) => {
                        const hasErrors = prod.errors.length > 0;
                        return (
                          <tr 
                            key={idx} 
                            style={{ 
                              borderBottom: '1px solid var(--border)', 
                              background: hasErrors ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                            }}
                          >
                            <td style={{ padding: '8px 12px', fontWeight: 600, color: hasErrors ? 'var(--error)' : 'var(--text-primary)' }}>
                              {prod.name || <span style={{ fontStyle: 'italic', color: '#9aa3b2' }}>Empty Name</span>}
                            </td>
                            <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{prod.category}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 700 }}>{prod.our_price > 0 ? formatINR(prod.our_price) : '—'}</td>
                            <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{prod.variants || '—'}</td>
                            <td style={{ padding: '8px 12px' }}>
                              {hasErrors ? (
                                <span style={{ color: 'var(--error)', fontWeight: 600 }} title={prod.errors.join(', ')}>
                                  ⚠ {prod.errors[0]}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Ready</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {bulkImportMsg && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '8px', 
                background: bulkImportMsg.includes('❌') ? 'var(--error-bg)' : bulkImportMsg.includes('⏳') ? 'var(--info-bg)' : 'var(--success-bg)',
                color: bulkImportMsg.includes('❌') ? 'var(--error)' : bulkImportMsg.includes('⏳') ? 'var(--info)' : 'var(--success)',
                fontWeight: 600,
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {bulkImportMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={() => {
                  setBulkPreviewData([]);
                  setBulkImportMsg('');
                  setShowBulkModal(false);
                }}
                disabled={bulkImporting}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ padding: '8px 24px', fontSize: '13px', fontWeight: 700 }}
                onClick={handleBulkImportSubmit}
                disabled={bulkImporting || bulkPreviewData.length === 0}
              >
                {bulkImporting ? 'Importing...' : `Confirm & Import ${bulkPreviewData.length} Products`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

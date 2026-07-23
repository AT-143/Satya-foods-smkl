import React, { useState } from 'react';
import { Product, Order, OrderStatus, CategoryId, Review, Coupon } from '../types';
import { formatINR } from '../utils/pricing';
import { CATEGORIES_DATA, STORE_INFO } from '../data/products';
import { uploadProductImageToStorage } from '../services/firestoreService';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Truck,
  DollarSign,
  Users,
  MessageSquare,
  Printer,
  Search,
  Star,
  Tag,
  Settings,
  Phone,
  MapPin,
  X,
  FileText,
  ShieldCheck,
  Upload,
  ImageIcon,
  Camera,
  Link as LinkIcon,
  Menu,
  ChevronRight,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  LogOut,
} from 'lucide-react';

// Helper function to process and compress local uploaded image files into lightweight Data URLs
const compressAndReadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1000;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject('Failed to process image file');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject('Failed to read file');
    reader.readAsDataURL(file);
  });
};

interface ImageUploadInputProps {
  label: string;
  currentImage: string;
  onImageChange: (imageUrl: string, storagePath?: string) => void;
  isTe: boolean;
  imagePresets: { label: string; url: string }[];
  productId?: string;
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  currentImage,
  onImageChange,
  isTe,
  imagePresets,
  productId,
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      // Attempt upload to Firebase Storage
      const prodId = productId || `prod-${Date.now()}`;
      const { downloadUrl, storagePath } = await uploadProductImageToStorage(file, prodId);
      onImageChange(downloadUrl, storagePath);
    } catch (err) {
      console.warn('Firebase Storage upload failed, falling back to local compressed Data URL:', err);
      try {
        const dataUrl = await compressAndReadImage(file);
        onImageChange(dataUrl);
      } catch (compressErr) {
        alert(isTe ? 'ఫోటో అప్‌లోడ్ వైఫల్యం' : 'Failed to upload image file');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    }
  };

  return (
    <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-amber-600" />
          <span>{label}</span>
        </label>

        {/* Toggle between Upload File & Image URL */}
        <div className="flex bg-slate-200 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              tab === 'upload' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>{isTe ? 'అప్‌లోడ్ (File Upload)' : 'Upload File'}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              tab === 'url' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Thumbnail Preview */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-300 shrink-0 relative shadow-xs">
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[9px] font-bold p-1 text-center">
              <Camera className="w-5 h-5 mb-0.5 text-slate-400" />
              <span>No Image</span>
            </div>
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-amber-300 text-[10px] font-bold">
              Processing...
            </div>
          )}
        </div>

        {/* Input Control Box */}
        <div className="flex-1 w-full space-y-2">
          {tab === 'upload' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-2.5 text-center transition-all relative ${
                dragActive ? 'border-amber-500 bg-amber-50' : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>{isTe ? 'ఫోటో ఎంచుకోండి లేదా లాగండి (Upload Photo)' : 'Select Photo from Device'}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                Auto-optimized JPG, PNG, WEBP (Max 1000px)
              </p>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={currentImage}
                onChange={(e) => onImageChange(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] text-slate-600 font-extrabold shrink-0">Presets:</span>
            {imagePresets.map((pr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onImageChange(pr.url)}
                className="px-2 py-0.5 bg-white hover:bg-slate-100 text-[10px] font-bold rounded-md text-slate-700 border border-slate-200 shrink-0 shadow-2xs"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string, imageStoragePath?: string) => void;
  onDeleteReview: (reviewId: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  lang: 'te' | 'en';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  reviews,
  coupons,
  onUpdateOrderStatus,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteReview,
  onAddCoupon,
  onDeleteCoupon,
  lang,
}) => {
  const isTe = lang === 'te';

  // Sidebar navigation active view
  const [activeNav, setActiveNav] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'reviews' | 'settings'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Filters
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<CategoryId>('all');
  const [customerSearch, setCustomerSearch] = useState<string>('');

  // Modals State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);

  // New Product Form
  const [newPNameTe, setNewPNameTe] = useState('');
  const [newPNameEn, setNewPNameEn] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('powders');
  const [newPrice, setNewPrice] = useState('500');
  const [newImg, setNewImg] = useState('https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800');
  const [newStoragePath, setNewStoragePath] = useState<string | undefined>();
  const [newDescTe, setNewDescTe] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newStock, setNewStock] = useState('50');
  const [newIsOrganic, setNewIsOrganic] = useState(true);
  const [newIsBestSeller, setNewIsBestSeller] = useState(false);

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountPercent, setNewDiscountPercent] = useState('10');
  const [newMinOrder, setNewMinOrder] = useState('500');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Image Presets for Quick Selection
  const imagePresets = [
    { label: 'Spices/Pickle', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800' },
    { label: 'Turmeric/Yellow', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800' },
    { label: 'Curry Powder', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800' },
    { label: 'Oil/Ghee Jar', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800' },
    { label: 'Sweet/Dessert', url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800' },
    { label: 'Non-Veg', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800' },
  ];

  // Handlers
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPNameTe || !newPNameEn || !newPrice) return;

    const newProd: Product = {
      id: `p-${Date.now()}`,
      nameTe: newPNameTe,
      nameEn: newPNameEn,
      category: newCategory,
      pricePerKg: parseFloat(newPrice),
      image: newImg,
      imageStoragePath: newStoragePath,
      descriptionTe: newDescTe || 'సామర్లకోట స్వచ్ఛమైన ఉత్పత్తులు.',
      descriptionEn: newDescEn || 'Freshly prepared Samalkot delicacy.',
      ingredientsTe: ['స్వచ్ఛమైన దినుసులు'],
      ingredientsEn: ['Pure Ingredients'],
      shelfLife: '6 Months',
      isPureOrganic: newIsOrganic,
      isBestSeller: newIsBestSeller,
      rating: 5.0,
      reviewCount: 1,
      stockKg: parseFloat(newStock) || 50,
    };

    onAddProduct(newProd);
    setShowAddProductModal(false);
    resetProductForm();
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const coupon: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      discountPercent: parseFloat(newDiscountPercent) || 10,
      minOrderValue: parseFloat(newMinOrder) || 500,
      description: newCouponDesc || `${newDiscountPercent}% OFF on orders above ₹${newMinOrder}`,
    };

    onAddCoupon(coupon);
    setShowAddCouponModal(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  const resetProductForm = () => {
    setNewPNameTe('');
    setNewPNameEn('');
    setNewPrice('500');
    setNewDescTe('');
    setNewDescEn('');
    setNewStock('50');
    setNewStoragePath(undefined);
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length;
  
  // Aggregate Customers
  const customerMap = new Map<string, { fullName: string; phone: string; email: string; address: string; city: string; pincode: string; orderCount: number; totalSpent: number; lastOrderDate: string }>();
  orders.forEach((o) => {
    const key = o.customer.phone || o.customer.email || o.customer.fullName;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += o.totalAmount;
      existing.lastOrderDate = o.date;
    } else {
      customerMap.set(key, {
        fullName: o.customer.fullName,
        phone: o.customer.phone,
        email: o.customer.email,
        address: o.customer.address,
        city: o.customer.city,
        pincode: o.customer.pincode,
        orderCount: 1,
        totalSpent: o.totalAmount,
        lastOrderDate: o.date,
      });
    }
  });
  const uniqueCustomers = Array.from(customerMap.values());

  const filteredCustomers = uniqueCustomers.filter((c) => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const q = productSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.nameTe.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const navItems = [
    {
      id: 'overview',
      labelEn: 'Dashboard Overview',
      labelTe: 'డాష్‌బోర్డ్ వివరణ',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'products',
      labelEn: 'Products & Stock',
      labelTe: 'వస్తువులు & సరుకు',
      icon: Package,
      badge: products.length,
    },
    {
      id: 'orders',
      labelEn: 'Orders & Dispatch',
      labelTe: 'ఆర్డర్లు & డెలివరీ',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : orders.length,
      badgeColor: pendingOrdersCount > 0 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-700 text-slate-200',
    },
    {
      id: 'customers',
      labelEn: 'Customer Database',
      labelTe: 'వినియోగదారుల జాబితా',
      icon: Users,
      badge: uniqueCustomers.length,
    },
    {
      id: 'coupons',
      labelEn: 'Discounts & Coupons',
      labelTe: 'డిస్కౌంట్ కూపన్లు',
      icon: Tag,
      badge: coupons.length,
    },
    {
      id: 'reviews',
      labelEn: 'Reviews & Feedback',
      labelTe: 'రివ్యూల మేనేజర్',
      icon: Star,
      badge: reviews.length,
    },
    {
      id: 'settings',
      labelEn: 'Store Settings',
      labelTe: 'స్టోర్ సెట్టింగ్స్',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <div id="admin-portal-wrapper" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-red-600 to-amber-700 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-amber-400 font-extrabold text-xs font-serif">
                SF
              </div>
            </div>
            <div>
              <h2 className="text-sm font-black text-white font-serif tracking-tight">SATYA FOODS</h2>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block -mt-0.5">ADMIN PORTAL</span>
            </div>
          </div>
        </div>

        {/* Owner Profile Badge */}
        <div className="mx-4 my-4 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-extrabold text-white truncate">Satya Samalkot</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Verified Store
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/10 font-extrabold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{isTe ? item.labelTe : item.labelEn}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      item.badgeColor ? item.badgeColor : isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Note */}
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center space-y-1">
          <p>© {new Date().getFullYear()} Satya Foods A2Z</p>
          <p className="text-slate-600 font-mono">v2.4 Pro Dashboard</p>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:bg-slate-900 rounded-xl border border-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h2 className="text-xs font-black text-white">SATYA FOODS ADMIN</h2>
            <p className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
              {navItems.find((n) => n.id === activeNav)?.labelEn}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-slate-950 h-full p-4 space-y-4 border-r border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h3 className="font-bold text-xs text-amber-400 uppercase tracking-widest">Navigation</h3>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveNav(item.id as any);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                        isActive ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{isTe ? item.labelTe : item.labelEn}</span>
                      </div>
                      {item.badge !== null && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-[10px] text-slate-500">Samalkot Store Control</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Body Canvas */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-x-hidden bg-slate-900 min-h-screen">
        
        {/* Top Breadcrumb & Quick Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <span>Admin Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-amber-400 font-bold capitalize">{activeNav}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-serif">
              {isTe
                ? navItems.find((n) => n.id === activeNav)?.labelTe
                : navItems.find((n) => n.id === activeNav)?.labelEn}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isTe ? 'కొత్త వస్తువు చేర్చు' : 'Add New Product'}</span>
            </button>

            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTe ? 'కూపన్ సృష్టించు' : 'New Coupon'}</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: OVERVIEW & ANALYTICS */}
        {activeNav === 'overview' && (
          <div className="space-y-6">
            
            {/* 4 Primary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{isTe ? 'మొత్తం ఆదాయం' : 'Total Revenue'}</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{formatINR(totalRevenue)}</div>
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{orders.length} orders recorded overall</span>
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{isTe ? 'సక్రియ ఆర్డర్లు' : 'Pending Orders'}</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">{pendingOrdersCount}</div>
                <p className="text-[11px] text-slate-400 font-medium">Require shipping / dispatch</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{isTe ? 'కేటలాగ్ ఉత్పత్తులు' : 'Active Catalog'}</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{products.length}</div>
                <p className="text-[11px] text-slate-400 font-medium">Items listed in store catalog</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{isTe ? 'వినియోగదారులు' : 'Total Customers'}</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{uniqueCustomers.length}</div>
                <p className="text-[11px] text-slate-400 font-medium">Unique registered buyers</p>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Quick Management Shortcuts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all space-y-1 group"
                >
                  <Plus className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">Add New Item</p>
                  <p className="text-[10px] text-slate-400">Upload photos & set price</p>
                </button>

                <button
                  onClick={() => setActiveNav('orders')}
                  className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all space-y-1 group"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">Manage Orders</p>
                  <p className="text-[10px] text-slate-400">Update tracking & dispatch</p>
                </button>

                <button
                  onClick={() => setActiveNav('customers')}
                  className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all space-y-1 group"
                >
                  <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">Customer List</p>
                  <p className="text-[10px] text-slate-400">Contact & phone numbers</p>
                </button>

                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all space-y-1 group"
                >
                  <Tag className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">Create Promo Code</p>
                  <p className="text-[10px] text-slate-400">Set discount percentage</p>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Recent Customer Orders</h3>
                  <p className="text-xs text-slate-400">Latest transactions received at Satya Foods</p>
                </div>
                <button
                  onClick={() => setActiveNav('orders')}
                  className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
                >
                  <span>View All Orders ({orders.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No customer orders placed yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-3 font-mono text-amber-400 font-bold">{ord.id}</td>
                          <td className="p-3">
                            <div className="font-bold text-white">{ord.customer.fullName}</div>
                            <div className="text-[10px] text-slate-400">{ord.customer.phone} • {ord.customer.city}</div>
                          </td>
                          <td className="p-3 text-[11px] text-slate-400">{ord.date}</td>
                          <td className="p-3 font-bold">{ord.items.length} items</td>
                          <td className="p-3 font-extrabold text-emerald-400">{formatINR(ord.totalAmount)}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                ord.status === 'DELIVERED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : ord.status === 'SHIPPED'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : ord.status === 'CANCELLED'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedInvoiceOrder(ord);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold border border-slate-700"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: PRODUCTS CATALOG MANAGER */}
        {activeNav === 'products' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-bold scrollbar-none">
                <button
                  onClick={() => setProductCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    productCategoryFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  All ({products.length})
                </button>
                {CATEGORIES_DATA.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
                      productCategoryFilter === cat.id
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{isTe ? cat.nameTe : cat.nameEn}</span>
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search item name..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Products List Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
                <Package className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No Products Listed</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your store catalog is currently empty. Click the button below to add your first product with photo & pricing!
                </p>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-5 py-2.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Product</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.nameEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {prod.isPureOrganic && (
                            <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md shadow-xs">
                              100% ORGANIC
                            </span>
                          )}
                          {prod.isBestSeller && (
                            <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md shadow-xs">
                              BEST SELLER
                            </span>
                          )}
                        </div>
                        <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-700">
                          Stock: {prod.stockKg} kg
                        </span>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-black text-white font-serif">{prod.nameTe}</h3>
                            <p className="text-xs font-semibold text-slate-400">{prod.nameEn}</p>
                          </div>
                          <span className="text-xs font-black text-emerald-400 font-mono shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            {formatINR(prod.pricePerKg)}/kg
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {isTe ? prod.descriptionTe : prod.descriptionEn}
                        </p>
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-3 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${prod.nameEn}?`)) {
                            onDeleteProduct(prod.id, prod.imageStoragePath);
                          }
                        }}
                        className="py-1.5 px-3 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold rounded-xl border border-red-800/60 flex items-center justify-center gap-1 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: ORDERS & DISPATCH */}
        {activeNav === 'orders' && (
          <div className="space-y-6">
            
            {/* Order Status Filters */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Filter Orders by Status
              </h3>
              <div className="flex gap-1.5 flex-wrap text-xs font-bold">
                {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      orderFilter === st
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800 space-y-2">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No Orders Found</h4>
                <p className="text-xs text-slate-500">No customer orders matching status filter "{orderFilter}".</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-colors"
                  >
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-amber-400 font-mono">{ord.id}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : ord.status === 'SHIPPED'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : ord.status === 'CANCELLED'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{ord.date}</p>
                      </div>

                      {/* Status Change Selector & Invoice Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>

                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-400" />
                          <span>Print Slip</span>
                        </button>
                      </div>
                    </div>

                    {/* Customer & Items Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      
                      {/* Customer Address Card */}
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                        <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-amber-400" />
                          <span>Customer Shipping Details</span>
                        </h4>
                        <div className="text-slate-300 space-y-1">
                          <p className="font-bold text-white text-sm">{ord.customer.fullName}</p>
                          <p className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <a href={`tel:${ord.customer.phone}`} className="hover:text-amber-400 underline font-mono">
                              {ord.customer.phone}
                            </a>
                          </p>
                          <p className="flex items-start gap-1.5 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                            <span>
                              {ord.customer.address}, {ord.customer.city}, {ord.customer.state} - {ord.customer.pincode}
                            </span>
                          </p>
                          {ord.customer.notes && (
                            <p className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-[11px] mt-1 font-medium">
                              Note: {ord.customer.notes}
                            </p>
                          )}
                        </div>

                        {/* WhatsApp Notify Button */}
                        <a
                          href={`https://wa.me/91${ord.customer.phone}?text=${encodeURIComponent(
                            `Hello ${ord.customer.fullName}, Thank you for ordering from Satya Foods! Your Order ID: ${ord.id} status is now ${ord.status}. Total Amount: ₹${ord.totalAmount}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs mt-2"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send WhatsApp Status Update</span>
                        </a>
                      </div>

                      {/* Items Ordered List */}
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-white text-xs mb-2">Order Items ({ord.items.length})</h4>
                          <div className="space-y-2 divide-y divide-slate-800/80">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="pt-1.5 flex items-center justify-between text-slate-300">
                                <div>
                                  <p className="font-bold text-white">{it.product.nameEn} ({it.product.nameTe})</p>
                                  <p className="text-[11px] text-slate-400">Pack: {it.weight} × Qty: {it.quantity}</p>
                                </div>
                                <span className="font-mono font-bold text-amber-400">{formatINR(it.unitPrice * it.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total Summary */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm font-bold">
                          <span className="text-slate-400">Total Payable ({ord.paymentMethod}):</span>
                          <span className="text-emerald-400 font-extrabold font-mono text-base">{formatINR(ord.totalAmount)}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 4: CUSTOMERS DATABASE */}
        {activeNav === 'customers' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-white">Customer Profiles</h3>
                <p className="text-xs text-slate-400">Registered buyers derived from store sales history</p>
              </div>

              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customer name, phone, city..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800 space-y-2">
                <Users className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No Customer Records</h4>
                <p className="text-xs text-slate-500">No customer profiles recorded matching search input.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((cust, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-sm font-serif">
                          {cust.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-sm">{cust.fullName}</h4>
                          <p className="text-[11px] text-slate-400">📍 {cust.city}, {cust.pincode}</p>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 font-extrabold font-mono text-xs px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        {formatINR(cust.totalSpent)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <a href={`tel:${cust.phone}`} className="font-mono font-bold text-amber-400 hover:underline">
                          {cust.phone}
                        </a>
                      </p>
                      {cust.email && (
                        <p className="flex items-center justify-between">
                          <span className="text-slate-500">Email:</span>
                          <span className="text-slate-300 font-mono text-[11px]">{cust.email}</span>
                        </p>
                      )}
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Total Orders:</span>
                        <span className="font-extrabold text-white">{cust.orderCount} orders</span>
                      </p>
                      <p className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Last Order:</span>
                        <span className="text-slate-400">{cust.lastOrderDate}</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`tel:${cust.phone}`}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/91${cust.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: COUPONS */}
        {activeNav === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-white">Promotional Coupon Codes</h3>
                <p className="text-xs text-slate-400">Create discount offers to incentivize store purchases</p>
              </div>

              <button
                onClick={() => setShowAddCouponModal(true)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            {coupons.length === 0 ? (
              <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800 space-y-2">
                <Tag className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No Active Coupons</h4>
                <p className="text-xs text-slate-500">Create discount coupons like "SATYA10" or "GODAVARI15"!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.code} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 tracking-wider">
                        {c.code}
                      </span>
                      <button
                        onClick={() => onDeleteCoupon(c.code)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-slate-900"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl font-black text-white">{c.discountPercent}% OFF</div>
                      <p className="text-xs text-slate-400">{c.description}</p>
                      <p className="text-[11px] text-amber-300 font-medium pt-1">
                        Min Order Value: {formatINR(c.minOrderValue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: REVIEWS */}
        {activeNav === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white">Customer Reviews & Moderation</h3>
                <p className="text-xs text-slate-400">Moderate buyer testimonials published on store pages</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                Total Reviews: {reviews.length}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800 space-y-2">
                <Star className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No Reviews Published</h4>
                <p className="text-xs text-slate-500">Customer feedback will appear here as buyers leave reviews.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-white text-sm">{rev.customerName}</h4>
                        <p className="text-[11px] text-slate-400">📍 {rev.location} • {rev.date}</p>
                      </div>
                      <button
                        onClick={() => onDeleteReview(rev.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-slate-900"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      {rev.verifiedPurchase && (
                        <span className="ml-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Verified Buyer
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 7: STORE SETTINGS */}
        {activeNav === 'settings' && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-extrabold text-white">Satya Foods Store Settings</h3>
              <p className="text-xs text-slate-400">Store configuration overview for Samalkot branch</p>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white text-sm">Store Information</p>
                <p>Name: <span className="font-mono text-amber-400">{STORE_INFO.nameEn} ({STORE_INFO.nameTe})</span></p>
                <p>Location: <span className="text-slate-300">{STORE_INFO.locationEn}</span></p>
                <p>Phones: <span className="font-mono text-slate-300">{STORE_INFO.phone1}, {STORE_INFO.phone2}</span></p>
                <p>WhatsApp: <span className="font-mono text-emerald-400">+{STORE_INFO.whatsapp}</span></p>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white text-sm">Payment Gateway Settings</p>
                <p className="text-slate-400">
                  Instant UPI QR code ordering is currently enabled for direct bank transfers & WhatsApp receipt confirmations.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-slate-100 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white font-serif flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>{isTe ? 'కొత్త ఉత్పత్తి జోడించండి' : 'Add New Product to Store'}</span>
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Name in Telugu (తెలుగు పేరు) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPNameTe}
                    onChange={(e) => setNewPNameTe(e.target.value)}
                    placeholder="ఉదా: కొత్త ఆవకాయ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Name in English *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPNameEn}
                    onChange={(e) => setNewPNameEn(e.target.value)}
                    placeholder="e.g. Fresh Mango Avakaya"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameEn} ({c.nameTe})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Price Per Kg (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Local File / Image Uploader */}
              <ImageUploadInput
                label={isTe ? 'ఉత్పత్తి ఫోటో (Product Photo)' : 'Product Photo'}
                currentImage={newImg}
                onImageChange={(imgUrl, storagePath) => {
                  setNewImg(imgUrl);
                  setNewStoragePath(storagePath);
                }}
                isTe={isTe}
                imagePresets={imagePresets}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Stock Quantity (in Kg)
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col justify-end space-y-2 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400">
                    <input
                      type="checkbox"
                      checked={newIsOrganic}
                      onChange={(e) => setNewIsOrganic(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>100% Organic Tag</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-400">
                    <input
                      type="checkbox"
                      checked={newIsBestSeller}
                      onChange={(e) => setNewIsBestSeller(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                    />
                    <span>Best Seller Badge</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={newDescEn}
                  onChange={(e) => setNewDescEn(e.target.value)}
                  placeholder="Freshly prepared with pure oil and traditional spices..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md hover:bg-emerald-700"
                >
                  Save Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-slate-100 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white font-serif flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Edit Product Details</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Name (Telugu)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nameTe}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, nameTe: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nameEn}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, nameEn: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Price / Kg (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.pricePerKg}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        pricePerKg: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Stock (Kg)</label>
                  <input
                    type="number"
                    value={editingProduct.stockKg}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockKg: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <ImageUploadInput
                label={isTe ? 'ఉత్పత్తి ఫోటో సవరణ (Product Photo)' : 'Product Photo'}
                currentImage={editingProduct.image}
                productId={editingProduct.id}
                onImageChange={(imgUrl, storagePath) =>
                  setEditingProduct({
                    ...editingProduct,
                    image: imgUrl,
                    imageStoragePath: storagePath || editingProduct.imageStoragePath,
                  })
                }
                isTe={isTe}
                imagePresets={imagePresets}
              />

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl shadow-md hover:bg-amber-400"
                >
                  Update Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD COUPON */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white font-serif flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                <span>Create New Coupon</span>
              </h3>
              <button
                onClick={() => setShowAddCouponModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Coupon Code (e.g. SATYA10) *
                </label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. FESTIVAL15"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs uppercase font-mono font-bold text-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Discount (%) *</label>
                  <input
                    type="number"
                    required
                    value={newDiscountPercent}
                    onChange={(e) => setNewDiscountPercent(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                >
                  Create Coupon
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: PRINT INVOICE SLIP */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 font-serif">SATYA FOODS - INVOICE SLIP</h3>
                <p className="text-[10px] text-slate-500 font-mono">Order ID: {selectedInvoiceOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="text-slate-500 hover:text-slate-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3 font-sans">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Ship To:</p>
                <p className="font-bold text-slate-800">{selectedInvoiceOrder.customer.fullName}</p>
                <p>{selectedInvoiceOrder.customer.address}, {selectedInvoiceOrder.customer.city}</p>
                <p>{selectedInvoiceOrder.customer.state} - {selectedInvoiceOrder.customer.pincode}</p>
                <p className="font-mono font-bold">Phone: {selectedInvoiceOrder.customer.phone}</p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2">Pack</th>
                      <th className="p-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedInvoiceOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold">{it.product.nameEn}</td>
                        <td className="p-2">{it.weight} × {it.quantity}</td>
                        <td className="p-2 text-right font-mono font-bold">{formatINR(it.unitPrice * it.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700 font-extrabold font-mono">{formatINR(selectedInvoiceOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

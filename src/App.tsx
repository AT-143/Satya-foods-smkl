import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Sparkles, Truck, Star, MessageSquare } from 'lucide-react';
import { Product, CartItem, Order, CategoryId, WeightOption, OrderStatus, Review, Coupon } from './types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, SAMPLE_REVIEWS } from './data/products';
import { calculateWeightPrice } from './utils/pricing';
import {
  subscribeProducts,
  saveProductToDb,
  deleteProductFromDb,
  subscribeOrders,
  addOrderToDb,
  updateOrderStatusInDb,
  subscribeReviews,
  addReviewToDb,
  deleteReviewFromDb,
  subscribeCoupons,
  addCouponToDb,
  deleteCouponFromDb,
  seedInitialFirestoreData,
} from './services/firestoreService';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { InfoModals } from './components/InfoModals';
import { AdminPage } from './admin/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Language toggle
  const [lang, setLang] = useState<'te' | 'en'>('en');

  // Protected Admin Session State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('satya_admin_auth') === 'true';
    }
    return false;
  });

  // Main Nav Active Tab for Customer Storefront
  const [activeTab, setActiveTab] = useState<'store' | 'tracking' | 'reviews' | 'admin'>('store');

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      setActiveTab('admin');
    } else if (activeTab === 'admin') {
      setActiveTab('store');
    }
  }, [location.pathname]);

  const handleOpenAdminModal = () => {
    navigate('/admin');
  };

  const handleAdminAuthenticate = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('satya_admin_auth', 'true');
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('satya_admin_auth');
    navigate('/');
    setActiveTab('store');
  };

  // Product Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('satya_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('satya_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SAMPLE_REVIEWS;
  });

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('satya_coupons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_COUPONS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('satya_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Real-time Firestore Subscriptions & Automatic Seed Sync
  useEffect(() => {
    let unsubscribeProducts: () => void;
    let unsubscribeOrders: () => void;
    let unsubscribeReviews: () => void;
    let unsubscribeCoupons: () => void;

    const initFirebaseData = async () => {
      try {
        await seedInitialFirestoreData(INITIAL_PRODUCTS, INITIAL_COUPONS, SAMPLE_REVIEWS);

        unsubscribeProducts = subscribeProducts((remoteProducts) => {
          if (remoteProducts && remoteProducts.length > 0) {
            setProducts(remoteProducts);
            localStorage.setItem('satya_products', JSON.stringify(remoteProducts));
          } else {
            setProducts(INITIAL_PRODUCTS);
          }
        });

        unsubscribeOrders = subscribeOrders((remoteOrders) => {
          setOrders(remoteOrders);
          localStorage.setItem('satya_orders', JSON.stringify(remoteOrders));
        });

        unsubscribeReviews = subscribeReviews((remoteReviews) => {
          if (remoteReviews && remoteReviews.length > 0) {
            setReviews(remoteReviews);
            localStorage.setItem('satya_reviews', JSON.stringify(remoteReviews));
          }
        });

        unsubscribeCoupons = subscribeCoupons((remoteCoupons) => {
          if (remoteCoupons && remoteCoupons.length > 0) {
            setCoupons(remoteCoupons);
            localStorage.setItem('satya_coupons', JSON.stringify(remoteCoupons));
          }
        });
      } catch (err) {
        console.warn('Firestore sync fallback to local storage', err);
        if (products.length === 0) setProducts(INITIAL_PRODUCTS);
      }
    };

    initFirebaseData();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeReviews) unsubscribeReviews();
      if (unsubscribeCoupons) unsubscribeCoupons();
    };
  }, []);

  // UI Filter & Cart States
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('satya_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [infoModalType, setInfoModalType] = useState<'about' | 'gallery' | 'contact' | null>(null);

  // Cart Coupon Discounts
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('satya_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Product to Cart Handler
  const handleAddToCart = (product: Product, weight: WeightOption, quantity: number) => {
    const unitPrice = calculateWeightPrice(product.pricePerKg, weight);
    
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => item.product.id === product.id && item.weight === weight
      );

      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            weight,
            quantity,
            unitPrice,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedCouponCode('');
    setAppliedCouponDiscount(0);
  };

  const handleProceedCheckout = (discountPercent: number = 0, couponCode: string = '') => {
    setAppliedCouponDiscount(discountPercent);
    setAppliedCouponCode(couponCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Placement Handler
  const handleOrderPlaced = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    try {
      await addOrderToDb(newOrder);
    } catch (e) {
      console.error('Failed to sync order to Firestore:', e);
    }
  };

  // Admin Actions
  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id: newId };
    setProducts((prev) => [newProduct, ...prev]);
    try {
      await saveProductToDb(newProduct);
    } catch (e) {
      console.error('Error adding product:', e);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    try {
      await saveProductToDb(updatedProduct);
    } catch (e) {
      console.error('Error updating product:', e);
    }
  };

  const handleDeleteProduct = async (id: string, imageStoragePath?: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProductFromDb(id, imageStoragePath);
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    try {
      await updateOrderStatusInDb(orderId, newStatus);
    } catch (e) {
      console.error('Error updating order status:', e);
    }
  };

  const handleAddReview = async (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);
    try {
      await addReviewToDb(newReview);
    } catch (e) {
      console.error('Error adding review:', e);
    }
  };

  const handleDeleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteReviewFromDb(id);
    } catch (e) {
      console.error('Error deleting review:', e);
    }
  };

  const handleAddCoupon = async (couponData: Coupon) => {
    setCoupons((prev) => [couponData, ...prev]);
    try {
      await addCouponToDb(couponData);
    } catch (e) {
      console.error('Error adding coupon:', e);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    try {
      await deleteCouponFromDb(code);
    } catch (e) {
      console.error('Error deleting coupon:', e);
    }
  };

  // Filtered Products Search & Category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      product.nameEn.toLowerCase().includes(query) ||
      product.nameTe.includes(query) ||
      product.descriptionEn.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const isTe = lang === 'te';

  return (
    <Routes>
      {/* SEPARATE DEDICATED ROUTE FOR ADMIN PANEL */}
      <Route
        path="/admin/*"
        element={
          <AdminPage
            products={products}
            orders={orders}
            reviews={reviews}
            coupons={coupons}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onDeleteReview={handleDeleteReview}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            lang={lang}
            setLang={setLang}
            isAuthenticated={isAdminAuthenticated}
            onAuthenticate={handleAdminAuthenticate}
            onLogout={handleAdminLogout}
            onBackToStore={() => {
              navigate('/');
              setActiveTab('store');
            }}
          />
        }
      />

      {/* CUSTOMER STOREFRONT ROUTES */}
      <Route
        path="/*"
        element={
          <div id="app-root" className="min-h-screen bg-amber-50/50 text-amber-950 font-sans flex flex-col selection:bg-amber-300 selection:text-red-950 pb-16 md:pb-0">
            
            {/* Header Bar */}
            <Header
              activeTab={activeTab}
              setActiveTab={(tab) => {
                if (tab === 'admin') {
                  navigate('/admin');
                } else {
                  setActiveTab(tab);
                }
              }}
              lang={lang}
              setLang={setLang}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
              onOpenCart={() => setIsCartOpen(true)}
              isAdminAuthenticated={isAdminAuthenticated}
              onOpenAdminModal={handleOpenAdminModal}
              onAdminLogout={handleAdminLogout}
              onOpenAbout={() => setInfoModalType('about')}
              onOpenGallery={() => setInfoModalType('gallery')}
              onOpenContact={() => setInfoModalType('contact')}
            />

            <main className="flex-1">
              <Routes>
                {/* 1. HOME ROUTE */}
                <Route
                  path="/"
                  element={
                    <>
                      {/* Hero Banner Showcase */}
                      <HeroBanner lang={lang} />

                      {/* Category Filter Pills */}
                      <CategoryBar
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        lang={lang}
                      />

                      {/* Product Catalog Grid */}
                      <div id="product-catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl sm:text-2xl font-black text-red-950 font-serif">
                            {selectedCategory === 'all'
                              ? isTe
                                ? 'అన్ని ఉత్పత్తుల జాబితా'
                                : 'All Traditional Products'
                              : isTe
                              ? `${selectedCategory} వర్గం ఉత్పత్తులు`
                              : 'Category Products'}
                          </h2>
                          <span className="text-xs text-amber-900 font-extrabold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                            {filteredProducts.length} {isTe ? 'రకాలు అందుబాటులో ఉన్నాయి' : 'Items Found'}
                          </span>
                        </div>

                        {filteredProducts.length === 0 ? (
                          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-amber-200 shadow-xs space-y-3">
                            <p className="text-sm font-bold text-red-950">
                              {products.length === 0
                                ? isTe
                                  ? 'స్టోర్‌లో ఇంకా ఉత్పత్తులు జోడించలేదు. అడ్మిన్ ప్యానెల్ నుండి ఉత్పత్తులను జోడించండి.'
                                  : 'No products added to the store yet. Add products from the Owner/Admin panel!'
                                : isTe
                                ? 'మీరు వెతికిన పదం లేదా కేటగిరీకి సంబంధించిన వస్తువులు లభించలేదు.'
                                : 'No items found matching your search.'}
                            </p>
                            {products.length === 0 ? (
                              <button
                                onClick={handleOpenAdminModal}
                                className="px-4 py-2 bg-gradient-to-r from-red-900 to-amber-900 text-amber-100 text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 hover:scale-105 transition-transform"
                              >
                                <span>{isTe ? 'అడ్మిన్ ప్యానెల్‌కి వెళ్లండి' : 'Open Admin Panel'}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSearchQuery('');
                                  setSelectedCategory('all');
                                }}
                                className="text-xs text-amber-800 font-extrabold underline"
                              >
                                {isTe ? 'అన్ని ఉత్పత్తులు చూడండి' : 'Clear Filters & View All'}
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {filteredProducts.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                lang={lang}
                                onAddToCart={handleAddToCart}
                                onQuickView={(p) => setQuickViewProduct(p)}
                              />
                            ))}
                          </div>
                        )}

                        {/* Trust Features & Handmade Tradition Promise */}
                        <section id="trust-promise-section" className="bg-gradient-to-br from-amber-100 via-amber-50 to-red-100/60 py-10 px-4 sm:px-6 lg:px-8 border-y border-amber-300/80 my-8">
                          <div className="max-w-7xl mx-auto space-y-6 text-center">
                            <div>
                              <span className="text-xs font-black uppercase tracking-widest text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                                {isTe ? 'గోదావరి సంప్రదాయ పిండివంటలు' : 'WHY CHOOSE SATYA FOODS'}
                              </span>
                              <h2 className="text-2xl sm:text-3xl font-black text-red-950 font-serif mt-2">
                                {isTe ? 'మన గోదావరి స్వచ్ఛమైన ఆతిథ్యం & రుచులు' : 'Handcrafted Quality & Pure Tradition'}
                              </h2>
                              <p className="text-xs sm:text-sm text-amber-900 max-w-2xl mx-auto mt-1 font-medium">
                                {isTe
                                  ? 'సామర్లకోటలో ప్రతి రోజు తయారుచేసే స్వచ్ఛమైన ఆవకాయలు, సాంప్రదాయ నెయ్యి పిండివంటలు మరియు మసాలా కారపొడులు.'
                                  : 'Prepared fresh daily in Samalkot using time-tested family recipes, pure ingredients, and zero chemical preservatives.'}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800 font-bold text-xl">
                                  🧈
                                </div>
                                <div>
                                  <h3 className="text-sm font-extrabold text-red-950 font-serif">
                                    {isTe ? 'స్వచ్ఛమైన నెయ్యి & గానుగ నూనె' : 'Pure Desi Ghee & Oils'}
                                  </h3>
                                  <p className="text-xs text-amber-900/80 mt-1">
                                    {isTe ? '100% ప్యూర్ గేదె నెయ్యి మరియు కట్టెగానుగ పల్లీ నూనె మాత్రమే వాడతాము.' : 'Made exclusively with 100% pure ghee & wood-pressed cold-pressed oils.'}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-800 font-bold text-xl">
                                  🌿
                                </div>
                                <div>
                                  <h3 className="text-sm font-extrabold text-red-950 font-serif">
                                    {isTe ? '100% హోమ్‌మేడ్ & ఆర్గానిక్' : '100% Natural & Chemical Free'}
                                  </h3>
                                  <p className="text-xs text-amber-900/80 mt-1">
                                    {isTe ? 'ఎటువంటి ఆర్టిఫిషియల్ కలర్స్ లేదా ప్రిజర్వేటివ్స్ కలపము.' : 'No synthetic colors, artificial flavors, or chemical preservatives used.'}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center shrink-0 text-red-800 font-bold text-xl">
                                  📦
                                </div>
                                <div>
                                  <h3 className="text-sm font-extrabold text-red-950 font-serif">
                                    {isTe ? 'వ్యాక్యూమ్ లీక్-ప్రూఫ్ ప్యాకింగ్' : 'Vacuum Sealed Packaging'}
                                  </h3>
                                  <p className="text-xs text-amber-900/80 mt-1">
                                    {isTe ? 'ఆవకాయ నూనెలు కారకుండా ప్రత్యేక హైజీనిక్ వ్యాక్యూమ్ సీల్ ప్యాకింగ్.' : '3-layer leak-proof vacuum sealed food grade packaging for absolute freshness.'}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-900 font-bold text-xl">
                                  ✈️
                                </div>
                                <div>
                                  <h3 className="text-sm font-extrabold text-red-950 font-serif">
                                    {isTe ? 'ప్రపంచవ్యాప్త హోమ్ డెలివరీ' : 'Pan-India & Global Express'}
                                  </h3>
                                  <p className="text-xs text-amber-900/80 mt-1">
                                    {isTe ? 'ఇండియాతో పాటు యూఎస్ఏ, యూకే వంటి దేశాలకు వేగవంతమైన షిప్పింగ్.' : 'Fast door delivery across all Indian pincodes and international courier.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </>
                  }
                />

                {/* 2. ABOUT PAGE */}
                <Route path="/about" element={<AboutPage lang={lang} />} />

                {/* 3. PRODUCTS PAGE */}
                <Route
                  path="/products"
                  element={
                    <ProductsPage
                      products={products}
                      lang={lang}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      onAddToCart={handleAddToCart}
                      onOpenQuickView={(p) => setQuickViewProduct(p)}
                    />
                  }
                />

                {/* 4. GALLERY PAGE */}
                <Route path="/gallery" element={<GalleryPage lang={lang} />} />

                {/* 5. CONTACT PAGE */}
                <Route path="/contact" element={<ContactPage lang={lang} />} />

                {/* 6. REVIEWS PAGE */}
                <Route
                  path="/reviews"
                  element={
                    <ReviewsSection
                      lang={lang}
                      reviews={reviews}
                      onAddReview={handleAddReview}
                    />
                  }
                />

                {/* 7. ORDER TRACKING PAGE */}
                <Route
                  path="/track"
                  element={<OrderTracker orders={orders} lang={lang} />}
                />
              </Routes>
            </main>

            {/* Footer */}
            <Footer
              lang={lang}
              onOpenAdminModal={handleOpenAdminModal}
              isAdminAuthenticated={isAdminAuthenticated}
            />

            {/* Product Detail Quick View Modal */}
            <ProductDetailModal
              product={quickViewProduct}
              isOpen={!!quickViewProduct}
              onClose={() => setQuickViewProduct(null)}
              lang={lang}
              onAddToCart={handleAddToCart}
            />

            {/* Cart Drawer */}
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
              onProceedCheckout={handleProceedCheckout}
              lang={lang}
            />

            {/* Checkout Modal */}
            <CheckoutModal
              isOpen={isCheckoutOpen}
              onClose={() => setIsCheckoutOpen(false)}
              cartItems={cartItems}
              couponDiscount={appliedCouponDiscount}
              couponCode={appliedCouponCode}
              lang={lang}
              onOrderPlaced={handleOrderPlaced}
              onClearCart={handleClearCart}
            />

            {/* Floating WhatsApp Quick Order Button (Maharaja Foods Feature) */}
            <a
              id="floating-whatsapp-btn"
              href={`https://wa.me/919505147672?text=${encodeURIComponent(
                isTe
                  ? 'నమస్కారం! సత్య ఫుడ్స్ పిండివంటలు మరియు ఆవకాయల ధరల వివరాలు తెలుసుకోవాలనుకుంటున్నాను.'
                  : 'Hello! I want to inquire about Satya Foods traditional delicacies and pickles.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white ring-4 ring-emerald-500/20"
              title={isTe ? 'వాట్సాప్‌లో చాట్ చేయండి' : 'Chat on WhatsApp'}
            >
              <MessageSquare className="w-6 h-6 fill-white text-emerald-600" />
              <span className="hidden group-hover:inline text-xs font-black tracking-wide pr-1">
                {isTe ? 'వాట్సాప్ ఆర్డర్' : 'WhatsApp Order'}
              </span>
            </a>

            {/* Mobile Sticky Floating Navigation Bar */}
            <div id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-red-950 via-amber-950 to-red-950 text-amber-100 border-t border-amber-600/40 shadow-2xl px-2 py-1.5 flex items-center justify-around backdrop-blur-md">
              <button
                onClick={() => setActiveTab('store')}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[60px] min-h-[44px] transition-all ${
                  activeTab === 'store' ? 'text-amber-400 font-black scale-105' : 'text-amber-200/70'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{isTe ? 'షాప్' : 'Shop'}</span>
              </button>

              <button
                onClick={() => setActiveTab('tracking')}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[60px] min-h-[44px] transition-all ${
                  activeTab === 'tracking' ? 'text-amber-400 font-black scale-105' : 'text-amber-200/70'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{isTe ? 'ట్రాక్' : 'Track'}</span>
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex flex-col items-center justify-center p-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-red-950 font-black rounded-2xl min-w-[64px] min-h-[44px] shadow-lg active:scale-95 transition-transform"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px]">{isTe ? 'కార్ట్' : 'Cart'}</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1 bg-red-800 text-amber-100 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-400 shadow-md">
                    {cartItems.reduce((acc, it) => acc + it.quantity, 0)}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[60px] min-h-[44px] transition-all ${
                  activeTab === 'reviews' ? 'text-amber-400 font-black scale-105' : 'text-amber-200/70'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{isTe ? 'రివ్యూలు' : 'Reviews'}</span>
              </button>

              <button
                onClick={() => navigate('/admin')}
                className="flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[60px] min-h-[44px] text-amber-300 hover:text-amber-100"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] mt-0.5">{isTe ? 'అడ్మిన్' : 'Admin'}</span>
              </button>
            </div>

            {/* Info Modals (About, Gallery, Contact) */}
            <InfoModals
              type={infoModalType}
              onClose={() => setInfoModalType(null)}
              lang={lang}
            />

          </div>
        }
      />
    </Routes>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

// --- DATA LAYER (Original definitive baseline layout synced to eliminate routing loops) ---
export const products = [
  { id: 1, name: "Terabyte Watch Ultra", price: 65999, category: "Wearables", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=60&w=500", tag: "Limited", spec: "Grade-5 Titanium Build" },
  { id: 2, name: "Terabyte Studio Pro", price: 28900, category: "Audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=60&w=1000", tag: "Best Seller", spec: "Lossless Audio 2.0 headphone" },
  { id: 3, name: "Terabyte Phone 15 Pro", price: 144900, category: "Mobile", img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=60&w=1000", tag: "New", spec: "A17 Pro Silicon smartphone" },
  { id: 4, name: "Terabyte Vision Glass", price: 299000, category: "Vision", img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=60&w=1000", tag: "Elite", spec: "Spatial Computing Ready ar vr" },
  { id: 5, name: "Terabyte Aero Pods", price: 49900, category: "Audio", img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=60&w=1000", tag: "Trending", spec: "Active Noise Cancellation earbuds earphones" },
  { id: 6, name: "Terabyte MagSafe Hub", price: 14900, category: "Power", img: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&q=60&w=1000", tag: "Essential", spec: "15W Fast Wireless charger" },
  { id: 7, name: "Terabyte Keyboard Pro", price: 12900, category: "Work", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=60&w=1000", tag: "Mechanical", spec: "Silver Switches custom keyboard" },
  { id: 8, name: "Terabyte Mouse Pad", price: 4500, category: "Work", img: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&q=60&w=1000", tag: "Minimal", spec: "Waterproof Micro-texture desk mat" },
  { id: 9, name: "Terabyte Laptop Stand", price: 8900, category: "Work", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=60&w=1000", tag: "Ergonomic", spec: "Brushed Aluminum riser" }
];

const Home = () => {
  // GLOBALIZED PULL: Fetching native shared active theme triggers directly from unified state aggregator
  const { addToCart, cart, isDarkMode, toggleTheme } = useCart();
  const navigate = useNavigate();
  
  const [showPopup, setShowPopup] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  
  const [quantities, setQuantities] = useState({});
  const [addedStatus, setAddedStatus] = useState({});
  const catalogueRef = useRef(null);

  // Track global header resize / menu overlaps
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const slides = [
    { title: "TERABYTE ELITE", sub: "THE FUTURE OF TECHNOLOGY", img: "https://plus.unsplash.com/premium_photo-1712764121254-d9867c694b81?w=1200" },
    { title: "PRECISION DESIGN", sub: "AEROSPACE GRADE HARDWARE", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200" },
    { title: "STUDIO SOUND", sub: "PURE AUDIO EXPERIENCE", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200" }
  ];

  const playPremiumBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {}
  };

  // Sync menu overlay constraints cross-tree
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    
    const handleMenuState = (e) => {
      if (e.detail !== undefined) {
        setIsMenuOpen(e.detail.isOpen);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("terabyte_nav_toggle", handleMenuState);
    
    const sliderTimer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("terabyte_nav_toggle", handleMenuState);
      clearInterval(sliderTimer);
    };
  }, [slides.length]);

  const handleToggleTheme = () => {
    playPremiumBeep();
    toggleTheme();
  };

  const handleQuantityChange = (id, delta) => {
    playPremiumBeep();
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation();
    playPremiumBeep();
    
    const qtyToPush = quantities[product.id] || 1;

    addToCart({ ...product, quantity: qtyToPush });
    
    setLastAdded(`${product.name} (x${qtyToPush})`);
    setShowPopup(true);
    setAddedStatus(prev => ({ ...prev, [product.id]: true }));
    
    setTimeout(() => {
      setAddedStatus(prev => ({ ...prev, [product.id]: false }));
      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    }, 2500);

    setTimeout(() => setShowPopup(false), 3500);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (catalogueRef.current) {
      const yOffset = -120;
      const y = catalogueRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      playPremiumBeep();
      alert(`🎉 Network Joined! Updates will be sent to ${newsletterEmail.toLowerCase()}`);
      setNewsletterEmail("");
    }
  };

  // OMITTING "Work" items exclusively from the Home Page display stream
  const homeDisplayProducts = products.filter(p => p.category !== "Work");

  let processedProducts = homeDisplayProducts.filter(p => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) return matchCategory;

    const matchName = p.name.toLowerCase().includes(query);
    const matchSpec = p.spec.toLowerCase().includes(query);
    const matchCatText = p.category.toLowerCase().includes(query);

    return matchCategory && (matchName || matchSpec || matchCatText);
  });

  // Native dynamic sorting logic embedded directly onto Landing dashboard view
  if (sortBy === "price-asc") {
    processedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    processedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    // CRITICAL FIX: Removed overflow-x-hidden to fully restore viewport sticky behavior tracking
    <div className={`min-h-screen font-sans antialiased transition-colors duration-500 selection:bg-[#D4AF37] selection:text-white ${isDarkMode ? 'bg-[#121212] text-[#F9F6F0]' : 'bg-[#F9F6F0] text-[#1A1A1A]'}`}>
      
      {/* FLOATING THEME SWITCHER DIRECTED TO GLOBAL HANDLER */}
      <button 
        onClick={handleToggleTheme}
        aria-label={`Switch to ${isDarkMode ? 'Light' : 'Dark'} mode`}
        className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[4000] bg-[#D4AF37] text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black shadow-2xl hover:scale-110 transition-transform active:scale-95 cursor-pointer border border-white/20"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* TOAST POPUP */}
      {showPopup && (
        <div 
          role="alert" 
          className="fixed bottom-6 md:bottom-10 left-4 right-4 md:left-auto md:right-10 z-[5000] 
                     bg-[#1A1A1A] text-[#F9F6F0] p-4 md:p-5 rounded-[20px] md:rounded-[25px] 
                     shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between gap-6 
                     border border-white/10 transition-all duration-300 animate-slideUp"
        >
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-[#D4AF37] rounded-full flex-shrink-0 flex items-center justify-center font-black text-black text-xs md:text-base">✓</div>
             <div className="overflow-hidden">
                <p className="text-[7px] md:text-[8px] font-black tracking-[0.3em] text-[#D4AF37] uppercase">Inventory Updated</p>
                <p className="text-xs md:text-sm font-black uppercase tracking-tight truncate max-w-[140px] md:max-w-[220px]">{lastAdded}</p>
             </div>
          </div>
          <Link to="/cart" className="bg-white text-black px-5 py-2.5 rounded-full text-[9px] font-black tracking-widest uppercase hover:bg-[#D4AF37] transition-all whitespace-nowrap shadow-sm font-black">
            Checkout →
          </Link>
        </div>
      )}

      {/* HERO SLIDER */}
      <section className="relative h-[80vh] md:h-screen bg-black overflow-hidden" aria-label="Featured Products Slider">
        {slides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${i === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`} aria-hidden={i !== currentSlide}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
            <img src={slide.img} className="w-full h-full object-cover opacity-70" alt={slide.title} />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
              <p className="text-[9px] md:text-[11px] font-black tracking-[0.8em] md:tracking-[1.2em] text-[#D4AF37] mb-6 uppercase">{slide.sub}</p>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white uppercase italic">
                {slide.title}<span className="text-[#D4AF37] not-italic">.</span>
              </h1>
              <div className="pt-10 md:pt-16 flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-[280px] sm:max-w-none justify-center">
                <button onClick={() => catalogueRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black px-8 py-4 md:px-12 md:py-5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase hover:bg-[#D4AF37] transition-all active:scale-95 shadow-xl font-black">Shop Inventory</button>
                <a 
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={playPremiumBeep}
                  className="border border-white/30 text-white px-8 py-4 md:px-12 md:py-5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all block text-center font-black"
                >
                  Watch Film ↗
                </a>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 z-30">
          {slides.map((_, i) => (
            <button 
              key={i} 
              aria-label={`Go to slide ${i + 1}`} 
              aria-current={i === currentSlide}
              onClick={() => setCurrentSlide(i)} 
              className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 md:w-16 bg-[#D4AF37]' : 'w-3 md:w-6 bg-white/30'}`} 
            />
          ))}
        </div>
      </section>

      {/* BRAND STATS */}
      <section className={`py-12 md:py-20 border-b shadow-sm relative z-20 transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-gray-100'}`} aria-label="Brand Core Values">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-left md:text-center">
          {[{ l: "Engineering", v: "Terabyte Core" }, { l: "Delivery", v: "Priority Air" }, { l: "Warranty", v: "1 Year Shield" }, { l: "Support", v: "24/7 Concierge" }].map((item, i) => (
            <div key={i} className={`space-y-1 md:space-y-2 border-l-2 pl-4 md:pl-8 ${isDarkMode ? 'border-white/10' : 'border-[#F9F6F0]'}`}>
              <p className="text-[8px] md:text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">{item.l}</p>
              <p className={`text-sm md:text-xl font-black tracking-tight uppercase truncate ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- ADVANCED STICKY NAV (SORT SELECTOR KEPT + ABSOLUTELY STICKY) --- */}
      <nav className={`sticky top-4 z-[2000] px-4 md:px-6 my-4 transition-all duration-500 ${
        isScrolled ? 'translate-y-0 shadow-2xl' : 'translate-y-0'
      } ${isMenuOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100 pointer-events-auto'}`} 
      aria-label="Product Filtering Navigation">
        <div className={`max-w-6xl mx-auto backdrop-blur-2xl border rounded-[25px] md:rounded-[40px] shadow-lg p-2 md:p-3 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A]/90 border-white/10' : 'bg-white/85 border-gray-100'}`}>
          
          <div className="flex gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto px-2 py-1" role="group" aria-label="Filter by Category">
            {["All", "Wearables", "Audio", "Mobile", "Vision", "Power"].map(c => (
              <button 
                key={c} 
                aria-pressed={activeCategory === c}
                onClick={() => handleCategorySelect(c)} 
                className={`whitespace-nowrap px-4 py-2 md:px-7 md:py-3 rounded-full text-[8px] md:text-[9px] font-black tracking-widest uppercase transition-all ${
                  activeCategory === c 
                    ? 'bg-[#D4AF37] text-black shadow-md scale-105 font-black' 
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className={`flex-1 w-full flex items-center px-4 lg:px-8 rounded-full transition-all border py-1 ${isDarkMode ? 'bg-black/50 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
             <span className="mr-3 opacity-30 text-xs" aria-hidden="true">🔍</span>
             <label htmlFor="search-input" className="sr-only">Search Artifacts</label>
             <input 
               id="search-input"
               type="text" 
               value={searchQuery} 
               placeholder="SEARCH INVENTORY (e.g., headphone)..." 
               className={`bg-transparent w-full text-[9px] md:text-[10px] font-black tracking-widest outline-none uppercase py-1 ${isDarkMode ? 'text-white placeholder:text-gray-600' : 'text-black placeholder:text-gray-500'}`} 
               onChange={(e) => setSearchQuery(e.target.value)} 
             />
             {searchQuery && (
               <button onClick={() => setSearchQuery("")} aria-label="Clear search query" className="text-[10px] font-bold text-gray-500 hover:text-[#D4AF37] px-2">✕</button>
             )}
          </div>

          <div className={`w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 px-2 lg:border-l pl-4 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
             <label htmlFor="sort-dropdown" className="text-[8px] font-black tracking-widest text-gray-500 uppercase hidden sm:inline">Sort:</label>
             <select 
               id="sort-dropdown"
               value={sortBy} 
               onChange={(e) => setSortBy(e.target.value)}
               className={`bg-transparent text-[9px] font-black tracking-widest uppercase outline-none cursor-pointer py-2 pr-4 border-none ${isDarkMode ? 'text-white' : 'text-black'}`}
             >
                <option value="default" className="text-black">Standard Order</option>
                <option value="price-asc" className="text-black">Price: Low to High</option>
                <option value="price-desc" className="text-black">Price: High to Low</option>
             </select>
          </div>

        </div>
      </nav>

      {/* PRODUCT CATALOGUE */}
      <section ref={catalogueRef} className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-32 scroll-mt-32" aria-labelledby="catalog-title">
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4 px-2 border-b pb-6 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="space-y-1 md:space-y-2 text-left">
             <p className="text-[8px] md:text-[10px] font-black text-[#D4AF37] tracking-[0.5em] uppercase italic">System Inventory</p>
             <h2 id="catalog-title" className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic ${isDarkMode ? 'text-white' : 'text-black'}`}>Featured Artifacts</h2>
          </div>
          <div className="text-left md:text-right space-y-1">
             <p className="text-gray-500 font-bold text-[9px] md:text-xs uppercase tracking-widest leading-relaxed">
               {activeCategory === "All" ? "Displaying Base Core Setups" : `Filtered by: ${activeCategory}`} ({processedProducts.length} items)
             </p>
             <Link to="/products" onClick={playPremiumBeep} className="text-[#D4AF37] font-black text-[9px] uppercase tracking-widest block hover:underline">
               Explore complete archive collection ↗
             </Link>
          </div>
        </div>

        {processedProducts.length === 0 ? (
          <div className={`py-20 text-center space-y-4 rounded-[30px] border ${isDarkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-gray-100'}`}>
            <p className="text-gray-500 text-xs font-black tracking-widest uppercase" role="status">No artifacts match your parameters.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); setSortBy("default"); }} className="bg-[#D4AF37] text-black px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest font-black">Reset Scope</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 md:gap-16 lg:gap-20">
            {processedProducts.map(p => {
              const currentQtyCount = quantities[p.id] || 1;

              return (
                <div key={p.id} className="group relative flex flex-col animate-slideUp">
                  
                  <div className={`relative aspect-[4/5] w-full rounded-[25px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden shadow-sm border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between ${isDarkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-gray-50'}`}>
                    
                    <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
                        <span className="bg-black text-[#D4AF37] px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[6px] sm:text-[7px] md:text-[8px] font-black tracking-widest uppercase shadow-md">{p.tag}</span>
                    </div>

                    <Link to={`/product/${p.id}`} className="w-full h-full p-4 sm:p-12 md:p-16 flex items-center justify-center my-auto" aria-label={`View details for ${p.name}`}>
                      <img src={p.img} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out p-2 sm:p-4" alt="" />
                    </Link>
                    
                    <div className="absolute inset-x-2 bottom-2 sm:inset-x-5 sm:bottom-5 z-20 space-y-2">
                       
                       <div className="flex items-center justify-between bg-black/40 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 mx-auto w-fit gap-2 sm:gap-4">
                         <button 
                           type="button" 
                           onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuantityChange(p.id, -1); }} 
                           className="text-white hover:text-[#D4AF37] font-black text-xs px-1.5 cursor-pointer"
                         >
                           －
                         </button>
                         <span className="text-[9px] sm:text-xs font-black text-[#D4AF37]">{currentQtyCount}</span>
                         <button 
                           type="button" 
                           onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuantityChange(p.id, 1); }} 
                           className="text-white hover:text-[#D4AF37] font-black text-xs px-1.5 cursor-pointer"
                         >
                           ＋
                         </button>
                       </div>

                       <button 
                        onClick={(e) => handleAddToCart(e, p)} 
                        disabled={addedStatus[p.id]} 
                        aria-label={`Add ${currentQtyCount} units of ${p.name} to bag`}
                        className={`w-full py-2 sm:py-3 rounded-full text-[7px] sm:text-[9px] font-black tracking-widest uppercase transition-all duration-300 shadow-lg cursor-pointer ${
                          addedStatus[p.id] 
                            ? 'bg-green-500 text-white scale-100 font-black' 
                            : 'bg-[#D4AF37] text-black hover:bg-white active:scale-95 font-black'
                        }`}
                       >
                        {addedStatus[p.id] ? `✓ Added (x${currentQtyCount})` : `Add To Bag +`}
                       </button>

                    </div>

                  </div>

                  <div className="mt-3 sm:mt-6 px-1 text-left space-y-0.5 sm:space-y-2">
                     <p className="text-[6px] sm:text-[8px] font-black text-gray-500 tracking-[0.2em] sm:tracking-[0.3em] uppercase truncate">{p.spec}</p>
                     <h3 className={`text-xs sm:text-xl md:text-2xl font-black tracking-tighter uppercase truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{p.name}</h3>
                     <p className="text-xs sm:text-lg md:text-xl font-black text-[#D4AF37]">₹{(p.price * currentQtyCount).toLocaleString('en-IN')}</p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* HERITAGE / STATS */}
      <section className="mx-4 md:mx-6 py-20 md:py-32 bg-[#1A1A1A] rounded-[30px] md:rounded-[60px] text-[#F9F6F0] overflow-hidden shadow-2xl border border-white/5" aria-labelledby="infrastructure-title">
         <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8 md:space-y-10 text-left">
               <span className="text-[#D4AF37] text-[9px] font-black tracking-[0.6em] uppercase italic">Terabyte Systems</span>
               <h2 id="infrastructure-title" className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic uppercase text-white">Engineered for <br className="hidden md:block"/> Supremacy.</h2>
               <p className="text-gray-400 text-xs md:text-base leading-relaxed max-w-md font-medium">Precision industrial manufacturing aligned with lossless processing architectures. Every product delivers uncompromised standard.</p>
               <div className="pt-2">
                  <button onClick={() => { playPremiumBeep(); navigate('/contact'); }} className="border-b-2 border-[#D4AF37] text-[#D4AF37] pb-1 text-[9px] font-black tracking-widest uppercase hover:text-white transition-all cursor-pointer font-black">
                    Explore Infrastructure →
                  </button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
               {[{t:"HQ", l:"Bangalore Base"}, {t:"99%", l:"Precision"}, {t:"Labs", l:"OMR Tech Park"}, {t:"2026", l:"Deployment"}].map((s,i)=>(
                 <div key={i} className={`aspect-square rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105 ${i===3 ? 'bg-[#D4AF37] text-black shadow-xl font-black' : 'bg-white/5 border border-white/5 backdrop-blur-sm'}`}>
                   <p className="text-2xl md:text-4xl font-black italic">{s.t}</p>
                   <p className="text-[7px] md:text-[8px] font-black tracking-[0.2em] uppercase opacity-80 mt-1">{s.l}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* PERFORMANCE BAR SHOWCASE */}
      <section className={`py-20 md:py-32 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`} aria-labelledby="metrics-title">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
           <div className="text-center mb-16 md:mb-24">
              <h2 id="metrics-title" className={`text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Operational Metrics</h2>
              <p className="text-[#D4AF37] text-[8px] tracking-[0.4em] uppercase font-black">Industrial Load Output</p>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 md:space-y-10 order-2 lg:order-1 text-left">
                  {[{ t: "Spatial Logic", p: "98%" }, { t: "Acoustic Fidelity", p: "96%" }, { t: "Silicon Speed", p: "100%" }].map((spec, i) => (
                    <div key={i} className="group">
                       <div className="flex justify-between items-end mb-2">
                          <h3 className={`text-sm md:text-base font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{spec.t}</h3>
                          <span className="text-[#D4AF37] font-black text-xs tracking-widest">{spec.p}</span>
                       </div>
                       <div className={`h-[3px] w-full overflow-hidden rounded-full border ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                          <div className="h-full bg-[#D4AF37] transition-all duration-1000 ease-out rounded-full" style={{ width: spec.p }}></div>
                       </div>
                    </div>
                  ))}
              </div>
              <div className={`rounded-[30px] md:rounded-[50px] overflow-hidden shadow-xl h-[280px] md:h-[400px] order-1 lg:order-2 border ${isDarkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-[#F9F6F0] border-none'}`}>
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=1000" className="w-full h-full object-cover grayscale contrast-125 brightness-90 mix-blend-multiply p-2" alt="Infrastructure performance telemetry graphic" />
              </div>
           </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className={`py-20 md:py-32 relative overflow-hidden px-6 border-t border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-[#F9F6F0] border-gray-100'}`} aria-labelledby="newsletter-title">
         <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <div className="w-12 h-[3px] bg-[#D4AF37] mx-auto"></div>
            <h2 id="newsletter-title" className={`text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none ${isDarkMode ? 'text-white' : 'text-black'}`}>Partner with Terabyte.</h2>
            <p className="text-gray-500 text-xs md:text-sm font-bold tracking-widest max-w-lg mx-auto uppercase leading-relaxed">
              Join our elite network for priority prototype dispatches and early access to our custom builds.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center pt-4 w-full max-w-md mx-auto">
               <label htmlFor="startup-email-input" className="sr-only">Your Secure Email Address</label>
               <input 
                 id="startup-email-input"
                 type="email" 
                 value={newsletterEmail}
                 onChange={(e) => setNewsletterEmail(e.target.value)}
                 required
                 placeholder="NAME@STARTUP.IN" 
                 className={`border px-6 py-4 rounded-full text-[9px] font-black tracking-widest outline-none focus:border-[#D4AF37] flex-1 shadow-sm uppercase ${isDarkMode ? 'bg-black text-white border-white/10 placeholder:text-gray-600' : 'bg-white text-black border-gray-200 placeholder:text-gray-400'}`} 
               />
               <button 
                 type="submit"
                 aria-label="Join early access newsletter"
                 className="bg-[#D4AF37] text-black px-8 py-4 rounded-full text-[9px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-md active:scale-95 cursor-pointer font-black"
               >
                 Join Link
               </button>
            </form>
         </div>
         <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"></div>
      </section>
    </div>
  );
};

export default Home;
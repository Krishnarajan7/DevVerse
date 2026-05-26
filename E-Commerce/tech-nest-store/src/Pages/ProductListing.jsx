import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductListing = () => {
  const { addToCart, isDarkMode } = useCart();
  
  // --- DYNAMIC STATE ---
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showPopup, setShowPopup] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  const [addedStatus, setAddedStatus] = useState({});

  // --- FETCH FROM DATABASE ---
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchInventory = async () => {
      try {
        setLoading(true);
        // Backend API path check
        const res = await axios.get('http://localhost:5000/api/products');
        
        if (res.data.success) {
          // console.log("Vault Items Received:", res.data.data); // Debugging-kaga
          setDbProducts(res.data.data);
        }
      } catch (err) {
        console.error("Vault sync failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    addToCart({ ...product, quantity: 1 });
    setLastAdded(product.name);
    setShowPopup(true);
    
    setAddedStatus(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedStatus(prev => ({ ...prev, [product._id]: false })), 2500);
    setTimeout(() => setShowPopup(false), 3500);
  };

  // Filter logic (Excluding 'Work' category products)
  const filtered = dbProducts.filter(p => p.category !== "Work");
  
  let processedProducts = filtered.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortBy === "price-asc") processedProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") processedProducts.sort((a, b) => b.price - a.price);

  if (loading) return (
    <div className={`h-screen flex items-center justify-center font-black uppercase tracking-widest ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#F9F6F0] text-black'}`}>
      <p className="animate-pulse italic text-sm">Synchronizing Vault Inventory...</p>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#D4AF37] selection:text-white pb-32 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-[#F9F6F0]' : 'bg-[#F9F6F0] text-[#1A1A1A]'}`}>
      
      {/* Toast Notification */}
      {showPopup && (
        <div className="fixed bottom-6 md:bottom-10 right-4 md:right-10 z-[5000] bg-[#1A1A1A] text-[#F9F6F0] p-5 rounded-[25px] shadow-2xl flex items-center gap-6 border border-white/10 animate-slideUp">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center font-black text-black">✓</div>
             <div>
                <p className="text-[8px] font-black tracking-widest text-[#D4AF37] uppercase">Artifact Secured</p>
                <p className="text-sm font-black uppercase truncate max-w-[200px]">{lastAdded}</p>
             </div>
          </div>
          <Link to="/cart" className="bg-white text-black px-5 py-2 rounded-full text-[9px] font-black uppercase shadow-sm">View Bag →</Link>
        </div>
      )}

      {/* Cinematic Header */}
      <header className="bg-[#1A1A1A] text-[#F9F6F0] pt-24 md:pt-36 pb-16 px-6 rounded-b-[40px] md:rounded-b-[60px] shadow-2xl relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="text-left">
            <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase italic">Lossless Architecture</p>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic">Catalogue<span className="text-[#D4AF37] not-italic">.</span></h1>
          </div>
          <div className="border-l border-white/10 pl-6 text-left">
             <p className="text-[8px] font-black tracking-widest uppercase text-[#D4AF37]">Total Nodes</p>
             <p className="text-4xl font-black uppercase">{processedProducts.length}</p>
          </div>
        </div>
      </header>

      {/* Search & Tabs */}
      <section className="max-w-7xl mx-auto px-6 my-8">
        <div className={`p-4 rounded-[40px] flex flex-col lg:flex-row gap-4 items-center ${isDarkMode ? 'bg-[#1A1A1A] border border-white/10' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {["All", "Wearables", "Audio", "Mobile", "Vision", "Power"].map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === c ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-black'}`}>
                {c}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Search Artifacts..." 
            className="flex-1 bg-transparent px-6 py-3 outline-none text-[10px] font-black tracking-widest uppercase"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Inventory Grid */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
        {processedProducts.length > 0 ? (
          processedProducts.map(p => (
            <div key={p._id} className="group flex flex-col animate-slideUp">
              <div className={`relative aspect-[4/5] rounded-[50px] overflow-hidden flex flex-col items-center justify-center p-12 transition-all hover:-translate-y-2 hover:shadow-2xl ${isDarkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-gray-50'}`}>
                <div className="absolute top-8 right-8 bg-black text-[#D4AF37] px-4 py-2 rounded-full text-[8px] font-black uppercase italic z-20">{p.tag}</div>
                <Link to={`/product/${p._id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                  <img src={p.img} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4" />
                </Link>
                <div className="absolute inset-x-6 bottom-6 z-20">
                   <button 
                    onClick={(e) => handleAddToCart(e, p)} 
                    disabled={addedStatus[p._id]}
                    className={`w-full py-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${addedStatus[p._id] ? 'bg-green-500 text-white' : 'bg-[#D4AF37] text-black hover:bg-black hover:text-white shadow-xl'}`}
                   >
                     {addedStatus[p._id] ? '✓ Secured' : 'Add To Bag +'}
                   </button>
                </div>
              </div>
              <div className="mt-6 text-left px-2">
                 <p className="text-[8px] font-black text-gray-500 tracking-widest uppercase">{p.spec}</p>
                 <Link to={`/product/${p._id}`}>
                   <h2 className="text-2xl font-black uppercase tracking-tighter mt-1 hover:text-[#D4AF37] transition-colors cursor-pointer">{p.name}</h2>
                 </Link>
                 <p className="text-xl font-black text-[#D4AF37] mt-1">₹{p.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">No artifacts found in this sector.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductListing;
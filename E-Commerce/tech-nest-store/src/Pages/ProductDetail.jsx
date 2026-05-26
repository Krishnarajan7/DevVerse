import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios'; // Database-kaga axios add panniyachu

const ProductDetail = () => {
  const { id } = useParams(); // URL-la irundhu MongoDB _id varum
  const { addToCart, isDarkMode, toggleTheme } = useCart();
  const navigate = useNavigate();
  
  // --- DYNAMIC STATE ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('specs');

  // --- SYNC WITH BACKEND VAULT ---
 useEffect(() => {

  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  const fetchVaultData = async () => {
    try {
      setLoading(true);
      // Ippo backend-la namma '/api/products/:id' create panniyachu
      const res = await axios.get(`http://localhost:5000/api/products/${id}`); 
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (err) {
      console.error("Vault Telemetry Error");
    } finally {
      setLoading(false);
    }
  };
  fetchVaultData();
}, [id]);

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

  const handleToggleTheme = () => {
    playPremiumBeep();
    toggleTheme();
  };

  // --- LOADING INTERFACE ---
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-white text-black'}`}>
        <p className="text-[10px] font-black tracking-[0.5em] md:tracking-[1em] uppercase animate-pulse text-center">
          Accessing Arul Vault Telemetry...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Node Not Found</h2>
        <button onClick={() => navigate('/')} className="bg-[#D4AF37] text-black px-8 py-3 rounded-full font-black uppercase text-[10px]">Return to Archive</button>
      </div>
    );
  }

  const handleAdd = () => {
    playPremiumBeep();
    addToCart({ ...product, quantity: qty });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQty(1);
    }, 2000);
  };

  return (
    <div className={`min-h-screen font-sans antialiased pt-8 md:pt-16 pb-32 transition-colors duration-500 selection:bg-[#D4AF37] selection:text-white ${isDarkMode ? 'bg-[#121212] text-[#F9F6F0]' : 'bg-white text-black'}`}>
      
      {/* THEME SWITCHER */}
      <button onClick={handleToggleTheme} className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[4000] bg-[#D4AF37] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 cursor-pointer border border-white/20">
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8 flex items-center gap-4">
        <Link to="/" onClick={playPremiumBeep} className="text-[10px] font-black tracking-widest uppercase hover:text-[#D4AF37]">Archive</Link>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <span className="text-[10px] font-black tracking-widest uppercase text-[#D4AF37] italic">{product.category} Vector</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start text-left">
          
          {/* IMAGE ASSET */}
          <div className="relative group w-full animate-slideUp">
            <div className={`aspect-square rounded-[40px] flex items-center justify-center p-10 overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-[#F9F9F9] border-gray-50'}`}>
              <span className="absolute top-6 right-6 bg-black text-[#D4AF37] px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest z-10">{product.tag}</span>
              <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain transition-transform duration-[2s] group-hover:scale-110 p-4" />
              <span className="absolute bottom-6 left-6 text-[7px] font-black tracking-widest text-gray-500 uppercase z-10">Verification: {product._id?.slice(-8)}</span>
            </div>
          </div>

          {/* METADATA DASHBOARD */}
          <div className="space-y-12 animate-slideUp">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="bg-[#D4AF37] text-black px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic font-black">Arul Standards</span>
                <span className="text-[9px] font-black uppercase tracking-widest italic text-gray-500">Node ID: {product._id?.slice(-6)}</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">{product.name}</h1>
              <p className="text-3xl font-light italic text-[#D4AF37]">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            <p className="text-lg font-medium leading-relaxed opacity-70 max-w-lg">{product.spec}</p>

            {/* MULTIPLIER CONTROLLERS */}
            <div className={`space-y-10 pt-10 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="flex items-center gap-8">
                <div className={`flex items-center rounded-full p-2 border ${isDarkMode ? 'bg-black border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <button onClick={() => { playPremiumBeep(); setQty(q => Math.max(1, q - 1)); }} className="w-12 h-12 flex items-center justify-center text-lg font-bold hover:text-red-500">－</button>
                  <span className="w-12 text-center font-black text-base">{qty}</span>
                  <button onClick={() => { playPremiumBeep(); setQty(q => q + 1); }} className="w-12 h-12 flex items-center justify-center text-lg font-bold hover:text-green-500">＋</button>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Payload Multiplier</p>
                  <p className="text-[8px] font-bold text-[#D4AF37] tracking-widest uppercase">Total: ₹{(product.price * qty).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <button onClick={handleAdd} className={`w-full py-8 rounded-[40px] text-[11px] font-black tracking-[0.5em] uppercase transition-all duration-500 shadow-xl ${added ? 'bg-green-500 text-white' : 'bg-[#D4AF37] text-black hover:bg-white active:scale-95'}`}>
                {added ? `✓ Secured Payload (x${qty})` : `Add to Collection +`}
              </button>
            </div>

            {/* TABS VIEW */}
            <div className="pt-20">
              <div className="flex gap-12 border-b pb-6 mb-10 border-white/10">
                {['specs', 'shipping'].map(t => (
                  <button key={t} onClick={() => { playPremiumBeep(); setTab(t); }} className={`text-[9px] font-black tracking-[0.3em] uppercase transition-all ${tab === t ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-6' : 'text-gray-500'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="min-h-[120px]">
                {tab === 'specs' && (
                  <div className={`p-6 rounded-2xl border space-y-2 ${isDarkMode ? 'bg-black/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Vector Standard</p>
                    <p className="text-sm font-bold tracking-wide opacity-80">{product.spec || "Aerospace Grade Hardware."}</p>
                  </div>
                )}
                {tab === 'shipping' && (
                  <div className={`p-6 rounded-2xl border space-y-2 ${isDarkMode ? 'bg-black/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-[9px] font-black tracking-widest uppercase text-[#D4AF37]">Priority Air Dispatch</p>
                    <p className="text-sm font-bold text-gray-500 leading-relaxed">White-glove delivery service handled by elite logistics nodes. Insured transit directly from Bangalore Hub.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
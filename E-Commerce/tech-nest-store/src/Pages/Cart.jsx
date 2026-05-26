import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  // GLOBALIZED PULL: Fetching native shared active theme triggers directly from unified state aggregator
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart, cartTotal, isLoggedIn, user, isDarkMode, toggleTheme } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Payment & Verification States
  const [paymentMethod, setPaymentMethod] = useState('upi'); 
  const [upiStatus, setUpiStatus] = useState('idle'); 
  const [paymentScreenshot, setPaymentScreenshot] = useState(null); // Proof storage
  
  const [shippingData, setShippingData] = useState({ 
    phone: '', 
    address: '', 
    email: '',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 10) {
      setShippingData({ ...shippingData, phone: value });
    }
  };

// 1. Intha state-ai mela Cart component kulla add pannunga
const [screenshotUrl, setScreenshotUrl] = useState("");

// 2. Updated function
const handleScreenshotUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ecomerce"); 

  try {
    setIsProcessing(true);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dqkogm7lm/image/upload", 
      formData
    );

    const uploadedUrl = res.data.secure_url;
    setScreenshotUrl(uploadedUrl); // Ippo ithu error tharaathu ✓
    setPaymentScreenshot(uploadedUrl); 
    setIsProcessing(false);
    
    alert("🔥 Proof uploaded to Cloud successfully! ✓");
  } catch (err) {
    setIsProcessing(false);
    console.error("Upload Error:", err);
    alert("❌ Cloud upload failed!");
  }
};

  const handleVerifyUpi = () => {
    if (!shippingData.upiId || !shippingData.upiId.includes('@')) {
      alert("Please enter a valid UPI ID (e.g., arul@okaxis)");
      return;
    }
    playPremiumBeep();
    setUpiStatus('verifying');
    setTimeout(() => { setUpiStatus('verified'); }, 1200);
  };

  // --- STRICT AUTHENTICATION GATE ---
  const handleCheckoutClick = () => {
    playPremiumBeep();
    if (!isLoggedIn) {
      alert("🔒 Authorization Required: Please Sign In to process your transaction.");
      navigate('/auth');
      return;
    }
    if (user && user.email) {
      setShippingData(prev => ({ ...prev, email: user.email.toLowerCase() }));
    }
    setShowModal(true);
  };

  // --- PERSISTENT TRANSACTION DISPATCH (MONGODB + PROOF) ---
  const handleFinalOrder = async (e) => {
    e.preventDefault();
    playPremiumBeep();

    if (shippingData.phone.length !== 10) { 
      alert("Please enter a valid 10-digit mobile number."); 
      return; 
    }

    if (paymentMethod === 'upi') {
      if (upiStatus !== 'verified') {
        alert("Please verify your UPI ID to see the QR code.");
        return;
      }
      if (!paymentScreenshot) {
        alert("⚠️ Payment Proof Required: Please upload the screenshot of your GPay/PhonePe transaction.");
        return;
      }
    }

    setIsProcessing(true);

    const orderPayload = {
      architect: user?.name || "Arul",
      email: user?.email || shippingData.email,
      phone: shippingData.phone,
      address: shippingData.address,
      paymentSystem: paymentMethod,
      items: cart,
      total: cartTotal,
      proofAttached: paymentScreenshot ? "YES" : "NO"
    };

    try {
      const response = await axios.post('http://localhost:5000/api/checkout', orderPayload);
      if (response.data.success) {
        setIsProcessing(false);
        setShowModal(false);
        setOrderSuccess(true);
        clearCart();
        console.log("🔥 [MONGODB] Order Secured with Proof:", response.data.transactionId);
      }
    } catch (err) {
      setIsProcessing(false);
      alert("Database transmission dropped! Check if backend is running.");
    }
  };

  if (orderSuccess) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 text-center transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#F9F6F0] text-black'}`}>
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl animate-bounce mb-8 shadow-xl">✓</div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Order Dispatched!</h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-bold mt-4 max-w-md">
          Transaction verified via <span className="text-[#D4AF37] font-black">{paymentMethod.toUpperCase()}</span>. Proof received and stored in MongoDB.
        </p>
        <Link to="/products" className="bg-[#D4AF37] text-black px-12 py-5 rounded-full text-[10px] font-black uppercase mt-12 shadow-md active:scale-95">
          Return to Store
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 space-y-8 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#F9F6F0] text-black'}`}>
        <div className="text-6xl grayscale opacity-20">🛒</div>
        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">The archive is empty</p>
        <Link to="/products" className="bg-[#D4AF37] text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest">Browse Store</Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#D4AF37] selection:text-white pb-32 pt-28 md:pt-40 px-6 md:px-12 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-[#F9F6F0]' : 'bg-[#F9F6F0] text-[#1A1A1A]'}`}>
      
      <button onClick={handleToggleTheme} className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[4000] bg-[#D4AF37] text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black shadow-2xl border border-white/20">
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic mb-12 md:mb-20 text-left">My Cart<span className="text-[#D4AF37]">.</span></h1>
        
        <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 transition-all ${showModal ? 'blur-md scale-95 opacity-50 pointer-events-none' : ''}`}>
          
          <div className="flex-1 space-y-8 text-left">
            {cart.map((item) => (
              <div key={item.id} className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-10 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <img src={item.image || item.img} alt={item.name} className="w-32 h-32 object-contain rounded-[25px] p-4 bg-white shadow-sm" />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">{item.name}</h3>
                  <p className="text-xs font-black text-[#D4AF37] tracking-widest mt-2 mb-6">{formatINR(item.price)}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-6">
                    <div className="flex items-center gap-4 px-4 py-2 rounded-full border border-gray-200">
                      <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 font-black text-gray-500">－</button>
                      <span className="font-bold text-xs">{item.quantity}</span>
                      <button onClick={() => addToCart({ ...item, quantity: 1 })} className="w-6 h-6 font-black text-gray-500">＋</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[9px] font-black uppercase text-gray-500 hover:text-red-600 transition-colors">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="w-full lg:w-[400px]">
            <div className={`rounded-[40px] p-8 md:p-10 sticky top-32 border shadow-sm text-left ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'}`}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] border-b pb-4 mb-8 text-gray-500">Summary</h2>
              <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>{formatINR(cartTotal)}</span>
                  </div>
                  <div className={`flex justify-between text-2xl md:text-3xl font-black italic pt-4 border-t ${isDarkMode ? 'text-white border-white/10' : 'text-black border-gray-100'}`}>
                    <span>Total</span>
                    <span className="text-[#D4AF37]">{formatINR(cartTotal)}</span>
                  </div>
              </div>
              <button onClick={handleCheckoutClick} className="w-full bg-[#D4AF37] text-black py-6 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-md hover:bg-white transition-all font-black">Checkout Now →</button>
            </div>
          </aside>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[5000] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className={`w-full max-w-xl rounded-t-[40px] md:rounded-[40px] p-8 md:p-10 relative z-10 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto text-left ${isDarkMode ? 'bg-[#1A1A1A] text-white border border-white/10' : 'bg-white text-black'}`}>
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-6">Dispatch Node</h2>
            
            <form onSubmit={handleFinalOrder} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Architect</label>
                    <input type="text" value={user?.name || "Arul"} disabled className="w-full rounded-xl px-4 py-3 text-xs font-black uppercase bg-gray-100/10 text-gray-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Mobile Link</label>
                    <input type="text" required value={shippingData.phone} onChange={handlePhoneChange} className="w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#D4AF37] bg-transparent border-gray-500/20" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Destination Address</label>
                  <textarea required value={shippingData.address} onChange={(e) => setShippingData({...shippingData, address: e.target.value})} className="w-full border rounded-xl px-4 py-3 text-xs font-bold h-20 resize-none outline-none focus:border-[#D4AF37] bg-transparent border-gray-500/20" />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-gray-500/20">
                 <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 rounded-xl border border-gray-500/10`}>
                    {['upi', 'card', 'nb', 'cod'].map((m) => (
                      <button key={m} type="button" onClick={() => setPaymentMethod(m)} className={`py-2 text-[9px] font-black uppercase rounded-lg ${paymentMethod === m ? 'bg-[#D4AF37] text-black' : 'text-gray-500'}`}>{m.toUpperCase()}</button>
                    ))}
                 </div>

                 {/* --- REAL UPI WITH SCREENSHOT UPLOAD --- */}
                 {paymentMethod === 'upi' && (
                   <div className="space-y-4 animate-slideUp">
                     <div className="flex rounded-xl overflow-hidden border border-gray-500/20">
                       <input type="text" placeholder="arul@okaxis" value={shippingData.upiId} onChange={(e) => setShippingData({...shippingData, upiId: e.target.value.toLowerCase()})} className="w-full bg-transparent px-4 py-3 text-xs lowercase" />
                       <button type="button" onClick={handleVerifyUpi} className={`px-5 py-3 text-[9px] font-black uppercase ${upiStatus === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>{upiStatus === 'verified' ? '✓ Verified' : 'Verify'}</button>
                     </div>

                     {upiStatus === 'verified' && (
                       <div className="space-y-4">
                         <div className="p-6 bg-white rounded-[30px] flex flex-col items-center gap-4 border-2 border-[#D4AF37] shadow-xl">
                           <p className="text-[10px] font-black uppercase text-black">Scan & Pay {formatINR(cartTotal)}</p>
                           <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=arulprasaath64@okhdfcbank&pn=Arul%20Prasaath&am=${cartTotal}&cu=INR`} alt="GPay QR" className="w-40 h-40" />
                           <p className="text-[8px] font-black text-black">Merchant: Arul Prasaath</p>
                         </div>

                         {/* SCREENSHOT UPLOAD BOX */}
                         <div className={`p-4 rounded-2xl border-2 border-dashed ${isDarkMode ? 'border-white/10 bg-black/40' : 'border-gray-200 bg-gray-50'}`}>
                            <label className="text-[9px] font-black uppercase text-[#D4AF37] block mb-2 text-center tracking-widest">Step 2: Upload Proof of Transfer</label>
                            {!paymentScreenshot ? (
                              <div className="relative h-24 flex flex-col items-center justify-center">
                                <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <span className="text-xl">📸</span>
                                <span className="text-[7px] font-bold text-gray-500 uppercase mt-2">Click to select screenshot</span>
                              </div>
                            ) : (
                              <div className="relative">
                                <img src={paymentScreenshot} alt="Proof" className="w-full h-32 object-cover rounded-xl border border-[#D4AF37]" />
                                <button onClick={() => setPaymentScreenshot(null)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-[10px] font-black">✕</button>
                                <p className="text-[8px] text-green-500 font-black text-center mt-2 uppercase tracking-widest">Proof Attached Successfully ✓</p>
                              </div>
                            )}
                         </div>
                       </div>
                     )}
                   </div>
                 )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-500/20">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Abort</button>
                <button type="submit" disabled={isProcessing} className="flex-1 bg-[#D4AF37] text-black py-5 rounded-full text-[10px] font-black uppercase shadow-md active:scale-95 font-black">
                  {isProcessing ? 'Transmitting...' : `Authorize & Confirm`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
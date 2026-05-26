import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Profile = () => {
  const { user, logout, isLoggedIn } = useCart();
  const navigate = useNavigate();
  
  // States
  const [realOrders, setRealOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Details toggle-kaga

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn || !user) {
      navigate('/auth');
      return;
    }

    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        // User email vachi filter panni orders-ai edukkuroam
        const response = await axios.get(`http://localhost:5000/api/orders/${user.email}`);
        if (response.data.success) {
          setRealOrders(response.data.orders);
        }
      } catch (err) {
        console.error("Order Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [isLoggedIn, user, navigate]);

  // --- 1. DELETE LOGIC (CANCEL ORDER) ---
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("⚠️ Are you sure you want to cancel this order? It will be deleted from our records.")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
        if (res.data.success) {
          // Database-la delete aana udanae UI-la irundhum remove panroam
          setRealOrders(prev => prev.filter(ord => ord._id !== orderId));
          alert("Order permanently deleted from database.");
        }
      } catch (err) {
        alert("Failed to cancel order. Server error.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Toggle Details
  const toggleDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const userName = user?.name || "Architect";
  const userEmail = user?.email || "verified@terabyte.in";

  return (
    <div className="bg-[#F9F6F0] min-h-screen text-[#1A1A1A] pb-32">
      
      {/* --- HEADER --- */}
      <header className="bg-[#1A1A1A] text-[#F9F6F0] pt-24 pb-16 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black text-3xl uppercase border-2 border-white/20">
               {userName.charAt(0)}
             </div>
             <div className="text-left">
               <p className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase italic">Secure Node Profile</p>
               <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white">{userName}</h1>
               <p className="text-gray-400 text-sm font-bold">{userEmail}</p>
             </div>
          </div>
          <button onClick={handleLogout} className="bg-red-600/10 border border-red-600/30 text-red-500 px-8 py-3 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95">
            Log Out ⏏
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Nav Tabs */}
        <div className="lg:col-span-4">
           <div className="bg-white rounded-[30px] p-4 border border-gray-100 shadow-sm">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left p-4 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all ${activeTab === 'orders' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500'}`}
              >
                📦 Real-time Orders ({realOrders.length})
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full text-left p-4 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all mt-2 ${activeTab === 'security' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500'}`}
              >
                🔑 Account Security
              </button>
           </div>
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-8">
           <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm min-h-[400px] text-left">
              
              {activeTab === 'orders' && (
                <div className="animate-slideUp">
                   <h2 className="text-xl font-black uppercase italic text-black border-b pb-4 mb-6">Database History</h2>
                   
                   {loading ? (
                     <p className="text-gray-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">Accessing MongoDB Cluster...</p>
                   ) : realOrders.length > 0 ? (
                     <div className="space-y-4">
                        {realOrders.map((ord) => (
                          <div key={ord._id} className="rounded-3xl border border-gray-100 bg-gray-50/50 overflow-hidden">
                            {/* Order Main Row */}
                            <div className="p-6 flex justify-between items-center">
                              <div onClick={() => toggleDetails(ord._id)} className="cursor-pointer group">
                                <p className="text-[10px] font-black text-[#D4AF37] uppercase">{ord.transactionId}</p>
                                <p className="text-sm font-black text-black uppercase mt-1 group-hover:text-[#D4AF37] transition-colors">
                                  {expandedOrderId === ord._id ? "Close Details ✕" : "View Details ↓"}
                                </p>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="text-lg font-black text-black">₹{ord.totalAuthorized.toLocaleString()}</p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(ord.timestamp).toLocaleDateString()}</p>
                                </div>
                                <button 
                                  onClick={() => handleCancelOrder(ord._id)}
                                  className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            {/* --- EXPANDED DETAILS (DYNAMIC) --- */}
                            {expandedOrderId === ord._id && (
                              <div className="px-6 pb-6 pt-2 bg-white border-t border-gray-50 animate-slideDown">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                  <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Ordered Items</h4>
                                    {ord.items.map((item, i) => (
                                      <div key={i} className="flex justify-between text-xs font-bold border-b border-gray-50 pb-2 text-gray-700">
                                        <span>{item.name} (x{item.quantity})</span>
                                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Shipping Matrix</h4>
                                    <p className="text-xs font-bold text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">{ord.address}</p>
                                    {ord.screenshotUrl && (
                                      <a href={ord.screenshotUrl} target="_blank" rel="noreferrer" className="inline-block text-[9px] font-black bg-[#D4AF37] text-black px-4 py-2 rounded-full uppercase shadow-md hover:bg-black hover:text-white transition-all">
                                        View Payment Proof 👁️
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="p-16 border-2 border-dashed border-gray-100 rounded-[40px] text-center">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Zero transactions found in session</p>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="text-left animate-slideUp space-y-8">
                   <h2 className="text-xl font-black uppercase italic text-black border-b pb-4">Account Integrity</h2>
                   <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                         <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">Verified Identity Name</p>
                         <p className="text-sm font-black text-black uppercase mt-1">{userName}</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                         <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">Encrypted Network Email</p>
                         <p className="text-sm font-black text-black mt-1">{userEmail}</p>
                      </div>
                   </div>
                </div>
              )}

           </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
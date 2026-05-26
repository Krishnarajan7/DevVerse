import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart, isLoggedIn, user, logout, isDarkMode } = useCart();
  const [isOpen, setIsOpen] = useState(false); 

  // Strictly counts distinct array rows only
  const totalItems = cart.length;

  let displayUser = null;
  if (isLoggedIn) {
    displayUser = user;
    if (!displayUser || !displayUser.name) {
      const stored = localStorage.getItem("terabyte_registered_user");
      if (stored) {
        displayUser = JSON.parse(stored);
      }
    }
  }

  // --- CRITICAL FIX: BODY SCROLL LOCK ENGINE 🔥 ---
  // Menu open aagum bodhu background scroll aavadhai absolute-ah thadukkum
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Clean up function: component unmount aana scroll-ai normal aakkidum
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper trigger to toggle mobile drawer and instantly sync cross-tree visibility handlers
  const handleToggleMenu = (nextState) => {
    setIsOpen(nextState);
    window.dispatchEvent(new CustomEvent("terabyte_nav_toggle", { detail: { isOpen: nextState } }));
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[2000] backdrop-blur-md border-b px-6 md:px-12 py-3 md:py-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A]/95 border-white/10 text-white' : 'bg-white/95 border-gray-100 text-black'}`} aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="relative z-[2100] text-xl md:text-2xl font-black tracking-tighter text-inherit">
          TERABYTE<span className="text-[#D4AF37]">.</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-xs font-bold text-gray-500 hover:text-[#D4AF37] transition-colors uppercase tracking-widest">Home</Link>
          <Link to="/products" className="text-xs font-bold text-gray-500 hover:text-[#D4AF37] transition-colors uppercase tracking-widest">Explore</Link>
          
          {isLoggedIn && displayUser && displayUser.name ? (
            <Link 
              to="/profile" 
              className={`flex items-center gap-2 border px-4 py-2 rounded-full hover:border-[#D4AF37] transition-all group shadow-sm ${isDarkMode ? 'bg-black border-white/10' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="w-4 h-4 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-black text-[9px]">
                {displayUser.name.charAt(0).toUpperCase()}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest group-hover:text-[#D4AF37] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {displayUser.name}
              </span>
            </Link>
          ) : (
            <Link to="/auth" className={`text-xs font-bold border-b-2 uppercase tracking-widest ${isDarkMode ? 'text-white border-white' : 'text-black border-black'}`}>Sign In</Link>
          )}

          <Link to="/cart" aria-label={`Shopping Cart with ${totalItems} distinct items`} className="relative text-xl">
            🛒 
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black shadow-md">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE TOGGLE BUTTON */}
        <button 
          onClick={() => handleToggleMenu(!isOpen)} 
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className={`md:hidden relative z-[2200] p-2 text-xl ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* SLIDING SIDEBAR */}
        <div className={`fixed top-0 right-0 h-screen w-[75%] max-w-[280px] shadow-2xl z-[2150] flex flex-col pt-20 px-8 transition-all duration-500 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isDarkMode ? 'bg-[#1A1A1A] text-white border-l border-white/10' : 'bg-white text-black'}`}>
          
          <div className="flex flex-col text-left">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Shop</p>
            <Link to="/cart" onClick={() => handleToggleMenu(false)} className={`flex justify-between items-center py-3 border-b ${isDarkMode ? 'border-white/10 hover:text-[#D4AF37]' : 'border-gray-50 hover:text-[#D4AF37]'}`}>
              <span className="text-base font-black uppercase tracking-widest">My Cart</span>
              <span className="text-sm font-bold bg-[#D4AF37] text-black px-2 py-0.5 rounded-full font-black">{totalItems}</span>
            </Link>
            <Link to="/products" onClick={() => handleToggleMenu(false)} className={`block py-3 text-base font-black uppercase tracking-widest border-b ${isDarkMode ? 'border-white/10 hover:text-[#D4AF37]' : 'border-gray-50 hover:text-[#D4AF37]'}`}>
              Explore
            </Link>

            <div className="mt-6">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Menu</p>
              <Link to="/" onClick={() => handleToggleMenu(false)} className={`block py-3 text-base font-black uppercase tracking-widest border-b ${isDarkMode ? 'border-white/10 hover:text-[#D4AF37]' : 'border-gray-50 hover:text-[#D4AF37]'}`}>
                Home
              </Link>
            </div>

            <div className="mt-6">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Account</p>
               {isLoggedIn && displayUser && displayUser.name ? (
                 <div className="space-y-2 pt-1">
                   <Link to="/profile" onClick={() => handleToggleMenu(false)} className="flex items-center justify-between py-2 text-base font-black uppercase tracking-widest hover:text-[#D4AF37]">
                     <span>⚙ {displayUser.name}</span>
                   </Link>
                   <button onClick={() => { logout(); handleToggleMenu(false); }} className={`w-full text-left py-3 text-xs font-black text-red-500 uppercase tracking-widest border-t ${isDarkMode ? 'border-white/10' : 'border-gray-50'}`}>
                    Sign Out
                   </button>
                 </div>
               ) : (
                 <Link to="/auth" onClick={() => handleToggleMenu(false)} className="block py-3 text-base font-black uppercase tracking-widest hover:text-[#D4AF37]">
                   Sign In
                 </Link>
               )}
            </div>
          </div>
        </div>

        {/* BACKDROP OVERLAY */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2100] md:hidden" onClick={() => handleToggleMenu(false)} />
        )}

      </div>
    </nav>
  );
};

export default Navbar;
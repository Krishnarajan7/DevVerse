import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios'; // 1. Axios Import Panniyachu

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, isDarkMode } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'email' ? value.toLowerCase() : value 
    });
  };

  const handleSubmit = async (e) => { // 2. Async function-ah mathiyachu
    e.preventDefault();
    playPremiumBeep();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    const normalizedEmail = formData.email.toLowerCase().trim();

    // --- SIGN UP LOGIC (MongoDB Integration) ---
    if (!isLogin) {
      if (!formData.name.trim()) {
        alert("Please enter your name.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const userData = {
        name: formData.name.trim(),
        email: normalizedEmail,
        password: formData.password
      };

      try {
        // BACKEND API CALL
        const response = await axios.post('http://localhost:5000/api/auth/register', userData);
        
        if (response.data.success) {
          alert("Account created successfully in MongoDB! Now please Log In.");
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          setIsLogin(true);
        }
      } catch (err) {
        console.error("Signup Error:", err);
        alert(err.response?.data?.message || "Database connection failed. Is your backend running on Port 5000?");
      }
      return;
    }

    // --- LOGIN LOGIC (MongoDB Verification) ---
    if (isLogin) {
      const loginData = {
        email: normalizedEmail,
        password: formData.password
      };

      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
        
        if (response.data.success) {
          login({ name: response.data.user.name, email: response.data.user.email });
          alert(`Welcome back, ${response.data.user.name}!`);
          navigate('/products');
        }
      } catch (err) {
        console.error("Login Error:", err);
        alert(err.response?.data?.message || "Invalid credentials or Server Offline.");
      }
    }
  };

  return (
    <div className={`min-h-[80vh] flex flex-col items-center justify-center py-20 px-6 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F9F6F0]'}`}>
      <div className="w-full max-w-md animate-slideUp">
        
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-black italic tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {isLogin ? 'Welcome Back' : 'Join Terabyte'}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mt-2">
            {isLogin ? 'Identity Verification' : 'New Architecture Setup'}
          </p>
        </div>

        <div className={`border p-8 md:p-10 rounded-[30px] shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-100'}`}>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                <input 
                  type="text" name="name" placeholder="Arul" 
                  value={formData.name} onChange={handleInputChange}
                  className={`w-full border rounded-2xl px-6 py-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50 text-black border-gray-100 focus:border-black'}`}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Email Address</label>
              <input 
                type="email" name="email" placeholder="name@example.com" 
                value={formData.email} onChange={handleInputChange}
                className={`w-full border rounded-2xl px-6 py-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50 text-black border-gray-100 focus:border-black'}`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Password</label>
              <input 
                type="password" name="password" placeholder="••••••••" 
                value={formData.password} onChange={handleInputChange}
                className={`w-full border rounded-2xl px-6 py-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50 text-black border-gray-100 focus:border-black'}`}
              />
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Confirm Password</label>
                <input 
                  type="password" name="confirmPassword" placeholder="••••••••" 
                  value={formData.confirmPassword} onChange={handleInputChange}
                  className={`w-full border rounded-2xl px-6 py-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-black text-white border-white/10 focus:border-[#D4AF37]' : 'bg-gray-50 text-black border-gray-100 focus:border-black'}`}
                />
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-widest mt-6 transition-all active:scale-95 ${isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black'}`}
            >
              {isLogin ? 'Verify Identity' : 'Authorize & Store'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100/10">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[9px] font-black uppercase text-gray-500 hover:text-[#D4AF37] transition-colors underline underline-offset-8"
            >
              {isLogin ? "Need a new profile? Sign Up" : "Back to Verification? Log In"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
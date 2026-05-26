import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Smooth scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Premium Auditory Feedback (Subtle startup click sound)
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
    } catch (err) {
      // Ignored safely if blocked
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    playPremiumBeep();
    setIsSubmitting(true);

    // Simulate fast support response
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  return (
    <div className="bg-[#F9F6F0] min-h-screen text-[#1A1A1A] font-sans antialiased selection:bg-[#D4AF37] selection:text-white pb-32">
      
      {/* --- RESPONSIVE SUCCESS TOAST --- */}
      {showToast && (
        <div className="fixed bottom-6 md:bottom-10 left-4 right-4 md:left-auto md:right-10 z-[5000] 
                        bg-[#1A1A1A] text-[#F9F6F0] p-4 md:p-5 rounded-[20px] md:rounded-[25px] 
                        shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between gap-6 
                        border border-white/10 animate-slideUp">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center font-black text-white text-xs md:text-base">✓</div>
             <div className="overflow-hidden">
                <p className="text-[7px] md:text-[8px] font-black tracking-[0.3em] text-[#D4AF37] uppercase">Support Ticket</p>
                <p className="text-xs md:text-sm font-black uppercase tracking-tight truncate max-w-[140px] md:max-w-[220px]">Message Sent!</p>
             </div>
          </div>
          <span className="text-[9px] font-black tracking-widest text-gray-400 uppercase pr-2">Terabyte Support</span>
        </div>
      )}

      {/* --- STARTUP HEADER --- */}
      <header className="bg-[#1A1A1A] text-[#F9F6F0] pt-24 md:pt-36 pb-16 md:pb-24 px-6 border-b border-white/10 relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-2xl">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <p className="text-[#D4AF37] text-[9px] md:text-[10px] font-black tracking-[0.6em] uppercase italic">Customer Success</p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none">
              Get in touch<span className="text-[#D4AF37] not-italic">.</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide leading-relaxed pt-2">
              Have a question about our premium electronics or need help with your order? Our support team is always here for you.
            </p>
          </div>

          <div className="flex gap-6 border-t border-white/10 md:border-t-0 pt-6 md:pt-0 w-full md:w-auto justify-start md:justify-end">
            <div className="border-l border-white/10 pl-4 text-left">
               <p className="text-[8px] font-black tracking-[0.3em] uppercase text-[#D4AF37]">Avg Response Time</p>
               <p className="text-xl font-black uppercase tracking-tight">&lt; 2 Hours</p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"></div>
      </header>

      {/* --- MAIN CONTACT DASHBOARD --- */}
      <main className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
        
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-12 text-left">
           <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-black mb-4">Our Workspaces</h2>
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase leading-relaxed">
                Designed in Bangalore. Crafted for tech enthusiasts everywhere.
              </p>
           </div>

           <div className="space-y-6">
              {[{ c: "Terabyte HQ", addr: "Indiranagar, 100ft Road, Bangalore", tag: "Design Studio" },
                { c: "Support Desk", addr: "OMR Tech Park, Phase 2, Chennai", tag: "Customer Success" }].map((node, i) => (
                 <div key={i} className="p-6 bg-white rounded-[25px] border border-gray-100 shadow-sm space-y-2 group transition-all hover:border-black">
                    <div className="flex justify-between items-center">
                       <h4 className="text-sm font-black uppercase tracking-tight text-black group-hover:text-[#D4AF37] transition-colors">{node.c}</h4>
                       <span className="text-[7px] font-black bg-gray-50 px-2 py-1 rounded text-[#D4AF37] tracking-widest uppercase">{node.tag}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{node.addr}</p>
                 </div>
              ))}
           </div>

           <div className="p-8 bg-[#1A1A1A] text-white rounded-[30px] space-y-4 shadow-xl">
              <p className="text-[#D4AF37] text-[8px] font-black tracking-[0.4em] uppercase">Direct Inquiries</p>
              <p className="text-xs leading-relaxed text-gray-300 font-medium">
                Want to partner with us, request custom enterprise bulk orders, or join our fast-growing startup team?
              </p>
              <p className="text-lg font-black tracking-widest text-white uppercase italic pt-2">hello@terabyte.in</p>
           </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
           <div className="bg-white rounded-[40px] md:rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-sm">
              <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-black mb-8 text-left">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                    <input 
                      type="text" required name="name" placeholder="Arul" 
                      value={formData.name} onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black uppercase tracking-widest"
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input 
                      type="email" required name="email" placeholder="arul@example.com" 
                      value={formData.email} onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black"
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">How Can We Help?</label>
                    <select 
                      name="subject" required value={formData.subject} onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-black transition-all text-black cursor-pointer"
                    >
                       <option value="" disabled>SELECT A REASON</option>
                       <option value="product-query">Product Inquiry</option>
                       <option value="order-status">Order Status & Shipping</option>
                       <option value="warranty">Warranty Claim</option>
                       <option value="feedback">General Feedback</option>
                    </select>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                    <textarea 
                      required name="message" rows="5" placeholder="Write your question or feedback here..." 
                      value={formData.message} onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-black transition-all text-black resize-none"
                    ></textarea>
                 </div>

                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-md ${
                     isSubmitting 
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                       : 'bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black active:scale-95'
                   }`}
                 >
                   {isSubmitting ? 'Sending Message...' : 'Send Message →'}
                 </button>
              </form>
           </div>
        </div>

      </main>

    </div>
  );
};

export default Contact;
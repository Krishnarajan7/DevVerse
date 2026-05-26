import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

// FOLDER NAMES-AI CAPITAL 'P' KU MATHI IRUKKAEN
import Home from './Pages/Home';
import ProductListing from './Pages/ProductListing';
import ProductDetail from './Pages/ProductDetail';
import Cart from './Pages/Cart';
import Auth from './Pages/Auth';
import Contact from './Pages/Contact';
import Profile from './Pages/Profile';
import Footer from './components/Footer';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white selection:bg-tnGreen selection:text-white flex flex-col">
        
          <Navbar />

        
          <main className="flex-grow pt-20 md:pt-28">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
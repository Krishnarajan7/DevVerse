import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // --- 1. PERSISTENT CART ENGINE ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("terabyte_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("terabyte_cart", JSON.stringify(cart));
  }, [cart]);

  // --- 2. GLOBAL THEME ENGINE ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("terabyte_theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      localStorage.setItem("terabyte_theme", nextTheme ? "dark" : "light");
      return nextTheme;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F9F6F0';
    }
  }, [isDarkMode]);

  // --- 3. PERSISTENT AUTH ENGINE (No More Default Identity) ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("terabyte_user");
    // Memory-la enna data irukko adhai thaan refresh-kku appram load pannum
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("terabyte_user") ? true : false;
  });

  // Auth Functions
  const login = (userData) => {
    if (userData) {
      // Backend-la irundhu vara real data-vai (e.g. Praveen) memory-la lock panroam
      localStorage.setItem("terabyte_user", JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("terabyte_user");
    setIsLoggedIn(false);
    setUser(null);
  };

  // --- 4. CART LOGIC ---
  const addToCart = (product) => {
    setCart((prev) => {
      const isItemInCart = prev.find((item) => item.id === product.id);
      const incomingQty = product.quantity || 1;
      if (isItemInCart) {
        return prev.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + incomingQty } 
            : item
        );
      }
      return [...prev, { ...product, quantity: incomingQty }];
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("terabyte_cart");
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        decreaseQuantity, 
        removeFromCart, 
        clearCart, 
        cartTotal,
        isLoggedIn,
        user,
        login,
        logout,
        isDarkMode,
        toggleTheme
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
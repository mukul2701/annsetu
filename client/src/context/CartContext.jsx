import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('annsetu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('annsetu_cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, quantity = 10) {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        );
      }
      return [...prev, { ...product, quantity: Number(quantity) }];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item._id === productId ? { ...item, quantity: Number(quantity) } : item))
    );
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item._id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
  const retailEstimate = cart.reduce((sum, item) => sum + ((item.retailBenchmark || (item.pricePerUnit * 1.35)) * item.quantity), 0);
  const totalSavings = Math.max(0, retailEstimate - subtotal);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        retailEstimate,
        totalSavings,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

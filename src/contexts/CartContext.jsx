import { useState, useEffect, createContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('guestCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("%cERRROR|%c Couldn't reading cart in localstorage.", "color: rgb(255, 60, 0)", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    } catch (error) {
      console.error("%cERROR|%c Couldn't save the cart in localstorage.", "color: rgb(255, 60, 0)", error);
    }
  }, [cart]);

  const addItem = (newItem) => {
    setCart(prev => {
      const exists = prev.some(item => item.id === newItem.id);
      
      if (exists) {
        return prev.map(item =>
          item.product === newItem.id
            ? { ...item, amount: (item.amount || 1) + (newItem.amount || 1) }
            : item
        );
      }
      
      // Si es un item nuevo, lo agregamos
      return [...prev, newItem];
    });
  };

  // Eliminar un item
  const quitItem = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  // Cambiar cantidad de forma inmutable
  const changeAmount = (itemId, newAmount) => {
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, amount: newAmount } // Creamos un nuevo objeto
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, quitItem, addItem, changeAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
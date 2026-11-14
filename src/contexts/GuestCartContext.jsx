import { useState, useEffect, createContext } from "react";

const GuestCartContext = createContext();

export function GuestCartProvider({ children }) {
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
    if (newItem?.productId || newItem?.listId) {
      const hasList = Boolean(newItem?.listId)
      setCart(prev => {
        const exists = prev.some(item => hasList? item.listId === newItem.listId : item.productId === newItem.productId);
        
        if (exists) {
          return prev.map(item =>
            (hasList? item.listId === newItem.listId : item.productId === newItem.productId)
              ? { ...item, amount: (item.amount || 1) + (newItem.amount || 1) }
              : item
          );
        }
        
        return [...prev, newItem];
      });
    }
  };

  const quitItem = (itemId) => {
    setCart(prev => prev.filter(item => item.itemId !== itemId));
  };

  const changeAmount = (itemId, newAmount) => {
    setCart(prev =>
      prev.map(item =>
        item.itemId === itemId
          ? { ...item, amount: newAmount } // Creamos un nuevo objeto
          : item
      )
    );
  };

  return (
    <GuestCartContext.Provider value={{ guestCart: cart, quitItem, addItem, changeAmount }}>
      {children}
    </GuestCartContext.Provider>
  );
}

export default GuestCartContext;
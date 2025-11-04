"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Cart, CartItem, Product } from '@/types/product';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const productId = (product as any)._id || (product as any).id;
      const existingItem = state.items.find(item => {
        const itemId = (item.product as any)._id || (item.product as any).id;
        return itemId === productId;
      });
      
      if (existingItem) {
        const updatedItems = state.items.map(item => {
          const itemId = (item.product as any)._id || (item.product as any).id;
          return itemId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
        return calculateCartTotals(updatedItems);
      } else {
        const newItems = [...state.items, { product, quantity }];
        return calculateCartTotals(newItems);
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => {
        const itemId = (item.product as any)._id || (item.product as any).id;
        return itemId !== action.payload.productId;
      });
      return calculateCartTotals(updatedItems);
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        const updatedItems = state.items.filter(item => {
          const itemId = (item.product as any)._id || (item.product as any).id;
          return itemId !== productId;
        });
        return calculateCartTotals(updatedItems);
      } else {
        const updatedItems = state.items.map(item => {
          const itemId = (item.product as any)._id || (item.product as any).id;
          return itemId === productId
            ? { ...item, quantity }
            : item;
        });
        return calculateCartTotals(updatedItems);
      }
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
};

const calculateCartTotals = (items: CartItem[]): CartState => {
  const total = items.reduce((sum, item) => {
    // Support both Sanity (product.price) and Stripe (product.price.unit_amount) formats
    let price: number;
    if (typeof item.product.price === 'number') {
      price = item.product.price;
    } else if ((item.product.price as any)?.unit_amount) {
      price = (item.product.price as any).unit_amount / 100; // Stripe uses cents
    } else {
      price = 0;
    }
    return sum + (price * item.quantity);
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, total, itemCount };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => {
      const itemId = (item.product as any)._id || (item.product as any).id;
      return itemId === productId;
    });
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

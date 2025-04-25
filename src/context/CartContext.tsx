import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };

    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load cart items when user changes
  useEffect(() => {
    const loadCartItems = async () => {
      if (!userId) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_cart')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;

        setCartItems(data?.map(item => ({
          id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })) || []);
      } catch (error) {
        console.error('Error loading cart items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, [userId]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    if (!userId) {
      // If user is not logged in, redirect to login
      window.location.href = '/auth';
      return;
    }

    try {
      const { data: existingItem, error: fetchError } = await supabase
        .from('user_cart')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', item.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingItem) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
          .from('user_cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('user_id', userId)
          .eq('product_id', item.id);

        if (updateError) throw updateError;
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('user_cart')
          .insert([{
            user_id: userId,
            product_id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
          }]);

        if (insertError) throw insertError;
      }

      // Update local state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          return prevItems.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return [...prevItems, { ...item, quantity: 1 }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_cart')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', id);

      if (error) throw error;

      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!userId) return;

    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_cart')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', id);

      if (error) throw error;

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_cart')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
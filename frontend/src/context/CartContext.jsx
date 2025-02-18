import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: Math.min(i.qty + (action.qty || 1), i.stock) } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: action.qty || 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'LOAD':
      return { ...state, items: action.items };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, qty = 1) => {
    dispatch({ type: 'ADD_ITEM', item: product, qty });
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const subtotal = state.items.reduce((sum, i) => sum + (i.sale_price || i.price) * i.qty, 0);
  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
  const shipping = subtotal >= 3000 ? 0 : 300;

  return (
    <CartContext.Provider value={{
      items: state.items, addToCart, removeFromCart, updateQty, clearCart,
      subtotal, totalItems, shipping,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

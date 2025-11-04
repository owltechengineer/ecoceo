"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

const CartIcon = () => {
  const { state } = useCart();

  return (
    <Link
      href="/shop/cart"
      className="relative inline-flex items-center justify-center p-2 text-white hover:text-blue-300 transition-colors"
    >
      <FontAwesomeIcon icon={faCartShopping} className="w-6 h-6" />
      
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;

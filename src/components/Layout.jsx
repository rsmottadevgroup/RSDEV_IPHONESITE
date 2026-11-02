import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchModal from './SearchModal';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import { useCart } from '../context/CartContext';
import './Layout.css';

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isCartOpen, openCart, closeCart } = useCart();
  const [navigationVisible, setNavigationVisible] = useState(true);
  const previousScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 8) {
        setNavigationVisible(true);
      } else if (currentScrollY > previousScrollY.current + 2) {
        setNavigationVisible(false);
      }

      previousScrollY.current = currentScrollY;
    };

    previousScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="layout">
      <Sidebar 
        onSearchOpen={() => setSearchOpen(true)} 
        onCartOpen={openCart} 
        navigationVisible={navigationVisible}
        onNavigationReveal={() => setNavigationVisible(true)}
      />
      <main className="main-content">
        <Outlet />
        <Footer />
      </main>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}

import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Smartphone, ShoppingBag, Settings, Tag,
  Menu, X, Sun, Moon, ChevronRight
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/produtos', icon: Smartphone, label: 'Produtos' },
  { path: '/ofertas', icon: Tag, label: 'Ofertas' },
  { path: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function Sidebar({ onSearchOpen, onCartOpen, navigationVisible, onNavigationReveal }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const dragStartX = useRef(null);
  const { totalItems, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!navigationVisible) {
      setMobileOpen(false);
    }
  }, [navigationVisible]);

  const revealNavigation = () => {
    if (window.innerWidth <= 900) {
      setMobileOpen(true);
    }
    onNavigationReveal();
  };

  return (
    <>
      <button 
        className={`mobile-menu-btn ${navigationVisible ? '' : 'is-hidden'}`}
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        aria-hidden={!navigationVisible}
        tabIndex={navigationVisible ? 0 : -1}
      >
        <Menu size={22} />
      </button>

      {!navigationVisible && (
        <button
          className="navigation-reveal-btn"
          onClick={revealNavigation}
          onPointerDown={(event) => {
            dragStartX.current = event.clientX;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={(event) => {
            if (dragStartX.current !== null && event.clientX - dragStartX.current > 20) {
              revealNavigation();
            }
            dragStartX.current = null;
          }}
          aria-label="Mostrar navegação"
          title="Mostrar navegação"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''} ${navigationVisible ? '' : 'is-hidden'}`}>
        <div className="sidebar-inner">
          <div className="sidebar-logo">
            <button className="logo-icon" onClick={() => setVideoOpen(true)} aria-label="Assistir vídeo do iPhone">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 16.99 2.93997 12.44 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.1 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
            </button>
            <button className="close-mobile" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={path === '/'}
              >
                <span className="nav-icon"><Icon size={20} strokeWidth={1.6} /></span>
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
            <button className="nav-item cart-nav-item" onClick={onCartOpen || openCart} aria-label={`Abrir carrinho (${totalItems} itens)`}>
              <span className="nav-icon"><ShoppingBag size={20} strokeWidth={1.6} /></span>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              <span className="nav-label">Carrinho</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="theme-toggle">
              <Sun size={14} strokeWidth={1.5} />
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
              <Moon size={14} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </aside>
      {videoOpen && (
        <div className="iphone-video-overlay" onClick={() => setVideoOpen(false)}>
          <div className="iphone-video-dialog" role="dialog" aria-modal="true" aria-label="Vídeo do iPhone" onClick={event => event.stopPropagation()}>
            <button className="iphone-video-close" onClick={() => setVideoOpen(false)} aria-label="Fechar vídeo">
              <X size={22} />
            </button>
            <video src="/videoiphone.mp4" controls autoPlay playsInline />
          </div>
        </div>
      )}
    </>
  );
}

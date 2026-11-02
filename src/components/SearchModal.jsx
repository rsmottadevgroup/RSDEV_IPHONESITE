import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import './SearchModal.css';

export default function SearchModal({ isOpen, onClose }) {
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim().length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.color.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal glass" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <Search size={22} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar produtos, categorias..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="search-close">
            <X size={22} />
          </button>
        </div>

        {results.length > 0 && (
          <div className="search-results">
            {results.map(product => (
              <Link
                key={product.id}
                to={`/produto/${product.id}`}
                className="search-result-item"
                onClick={onClose}
              >
                <img src={product.image} alt={product.name} />
                <div className="result-info">
                  <span className="result-name">{product.name}</span>
                  <span className="result-meta">{product.category} · {product.storage}</span>
                </div>
                <span className="result-price">{formatPrice(product.price)}</span>
              </Link>
            ))}
          </div>
        )}

        {query.trim().length > 1 && results.length === 0 && (
          <div className="search-empty">
            <p>Nenhum produto encontrado para “{query}”</p>
          </div>
        )}

        {query.trim().length <= 1 && (
          <div className="search-suggestions">
            <p className="suggestions-title">Sugestões</p>
            <div className="suggestion-tags">
              {['iPhone 16', 'MacBook', 'AirPods', 'Apple Watch', 'iPad Pro'].map(tag => (
                <button key={tag} onClick={() => setQuery(tag)} className="suggestion-tag">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

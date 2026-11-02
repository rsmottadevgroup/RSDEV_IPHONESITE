import { Link } from 'react-router-dom';
import { Eye, ShoppingBag } from 'lucide-react';
import { formatPrice, calculateInstallment } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/produto/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.discount > 0 && (
          <span className="product-badge">-{product.discount}%</span>
        )}
        {product.new && <span className="product-badge new">Novo</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="product-card-actions">
          <button className="card-action-btn" title="Ver detalhes">
            <Eye size={18} />
          </button>
          <button className="card-action-btn" onClick={handleAdd} title="Adicionar ao carrinho">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-meta">{product.storage} · {product.color}</p>
        <div className="product-pricing">
          {product.originalPrice > product.price && (
            <span className="product-original">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <p className="product-installment">
          12x de {calculateInstallment(product.price)} sem juros
        </p>
        <span className={`product-stock ${product.availability === 'Em estoque' ? 'in' : 'out'}`}>
          {product.availability}
        </span>
      </div>
    </Link>
  );
}

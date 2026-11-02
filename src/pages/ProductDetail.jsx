import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check, Star } from 'lucide-react';
import { formatPrice, calculateInstallment } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find(p => String(p.id) === id);
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product?.color || '');
  const [selectedStorage, setSelectedStorage] = useState(product?.storage || '');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 className="serif">Produto não encontrado</h2>
        <Link to="/produtos" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product, { color: selectedColor, storage: selectedStorage });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/produtos" className="back-link">
          <ArrowLeft size={18} /> Voltar aos produtos
        </Link>

        <div className="detail-grid">
          <div className="detail-gallery">
            <div className="main-image">
              <img src={product.images[activeImage] || product.image} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${activeImage === i ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <span className="detail-category sans">{product.category}</span>
            <h1 className="serif">{product.name}</h1>
            <div className="detail-rating">
              <Star size={16} fill="var(--orange-vibrant)" color="var(--orange-vibrant)" />
              <span>{product.rating}</span>
              <span className="reviews">({product.reviews} avaliações)</span>
            </div>

            <div className="detail-pricing">
              {product.originalPrice > product.price && (
                <span className="original">{formatPrice(product.originalPrice)}</span>
              )}
              <span className="price">{formatPrice(product.price)}</span>
              <p className="installment">12x de {calculateInstallment(product.price)} sem juros</p>
            </div>

            <p className="detail-desc">{product.description}</p>

            {product.colors && product.colors.length > 1 && (
              <div className="option-group">
                <h4>Cor — <span>{selectedColor}</span></h4>
                <div className="option-chips">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      className={`option-chip ${selectedColor === c ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.storages && product.storages[0] !== '-' && (
              <div className="option-group">
                <h4>Armazenamento</h4>
                <div className="option-chips">
                  {product.storages.map(s => (
                    <button
                      key={s}
                      className={`option-chip ${selectedStorage === s ? 'active' : ''}`}
                      onClick={() => setSelectedStorage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className={`stock ${product.availability === 'Em estoque' ? 'in' : ''}`}>
              {product.availability}
            </p>

            <button className={`btn btn-primary add-btn ${added ? 'added' : ''}`} onClick={handleAdd}>
              {added ? <><Check size={18} /> Adicionado</> : <><ShoppingBag size={18} /> Adicionar ao carrinho</>}
            </button>

            <div className="specs-section">
              <h3 className="serif">Especificações</h3>
              <dl className="specs-list">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="spec-row">
                    <dt>{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related-section">
            <h2 className="serif">Produtos relacionados</h2>
            <div className="products-grid related-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

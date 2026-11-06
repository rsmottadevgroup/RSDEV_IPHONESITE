import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categories as initialCategories, formatPrice } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const { products } = useProducts();
  const categories = initialCategories.map(category => ({
    ...category,
    count: products.filter(product => product.category === category.name).length
  }));
  const featured = products.filter(p => p.featured).slice(0, 4);
  const launches = products.filter(p => p.new).slice(0, 3);
  const offers = products.filter(p => p.discount >= 8).slice(0, 4);

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-gradient" />
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-brand sans">APPLE</span>
            <h1 className="hero-title serif">
              iPhone
            </h1>
            <p className="hero-subtitle sans">
              DESIGN QUE<br />INSPIRA
            </p>
            <p className="hero-desc">
              Tecnologia de ponta,<br />em cada detalhe.
            </p>
            <Link to="/produtos" className="btn btn-outline hero-cta">
              Conheça mais <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="hero-pagination sans">
          <span className="active">01</span>
          <span className="line" />
          <span>03</span>
        </div>

        <button className="hero-menu-btn" aria-label="logo power">
          <img src="/rsmottavert.png" alt="PowerCell" />
        </button>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-label sans">Seleção Editorial</span>
              <h2 className="section-title serif">Produtos em Destaque</h2>
            </div>
            <Link to="/produtos" className="btn btn-ghost">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header center">
            <span className="section-label sans">Explore</span>
            <h2 className="section-title serif">Categorias Populares</h2>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/produtos?categoria=${cat.name}`} className="category-card">
                <div className="category-image">
                  <img src={cat.image} alt={cat.name} />
                  <div className="category-overlay" />
                </div>
                <div className="category-info">
                  <h3 className="serif">{cat.name}</h3>
                  <p>{cat.count} produtos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Launches Banner */}
      <section className="section launches-section">
        <div className="container">
          <div className="launches-banner glass">
            <div className="launches-text">
              <Sparkles size={24} className="launches-icon" />
              <span className="section-label sans">Lançamentos</span>
              <h2 className="serif">O futuro chegou</h2>
              <p>Descubra os produtos mais recentes da linha Apple com tecnologia de ponta e design inconfundível.</p>
              <Link to="/produtos?novo=true" className="btn btn-primary">
                Ver lançamentos <ArrowRight size={16} />
              </Link>
            </div>
            <div className="launches-products">
              {launches.map(p => (
                <Link key={p.id} to={`/produto/${p.id}`} className="launch-item">
                  <img src={p.image} alt={p.name} />
                  <div>
                    <h4>{p.name}</h4>
                    <span>{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="section offers-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-label sans">Oportunidades</span>
              <h2 className="section-title serif">Ofertas Especiais</h2>
            </div>
            <Link to="/ofertas" className="btn btn-ghost">
              Todas as ofertas <ArrowRight size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {offers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section promo-section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-content">
              <span className="sans">EXCLUSIVO</span>
              <h2 className="serif">Troque e ganhe</h2>
              <p>Traga seu dispositivo antigo e receba crédito na compra de um novo iPhone ou MacBook.</p>
              <Link to="/contato" className="btn btn-primary">Saiba mais</Link>
            </div>
            <div className="promo-visual">
              <div className="#" />
              <img src="https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"></img>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

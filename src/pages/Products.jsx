import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'Acessórios'];
const CONDITIONS = ['Novo', 'Seminovo'];
const STORAGES = ['128GB', '256GB', '512GB', '1TB', '2TB', '64GB'];
const COLORS = ['Titânio Laranja', 'Titânio Preto', 'Titânio Natural', 'Preto', 'Branco', 'Prata', 'Meia-noite', 'Azul'];

export default function Products() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [category, setCategory] = useState(searchParams.get('categoria') || '');
  const [condition, setCondition] = useState('');
  const [storage, setStorage] = useState('');
  const [color, setColor] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState('featured');
  const [showNew, setShowNew] = useState(searchParams.get('novo') === 'true');

  useEffect(() => {
    const cat = searchParams.get('categoria');
    if (cat) setCategory(cat);
    if (searchParams.get('novo') === 'true') setShowNew(true);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category) result = result.filter(p => p.category === category);
    if (condition) result = result.filter(p => p.condition === condition);
    if (storage) result = result.filter(p => p.storage === storage || p.storages?.includes(storage));
    if (color) result = result.filter(p => p.color === color || p.colors?.includes(color));
    if (priceMin) result = result.filter(p => p.price >= Number(priceMin));
    if (priceMax) result = result.filter(p => p.price <= Number(priceMax));
    if (showNew) result = result.filter(p => p.new);

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case 'popular':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [category, condition, storage, color, priceMin, priceMax, sort, showNew]);

  const clearFilters = () => {
    setCategory('');
    setCondition('');
    setStorage('');
    setColor('');
    setPriceMin('');
    setPriceMax('');
    setShowNew(false);
    setSearchParams({});
  };

  const hasFilters = category || condition || storage || color || priceMin || priceMax || showNew;

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <span className="section-label sans">Catálogo</span>
          <h1 className="serif">Todos os Produtos</h1>
          <p>Tecnologia Apple premium selecionada para você</p>
        </div>
      </div>

      <div className="container products-layout">
        {/* Filters sidebar */}
        <aside className={`filters-panel ${filtersOpen ? 'open' : ''}`}>
          <div className="filters-header">
            <h3 className="sans">Filtros</h3>
            <button className="close-filters" onClick={() => setFiltersOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {hasFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              Limpar filtros
            </button>
          )}

          <div className="filter-group">
            <h4>Categoria</h4>
            <div className="filter-options">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`filter-chip ${category === c ? 'active' : ''}`}
                  onClick={() => setCategory(category === c ? '' : c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Condição</h4>
            <div className="filter-options">
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  className={`filter-chip ${condition === c ? 'active' : ''}`}
                  onClick={() => setCondition(condition === c ? '' : c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Armazenamento</h4>
            <div className="filter-options">
              {STORAGES.map(s => (
                <button
                  key={s}
                  className={`filter-chip ${storage === s ? 'active' : ''}`}
                  onClick={() => setStorage(storage === s ? '' : s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Cor</h4>
            <div className="filter-options">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`filter-chip ${color === c ? 'active' : ''}`}
                  onClick={() => setColor(color === c ? '' : c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Faixa de preço</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Mín"
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Máx"
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showNew}
                onChange={e => setShowNew(e.target.checked)}
              />
              <span>Apenas lançamentos</span>
            </label>
          </div>
        </aside>

        {/* Main */}
        <div className="products-main">
          <div className="products-toolbar">
            <button className="filters-toggle" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={18} />
              Filtros
              {hasFilters && <span className="filter-count">!</span>}
            </button>
            <p className="results-count">{filtered.length} produtos</p>
            <div className="sort-select">
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="featured">Destaques</option>
                <option value="newest">Lançamentos</option>
                <option value="popular">Popularidade</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="no-results">
              <p>Nenhum produto encontrado com esses filtros.</p>
              <button className="btn btn-outline" onClick={clearFilters}>Limpar filtros</button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && <div className="filters-overlay" onClick={() => setFiltersOpen(false)} />}
    </div>
  );
}

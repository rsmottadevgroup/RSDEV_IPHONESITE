import { Link } from 'react-router-dom';
import { categories as initialCategories } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import './Categories.css';

export default function Categories() {
  const { products } = useProducts();
  const categories = initialCategories.map(category => ({
    ...category,
    count: products.filter(product => product.category === category.name).length
  }));

  return (
    <div className="categories-page">
      <div className="categories-hero">
        <div className="container">
          <span className="section-label sans">Explore</span>
          <h1 className="serif">Categorias</h1>
          <p>Navegue por linhas de produtos Apple</p>
        </div>
      </div>

      <div className="container">
        <div className="categories-full-grid">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/produtos?categoria=${cat.name}`}
              className={`cat-card ${i === 0 || i === 3 ? 'large' : ''}`}
            >
              <div className="cat-image">
                <img src={cat.image} alt={cat.name} />
                <div className="cat-overlay" />
              </div>
              <div className="cat-content">
                <h2 className="serif">{cat.name}</h2>
                <p>{cat.description}</p>
                <span className="cat-count sans">{cat.count} produtos</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

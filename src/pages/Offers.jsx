import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import './Offers.css';

export default function Offers() {
  const { products } = useProducts();
  const offers = products.filter(p => p.discount > 0).sort((a, b) => b.discount - a.discount);

  return (
    <div className="offers-page">
      <div className="offers-hero">
        <div className="container">
          <span className="section-label sans">Promoções</span>
          <h1 className="serif">Ofertas Especiais</h1>
          <p>Oportunidades selecionadas com descontos exclusivos</p>
        </div>
      </div>

      <div className="container">
        <div className="offers-banner glass">
          <div>
            <h2 className="serif">Até 17% off</h2>
            <p>Em produtos selecionados por tempo limitado</p>
          </div>
          <div className="offers-timer sans">
            <div className="timer-block"><span>02</span><small>dias</small></div>
            <div className="timer-block"><span>14</span><small>hrs</small></div>
            <div className="timer-block"><span>37</span><small>min</small></div>
          </div>
        </div>

        <div className="products-grid offers-grid">
          {offers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

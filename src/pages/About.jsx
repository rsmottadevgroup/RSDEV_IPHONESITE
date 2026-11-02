import { ArrowRight, BadgeCheck, ShieldCheck, Smartphone, Star, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './About.css';

const values = [
  {
    icon: Smartphone,
    title: 'Tecnologia de verdade',
    text: 'Oferecemos celulares e acessórios selecionados com foco em desempenho, qualidade de imagem e experiência premium.'
  },
  {
    icon: ShieldCheck,
    title: 'Confiança e segurança',
    text: 'Cada compra é acompanhada por suporte transparente, garantia e atenção real para você não ficar sozinho.'
  },
  {
    icon: Truck,
    title: 'Entrega rápida',
    text: 'Operamos com logística pensada para chegar rápido, com cuidado e com rastreio em tempo real.'
  }
];

const highlights = [
  'Atendimento especializado em celulares e acessórios',
  'Produtos originais com garantia e suporte técnico',
  'Seleção curada para quem busca desempenho e estilo',
  'Compras seguras com experiência simples e confiável'
];

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <span className="section-label sans">Sobre a PowerCell</span>
          <h1 className="serif">Tecnologia que acompanha seu dia a dia.</h1>
          <p className="about-lead">
            A PowerCell nasceu para unir inovação, qualidade e atendimento de alto nível em uma loja de celulares pensada para quem valoriza tecnologia que funciona e impressiona.
          </p>
        </div>
      </div>

      <div className="container about-content">
        <section className="about-story glass">
          <div className="about-story-copy">
            <span className="section-label sans">Nossa história</span>
            <h2 className="serif">Uma loja moderna para quem vive conectado.</h2>
            <p>
              Desde o início, a PowerCell se dedicou a facilitar a escolha do melhor celular com base em qualidade, preço e necessidades reais de cada cliente. Nossa missão é transformar a compra de tecnologia em uma experiência simples, clara e confiável.
            </p>
            <p>
              Trabalhamos com smartphones de alto desempenho, acessórios essenciais e uma curadoria focada em marcas e modelos que realmente fazem a diferença no dia a dia.
            </p>
          </div>

          <div className="about-badges">
            <div className="about-badge">
              <Star size={20} />
              <span>+15 mil clientes atendidos</span>
            </div>
            <div className="about-badge">
              <BadgeCheck size={20} />
              <span>Garantia em todos os produtos</span>
            </div>
            <div className="about-badge">
              <Truck size={20} />
              <span>Entrega rápida e rastreada</span>
            </div>
          </div>
        </section>

        <section className="about-values">
          {values.map(({ icon: Icon, title, text }) => (
            <article className="about-card glass" key={title}>
              <div className="about-card-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="about-highlights glass">
          <div>
            <span className="section-label sans">Por que escolher</span>
            <h2 className="serif">A PowerCell é pensada para seu estilo de vida.</h2>
          </div>

          <ul>
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        <section className="about-cta glass">
          <div>
            <span className="section-label sans">Pronto para aproveitar</span>
            <h2 className="serif">Encontre o celular ideal para você.</h2>
          </div>

          <div className="about-cta-actions">
            <Link to="/produtos" className="btn btn-primary">
              Ver catálogo <ArrowRight size={16} />
            </Link>
            <Link to="/contato" className="btn btn-outline">
              Falar com especialista
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

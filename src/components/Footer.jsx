import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logopower.png" style={{ width: '80%', height: 'auto' }}></img>
            
          </div>
          <p>Tecnologia de ponta, em cada detalhe. Design que inspira.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4 className="sans">Navegação</h4>
            <Link to="/">Home</Link>
            <Link to="/produtos">Produtos</Link>
            <Link to="/categorias">Categorias</Link>
            <Link to="/ofertas">Ofertas</Link>
          </div>
          <div className="footer-col">
            <h4 className="sans">Institucional</h4>
            <Link to="/sobre">Sobre nós</Link>
            <Link to="/contato">Contato</Link>
            <a href="#">Política de Privacidade</a>
            <a href="#">Termos de Uso</a>
          </div>
          <div className="footer-col">
            <h4 className="sans">Suporte</h4>
            <a href="#">FAQ</a>
            <a href="#">Trocas e Devoluções</a>
            <a href="#">Garantia</a>
            <a href="#">Rastreio</a>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4 className="serif">Newsletter</h4>
          <p>Receba lançamentos e ofertas exclusivas.</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Seu e-mail" required />
            <button type="submit" className="btn btn-primary">Assinar</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 Apple Premium Concept. Todos os direitos reservados. Projeto demonstrativo.</p>
        </div>
      </div>
    </footer>
  );
}

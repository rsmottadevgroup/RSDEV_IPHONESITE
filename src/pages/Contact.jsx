import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Twitter } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <span className="section-label sans">Fale conosco</span>
          <h1 className="serif">Contato</h1>
          <p>Estamos prontos para ajudar</p>
        </div>
      </div>

      <div className="container contact-layout">
        <div className="contact-info">
          <div className="contact-card glass">
            <MessageCircle size={22} />
            <div>
              <h4>WhatsApp</h4>
              <a href="https://wa.me/5514998894962" target="_blank" rel="noreferrer">
                (14) 99889-4962
              </a>
            </div>
          </div>
          <div className="contact-card glass">
            <Mail size={22} />
            <div>
              <h4>E-mail</h4>
              <a href="mailto:contato@applepremium.com">contato@applepremium.com</a>
            </div>
          </div>
          <div className="contact-card glass">
            <Phone size={22} />
            <div>
              <h4>Telefone</h4>
              <span>(11) 3456-7890</span>
            </div>
          </div>
          <div className="contact-card glass">
            <MapPin size={22} />
            <div>
              <h4>Endereço</h4>
              <span>Av. Paulista, 1000 — São Paulo, SP</span>
            </div>
          </div>

          <div className="contact-socials">
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
          </div>
        </div>

        <form className="contact-form glass" onSubmit={handleSubmit}>
          <h3 className="serif">Envie uma mensagem</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Nome</label>
              <input type="text" required placeholder="Seu nome" />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" required placeholder="seu@email.com" />
            </div>
          </div>
          <div className="form-group">
            <label>Assunto</label>
            <input type="text" required placeholder="Como podemos ajudar?" />
          </div>
          <div className="form-group">
            <label>Mensagem</label>
            <textarea rows={5} required placeholder="Escreva sua mensagem..." />
          </div>
          <button type="submit" className="btn btn-primary">
            {sent ? 'Mensagem enviada!' : 'Enviar mensagem'}
          </button>
        </form>
      </div>
    </div>
  );
}

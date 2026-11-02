import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import './CartDrawer.css';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  if (!isOpen) return null;

  const handleOrder = () => {
    const orderLines = items.map(item => {
      const options = [item.selectedColor, item.selectedStorage]
        .filter(value => value && value !== '-')
        .join(' / ');
      const details = options ? ` (${options})` : '';
      return `- ${item.name}${details} | ${item.quantity}x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`;
    });
    const message = [
      'Olá! Gostaria de encomendar os seguintes produtos:',
      '',
      ...orderLines,
      '',
      `Total: ${formatPrice(subtotal)}`
    ].join('\n');
    const whatsappUrl = `https://wa.me/5514998894962?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="serif">Carrinho</h2>
          <button onClick={onClose} className="cart-close">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={48} strokeWidth={1} />
            <p>Seu carrinho está vazio</p>
            <Link to="/produtos" className="btn btn-primary" onClick={onClose}>
              Explorar produtos
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item, idx) => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedStorage}-${idx}`} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-meta">
                      {item.selectedColor} · {item.selectedStorage}
                    </p>
                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(item, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className="cart-installment">
                ou 12x de {formatPrice(subtotal / 12)} sem juros
              </p>
              <button className="btn btn-primary checkout-btn" onClick={handleOrder}>
                Encomendar carrinho
              </button>
              <button className="btn btn-ghost clear-btn" onClick={clearCart}>
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

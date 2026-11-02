import { useState } from 'react';
import { LogIn, LogOut, PackagePlus, Trash2, Upload } from 'lucide-react';
import { categories, formatPrice } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import './About.css';

export default function About() {
  const { session, isAdmin, loading: authLoading, isSupabaseConfigured, signIn, signOut } = useAuth();
  const { customProducts, legacyProductCount, addProduct, removeProduct, importInitialCatalog, importLegacyProducts, uploadProductImage, loading: productsLoading, error: productsError } = useProducts();
  const [email, setEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: categories[0].name,
    price: '',
    originalPrice: '',
    image: '',
    color: '',
    storage: '',
    description: ''
  });

  const handleAdminAccess = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await signIn(email, adminPassword);
    } catch (loginError) {
      setError(loginError.message || 'Não foi possível entrar.');
    } finally {
      setBusy(false);
    }
  };

  const handleProductSubmit = async event => {
    event.preventDefault();
    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice) > price ? Number(form.originalPrice) : price;
    const image = form.image.trim() || categories.find(category => category.name === form.category)?.image;

    setBusy(true);
    setError('');
    try {
      await addProduct({
        name: form.name.trim(),
        category: form.category,
        brand: 'Apple',
        model: '',
        price,
        originalPrice,
        storage: form.storage.trim() || '-',
        color: form.color.trim() || 'Padrão',
        condition: 'Novo',
        availability: 'Em estoque',
        rating: 5,
        reviews: 0,
        image,
        images: [image],
        description: form.description.trim(),
        specs: {},
        colors: form.color.trim() ? [form.color.trim()] : [],
        storages: form.storage.trim() ? [form.storage.trim()] : ['-'],
        featured: false,
        new: false,
        discount: originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0
      });

      setForm({ name: '', category: categories[0].name, price: '', originalPrice: '', image: '', color: '', storage: '', description: '' });
      setMessage('Produto salvo no catálogo.');
    } catch (saveError) {
      setError(saveError.message || 'Não foi possível salvar o produto.');
    } finally {
      setBusy(false);
    }
  };

  const handleImageUpload = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5 MB.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const image = await uploadProductImage(file);
      setForm(current => ({ ...current, image }));
      setMessage('Imagem enviada.');
    } catch (uploadError) {
      setError(uploadError.message || 'Não foi possível enviar a imagem.');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  };

  const handleImportCatalog = async () => {
    setBusy(true);
    setError('');
    try {
      const count = await importInitialCatalog();
      setMessage(count ? `${count} produtos importados.` : 'O catálogo inicial já está importado.');
    } catch (importError) {
      setError(importError.message || 'Não foi possível importar o catálogo.');
    } finally {
      setBusy(false);
    }
  };

  const handleImportLegacyProducts = async () => {
    setBusy(true);
    setError('');
    try {
      const count = await importLegacyProducts();
      setMessage(count ? `${count} produtos locais importados.` : 'Os produtos locais já estavam no catálogo.');
    } catch (importError) {
      setError(importError.message || 'Não foi possível importar os produtos locais.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveProduct = async product => {
    setBusy(true);
    setError('');
    try {
      await removeProduct(product.id);
      setMessage(`${product.name} removido do catálogo.`);
    } catch (removeError) {
      setError(removeError.message || 'Não foi possível remover o produto.');
    } finally {
      setBusy(false);
    }
  };

  const updateField = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  };

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <span className="section-label sans">Painel da loja</span>
          <h1 className="serif">Configurações</h1>
          <p className="about-lead">
            Acesse a área administrativa para cadastrar produtos no catálogo.
          </p>
        </div>
      </div>

      <div className="container admin-container">
        {!isSupabaseConfigured ? (
          <div className="admin-panel admin-login">
            <h2 className="serif">Conecte o Supabase</h2>
            <p className="admin-local-note">Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local e aplique a migração do projeto para habilitar o login e o catálogo.</p>
          </div>
        ) : authLoading ? (
          <div className="admin-panel admin-login"><p className="admin-local-note">Verificando acesso...</p></div>
        ) : !isAdmin ? (
          <form className="admin-panel admin-login" onSubmit={handleAdminAccess}>
            <h2 className="serif">Login administrador</h2>
            {session && <p className="admin-local-note">Esta conta não tem permissão de administrador.</p>}
            <label>
              E-mail
              <input type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="username" />
            </label>
            <label>
              Senha
              <input type="password" value={adminPassword} onChange={event => setAdminPassword(event.target.value)} required autoComplete="current-password" />
            </label>
            {(error || productsError) && <p className="admin-error" role="alert">{error || productsError}</p>}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              <LogIn size={17} /> Entrar
            </button>
            <p className="admin-local-note">Crie a conta no Supabase e conceda a ela o papel de administrador para liberar o painel.</p>
          </form>
        ) : (
          <div className="admin-dashboard">
            <div className="admin-dashboard-header">
              <div>
                <span className="section-label sans">Administrador</span>
                <h2 className="serif">Produtos da loja</h2>
              </div>
              <button className="btn btn-ghost" onClick={signOut}>
                <LogOut size={17} /> Sair
              </button>
            </div>

            <div className="admin-catalog-actions">
              <p>{productsLoading ? 'Carregando produtos...' : `${customProducts.length} produtos próprios no catálogo`}</p>
              <div>
                {legacyProductCount > 0 && (
                  <button className="btn btn-outline" type="button" onClick={handleImportLegacyProducts} disabled={busy || productsLoading}>
                    Importar {legacyProductCount} {legacyProductCount === 1 ? 'produto' : 'produtos'} deste navegador
                  </button>
                )}
                <button className="btn btn-outline" type="button" onClick={handleImportCatalog} disabled={busy || productsLoading}>
                  Importar catálogo inicial
                </button>
              </div>
            </div>

            <form className="admin-panel admin-product-form" onSubmit={handleProductSubmit}>
              <h3 className="serif"><PackagePlus size={19} /> Novo produto</h3>
              <div className="admin-form-grid">
                <label className="admin-field-wide">
                  Nome do produto
                  <input name="name" value={form.name} onChange={updateField} required />
                </label>
                <label>
                  Categoria
                  <select name="category" value={form.category} onChange={updateField}>
                    {categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
                  </select>
                </label>
                <label>
                  Preço (R$)
                  <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={updateField} required />
                </label>
                <label>
                  Preço anterior (opcional)
                  <input name="originalPrice" type="number" min="0" step="0.01" value={form.originalPrice} onChange={updateField} />
                </label>
                <label>
                  Cor
                  <input name="color" value={form.color} onChange={updateField} />
                </label>
                <label>
                  Armazenamento / modelo
                  <input name="storage" value={form.storage} onChange={updateField} />
                </label>
                <label className="admin-field-wide">
                  URL da imagem (opcional)
                  <input name="image" type="url" value={form.image} onChange={updateField} placeholder="Usa uma imagem da categoria se ficar vazio" />
                </label>
                <label className="admin-field-wide admin-upload-field">
                  Enviar arquivo de imagem (máximo 5 MB)
                  <span><Upload size={16} /> Escolher imagem<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={busy} /></span>
                </label>
                <label className="admin-field-wide">
                  Descrição
                  <textarea name="description" rows="3" value={form.description} onChange={updateField} />
                </label>
              </div>
              {(message || error || productsError) && <p className={error || productsError ? 'admin-error' : 'admin-message'} role={error || productsError ? 'alert' : 'status'}>{error || productsError || message}</p>}
              <button type="submit" className="btn btn-primary" disabled={busy || productsLoading}><PackagePlus size={17} /> {busy ? 'Salvando...' : 'Adicionar produto'}</button>
            </form>

            <section className="admin-panel admin-product-list">
              <h3 className="serif">Cadastrados por você <span>{customProducts.length}</span></h3>
              {productsLoading ? (
                <p className="admin-empty">Carregando produtos...</p>
              ) : customProducts.length === 0 ? (
                <p className="admin-empty">Nenhum produto cadastrado ainda.</p>
              ) : customProducts.map(product => (
                <div className="admin-product-row" key={product.id}>
                  <img src={product.image} alt="" />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category} · {formatPrice(product.price)}</span>
                  </div>
                  <button type="button" className="admin-remove" onClick={() => handleRemoveProduct(product)} disabled={busy} aria-label={`Excluir ${product.name}`}>
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

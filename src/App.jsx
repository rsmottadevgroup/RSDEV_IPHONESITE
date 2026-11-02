import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import LegalPage from './pages/LegalPage';
import AdminSettings from './pages/AdminSettings';
import './styles/global.css';

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <ProductsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="produtos" element={<Products />} />
                <Route path="produto/:id" element={<ProductDetail />} />
                <Route path="categorias" element={<Categories />} />
                <Route path="ofertas" element={<Offers />} />
                <Route path="sobre" element={<About />} />
                <Route path="configuracoes" element={<AdminSettings />} />
                <Route path="contato" element={<Contact />} />
                <Route path="politica-de-privacidade" element={<LegalPage page="privacidade" />} />
                <Route path="termos-de-uso" element={<LegalPage page="termos" />} />
                <Route path="faq" element={<LegalPage page="faq" />} />
                <Route path="trocas-e-devolucoes" element={<LegalPage page="trocas" />} />
                <Route path="garantia" element={<LegalPage page="garantia" />} />
                <Route path="rastreio" element={<LegalPage page="rastreio" />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProductsProvider>
      </AuthProvider>
    </CartProvider>
  );
}

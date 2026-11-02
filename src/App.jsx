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
                <Route path="contato" element={<Contact />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProductsProvider>
      </AuthProvider>
    </CartProvider>
  );
}

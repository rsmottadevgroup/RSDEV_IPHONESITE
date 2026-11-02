import { createContext, useContext, useEffect, useState } from 'react';
import { products as initialProducts } from '../data/products';
import { productFromDatabase, productToDatabase, slugifyProductName } from '../lib/productMapping';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const ProductsContext = createContext(null);
const LEGACY_STORAGE_KEY = 'powercell-custom-products';

function readLegacyProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function ProductsProvider({ children }) {
  const [databaseProducts, setDatabaseProducts] = useState([]);
  const [legacyProducts, setLegacyProducts] = useState(readLegacyProducts);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!active) return;
      if (queryError) {
        setError(queryError.message);
      } else {
        setDatabaseProducts(data.map(productFromDatabase));
        setError('');
      }
      setLoading(false);
    };

    loadProducts();
    return () => { active = false; };
  }, []);

  const addProduct = async product => {
    if (!supabase) throw new Error('Configure o Supabase para cadastrar produtos.');
    const { data, error: insertError } = await supabase
      .from('products')
      .insert(productToDatabase(product))
      .select('*')
      .single();
    if (insertError) throw insertError;
    const savedProduct = productFromDatabase(data);
    setDatabaseProducts(current => [savedProduct, ...current]);
    return savedProduct;
  };

  const removeProduct = async id => {
    if (!supabase) throw new Error('Configure o Supabase para remover produtos.');
    const { error: updateError } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);
    if (updateError) throw updateError;
    setDatabaseProducts(current => current.map(product => (
      product.id === id ? { ...product, isActive: false } : product
    )));
  };

  const importInitialCatalog = async () => {
    if (!supabase) throw new Error('Configure o Supabase para importar o catálogo.');
    const knownSlugs = new Set(databaseProducts.map(product => product.slug));
    const seedRows = initialProducts
      .filter(product => !knownSlugs.has(product.slug || slugifyProductName(product.name)))
      .map(product => productToDatabase(product, { isSeeded: true }));

    if (!seedRows.length) return 0;
    const { data, error: insertError } = await supabase
      .from('products')
      .upsert(seedRows, { onConflict: 'slug' })
      .select('*');
    if (insertError) throw insertError;

    setDatabaseProducts(current => {
      const imported = data.map(productFromDatabase);
      const importedIds = new Set(imported.map(product => product.id));
      return [...imported, ...current.filter(product => !importedIds.has(product.id))];
    });
    return data.length;
  };

  const importLegacyProducts = async () => {
    if (!supabase) throw new Error('Configure o Supabase para importar produtos.');
    const knownSlugs = new Set(databaseProducts.map(product => product.slug));
    const rows = legacyProducts
      .filter(product => !knownSlugs.has(product.slug || slugifyProductName(product.name)))
      .map(product => productToDatabase(product));

    let imported = [];
    if (rows.length) {
      const { data, error: insertError } = await supabase
        .from('products')
        .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true })
        .select('*');
      if (insertError) throw insertError;
      imported = data.map(productFromDatabase);
      setDatabaseProducts(current => [...imported, ...current]);
    }

    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setLegacyProducts([]);
    return imported.length;
  };

  const uploadProductImage = async file => {
    if (!supabase) throw new Error('Configure o Supabase para enviar imagens.');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (uploadError) throw uploadError;
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  };

  const visibleProducts = isSupabaseConfigured
    ? databaseProducts.filter(product => product.isActive)
    : initialProducts;
  const customProducts = databaseProducts.filter(product => product.isActive && !product.isSeeded);

  return (
    <ProductsContext.Provider value={{
      products: visibleProducts,
      customProducts,
      legacyProductCount: legacyProducts.length,
      addProduct,
      removeProduct,
      importInitialCatalog,
      importLegacyProducts,
      uploadProductImage,
      loading,
      error,
      isSupabaseConfigured
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
}
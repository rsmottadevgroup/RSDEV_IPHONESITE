import { categories } from '../data/products';

export function slugifyProductName(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function productFromDatabase(row) {
  const category = categories.find(item => item.id === row.category_id)?.name || row.category_id;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    model: row.model || '',
    category,
    brand: row.brand,
    price: Number(row.price),
    originalPrice: Number(row.compare_at_price ?? row.price),
    storage: row.storage_label || '-',
    color: row.color_label || 'Padrão',
    condition: row.condition,
    availability: row.availability,
    rating: Number(row.rating),
    reviews: row.reviews,
    image: row.image_url,
    images: row.images || [],
    description: row.description || '',
    specs: row.specs || {},
    colors: row.colors || [],
    storages: row.storages || [],
    featured: row.is_featured,
    new: row.is_new,
    discount: row.discount_percent,
    isSeeded: row.is_seeded,
    isActive: row.is_active
  };
}

export function productToDatabase(product, { isSeeded = false } = {}) {
  const category = categories.find(item => item.name === product.category || item.id === product.category);
  if (!category) throw new Error('Selecione uma categoria válida.');

  return {
    slug: product.slug || slugifyProductName(product.name),
    name: product.name,
    model: product.model || '',
    category_id: category.id,
    brand: product.brand || 'Apple',
    price: Number(product.price),
    compare_at_price: Number(product.originalPrice ?? product.price),
    storage_label: product.storage || '-',
    color_label: product.color || 'Padrão',
    condition: product.condition || 'Novo',
    availability: product.availability || 'Em estoque',
    rating: Number(product.rating ?? 5),
    reviews: Number(product.reviews ?? 0),
    image_url: product.image,
    images: product.images?.length ? product.images : product.image ? [product.image] : [],
    description: product.description || '',
    specs: product.specs || {},
    colors: product.colors || [],
    storages: product.storages || [],
    is_featured: Boolean(product.featured),
    is_new: Boolean(product.new),
    discount_percent: Number(product.discount ?? 0),
    is_seeded: isSeeded,
    is_active: true
  };
}
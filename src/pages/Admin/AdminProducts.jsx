import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth, api } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import {
  ShoppingBag,
  Plus,
  Search,
  DollarSign,
  Package,
  Edit,
  Trash2,
  Shield,
  ArrowRight,
  Calendar,
  User,
  Star,
  Download,
  Eye
} from 'lucide-react';

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await api.get(`/admin/products?${params}`);
      setProducts(response.data.products || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterType, filterStatus]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadProducts();
  }, [user, navigate, loadProducts]);

  // Verificar permisos de administrador
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg mx-auto px-4 relative z-10"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 sm:p-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-red-500 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
              No tienes permisos de administrador para acceder a esta página.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 hover:scale-105 group"
            >
              <span>Volver al Inicio</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const getProductTypeIcon = (type) => {
    switch (type) {
      case 'workout_plan':
        return <Package className="w-5 h-5" />;
      case 'nutrition_guide':
        return <Star className="w-5 h-5" />;
      case 'course':
        return <Eye className="w-5 h-5" />;
      case 'ebook':
        return <Download className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getProductTypeColor = (type) => {
    switch (type) {
      case 'workout_plan':
        return 'text-blue-400 bg-blue-500/10';
      case 'nutrition_guide':
        return 'text-green-400 bg-green-500/10';
      case 'course':
        return 'text-purple-400 bg-purple-500/10';
      case 'ebook':
        return 'text-orange-400 bg-orange-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  const formatProductType = (type) => {
    const types = {
      'workout_plan': 'Plan de Entrenamiento',
      'nutrition_guide': 'Guía Nutricional',
      'course': 'Curso',
      'ebook': 'Ebook',
      'other': 'Otro'
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleCreateProduct = async (productData) => {
    try {
      await api.post('/admin/products', productData);
      loadProducts();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Error al crear el producto');
    }
  };

  const handleUpdateProduct = async (productId, updates) => {
    try {
      await api.put(`/admin/products/${productId}`, updates);
      loadProducts();
      setShowProductModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      await api.delete(`/admin/products/${productId}`);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error al eliminar el producto');
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <div className="lg:ml-72 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Gestión de Productos
                  </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg">
                  Administra los productos digitales de la plataforma
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Producto</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="w-full lg:w-64">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="workout_plan">Planes de Entrenamiento</option>
                  <option value="nutrition_guide">Guías Nutricionales</option>
                  <option value="course">Cursos</option>
                  <option value="ebook">Ebooks</option>
                  <option value="other">Otros</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 animate-pulse">
                  <div className="aspect-video bg-slate-800 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-800 rounded mb-2"></div>
                  <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No hay productos</h3>
              <p className="text-slate-500">No se encontraron productos que coincidan con los filtros aplicados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
                >
                  {/* Product Image/Preview */}
                  <div className="aspect-video bg-slate-800 relative overflow-hidden">
                    {product.preview_url ? (
                      <img
                        src={product.preview_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getProductTypeIcon(product.product_type)}
                      </div>
                    )}

                    {/* Product Type Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getProductTypeColor(product.product_type)}`}>
                        {getProductTypeIcon(product.product_type)}
                        <span>{formatProductType(product.product_type)}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.is_active
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {product.description || 'Sin descripción'}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-bold text-xl">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-slate-400 text-sm">{product.username || 'Usuario'}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(product.created_at)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openProductModal(product)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-500">
                          {product.download_url ? 'Descargable' : 'Digital'}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                <span className="px-4 py-2 text-slate-400">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Producto</h3>
            <ProductForm onSubmit={handleCreateProduct} onCancel={() => setShowCreateModal(false)} />
          </motion.div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">Editar Producto</h3>
            <ProductForm
              product={selectedProduct}
              onSubmit={(updates) => handleUpdateProduct(selectedProduct.id, updates)}
              onCancel={() => {
                setShowProductModal(false);
                setSelectedProduct(null);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Product Form Component
const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    product_type: product?.product_type || 'workout_plan',
    is_active: product?.is_active !== undefined ? product.is_active : true,
    download_url: product?.download_url || '',
    preview_url: product?.preview_url || '',
    tags: product?.tags ? (Array.isArray(product.tags) ? product.tags : JSON.parse(product.tags || '[]')) : []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      tags: JSON.stringify(formData.tags)
    });
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Nombre del Producto</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Precio (USD)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Tipo de Producto</label>
          <select
            value={formData.product_type}
            onChange={(e) => setFormData(prev => ({ ...prev, product_type: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="workout_plan">Plan de Entrenamiento</option>
            <option value="nutrition_guide">Guía Nutricional</option>
            <option value="course">Curso</option>
            <option value="ebook">Ebook</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">URL de Descarga</label>
          <input
            type="url"
            value={formData.download_url}
            onChange={(e) => setFormData(prev => ({ ...prev, download_url: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">URL de Preview</label>
          <input
            type="url"
            value={formData.preview_url}
            onChange={(e) => setFormData(prev => ({ ...prev, preview_url: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-orange-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Agregar tag y presionar Enter"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(e.target.value.trim());
              e.target.value = '';
            }
          }}
          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className="rounded border-slate-600 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm font-semibold text-slate-300">Producto Activo</span>
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300"
        >
          {product ? 'Actualizar' : 'Crear'} Producto
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AdminProducts;
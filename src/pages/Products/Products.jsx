import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Dumbbell,
  BookOpen,
  Apple,
  Trophy,
  Download,
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  Target,
  Crown
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tasa de cambio aproximada USD a COP
  const USD_TO_COP_RATE = 4000;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const API_BASE_URL = process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/api'
          : 'https://jeremyfitnessbackend-production.up.railway.app/api';
        
        const response = await axios.get(`${API_BASE_URL}/products`);
        const mappedProducts = response.data.products.map(product => ({
          ...product,
          title: product.name,
          category: product.product_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          icon: getIconForType(product.product_type),
          rating: 4.8, // Default rating since not in DB
          reviews: 100, // Default reviews
          duration: product.product_type === 'course' ? 'Varios' : 'Acceso ilimitado',
          features: ['Descarga inmediata', 'Soporte incluido', 'Actualizaciones gratis'],
          isPremium: product.price > 50,
          priceCOP: Math.round(product.price * USD_TO_COP_RATE)
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getIconForType = (type) => {
    switch (type) {
      case 'workout_plan':
        return <Dumbbell className="w-6 h-6" />;
      case 'nutrition_guide':
        return <Apple className="w-6 h-6" />;
      case 'course':
        return <Trophy className="w-6 h-6" />;
      case 'ebook':
        return <BookOpen className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const handlePurchase = (product) => {
    const phoneNumber = '+573016674680'; // Número de WhatsApp proporcionado
    const message = `Hola, estoy interesado en comprar el producto: ${product.title}\n\nDescripción: ${product.description}\nPrecio: $${product.priceCOP.toLocaleString()} COP\nTipo: ${product.category}\n\nPor favor, ayúdame con el proceso de compra.`;

    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const categories = [
    { name: 'Todos', count: products.length },
    { name: 'Entrenamiento', count: products.filter(p => p.product_type === 'workout_plan').length },
    { name: 'Nutrición', count: products.filter(p => p.product_type === 'nutrition_guide').length },
    { name: 'Curso', count: products.filter(p => p.product_type === 'course').length },
    { name: 'Ebook', count: products.filter(p => p.product_type === 'ebook').length }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <Download className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-400">Productos Digitales</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              Productos{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Exclusivos
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Planes de entrenamiento, guías nutricionales y cursos diseñados para 
              acelerar tu transformación física
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-2 bg-slate-900/50 border border-slate-800/50 rounded-xl text-slate-300 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 font-semibold"
              >
                {category.name} <span className="text-slate-500">({category.count})</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-800"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
              >
                {/* Product Header */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 flex items-center justify-center h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-red-500/30 relative z-10">
                    {product.icon}
                  </div>

                  {product.isPremium && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                      <Crown className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-sm border border-slate-700/50 rounded-lg text-xs font-semibold text-slate-300">
                    {product.category}
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating & Duration */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/50">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-red-500 fill-red-500" />
                      <span className="font-bold text-white">{product.rating}</span>
                      <span className="text-slate-500 text-sm">({product.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{product.duration}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-black text-white">
                        ${product.priceCOP.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-sm ml-1">COP</span>
                    </div>
                    <button
                      onClick={() => handlePurchase(product)}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Comprar</span>
                    </button>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900/30 border-y border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { value: '10K+', label: 'Productos Vendidos', icon: <Download className="w-5 h-5" /> },
              { value: '4.8', label: 'Rating Promedio', icon: <Star className="w-5 h-5" /> },
              { value: '95%', label: 'Satisfacción', icon: <TrendingUp className="w-5 h-5" /> },
              { value: '24/7', label: 'Soporte', icon: <CheckCircle className="w-5 h-5" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-center space-x-2 text-red-500 mb-2">
                  {stat.icon}
                  <span className="text-3xl font-black">{stat.value}</span>
                </div>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-slate-900 to-red-600/10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
              ¿No encuentras lo que{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                buscas
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Contáctanos y te ayudaremos a encontrar el producto perfecto para tus objetivos
            </p>
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105">
              Contactar Soporte
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products;

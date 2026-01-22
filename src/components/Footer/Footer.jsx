import React from 'react';
import { 
  Dumbbell, Mail, MapPin, Phone, Heart,
  Instagram, Youtube,
  Video, ShoppingBag, CreditCard,
  HelpCircle, Shield, FileText, MessageCircle,
  Zap, Target, Users, Award, ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
      { name: 'Contenido', href: '/content', icon: Video },
      { name: 'Productos', href: '/products', icon: ShoppingBag },
      { name: 'Suscripciones', href: '/subscriptions', icon: CreditCard },
    ];

  const supportLinks = [
    { name: 'Centro de Ayuda', href: '/help', icon: HelpCircle },
    { name: 'Contacto', href: '/contact', icon: MessageCircle },
    { name: 'Política de Privacidad', href: '/privacy', icon: Shield },
    { name: 'Términos de Servicio', href: '/terms', icon: FileText },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/oficial_.jeremy?igsh=d2hoM2dqZnpjdDhk',
      color: 'hover:text-pink-500 hover:bg-pink-500/10'
    },
    {
      name: 'TikTok',
      icon: Youtube,
      href: 'https://www.tiktok.com/@oficial_.jeremy?_r=1&_t=ZS-93HheIVMVfg',
      color: 'hover:text-red-500 hover:bg-red-500/10'
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Miembros' },
    { icon: Video, value: '500+', label: 'Videos' },
    { icon: Target, value: '95%', label: 'Satisfacción' },
    { icon: Award, value: '24/7', label: 'Soporte' }
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Section */}
        <div className="py-12 border-b border-slate-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="group text-center"
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-semibold">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50">
                  <Dumbbell className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    NackRat
                  </span>
                </div>
              </div>
              
              <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                El Verdadero Valhalla: Plataforma exclusiva de fitness con contenido premium, entrenamientos personalizados
                y comunidad dedicada al bienestar físico y mental. Transforma tu vida con nosotros.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <a 
                  href="mailto:sotelojeremy16@gmail.com"
                  className="flex items-center space-x-3 text-slate-400 hover:text-red-500 transition-colors group"
                >
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-red-500/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm">sotelojeremy16@gmail.com</span>
                </a>
                <a 
                  href="tel:+573016674680"
                  className="flex items-center space-x-3 text-slate-400 hover:text-red-500 transition-colors group"
                >
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-red-500/10 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">+57 301 6674680</span>
                </a>
                <div className="flex items-center space-x-3 text-slate-400">
                  <div className="p-2 bg-slate-800/50 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Bogotá, Colombia</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`p-3 bg-slate-800/50 rounded-xl text-slate-400 transition-all duration-300 ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Platform Links */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center">
                <Zap className="w-5 h-5 text-red-500 mr-2" />
                Plataforma
              </h3>
              <ul className="space-y-3">
                {platformLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className="flex items-center space-x-3 text-slate-400 hover:text-red-500 transition-all duration-300 group"
                      >
                        <Icon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:text-red-500 transition-all" />
                        <span className="text-sm font-medium">{link.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Support Links */}
            <div className="lg:col-span-4">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center">
                <HelpCircle className="w-5 h-5 text-red-500 mr-2" />
                Soporte
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className="flex items-center space-x-3 text-slate-400 hover:text-red-500 transition-all duration-300 group"
                      >
                        <Icon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:text-red-500 transition-all" />
                        <span className="text-sm font-medium">{link.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-t border-b border-slate-800/50">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-black mb-3">
              <span className="text-white">Únete a nuestra </span>
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                comunidad
              </span>
            </h3>
            <p className="text-slate-400 mb-6">
              Recibe contenido exclusivo, tips de entrenamiento y ofertas especiales
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-slate-800 transition-all"
                />
              </div>
              <button className="px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Suscribirme
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} NackRat. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>Desarrollado con</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>para la comunidad fitness</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

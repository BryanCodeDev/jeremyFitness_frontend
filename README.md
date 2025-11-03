# 🚀 Plataforma de Fitness Jeremy - Plataforma Completa

Una plataforma web completa para creadores de contenido fitness con sistema de suscripciones manual vía WhatsApp, gestión de contenido multimedia y transmisión en vivo. **Sistema de ingresos real con seguimiento de transacciones completadas.**

## 📋 Características Principales

### ✨ Funcionalidades del Frontend
- **React 18** con hooks modernos y contexto
- **Tailwind CSS** para diseño profesional negro/naranja/blanco
- **Diseño responsivo** optimizado para móviles y escritorio
- **Autenticación completa** con registro, login y gestión de perfiles
- **Sistema de notificaciones** en tiempo real
- **Reproductor de video** integrado
- **Galería de imágenes** optimizada
- **Transmisiones en vivo** con chat
- **Dashboard para creadores** con estadísticas
- **Panel administrativo completo** con métricas y gestión avanzada

### 🔧 Funcionalidades del Backend
- **Node.js + Express** API RESTful
- **MySQL** como base de datos principal
- **Autenticación JWT** segura con roles y permisos
- **Sistema de suscripciones manual** vía WhatsApp (sin integración automática de pagos)
- **Gestión de archivos** multimedia (imágenes, videos)
- **Procesamiento de video** con generación automática de thumbnails
- **WebSockets** para chat en vivo
- **Sistema de roles** (admin, creator, user)
- **API de contenido** con categorías y filtros
- **Panel administrativo** con métricas en tiempo real
- **Gestión completa** de usuarios, contenido y productos
- **Sistema de transacciones** para seguimiento de ingresos reales
- **Dashboard administrativo** con ingresos calculados automáticamente

### 👑 Funcionalidades del Administrador
- **Dashboard administrativo** con métricas completas:
  - Usuarios totales y por rol (10 usuarios de ejemplo incluidos)
  - Suscriptores activos y por tier (Premium/VIP/Free)
  - Contenido total y por tipo (10 contenidos multimedia)
  - Productos y live streams (10 productos, 10 streams)
  - **Ingresos reales** calculados de transacciones completadas ($1.740.000 COP de ejemplo)
- **Gestión de usuarios** con administración de suscripciones en tiempo real:
  - Cambiar planes (Free → Premium → VIP) instantáneamente
  - Seleccionar duración (1, 3, 6, 12 meses)
  - Cálculo automático de precios (Premium $60k/mes, VIP $120k/mes)
  - Registro automático de transacciones completadas
- **Gestión de contenido** multimedia (videos, imágenes, posts)
- **Gestión de productos** digitales con precios y categorías
- **Gestión de live streams** con control de estado y chat
- **Sidebar de navegación** responsiva y colapsable
- **Filtros y búsqueda** avanzada en todos los módulos
- **Interfaz moderna** con animaciones y efectos visuales

### 🎨 Diseño y UX
- **Tema profesional** negro con acentos naranjas
- **Animaciones fluidas** con Framer Motion
- **Efectos de vidrio** y gradientes modernos
- **Optimización de imágenes** con lazy loading
- **PWA ready** para instalación como app nativa

## 🏗️ Arquitectura del Proyecto

```
jeremy-fitness-platform/
├── backend/                 # API Backend Node.js
│   ├── config/             # Configuración de base de datos
│   ├── database/           # Scripts de base de datos
│   ├── middleware/         # Middleware personalizado
│   ├── models/             # Modelos de datos (opcional)
│   ├── routes/             # Rutas de la API
│   │   ├── admin.js        # 🔑 Rutas administrativas
│   │   ├── auth.js         # Autenticación
│   │   ├── content.js      # Gestión de contenido
│   │   ├── liveStreams.js  # Live streams
│   │   ├── products.js     # Productos digitales
│   │   ├── subscriptions.js# Suscripciones
│   │   └── users.js        # Gestión de usuarios
│   ├── src/                # Código fuente principal
│   └── uploads/            # Archivos subidos
├── frontend/               # Aplicación React
│   ├── public/             # Archivos estáticos
│   ├── src/                # Código fuente React
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── Admin/      # 👑 Componentes administrativos
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   └── ...
│   │   ├── pages/          # Páginas de la aplicación
│   │   │   ├── Admin/      # 👑 Páginas administrativas
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminUsers.jsx
│   │   │   │   ├── AdminContent.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   └── AdminLives.jsx
│   │   │   ├── Auth/       # Autenticación
│   │   │   ├── Dashboard/  # Dashboard creador
│   │   │   └── ...
│   │   ├── styles/         # Estilos y tema
│   │   ├── utils/          # Utilidades y contextos
│   │   └── hooks/          # Hooks personalizados
└── docs/                   # Documentación adicional
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** 16+
- **MySQL** 8.0+
- **FFmpeg** (para procesamiento de video)
- **Sistema de pagos manual** vía WhatsApp (sin integración automática)

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd jeremy-fitness-platform
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Configurar base de datos
mysql -u root -p < database/schema.sql

# Hashear contraseñas de usuarios de ejemplo
node fix-passwords.js

# Iniciar servidor de desarrollo
npm run dev
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### 4. Variables de Entorno (.env)

```env
# Servidor
NODE_ENV=development
PORT=5000

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=jeremy_fitness

# JWT
JWT_SECRET=tu-jwt-secret-super-seguro

# Sistema de pagos manual vía WhatsApp (sin integración automática)
# Los administradores registran pagos manualmente en el panel admin

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 📚 Uso de la Plataforma

### Para Usuarios

1. **Registro y Login**
    - Crear cuenta con email y contraseña
    - Verificar email (opcional)
    - Completar perfil básico

2. **Explorar Contenido**
    - Navegar contenido gratuito (10 contenidos de ejemplo)
    - Suscribirse para contenido premium
    - Interactuar con likes y comentarios

3. **Suscripciones**
    - Planes Premium ($60.000/mes) y VIP ($120.000/mes) disponibles
    - Pago manual vía WhatsApp (sin integración automática)
    - Gestión de suscripción por administradores
    - Duraciones flexibles: 1, 3, 6, 12 meses

### Para Administradores 👑

1. **Primeros Pasos**
    - **Login como admin**: `jeremy@fitness.com` / `AdminPass123`
    - **Dashboard principal**: Ver métricas completas con $1.740.000 COP en ingresos
    - **Gestión de usuarios**: 10 usuarios de ejemplo con diferentes tipos de suscripción

2. **Gestión de Suscripciones**
    - **Cambiar planes**: Free → Premium → VIP instantáneamente
    - **Seleccionar duración**: 1, 3, 6, 12 meses
    - **Cálculo automático**: Premium $60k/mes, VIP $120k/mes
    - **Registro de transacciones**: Se guardan automáticamente en `subscription_transactions`

3. **Contenido y Productos**
    - **10 contenidos multimedia**: Videos, posts, imágenes
    - **10 productos digitales**: Planes de entrenamiento, ebooks, cursos
    - **10 live streams**: Programados con chat integrado

### Para Creadores

1. **Dashboard**
     - Estadísticas de contenido y suscriptores
     - Ingresos y analíticas
     - Gestión de contenido

2. **Gestión de Contenido**
     - Subir videos e imágenes
     - Crear contenido premium
     - Programar publicaciones

3. **Monetización**
     - Configurar productos digitales
     - Gestionar suscripciones
     - Seguimiento de ingresos

### Para Administradores 👑

1. **Panel de Control**
    - **Métricas completas**: Usuarios, suscriptores, contenido, productos, ingresos
    - **Estadísticas en tiempo real**: Nuevos registros y conversiones
    - **Acciones rápidas**: Acceso directo a módulos principales

2. **Gestión de Usuarios**
    - **Lista completa** de usuarios con filtros avanzados (10 usuarios de ejemplo)
    - **Administración de roles**: Cambiar entre user, creator, admin
    - **Control de estado**: Activar/desactivar cuentas
    - **Gestión de suscripciones en tiempo real**:
      - Ver suscripción actual de cada usuario (Free/Premium/VIP)
      - Cambiar planes (Free → Premium → VIP) instantáneamente
      - Seleccionar duración (1, 3, 6, 12 meses)
      - **Cálculo automático de precios** (Premium $60k/mes, VIP $120k/mes)
      - Registro automático de transacciones completadas
      - Historial y fechas de expiración

3. **Gestión de Contenido**
    - **Vista de galería** con thumbnails y metadatos
    - **Filtros por tipo**: Videos, imágenes, shorts, posts
    - **Estados**: Publicado, borrador, premium
    - **Estadísticas**: Vistas, likes, fecha de creación
    - **Acciones**: Editar, eliminar, cambiar estado

4. **Gestión de Productos**
    - **Catálogo digital** completo
    - **Categorías**: Planes de entrenamiento, guías nutricionales, cursos, ebooks
    - **Precios y características** detalladas
    - **Control de disponibilidad**: Activar/desactivar productos

5. **Gestión de Live Streams**
    - **Estados en tiempo real**: Programados, en vivo, finalizados
    - **Información detallada**: Fecha, duración, espectadores
    - **Controles administrativos**: Iniciar, finalizar, moderar
    - **Chat integrado** con opciones de moderación

6. **Navegación Avanzada**
    - **Sidebar responsiva** con navegación intuitiva
    - **Búsqueda global** en todos los módulos
    - **Filtros inteligentes** por múltiples criterios
    - **Interfaz moderna** con animaciones y feedback visual

##  Comandos Disponibles

### Backend
```bash
npm start          # Iniciar servidor producción
npm run dev        # Iniciar servidor desarrollo
npm test           # Ejecutar tests
npm run migrate    # Ejecutar migraciones
```

### Frontend
```bash
npm start          # Iniciar desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar tests
npm run eject      # Eyectar configuración
```

## 🎯 Características Técnicas

### Optimización de Rendimiento
- **Lazy Loading** de imágenes y componentes
- **Code Splitting** automático
- **Compresión** de archivos estáticos
- **Cache** inteligente de contenido
- **Optimización** de videos e imágenes

### Seguridad
- **Autenticación JWT** segura
- **Validación** de datos en servidor y cliente
- **Rate limiting** para prevenir abuso
- **CORS** configurado correctamente
- **Headers de seguridad** apropiados

### Escalabilidad
- **Arquitectura modular** fácil de extender
- **Base de datos** optimizada con índices
- **API RESTful** estándar
- **Separación** clara de responsabilidades

## 🔮 Próximas Características

- [x] **Panel administrativo completo** con gestión avanzada 👑
- [x] **Sistema de roles y permisos** avanzado
- [x] **Gestión de suscripciones en tiempo real** con cálculo automático de precios
- [x] **Dashboard administrativo** con métricas completas e ingresos reales
- [x] **Sistema de transacciones** para seguimiento de pagos manuales
- [x] **Base de datos completa** con 10 ejemplos en cada tabla
- [x] **Suscripciones consistentes** en Profile, AdminUsers y Header
- [x] **Script de contraseñas** actualizado para todos los usuarios
- [ ] **Aplicación móvil** React Native
- [ ] **Realidad aumentada** para ejercicios
- [ ] **IA para análisis** de forma física
- [ ] **Integración** con wearables
- [ ] **Gamificación** y desafíos
- [ ] **Marketplace** de productos físicos
- [ ] **Sistema de moderación** avanzado para contenido
- [ ] **Analíticas detalladas** con gráficos interactivos
- [ ] **API de integración** para terceros

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Diseño inspirado** en plataformas líderes del sector
- **Comunidad fitness** por la motivación
- **Open source** por las herramientas increíbles

---

**¡Construyamos juntos la plataforma de fitness del futuro!** 💪✨
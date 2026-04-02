# Admin Panel

A modern, scalable, production-ready Admin Panel for a Portfolio built with React 19, Vite, Mantine UI, and Redux Toolkit.

## 🚀 Features

- **Modern Tech Stack**: React 19, Vite, JavaScript (ES2024+)
- **UI Library**: Mantine UI (latest)
- **State Management**: Redux Toolkit with React Redux
- **Routing**: React Router v6+ with lazy loading
- **Forms & Validation**: React Hook Form + Zod
- **Theme System**: Centralized theme management with Light/Dark/Bakery themes
- **Authentication**: JWT-based auth with token refresh
- **Role-Based Access**: Super Admin, Bakery Admin, Staff roles
- **Responsive Design**: Mobile-first, fully responsive layout

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Auth components (ProtectedRoute, PublicRoute)
│   ├── common/         # Common components (LoadingSpinner, ErrorBoundary)
│   └── layout/        # Layout components (Sidebar, Navbar, AdminLayout)
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard page
│   ├── products/      # Product management
│   ├── categories/    # Category management
│   ├── orders/        # Order management
│   ├── inventory/     # Inventory management
│   ├── customers/     # Customer management
│   ├── coupons/       # Coupon management
│   ├── reviews/       # Reviews & ratings
│   ├── staff/         # Staff management
│   ├── reports/       # Reports & analytics
│   └── settings/      # Settings pages
├── routes/            # Route configuration
├── services/          # API services
│   └── api/           # API endpoints
├── store/             # Redux store
│   └── slices/        # Redux slices
├── styles/            # Global styles
├── theme/             # Theme configuration
├── utils/             # Utility functions
├── App.jsx            # Main App component
└── main.jsx           # Entry point
```

## 🎨 Theme System

The application supports three themes:
- **Light Theme**: Default light theme
- **Dark Theme**: Dark mode theme
- **Bakery Theme**: Custom warm bakery-themed colors

Themes are managed centrally via Redux and can be switched at runtime.

## 🔐 Authentication

- JWT-based authentication
- Token refresh handling
- Protected routes with role-based access
- Persistent auth state using localStorage

## 👥 Roles & Permissions

- **Super Admin**: Full access to all modules
- **Bakery Admin**: Access to most modules except staff management
- **Staff**: Limited access to view-only modules

## 📱 Modules

1. **Dashboard**: Sales overview, orders summary, revenue charts
2. **Product Management**: CRUD operations for products
3. **Category Management**: Manage product categories
4. **Order Management**: View and manage orders
5. **Inventory Management**: Track inventory items
6. **Customer Management**: View customer details
7. **Offers & Coupons**: Manage discount coupons
8. **Reviews & Ratings**: View customer reviews
9. **Staff Management**: Manage staff members (Super Admin only)
10. **Reports & Analytics**: Sales and performance reports
11. **Settings**: Profile, theme, bakery info, permissions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🛠️ Development

### Code Style

- ESLint for linting
- Prettier for code formatting

```bash
# Run linter
npm run lint

# Format code
npm run format
```

### Absolute Imports

The project uses absolute imports with the `@/` alias configured in `vite.config.js`.

## 📝 API Integration

The application uses Axios for API calls with interceptors for:
- Automatic token injection
- Token refresh on 401 errors
- Error handling

API services are organized by module in `src/services/api/`.

## 🎯 Best Practices

- Clean Architecture with feature-based folder structure
- Separation of concerns (UI, State, API, Hooks)
- No prop drilling - Redux for global state
- Reusable components and hooks
- Code splitting with lazy loading
- Memoization where needed
- Type-safe validation with Zod

## 📄 License

MIT

## 👨‍💻 Development

Built with ❤️ using React 19 and modern web technologies.


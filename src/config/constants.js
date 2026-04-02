// Centralized application constants & configuration

// UI Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BAKERY: 'bakery',
  MIDNIGHT_BLUE: 'midnight_blue',
};

export const THEME_INFO = {
  [THEMES.LIGHT]: { name: 'Light', icon: '☀️', color: '#ffffff' },
  [THEMES.DARK]: { name: 'Dark', icon: '🌙', color: '#1a1b1e' },
  [THEMES.BAKERY]: { name: 'Bakery', icon: '🍞', color: '#fcf4e4' },
  [THEMES.MIDNIGHT_BLUE]: { name: 'Midnight', icon: '🌌', color: '#0f172a' },
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Environment modes
export const ENVIRONMENTS = {
  LOCAL: 'local',
  STAGING: 'staging',
  PRODUCTION: 'production',
};

// Current environment (defaults to LOCAL)
export const APP_ENV =
  import.meta.env.NEXT_API_URL || ENVIRONMENTS.LOCAL;

// Base URLs per environment
const BASE_URLS = import.meta.env.NEXT_API_URL;

export const API_BASE_URL = BASE_URLS[APP_ENV];

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    REFRESH: '/admin/auth/refresh',
    FORGOT_PASSWORD: '/admin/auth/forgotPassword',
    RESET_PASSWORD: '/admin/auth/resetPassword',
    GET_DETAILS: '/admin/auth/getAdminDetails',
    UPDATE_PROFILE: '/admin/auth/editProfile',
    CHANGE_PASSWORD: '/admin/auth/changePassword',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user',
};

// Application-level flags (feature toggles, etc.)
export const APP_FLAGS = {
  ENABLE_MOCK_API: false, // Use real backend
  ENABLE_ANALYTICS: false,
  ENABLE_DEMO_BANNER: false,
  // Development flag: Set to true to bypass auth for dashboard (ONLY FOR DEVELOPMENT)
  BYPASS_AUTH_FOR_DASHBOARD: false,
};

// Mock User Credentials (for development/testing)
export const MOCK_USER = {
  email: 'admin@portfolio.com',
  password: 'password123',
  user: {
    id: 1,
    name: 'Portfolio Admin',
    email: 'admin@portfolio.com',
    phone: '+1234567890',
    avatar: null,
  },
  token: 'mock_jwt_token_admin_12345',
};



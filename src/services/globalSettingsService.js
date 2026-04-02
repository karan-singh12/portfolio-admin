// Service to manage global admin panel settings
// Stores settings in localStorage

const STORAGE_KEY = 'global_admin_settings';

/**
 * Get all global settings from localStorage
 * @returns {Object} Global settings object
 */
export const getGlobalSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEY);
    if (settings) {
      return JSON.parse(settings);
    }
    // Return default settings
    return {
      branding: {
        fullName: 'Admin Panel',
        shortName: 'Admin Panel',
        logoPath: '/logo.png',
        logoInitials: 'AP',
        pageTitle: 'Admin Panel',
        description: 'Management System',
        logoBase64: null, // For uploaded logo
      },
      theme: {
        primaryColor: '#6366f1',
        accentColor: '#fbbf24',
        mode: 'dark', // light, dark, bakery
        themeStyle: 'midnight_blue', // Default theme style
        // Midnight Blue theme colors
        textDark: '#f5f7ff',
        textLight: '#cbd5e1',
        textMuted: '#94a3b8',
        bgPrimary: '#0f172a',
        bgSecondary: '#1e293b',
        bgTertiary: '#334155',
        borderColor: '#475569',
        borderHover: '#64748b',
        buttonColor: null, // null = use primaryColor
        tableBg: '#1e293b',
        tableBorder: '#475569',
        inputBg: '#334155',
        inputBorder: '#475569',
        sidebarBg: '#1e293b',
        sidebarText: '#f5f7ff',
        navbarBg: '#0f172a',
        navbarText: '#f5f7ff',
        cardBg: '#1e293b',
      },
      login: {
        username: 'admin',
        password: '', // Will be hashed in production
        rememberMe: false,
      },
      updatedAt: null,
    };
  } catch (error) {
    console.error('Error loading global settings:', error);
    return getDefaultSettings();
  }
};

/**
 * Get default settings
 * @returns {Object} Default settings
 */
const getDefaultSettings = () => {
  return {
    branding: {
      fullName: 'Admin Panel',
      shortName: 'Admin Panel',
      logoPath: '/logo.png',
      logoInitials: 'AP',
      pageTitle: 'Admin Panel',
      description: 'Management System',
      logoBase64: null,
    },
    theme: {
      primaryColor: '#6366f1',
      accentColor: '#fbbf24',
      mode: 'dark',
      themeStyle: 'midnight_blue',
      // Midnight Blue theme colors
      textDark: '#f5f7ff',
      textLight: '#cbd5e1',
      textMuted: '#94a3b8',
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      borderColor: '#475569',
      borderHover: '#64748b',
      buttonColor: null,
      tableBg: '#1e293b',
      tableBorder: '#475569',
      inputBg: '#334155',
      inputBorder: '#475569',
      sidebarBg: '#1e293b',
      sidebarText: '#f5f7ff',
      navbarBg: '#0f172a',
      navbarText: '#f5f7ff',
      cardBg: '#1e293b',
    },
    login: {
      username: 'admin',
      password: '',
      rememberMe: false,
    },
    updatedAt: null,
  };
};

/**
 * Save global settings to localStorage
 * @param {Object} settings - Settings object to save
 * @returns {Object} Saved settings
 */
export const saveGlobalSettings = (settings) => {
  try {
    const settingsToSave = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
    // Dispatch custom event to notify components to refresh
    window.dispatchEvent(new CustomEvent('globalSettingsUpdated'));
    return settingsToSave;
  } catch (error) {
    console.error('Error saving global settings:', error);
    throw error;
  }
};

/**
 * Update branding settings
 * @param {Object} branding - Branding settings
 * @returns {Object} Updated settings
 */
export const updateBranding = (branding) => {
  const currentSettings = getGlobalSettings();
  const updatedSettings = {
    ...currentSettings,
    branding: {
      ...currentSettings.branding,
      ...branding,
    },
  };
  return saveGlobalSettings(updatedSettings);
};

/**
 * Update theme settings
 * @param {Object} theme - Theme settings
 * @returns {Object} Updated settings
 */
export const updateTheme = (theme) => {
  const currentSettings = getGlobalSettings();
  const updatedSettings = {
    ...currentSettings,
    theme: {
      ...currentSettings.theme,
      ...theme,
    },
  };
  const saved = saveGlobalSettings(updatedSettings);
  // Apply theme colors immediately
  applyThemeColors(saved.theme);
  return saved;
};

/**
 * Apply theme colors to CSS variables
 * @param {Object} theme - Theme settings object
 */
export const applyThemeColors = (theme) => {
  if (!theme) return;
  
  const root = document.documentElement;
  
  // Primary colors
  if (theme.primaryColor) {
    root.style.setProperty('--primary-color', theme.primaryColor);
    // Calculate primary hover (darker shade)
    root.style.setProperty('--primary-hover', darkenColor(theme.primaryColor, 20));
  }
  
  // Accent colors
  if (theme.accentColor) {
    root.style.setProperty('--accent-color', theme.accentColor);
  }
  
  // Text colors
  if (theme.textDark) root.style.setProperty('--text-dark', theme.textDark);
  if (theme.textLight) root.style.setProperty('--text-light', theme.textLight);
  if (theme.textMuted) root.style.setProperty('--text-muted', theme.textMuted);
  
  // Background colors
  if (theme.bgPrimary) root.style.setProperty('--bg-primary', theme.bgPrimary);
  if (theme.bgSecondary) root.style.setProperty('--bg-secondary', theme.bgSecondary);
  if (theme.bgTertiary) root.style.setProperty('--bg-tertiary', theme.bgTertiary);
  
  // Border colors
  if (theme.borderColor) root.style.setProperty('--border-color', theme.borderColor);
  if (theme.borderHover) root.style.setProperty('--border-hover', theme.borderHover);
  
  // Button colors
  if (theme.buttonColor) {
    root.style.setProperty('--button-color', theme.buttonColor);
  } else if (theme.primaryColor) {
    root.style.setProperty('--button-color', theme.primaryColor);
  }
  
  // Table colors
  if (theme.tableBg) root.style.setProperty('--table-bg', theme.tableBg);
  if (theme.tableBorder) root.style.setProperty('--table-border', theme.tableBorder);
  
  // Input colors
  if (theme.inputBg) root.style.setProperty('--input-bg', theme.inputBg);
  if (theme.inputBorder) root.style.setProperty('--input-border', theme.inputBorder);
  if (theme.primaryColor) root.style.setProperty('--input-focus', theme.primaryColor);
  
  // Sidebar colors
  if (theme.sidebarBg) root.style.setProperty('--sidebar-bg', theme.sidebarBg);
  if (theme.sidebarText) root.style.setProperty('--sidebar-text', theme.sidebarText);
  if (theme.bgSecondary) root.style.setProperty('--sidebar-hover', theme.bgSecondary);
  if (theme.primaryColor) {
    const lightPrimary = lightenColor(theme.primaryColor, 90);
    root.style.setProperty('--sidebar-active', lightPrimary);
  }
  
  // Navbar colors
  if (theme.navbarBg) root.style.setProperty('--navbar-bg', theme.navbarBg);
  if (theme.navbarText) root.style.setProperty('--navbar-text', theme.navbarText);
  
  // Card colors
  if (theme.cardBg) root.style.setProperty('--card-bg', theme.cardBg);
  if (theme.primaryColor) {
    const shadowColor = hexToRgba(theme.primaryColor, 0.15);
    root.style.setProperty('--card-shadow', shadowColor);
  }
};

/**
 * Darken a color by percentage
 * @param {string} color - Hex color
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
const darkenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) - amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) - amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

/**
 * Lighten a color by percentage
 * @param {string} color - Hex color
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

/**
 * Convert hex color to rgba
 * @param {string} hex - Hex color
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Get preset theme colors based on theme mode
 * @param {string} themeMode - Theme mode (light, dark, bakery)
 * @returns {Object} Preset theme colors
 */
export const getPresetThemeColors = (themeMode = 'dark') => {
  const presets = {
    light: {
      primaryColor: '#ff8000',
      accentColor: '#ef4444',
      textDark: '#2d1b0e',
      textLight: '#6b7280',
      textMuted: '#9ca3af',
      bgPrimary: '#ffffff',
      bgSecondary: '#f9fafb',
      bgTertiary: '#f3f4f6',
      borderColor: '#e5e7eb',
      borderHover: '#d1d5db',
      buttonColor: null,
      tableBg: '#ffffff',
      tableBorder: '#e5e7eb',
      inputBg: '#ffffff',
      inputBorder: '#e5e7eb',
      sidebarBg: '#ffffff',
      sidebarText: '#2d1b0e',
      navbarBg: '#ffffff',
      navbarText: '#2d1b0e',
      cardBg: '#ffffff',
    },
    dark: {
      // Midnight Blue theme as default dark
      primaryColor: '#6366f1',
      accentColor: '#fbbf24',
      textDark: '#f5f7ff',
      textLight: '#cbd5e1',
      textMuted: '#94a3b8',
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      borderColor: '#475569',
      borderHover: '#64748b',
      buttonColor: null,
      tableBg: '#1e293b',
      tableBorder: '#475569',
      inputBg: '#334155',
      inputBorder: '#475569',
      sidebarBg: '#1e293b',
      sidebarText: '#f5f7ff',
      navbarBg: '#0f172a',
      navbarText: '#f5f7ff',
      cardBg: '#1e293b',
    },
    bakery: {
      primaryColor: '#ff8000',
      accentColor: '#ef4444',
      textDark: '#2d1b0e',
      textLight: '#6b7280',
      textMuted: '#9ca3af',
      bgPrimary: '#fff8f0',
      bgSecondary: '#fff5e6',
      bgTertiary: '#ffe8cc',
      borderColor: '#ffd4a3',
      borderHover: '#ffb870',
      buttonColor: null,
      tableBg: '#ffffff',
      tableBorder: '#ffd4a3',
      inputBg: '#ffffff',
      inputBorder: '#ffd4a3',
      sidebarBg: '#fff5e6',
      sidebarText: '#2d1b0e',
      navbarBg: '#fff8f0',
      navbarText: '#2d1b0e',
      cardBg: '#ffffff',
    },
  };
  
  return presets[themeMode] || presets.dark;
};

/**
 * Clear custom theme colors to let CSS theme take over
 */
export const clearCustomThemeColors = () => {
  const root = document.documentElement;
  const customColorVars = [
    '--primary-color',
    '--primary-hover',
    '--accent-color',
    '--text-dark',
    '--text-light',
    '--text-muted',
    '--bg-primary',
    '--bg-secondary',
    '--bg-tertiary',
    '--border-color',
    '--border-hover',
    '--button-color',
    '--table-bg',
    '--table-border',
    '--input-bg',
    '--input-border',
    '--input-focus',
    '--sidebar-bg',
    '--sidebar-text',
    '--sidebar-hover',
    '--sidebar-active',
    '--navbar-bg',
    '--navbar-text',
    '--card-bg',
    '--card-shadow',
  ];
  
  customColorVars.forEach((varName) => {
    root.style.removeProperty(varName);
  });
};

/**
 * Initialize theme colors on app load
 */
export const initializeTheme = () => {
  const settings = getGlobalSettings();
  
  // If theme style is set (like midnight_blue), use CSS theme instead of custom colors
  if (settings.theme?.themeStyle) {
    // Clear any custom colors to let CSS theme take over
    clearCustomThemeColors();
    return;
  }
  
  // Only apply custom colors if no theme style is set
  if (settings.theme && !settings.theme.themeStyle) {
    applyThemeColors(settings.theme);
  }
};

/**
 * Extract dominant colors from an image
 * @param {string} imageSrc - Image source (base64 or URL)
 * @param {number} colorCount - Number of colors to extract (default: 5)
 * @returns {Promise<Object>} Object with extracted colors
 */
export const extractColorsFromImage = (imageSrc, colorCount = 5) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Sample pixels (every nth pixel for performance)
        const sampleRate = Math.max(1, Math.floor(pixels.length / (4 * 10000)));
        const colorMap = new Map();
        
        for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          // Quantize colors to reduce variations
          const quantizedR = Math.floor(r / 10) * 10;
          const quantizedG = Math.floor(g / 10) * 10;
          const quantizedB = Math.floor(b / 10) * 10;
          
          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }
        
        // Sort colors by frequency
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, colorCount)
          .map(([color, count]) => {
            const [r, g, b] = color.split(',').map(Number);
            return {
              rgb: { r, g, b },
              hex: rgbToHex(r, g, b),
              count,
            };
          });
        
        // Filter out very light or very dark colors for better results
        const filteredColors = sortedColors.filter((color) => {
          const brightness = (color.rgb.r * 299 + color.rgb.g * 587 + color.rgb.b * 114) / 1000;
          return brightness > 30 && brightness < 240; // Not too dark, not too light
        });
        
        // Get primary and accent colors
        const primaryColor = filteredColors[0]?.hex || sortedColors[0]?.hex || '#6b2532';
        const accentColor = filteredColors[1]?.hex || sortedColors[1]?.hex || '#b8934a';
        
        // Calculate text colors based on primary
        const textDark = getContrastColor(primaryColor);
        const textLight = adjustBrightness(textDark, 40);
        const textMuted = adjustBrightness(textDark, 60);
        
        // Calculate background colors
        const bgPrimary = lightenColor(primaryColor, 95);
        const bgSecondary = lightenColor(primaryColor, 90);
        const bgTertiary = lightenColor(primaryColor, 85);
        
        // Calculate border colors
        const borderColor = lightenColor(primaryColor, 70);
        const borderHover = lightenColor(primaryColor, 60);
        
        resolve({
          primaryColor,
          accentColor,
          textDark,
          textLight,
          textMuted,
          bgPrimary,
          bgSecondary,
          bgTertiary,
          borderColor,
          borderHover,
          allColors: filteredColors.length > 0 ? filteredColors : sortedColors,
        });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = reject;
    img.src = imageSrc;
  });
};

/**
 * Convert RGB to Hex
 * @param {number} r - Red
 * @param {number} g - Green
 * @param {number} b - Blue
 * @returns {string} Hex color
 */
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Get contrast color (black or white) based on background
 * @param {string} hexColor - Hex color
 * @returns {string} Contrast color
 */
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#2d1b0e' : '#f9fafb';
};

/**
 * Adjust brightness of a color
 * @param {string} hexColor - Hex color
 * @param {number} percent - Percentage to adjust
 * @returns {string} Adjusted hex color
 */
const adjustBrightness = (hexColor, percent) => {
  const num = parseInt(hexColor.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

/**
 * Update login credentials
 * @param {Object} login - Login settings
 * @returns {Object} Updated settings
 */
export const updateLoginCredentials = (login) => {
  const currentSettings = getGlobalSettings();
  const updatedSettings = {
    ...currentSettings,
    login: {
      ...currentSettings.login,
      ...login,
    },
  };
  return saveGlobalSettings(updatedSettings);
};

/**
 * Convert image file to base64
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 string
 */
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get logo URL (either base64 or path)
 * @returns {string} Logo URL
 */
export const getLogoUrl = () => {
  const settings = getGlobalSettings();
  if (settings.branding?.logoBase64) {
    return settings.branding.logoBase64;
  }
  return settings.branding?.logoPath || '/logo.png';
};


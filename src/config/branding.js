// Global Admin Panel Branding Configuration
// This file now reads from globalSettingsService for dynamic branding
// Fallback to default values if settings not found

import { getGlobalSettings, getLogoUrl } from '@/services/globalSettingsService';

// Get branding from global settings or use defaults
const getBrandingFromSettings = () => {
  try {
    const settings = getGlobalSettings();
    return {
      FULL_NAME: settings.branding?.fullName || 'Admin Panel',
      SHORT_NAME: settings.branding?.shortName || 'Admin Panel',
      LOGO_PATH: getLogoUrl(),
      LOGO_INITIALS: settings.branding?.logoInitials || 'AP',
      PAGE_TITLE: settings.branding?.pageTitle || 'Admin Panel',
      DESCRIPTION: settings.branding?.description || 'Management System',
    };
  } catch (error) {
    console.error('Error loading branding from settings:', error);
    return getDefaultBranding();
  }
};

// Default branding (fallback)
const getDefaultBranding = () => ({
  FULL_NAME: 'Admin Panel',
  SHORT_NAME: 'Admin Panel',
  LOGO_PATH: '/logo.png',
  LOGO_INITIALS: 'AP',
  PAGE_TITLE: 'Admin Panel',
  DESCRIPTION: 'Management System',
});

// Export dynamic branding object
export const BRANDING = getBrandingFromSettings();

// Function to refresh branding (call after settings update)
export const refreshBranding = () => {
  const updated = getBrandingFromSettings();
  Object.assign(BRANDING, updated);
  return BRANDING;
};

// Helper function to get logo initials from name
export const getLogoInitials = (name = BRANDING.FULL_NAME) => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};


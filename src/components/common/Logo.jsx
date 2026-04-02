import { useState, useEffect } from 'react';
import { Group, Text, Image } from '@mantine/core';
import { BRANDING, getLogoInitials } from '@/config/branding';
import { getLogoUrl } from '@/services/globalSettingsService';
import '@/styles/logo.css';

const Logo = ({ 
  size = 'medium', // 'small', 'medium', 'large'
  showText = true, 
  variant = 'default', // 'default', 'auth'
  className = ''
}) => {
  const [logoError, setLogoError] = useState(false);
  const [logoUrl, setLogoUrl] = useState(BRANDING.LOGO_PATH);

  // Listen for logo updates
  useEffect(() => {
    const updateLogo = () => {
      const url = getLogoUrl();
      setLogoUrl(url);
      setLogoError(false);
    };

    updateLogo();
    window.addEventListener('globalSettingsUpdated', updateLogo);
    return () => {
      window.removeEventListener('globalSettingsUpdated', updateLogo);
    };
  }, []);

  // Size configurations
  const sizeConfig = {
    small: { logo: 32, text: 'sm', gap: 'xs' },
    medium: { logo: 48, text: 'md', gap: 'sm' },
    large: { logo: 64, text: 'lg', gap: 'md' },
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  const isAuth = variant === 'auth';

  // For sidebar (default variant), use circular logo
  const isSidebar = variant === 'default' && !isAuth;
  const logoSize = isSidebar ? (showText ? 44 : 40) : config.logo;
  const borderRadius = isSidebar ? '50%' : (isAuth ? '16px' : '12px');

  return (
    <Group 
      gap={config.gap} 
      align="center" 
      justify={isAuth ? "center" : "flex-start"}
      className={`logo-container ${className} ${variant}`}
      style={{
        flexDirection: isAuth ? 'column' : 'row',
        marginBottom: isAuth ? '1.5rem' : '0',
        width: '100%',
      }}
    >
      {logoError ? (
        <div
          className="logo-fallback"
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: borderRadius,
            background: isSidebar
              ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)'
              : isAuth 
                ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)'
                : 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: logoSize * 0.42,
            flexShrink: 0,
            boxShadow: isSidebar
              ? '0 4px 12px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
              : isAuth 
                ? '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)'
                : '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: isSidebar ? '2px solid rgba(255, 255, 255, 0.2)' : 'none',
            position: 'relative',
          }}
        >
          {BRANDING.LOGO_INITIALS || getLogoInitials()}
        </div>
      ) : (
        <div
          className="logo-image-wrapper"
          style={{
            position: 'relative',
            width: logoSize,
            height: logoSize,
            borderRadius: borderRadius,
            overflow: 'hidden',
            boxShadow: isSidebar
              ? '0 4px 12px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
              : isAuth 
                ? '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)'
                : '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: isSidebar
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)'
              : isAuth 
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                : 'transparent',
            border: isSidebar 
              ? '2.5px solid rgba(255, 255, 255, 0.2)' 
              : isAuth 
                ? '2px solid rgba(255, 255, 255, 0.2)' 
                : 'none',
          }}
        >
          <img 
            src={logoUrl} 
            alt={`${BRANDING.FULL_NAME} Logo`} 
            className="logo-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: isSidebar ? 'cover' : 'contain',
              display: 'block',
              padding: isSidebar ? '0' : (isAuth ? '8px' : '4px'),
            }}
            onError={() => setLogoError(true)}
          />
        </div>
      )}
      {showText && (
        <Text 
          fw={600} 
          size={isSidebar ? 'md' : config.text}
          c={isSidebar ? 'var(--sidebar-text)' : (isAuth ? 'var(--primary-color)' : 'var(--primary-color)')}
          className="logo-text"
          style={{
            textAlign: isAuth ? 'center' : 'left',
            letterSpacing: isSidebar ? '0.5px' : '0.5px',
            fontSize: isSidebar ? '17px' : undefined,
            lineHeight: isSidebar ? '1.3' : undefined,
            fontWeight: isSidebar ? 600 : 700,
            marginLeft: isSidebar ? '4px' : '0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {isAuth ? BRANDING.FULL_NAME : BRANDING.SHORT_NAME}
        </Text>
      )}
    </Group>
  );
};

export default Logo;


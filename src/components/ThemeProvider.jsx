import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import {
  lightTheme,
  darkTheme,
  bakeryTheme,
  oceanBlueTheme,
  forestGreenTheme,
  sunsetOrangeTheme,
  purpleDreamTheme,
  darkProTheme,
  minimalGrayTheme,
  royalGoldTheme,
  midnightBlueTheme,
  rosePinkTheme,
  emeraldGreenTheme,
  cyanSkyTheme,
  amberYellowTheme,
  crimsonRedTheme,
  indigoPurpleTheme,
  tealOceanTheme,
  seaGreenTheme,
  lavenderMistTheme,
} from '@/theme';
import { THEMES } from '@/config/constants';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/styles/theme.css';
import '@/styles/animations.css';

const ThemeProvider = ({ children }) => {
  const { currentTheme } = useSelector((state) => state.theme);

  useEffect(() => {
    // Smooth theme transition animation
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Set color scheme for dark themes
    const darkThemes = [THEMES.DARK, THEMES.DARK_PRO, THEMES.MIDNIGHT_BLUE];
    const colorScheme = darkThemes.includes(currentTheme) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-mantine-color-scheme', colorScheme);
    
    // Remove transition after animation completes
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 500);
  }, [currentTheme]);

  const getTheme = () => {
    switch (currentTheme) {
      case THEMES.DARK:
        return darkTheme;
      case THEMES.BAKERY:
        return bakeryTheme;
      case THEMES.OCEAN_BLUE:
        return oceanBlueTheme;
      case THEMES.FOREST_GREEN:
        return forestGreenTheme;
      case THEMES.SUNSET_ORANGE:
        return sunsetOrangeTheme;
      case THEMES.PURPLE_DREAM:
        return purpleDreamTheme;
      case THEMES.DARK_PRO:
        return darkProTheme;
      case THEMES.MINIMAL_GRAY:
        return minimalGrayTheme;
      case THEMES.ROYAL_GOLD:
        return royalGoldTheme;
      case THEMES.MIDNIGHT_BLUE:
        return midnightBlueTheme;
      case THEMES.ROSE_PINK:
        return rosePinkTheme;
      case THEMES.EMERALD_GREEN:
        return emeraldGreenTheme;
      case THEMES.CYAN_SKY:
        return cyanSkyTheme;
      case THEMES.AMBER_YELLOW:
        return amberYellowTheme;
      case THEMES.CRIMSON_RED:
        return crimsonRedTheme;
      case THEMES.INDIGO_PURPLE:
        return indigoPurpleTheme;
      case THEMES.TEAL_OCEAN:
        return tealOceanTheme;
      case THEMES.SEA_GREEN:
        return seaGreenTheme;
      case THEMES.LAVENDER_MIST:
        return lavenderMistTheme;
      default:
        return lightTheme;
    }
  };

  const getColorScheme = () => {
    const darkThemes = [THEMES.DARK, THEMES.DARK_PRO, THEMES.MIDNIGHT_BLUE];
    return darkThemes.includes(currentTheme) ? 'dark' : 'light';
  };

  return (
    <MantineProvider
      theme={getTheme()}
      defaultColorScheme={getColorScheme()}
    >
      <Notifications position="top-right" zIndex={1000} />
      {children}
    </MantineProvider>
  );
};

export default ThemeProvider;


import { createTheme } from '@mantine/core';

// Bakery custom colors (warm theme)
const bakeryColors = {
  primary: [
    '#fff5e6',
    '#ffe8cc',
    '#ffd4a3',
    '#ffb870',
    '#ff9c3d',
    '#ff8000',
    '#cc6600',
    '#994d00',
    '#663300',
    '#331a00',
  ],
  secondary: [
    '#f5f0e8',
    '#e8ddd0',
    '#d4c4b0',
    '#c0ab90',
    '#ac9270',
    '#987950',
    '#7a6140',
    '#5c4930',
    '#3e3020',
    '#201810',
  ],
  accent: [
    '#fef2f2',
    '#fee2e2',
    '#fecaca',
    '#fca5a5',
    '#f87171',
    '#ef4444',
    '#dc2626',
    '#b91c1c',
    '#991b1b',
    '#7f1d1d',
  ],
};

export const lightTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: bakeryColors.primary,
    secondary: bakeryColors.secondary,
    accent: bakeryColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});

export const darkTheme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'primary',
  colors: {
    primary: bakeryColors.primary,
    secondary: bakeryColors.secondary,
    accent: bakeryColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});

export const bakeryTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: bakeryColors.primary,
    secondary: bakeryColors.secondary,
    accent: bakeryColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#fff8f0',
  black: '#2d1b0e',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
        style: {
          background: 'linear-gradient(145deg, rgba(255, 248, 240, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        },
      },
    },
  },
});

// Ocean Blue Theme - Professional & Trustworthy
const oceanBlueColors = {
  primary: ['#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49'],
  secondary: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const oceanBlueTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: oceanBlueColors.primary,
    secondary: oceanBlueColors.secondary,
    accent: oceanBlueColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#0c4a6e',
});

// Forest Green Theme - Nature & Growth
const forestGreenColors = {
  primary: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  secondary: ['#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#365314', '#1a2e05'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const forestGreenTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: forestGreenColors.primary,
    secondary: forestGreenColors.secondary,
    accent: forestGreenColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#14532d',
});

// Sunset Orange Theme - Warm & Energetic
const sunsetOrangeColors = {
  primary: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
  secondary: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const sunsetOrangeTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: sunsetOrangeColors.primary,
    secondary: sunsetOrangeColors.secondary,
    accent: sunsetOrangeColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#7c2d12',
});

// Purple Dream Theme - Modern & Creative
const purpleDreamColors = {
  primary: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
  secondary: ['#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const purpleDreamTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: purpleDreamColors.primary,
    secondary: purpleDreamColors.secondary,
    accent: purpleDreamColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#581c87',
});

// Dark Pro Theme - Premium Dark Mode
const darkProColors = {
  primary: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#f8fafc', '#ffffff'],
  secondary: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#f8fafc'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const darkProTheme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'primary',
  colors: {
    primary: darkProColors.primary,
    secondary: darkProColors.secondary,
    accent: darkProColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#f8fafc',
  black: '#0f172a',
});

// Minimal Gray Theme - Clean & Professional
const minimalGrayColors = {
  primary: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'],
  secondary: ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const minimalGrayTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: minimalGrayColors.primary,
    secondary: minimalGrayColors.secondary,
    accent: minimalGrayColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#111827',
});

// Royal Gold Theme - Luxury & Elegance
const royalGoldColors = {
  primary: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
  secondary: ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12'],
  accent: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
};

export const royalGoldTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: royalGoldColors.primary,
    secondary: royalGoldColors.secondary,
    accent: royalGoldColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#78350f',
});

// Midnight Blue Theme - Deep & Sophisticated
const midnightBlueColors = {
  primary: ['#1e1b4b', '#312e81', '#4338ca', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#eef2ff', '#f5f7ff'],
  secondary: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#f8fafc'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const midnightBlueTheme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'primary',
  colors: {
    primary: midnightBlueColors.primary,
    secondary: midnightBlueColors.secondary,
    accent: midnightBlueColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#f5f7ff',
  black: '#0f172a',
});

// Rose Pink Theme - Soft & Feminine
const rosePinkColors = {
  primary: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337'],
  secondary: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const rosePinkTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: rosePinkColors.primary,
    secondary: rosePinkColors.secondary,
    accent: rosePinkColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#881337',
});

// Emerald Green Theme - Fresh & Vibrant
const emeraldGreenColors = {
  primary: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  secondary: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const emeraldGreenTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: emeraldGreenColors.primary,
    secondary: emeraldGreenColors.secondary,
    accent: emeraldGreenColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#064e3b',
});

// Cyan Sky Theme - Bright & Modern
const cyanSkyColors = {
  primary: ['#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#083344'],
  secondary: ['#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const cyanSkyTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: cyanSkyColors.primary,
    secondary: cyanSkyColors.secondary,
    accent: cyanSkyColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#083344',
});

// Amber Yellow Theme - Energetic & Bold
const amberYellowColors = {
  primary: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
  secondary: ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12'],
  accent: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
};

export const amberYellowTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: amberYellowColors.primary,
    secondary: amberYellowColors.secondary,
    accent: amberYellowColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#78350f',
});

// Crimson Red Theme - Bold & Powerful
const crimsonRedColors = {
  primary: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
  secondary: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const crimsonRedTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: crimsonRedColors.primary,
    secondary: crimsonRedColors.secondary,
    accent: crimsonRedColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#7f1d1d',
});

// Indigo Purple Theme - Deep & Mysterious
const indigoPurpleColors = {
  primary: ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'],
  secondary: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const indigoPurpleTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: indigoPurpleColors.primary,
    secondary: indigoPurpleColors.secondary,
    accent: indigoPurpleColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#312e81',
});

// Teal Ocean Theme - Calm & Serene
const tealOceanColors = {
  primary: ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'],
  secondary: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const tealOceanTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: tealOceanColors.primary,
    secondary: tealOceanColors.secondary,
    accent: tealOceanColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#134e4a',
});

// Sea Green Theme - Fresh & Refreshing
const seaGreenColors = {
  primary: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#0d9488', '#0f766e', '#115e59', '#134e4a'],
  secondary: ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const seaGreenTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: seaGreenColors.primary,
    secondary: seaGreenColors.secondary,
    accent: seaGreenColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#134e4a',
});

// Lavender Mist Theme - Soft & Dreamy
const lavenderMistColors = {
  primary: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
  secondary: ['#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75'],
  accent: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
};

export const lavenderMistTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: lavenderMistColors.primary,
    secondary: lavenderMistColors.secondary,
    accent: lavenderMistColors.accent,
  },
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#581c87',
});


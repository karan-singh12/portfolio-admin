import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Stack,
  Tabs,
  TextInput,
  Button,
  Select,
  Text,
  Group,
  Divider,
  Paper,
  Image,
  ColorInput,
  FileButton,
  Switch,
  PasswordInput,
  Alert,
} from '@mantine/core';
import {
  IconPalette,
  IconBuilding,
  IconShield,
  IconDeviceDesktop,
  IconUpload,
  IconX,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '@/store/slices/themeSlice';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  getGlobalSettings,
  saveGlobalSettings,
  updateBranding,
  updateTheme,
  updateLoginCredentials,
  convertImageToBase64,
  getLogoUrl,
  applyThemeColors,
  extractColorsFromImage,
  getPresetThemeColors,
  clearCustomThemeColors,
} from '@/services/globalSettingsService';

const Settings = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.theme);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [themeImagePreview, setThemeImagePreview] = useState(null);
  const [extractingColors, setExtractingColors] = useState(false);
  const [extractedColors, setExtractedColors] = useState(null);

  useEffect(() => {
    loadSettings();
    window.addEventListener('globalSettingsUpdated', loadSettings);
    // Apply theme on mount
    if (settings?.theme) {
      applyThemeColors(settings.theme);
    }
    return () => {
      window.removeEventListener('globalSettingsUpdated', loadSettings);
    };
  }, []);

  const loadSettings = () => {
    const loadedSettings = getGlobalSettings();
    setSettings(loadedSettings);
    
    // Initialize forms with loaded settings
    brandingForm.setValues(loadedSettings.branding);
    
    // Ensure all color values are strings, never null or undefined
    const theme = loadedSettings.theme || {};
    themeForm.setValues({
      primaryColor: theme.primaryColor || '#6366f1',
      accentColor: theme.accentColor || '#fbbf24',
      mode: theme.mode || 'dark',
      theme: theme.themeStyle || currentTheme || 'midnight_blue',
      textDark: theme.textDark || '#f5f7ff',
      textLight: theme.textLight || '#cbd5e1',
      textMuted: theme.textMuted || '#94a3b8',
      bgPrimary: theme.bgPrimary || '#0f172a',
      bgSecondary: theme.bgSecondary || '#1e293b',
      bgTertiary: theme.bgTertiary || '#334155',
      borderColor: theme.borderColor || '#475569',
      borderHover: theme.borderHover || '#64748b',
      buttonColor: theme.buttonColor || theme.primaryColor || '#6366f1',
      tableBg: theme.tableBg || '#1e293b',
      tableBorder: theme.tableBorder || '#475569',
      inputBg: theme.inputBg || '#334155',
      inputBorder: theme.inputBorder || '#475569',
      sidebarBg: theme.sidebarBg || '#1e293b',
      sidebarText: theme.sidebarText || '#f5f7ff',
      navbarBg: theme.navbarBg || '#0f172a',
      navbarText: theme.navbarText || '#f5f7ff',
      cardBg: theme.cardBg || '#1e293b',
    });
    loginForm.setValues(loadedSettings.login);
    
    // Set logo preview if base64 exists
    if (loadedSettings.branding?.logoBase64) {
      setLogoPreview(loadedSettings.branding.logoBase64);
    } else if (loadedSettings.branding?.logoPath) {
      setLogoPreview(loadedSettings.branding.logoPath);
    }
  };

  const brandingForm = useForm({
    initialValues: {
      fullName: 'Admin Panel',
      shortName: 'Admin Panel',
      logoPath: '/logo.png',
      logoInitials: 'AP',
      pageTitle: 'Admin Panel',
      description: 'Management System',
    },
  });

  const themeForm = useForm({
    initialValues: {
      theme: currentTheme || 'midnight_blue',
      primaryColor: '#6366f1',
      accentColor: '#fbbf24',
      mode: 'dark',
      // Text colors (Midnight Blue default)
      textDark: '#f5f7ff',
      textLight: '#cbd5e1',
      textMuted: '#94a3b8',
      // Background colors
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      // Border colors
      borderColor: '#475569',
      borderHover: '#64748b',
      // Button color
      buttonColor: null,
      // Table colors
      tableBg: '#1e293b',
      tableBorder: '#475569',
      // Input colors
      inputBg: '#334155',
      inputBorder: '#475569',
      // Sidebar colors
      sidebarBg: '#1e293b',
      sidebarText: '#f5f7ff',
      // Navbar colors
      navbarBg: '#0f172a',
      navbarText: '#f5f7ff',
      // Card colors
      cardBg: '#1e293b',
    },
  });

  const loginForm = useForm({
    initialValues: {
      username: 'admin',
      password: '',
      newPassword: '',
      confirmPassword: '',
      rememberMe: false,
    },
  });

  const handleLogoUpload = async (file) => {
    if (!file) return;
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification({
          title: 'Error',
          message: 'Please upload an image file',
          color: 'red',
        });
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showNotification({
          title: 'Error',
          message: 'Image size should be less than 2MB',
          color: 'red',
        });
        return;
      }
      
      // Convert to base64
      const base64 = await convertImageToBase64(file);
      setLogoPreview(base64);
      setLogoFile(file);
      
      showNotification({
        title: 'Success',
        message: 'Logo uploaded successfully',
        color: 'green',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to upload logo',
        color: 'red',
      });
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    brandingForm.setFieldValue('logoBase64', null);
  };

  const handleBrandingSubmit = (values) => {
    try {
      const brandingData = {
        ...values,
        logoBase64: logoPreview && logoPreview.startsWith('data:') ? logoPreview : null,
        logoPath: logoPreview && !logoPreview.startsWith('data:') ? logoPreview : values.logoPath,
      };
      
      updateBranding(brandingData);
      showNotification({
        title: 'Success',
        message: 'Branding settings saved successfully',
        color: 'green',
      });
      
      // Update page title
      document.title = values.pageTitle;
      
      // Reload to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to save branding settings',
        color: 'red',
      });
    }
  };

  const handleThemeSubmit = (values) => {
    try {
      // Update Redux theme
      dispatch(setTheme(values.theme));
      
      // If theme style is set, clear custom colors
      if (values.theme && values.theme !== 'light' && values.theme !== 'dark' && values.theme !== 'bakery') {
        clearCustomThemeColors();
      }
      
      // Prepare theme object with all colors
      const themeData = {
        primaryColor: values.primaryColor,
        accentColor: values.accentColor,
        mode: values.mode,
        themeStyle: values.theme, // Save theme style
        textDark: values.textDark,
        textLight: values.textLight,
        textMuted: values.textMuted,
        bgPrimary: values.bgPrimary,
        bgSecondary: values.bgSecondary,
        bgTertiary: values.bgTertiary,
        borderColor: values.borderColor,
        borderHover: values.borderHover,
        buttonColor: values.buttonColor || null,
        tableBg: values.tableBg,
        tableBorder: values.tableBorder,
        inputBg: values.inputBg,
        inputBorder: values.inputBorder,
        sidebarBg: values.sidebarBg,
        sidebarText: values.sidebarText,
        navbarBg: values.navbarBg,
        navbarText: values.navbarText,
        cardBg: values.cardBg,
      };
      
      // Update and apply theme colors
      updateTheme(themeData);
      
      showNotification({
        title: 'Success',
        message: 'Theme settings saved and applied successfully',
        color: 'green',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to save theme settings',
        color: 'red',
      });
    }
  };

  // Handle real-time color preview
  const handleColorChange = (field, value) => {
    // Ensure value is never null or undefined for ColorInput
    // ColorInput requires a string value, so provide fallback
    const safeValue = value && typeof value === 'string' ? value : (field === 'buttonColor' ? themeForm.values.primaryColor || '#6366f1' : '#000000');
    themeForm.setFieldValue(field, safeValue);
    // Apply immediately for preview
    const currentValues = themeForm.values;
    applyThemeColors({
      ...currentValues,
      [field]: safeValue,
    });
  };

  const handleThemeImageUpload = async (file) => {
    if (!file) return;
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification({
          title: 'Error',
          message: 'Please upload an image file',
          color: 'red',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification({
          title: 'Error',
          message: 'Image size should be less than 5MB',
          color: 'red',
        });
        return;
      }
      
      // Convert to base64 for preview
      const base64 = await convertImageToBase64(file);
      setThemeImagePreview(base64);
      
      showNotification({
        title: 'Success',
        message: 'Image uploaded. Click "Extract Colors" to analyze.',
        color: 'green',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to upload image',
        color: 'red',
      });
    }
  };

  const handleExtractColors = async () => {
    if (!themeImagePreview) return;
    
    try {
      setExtractingColors(true);
      const colors = await extractColorsFromImage(themeImagePreview, 5);
      setExtractedColors(colors);
      
      showNotification({
        title: 'Success',
        message: 'Colors extracted successfully! Click "Apply Extracted Colors" to use them.',
        color: 'green',
      });
    } catch (error) {
      console.error('Error extracting colors:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to extract colors from image',
        color: 'red',
      });
    } finally {
      setExtractingColors(false);
    }
  };

  const handleApplyExtractedColors = () => {
    if (!extractedColors) return;
    
    try {
      // Reset all custom colors and apply extracted colors
      const resetValues = {
        ...themeForm.values,
        // Reset to extracted colors (overwrites all custom colors)
        primaryColor: extractedColors.primaryColor,
        accentColor: extractedColors.accentColor,
        textDark: extractedColors.textDark,
        textLight: extractedColors.textLight,
        textMuted: extractedColors.textMuted,
        bgPrimary: extractedColors.bgPrimary,
        bgSecondary: extractedColors.bgSecondary,
        bgTertiary: extractedColors.bgTertiary,
        borderColor: extractedColors.borderColor,
        borderHover: extractedColors.borderHover,
        // Reset component colors to defaults based on extracted colors
        buttonColor: '',
        tableBg: extractedColors.bgPrimary,
        tableBorder: extractedColors.borderColor,
        inputBg: extractedColors.bgPrimary,
        inputBorder: extractedColors.borderColor,
        sidebarBg: extractedColors.bgSecondary,
        sidebarText: extractedColors.textDark,
        navbarBg: extractedColors.bgPrimary,
        navbarText: extractedColors.textDark,
        cardBg: extractedColors.bgPrimary,
      };
      
      themeForm.setValues(resetValues);
      
      // Apply immediately
      applyThemeColors({
        ...resetValues,
        mode: themeForm.values.mode,
      });
      
      showNotification({
        title: 'Success',
        message: 'Extracted colors applied! Custom colors reset. Click "Save Theme Settings" to persist.',
        color: 'green',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to apply extracted colors',
        color: 'red',
      });
    }
  };

  const handleLoginSubmit = (values) => {
    try {
      // Validate password change
      if (values.newPassword) {
        if (values.newPassword !== values.confirmPassword) {
          showNotification({
            title: 'Error',
            message: 'New passwords do not match',
            color: 'red',
          });
          return;
        }
        
        if (values.newPassword.length < 6) {
          showNotification({
            title: 'Error',
            message: 'Password must be at least 6 characters',
            color: 'red',
          });
          return;
        }
      }
      
      updateLoginCredentials({
        username: values.username,
        password: values.newPassword || values.password,
        rememberMe: values.rememberMe,
      });
      
      showNotification({
        title: 'Success',
        message: 'Login credentials updated successfully',
        color: 'green',
      });
      
      // Clear password fields
      loginForm.setFieldValue('newPassword', '');
      loginForm.setFieldValue('confirmPassword', '');
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to save login credentials',
        color: 'red',
      });
    }
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Title order={1}>Global Settings</Title>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Tabs defaultValue="branding">
            <Tabs.List>
              <Tabs.Tab value="branding" leftSection={<IconDeviceDesktop size={16} />}>
                Branding
              </Tabs.Tab>
              <Tabs.Tab value="theme" leftSection={<IconPalette size={16} />}>
                Theme
              </Tabs.Tab>
              <Tabs.Tab value="login" leftSection={<IconShield size={16} />}>
                Login Credentials
              </Tabs.Tab>
            </Tabs.List>

            {/* Branding Tab */}
            <Tabs.Panel value="branding" pt="md">
              <form onSubmit={brandingForm.onSubmit(handleBrandingSubmit)}>
                <Stack gap="md">
                  <Divider label="Admin Panel Information" labelPosition="left" />
                  
                  <Group grow>
                    <TextInput
                      label="Full Name"
                      placeholder="Admin Panel"
                      description="Full name displayed in navbar and login page"
                      required
                      {...brandingForm.getInputProps('fullName')}
                    />
                    <TextInput
                      label="Short Name"
                      placeholder="Admin Panel"
                      description="Short name displayed in sidebar"
                      required
                      {...brandingForm.getInputProps('shortName')}
                    />
                  </Group>

                  <TextInput
                    label="Page Title"
                    placeholder="Admin Panel"
                    description="Title shown in browser tab"
                    required
                    {...brandingForm.getInputProps('pageTitle')}
                  />

                  <TextInput
                    label="Description"
                    placeholder="Management System"
                    description="Subtitle or description"
                    {...brandingForm.getInputProps('description')}
                  />

                  <TextInput
                    label="Logo Initials"
                    placeholder="AP"
                    description="2 characters shown when logo fails to load"
                    maxLength={2}
                    {...brandingForm.getInputProps('logoInitials')}
                  />

                  <Divider label="Logo Upload" labelPosition="left" />

                  <Stack gap="sm">
                    <Text size="sm" fw={500}>
                      Current Logo
                    </Text>
                    {logoPreview ? (
                      <Paper p="md" withBorder style={{ maxWidth: 200 }}>
                        <Group>
                          <Image
                            src={logoPreview}
                            alt="Logo"
                            style={{ maxWidth: 100, maxHeight: 100, objectFit: 'contain' }}
                          />
                          <Button
                            size="xs"
                            color="red"
                            variant="light"
                            leftSection={<IconX size={14} />}
                            onClick={handleRemoveLogo}
                          >
                            Remove
                          </Button>
                        </Group>
                      </Paper>
                    ) : (
                      <Text size="sm" c="dimmed">
                        No logo uploaded
                      </Text>
                    )}

                    <FileButton
                      onChange={handleLogoUpload}
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    >
                      {(props) => (
                        <Button
                          {...props}
                          leftSection={<IconUpload size={16} />}
                          variant="light"
                        >
                          Upload Logo
                        </Button>
                      )}
                    </FileButton>
                    <Text size="xs" c="dimmed">
                      Recommended: PNG, JPG, or SVG. Max size: 2MB
                    </Text>
                  </Stack>

                  <Group justify="flex-end" mt="md">
                    <Button
                      type="submit"
                      leftSection={<IconCheck size={16} />}
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      Save Branding Settings
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Tabs.Panel>

            {/* Theme Tab */}
            <Tabs.Panel value="theme" pt="md">
              <form onSubmit={themeForm.onSubmit(handleThemeSubmit)}>
                <Stack gap="md">
                  <Divider label="Import Theme from Image" labelPosition="left" />
                  
                  <Paper p="md" withBorder style={{ backgroundColor: 'var(--card-bg)' }}>
                    <Stack gap="sm">
                      <Text size="sm" fw={500}>
                        Upload an image to extract colors (e.g., Flipkart homepage, Bilinkit dashboard)
                      </Text>
                      
                      {themeImagePreview && (
                        <Paper p="sm" withBorder>
                          <Group>
                            <Image
                              src={themeImagePreview}
                              alt="Theme Preview"
                              style={{ maxWidth: 200, maxHeight: 150, objectFit: 'contain' }}
                            />
                            <Stack gap="xs" style={{ flex: 1 }}>
                              <Button
                                size="xs"
                                variant="light"
                                leftSection={<IconUpload size={14} />}
                                onClick={handleExtractColors}
                                loading={extractingColors}
                                disabled={!themeImagePreview}
                              >
                                {extractingColors ? 'Extracting Colors...' : 'Extract Colors from Image'}
                              </Button>
                              <Button
                                size="xs"
                                color="red"
                                variant="light"
                                leftSection={<IconX size={14} />}
                                onClick={() => {
                                  setThemeImagePreview(null);
                                  setExtractedColors(null);
                                }}
                              >
                                Remove Image
                              </Button>
                            </Stack>
                          </Group>
                        </Paper>
                      )}
                      
                      {!themeImagePreview && (
                        <FileButton
                          onChange={handleThemeImageUpload}
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                        >
                          {(props) => (
                            <Button
                              {...props}
                              leftSection={<IconUpload size={16} />}
                              variant="light"
                            >
                              Upload Theme Image
                            </Button>
                          )}
                        </FileButton>
                      )}
                      
                      {extractedColors && (
                        <Paper p="sm" withBorder style={{ backgroundColor: 'var(--bg-secondary)' }}>
                          <Stack gap="xs">
                            <Text size="sm" fw={500}>
                              Extracted Colors:
                            </Text>
                            <Group gap="xs">
                              {extractedColors.allColors?.slice(0, 5).map((color, index) => (
                                <div key={index} style={{ textAlign: 'center' }}>
                                  <div
                                    style={{
                                      width: 40,
                                      height: 40,
                                      backgroundColor: color.hex,
                                      border: '1px solid var(--border-color)',
                                      borderRadius: 4,
                                      marginBottom: 4,
                                    }}
                                  />
                                  <Text size="xs" c="dimmed">
                                    {color.hex}
                                  </Text>
                                </div>
                              ))}
                            </Group>
                            <Button
                              size="xs"
                              variant="filled"
                              leftSection={<IconCheck size={14} />}
                              onClick={handleApplyExtractedColors}
                              style={{ backgroundColor: extractedColors.primaryColor }}
                            >
                              Apply Extracted Colors to Theme
                            </Button>
                          </Stack>
                        </Paper>
                      )}
                    </Stack>
                  </Paper>

                  <Divider label="Basic Theme Configuration" labelPosition="left" />

                  <Group grow>
                    <Select
                      label="Theme Mode"
                      description="Color scheme mode (will reset custom colors)"
                      data={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'bakery', label: 'Bakery Theme' },
                      ]}
                      value={themeForm.values.mode}
                      onChange={(value) => {
                        if (value) {
                          // Reset to preset theme colors based on mode
                          const presetColors = getPresetThemeColors(value);
                          const updatedValues = {
                            ...themeForm.values,
                            mode: value,
                            ...presetColors,
                          };
                          themeForm.setValues(updatedValues);
                          
                          // Apply immediately
                          applyThemeColors(updatedValues);
                          
                          showNotification({
                            title: 'Theme Mode Changed',
                            message: 'Custom colors reset to preset theme colors for selected mode',
                            color: 'blue',
                          });
                        }
                      }}
                    />
                    <Select
                      label="Theme Style"
                      description="Preset theme style (will reset custom colors)"
                      data={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'bakery', label: 'Bakery Theme' },
                        { value: 'ocean_blue', label: 'Ocean Blue' },
                        { value: 'forest_green', label: 'Forest Green' },
                        { value: 'sunset_orange', label: 'Sunset Orange' },
                        { value: 'purple_dream', label: 'Purple Dream' },
                        { value: 'dark_pro', label: 'Dark Pro' },
                        { value: 'minimal_gray', label: 'Minimal Gray' },
                        { value: 'royal_gold', label: 'Royal Gold' },
                        { value: 'midnight_blue', label: 'Midnight Blue' },
                        { value: 'rose_pink', label: 'Rose Pink' },
                        { value: 'emerald_green', label: 'Emerald Green' },
                        { value: 'cyan_sky', label: 'Cyan Sky' },
                        { value: 'amber_yellow', label: 'Amber Yellow' },
                      ]}
                      value={themeForm.values.theme}
                      onChange={(value) => {
                        if (value) {
                          // Update Redux theme (this will trigger ThemeProvider to set data-theme attribute)
                          dispatch(setTheme(value));
                          
                          // Clear custom colors immediately to let CSS theme take over
                          clearCustomThemeColors();
                          
                          // Update form values
                          themeForm.setFieldValue('theme', value);
                          themeForm.setFieldValue('themeStyle', value);
                          
                          // Save theme style to settings
                          const currentSettings = getGlobalSettings();
                          updateTheme({
                            ...currentSettings.theme,
                            themeStyle: value,
                          });
                          
                          showNotification({
                            title: 'Theme Style Updated',
                            message: `Preset theme "${value}" applied. Custom colors cleared.`,
                            color: 'green',
                          });
                        }
                      }}
                    />
                  </Group>

                  <Group grow>
                    <ColorInput
                      label="Primary Color"
                      description="Main brand color (buttons, links, highlights)"
                      format="hex"
                      value={themeForm.values.primaryColor || '#6366f1'}
                      onChange={(value) => handleColorChange('primaryColor', value || '#6366f1')}
                    />
                    <ColorInput
                      label="Accent Color"
                      description="Secondary brand color"
                      format="hex"
                      value={themeForm.values.accentColor || '#fbbf24'}
                      onChange={(value) => handleColorChange('accentColor', value || '#fbbf24')}
                    />
                  </Group>

                  <Divider label="Text Colors" labelPosition="left" />

                  <Group grow>
                    <ColorInput
                      label="Text Dark"
                      description="Main text color"
                      format="hex"
                      value={themeForm.values.textDark || '#f5f7ff'}
                      onChange={(value) => handleColorChange('textDark', value || '#f5f7ff')}
                    />
                    <ColorInput
                      label="Text Light"
                      description="Secondary text color"
                      format="hex"
                      value={themeForm.values.textLight || '#cbd5e1'}
                      onChange={(value) => handleColorChange('textLight', value || '#cbd5e1')}
                    />
                    <ColorInput
                      label="Text Muted"
                      description="Muted/disabled text color"
                      format="hex"
                      value={themeForm.values.textMuted || '#94a3b8'}
                      onChange={(value) => handleColorChange('textMuted', value || '#94a3b8')}
                    />
                  </Group>

                  <Divider label="Background Colors" labelPosition="left" />

                  <Group grow>
                    <ColorInput
                      label="Background Primary"
                      description="Main background color"
                      format="hex"
                      value={themeForm.values.bgPrimary || '#0f172a'}
                      onChange={(value) => handleColorChange('bgPrimary', value || '#0f172a')}
                    />
                    <ColorInput
                      label="Background Secondary"
                      description="Secondary background (cards, panels)"
                      format="hex"
                      value={themeForm.values.bgSecondary || '#1e293b'}
                      onChange={(value) => handleColorChange('bgSecondary', value || '#1e293b')}
                    />
                    <ColorInput
                      label="Background Tertiary"
                      description="Tertiary background (hover states)"
                      format="hex"
                      value={themeForm.values.bgTertiary || '#334155'}
                      onChange={(value) => handleColorChange('bgTertiary', value || '#334155')}
                    />
                  </Group>

                  <Divider label="Border Colors" labelPosition="left" />

                  <Group grow>
                    <ColorInput
                      label="Border Color"
                      description="Default border color"
                      format="hex"
                      value={themeForm.values.borderColor || '#475569'}
                      onChange={(value) => handleColorChange('borderColor', value || '#475569')}
                    />
                    <ColorInput
                      label="Border Hover"
                      description="Border color on hover"
                      format="hex"
                      value={themeForm.values.borderHover || '#64748b'}
                      onChange={(value) => handleColorChange('borderHover', value || '#64748b')}
                    />
                  </Group>

                  <Divider label="Component Colors" labelPosition="left" />

                  <Group grow>
                    <ColorInput
                      label="Button Color"
                      description="Button background (leave empty to use primary)"
                      format="hex"
                      value={themeForm.values.buttonColor || themeForm.values.primaryColor || '#6366f1'}
                      onChange={(value) => handleColorChange('buttonColor', value || themeForm.values.primaryColor || '#6366f1')}
                      placeholder="Auto (Primary)"
                    />
                    <ColorInput
                      label="Table Background"
                      description="Table background color"
                      format="hex"
                      value={themeForm.values.tableBg || '#1e293b'}
                      onChange={(value) => handleColorChange('tableBg', value || '#1e293b')}
                    />
                    <ColorInput
                      label="Table Border"
                      description="Table border color"
                      format="hex"
                      value={themeForm.values.tableBorder || '#475569'}
                      onChange={(value) => handleColorChange('tableBorder', value || '#475569')}
                    />
                  </Group>

                  <Group grow>
                    <ColorInput
                      label="Input Background"
                      description="Input field background"
                      format="hex"
                      value={themeForm.values.inputBg || '#334155'}
                      onChange={(value) => handleColorChange('inputBg', value || '#334155')}
                    />
                    <ColorInput
                      label="Input Border"
                      description="Input field border"
                      format="hex"
                      value={themeForm.values.inputBorder || '#475569'}
                      onChange={(value) => handleColorChange('inputBorder', value || '#475569')}
                    />
                  </Group>

                  <Divider label="Layout Colors" labelPosition="left" />

                  <Group grow>
                    <ColorInput
                      label="Sidebar Background"
                      description="Sidebar background color"
                      format="hex"
                      value={themeForm.values.sidebarBg || '#1e293b'}
                      onChange={(value) => handleColorChange('sidebarBg', value || '#1e293b')}
                    />
                    <ColorInput
                      label="Sidebar Text"
                      description="Sidebar text color"
                      format="hex"
                      value={themeForm.values.sidebarText || '#f5f7ff'}
                      onChange={(value) => handleColorChange('sidebarText', value || '#f5f7ff')}
                    />
                  </Group>

                  <Group grow>
                    <ColorInput
                      label="Navbar Background"
                      description="Navbar background color"
                      format="hex"
                      value={themeForm.values.navbarBg || '#0f172a'}
                      onChange={(value) => handleColorChange('navbarBg', value || '#0f172a')}
                    />
                    <ColorInput
                      label="Navbar Text"
                      description="Navbar text color"
                      format="hex"
                      value={themeForm.values.navbarText || '#f5f7ff'}
                      onChange={(value) => handleColorChange('navbarText', value || '#f5f7ff')}
                    />
                  </Group>

                  <ColorInput
                    label="Card Background"
                    description="Card/panel background color"
                    format="hex"
                    value={themeForm.values.cardBg || '#1e293b'}
                    onChange={(value) => handleColorChange('cardBg', value || '#1e293b')}
                  />

                  <Alert icon={<IconAlertCircle size={16} />} color="blue">
                    Colors are applied immediately as you change them. Click "Save Theme Settings" to persist changes.
                  </Alert>

                  <Group justify="space-between" mt="md">
                    <Button
                      variant="outline"
                      color="orange"
                      leftSection={<IconRefresh size={16} />}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset all theme colors to default? This will reset all custom colors.')) {
                          const presetColors = getPresetThemeColors(themeForm.values.mode);
                          const resetValues = {
                            ...themeForm.values,
                            ...presetColors,
                            buttonColor: '',
                          };
                          themeForm.setValues(resetValues);
                          
                          // Apply immediately
                          applyThemeColors(resetValues);
                          
                          showNotification({
                            title: 'Theme Reset',
                            message: 'All theme colors reset to default preset colors',
                            color: 'green',
                          });
                        }
                      }}
                    >
                      Reset Theme to Default
                    </Button>
                    <Button
                      type="submit"
                      leftSection={<IconCheck size={16} />}
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      Save Theme Settings
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Tabs.Panel>

            {/* Login Credentials Tab */}
            <Tabs.Panel value="login" pt="md">
              <form onSubmit={loginForm.onSubmit(handleLoginSubmit)}>
                <Stack gap="md">
                  <Divider label="Login Credentials" labelPosition="left" />

                  <Alert icon={<IconAlertCircle size={16} />} color="orange">
                    Changing login credentials will affect all users. Use with caution.
                  </Alert>

                  <TextInput
                    label="Username"
                    placeholder="admin"
                    description="Default login username"
                    required
                    {...loginForm.getInputProps('username')}
                  />

                  <PasswordInput
                    label="Current Password"
                    placeholder="Enter current password (leave empty if not changing)"
                    description="Required only if changing password"
                    {...loginForm.getInputProps('password')}
                  />

                  <Divider label="Change Password (Optional)" labelPosition="left" />

                  <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    description="Leave empty to keep current password"
                    {...loginForm.getInputProps('newPassword')}
                  />

                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    {...loginForm.getInputProps('confirmPassword')}
                  />

                  <Switch
                    label="Remember Me (Default)"
                    description="Remember login session by default"
                    {...loginForm.getInputProps('rememberMe', { type: 'checkbox' })}
                  />

                  <Group justify="flex-end" mt="md">
                    <Button
                      type="submit"
                      leftSection={<IconCheck size={16} />}
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      Save Login Credentials
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>
    </AdminLayout>
  );
};

export default Settings;

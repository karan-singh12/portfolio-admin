// Service to manage module configurations
// Stores module configurations in localStorage

const STORAGE_KEY = 'module_configurations';

/**
 * Get all module configurations from localStorage
 * @returns {Array} Array of module configurations
 */
export const getModuleConfigurations = () => {
  try {
    const configs = localStorage.getItem(STORAGE_KEY);
    return configs ? JSON.parse(configs) : [];
  } catch (error) {
    console.error('Error loading module configurations:', error);
    return [];
  }
};

/**
 * Save module configurations to localStorage
 * @param {Array} configs - Array of module configurations to save
 */
export const saveModuleConfigurations = (configs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    // Dispatch custom event to notify components to refresh
    window.dispatchEvent(new CustomEvent('moduleConfigsUpdated'));
  } catch (error) {
    console.error('Error saving module configurations:', error);
    throw error;
  }
};

/**
 * Get a module configuration by sidebar item ID
 * @param {string} sidebarItemId - ID of the sidebar item
 * @returns {Object|null} Module configuration or null
 */
export const getModuleConfiguration = (sidebarItemId) => {
  const configs = getModuleConfigurations();
  return configs.find((config) => config.sidebarItemId === sidebarItemId) || null;
};

/**
 * Add or update a module configuration
 * @param {Object} config - Module configuration object
 * @returns {Object} Saved configuration
 */
export const saveModuleConfiguration = (config) => {
  const configs = getModuleConfigurations();
  const existingIndex = configs.findIndex(
    (c) => c.sidebarItemId === config.sidebarItemId
  );

  const configToSave = {
    ...config,
    updatedAt: new Date().toISOString(),
    createdAt: existingIndex >= 0 ? configs[existingIndex].createdAt : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    configs[existingIndex] = configToSave;
  } else {
    configs.push(configToSave);
  }

  saveModuleConfigurations(configs);
  return configToSave;
};

/**
 * Delete a module configuration
 * @param {string} sidebarItemId - ID of the sidebar item
 */
export const deleteModuleConfiguration = (sidebarItemId) => {
  const configs = getModuleConfigurations();
  const filtered = configs.filter((c) => c.sidebarItemId !== sidebarItemId);
  saveModuleConfigurations(filtered);
};

/**
 * Get default field types
 * @returns {Array} Array of available field types
 */
export const getFieldTypes = () => [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select/Dropdown' },
  { value: 'date', label: 'Date' },
  { value: 'password', label: 'Password' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'File Upload' },
];

/**
 * Get default column types
 * @returns {Array} Array of available column types
 */
export const getColumnTypes = () => [
  { value: 'index', label: 'Index/Sr. No.' },
  { value: 'id', label: 'ID' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'status', label: 'Status Badge' },
  { value: 'image', label: 'Image' },
  { value: 'description', label: 'Description' },
];


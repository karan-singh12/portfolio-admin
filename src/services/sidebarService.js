// Service to manage dynamic sidebar items
// Stores items in localStorage and provides CRUD operations

import { IconMenu2 } from '@tabler/icons-react';

const STORAGE_KEY = 'dynamic_sidebar_items';

/**
 * Get all dynamic sidebar items from localStorage
 * @returns {Array} Array of dynamic sidebar items
 */
export const getDynamicSidebarItems = () => {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error loading dynamic sidebar items:', error);
    return [];
  }
};

/**
 * Save dynamic sidebar items to localStorage
 * @param {Array} items - Array of sidebar items to save
 */
export const saveDynamicSidebarItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Dispatch custom event to notify sidebar to refresh
    window.dispatchEvent(new CustomEvent('sidebarItemsUpdated'));
  } catch (error) {
    console.error('Error saving dynamic sidebar items:', error);
    throw error;
  }
};

/**
 * Add a new parent sidebar item
 * @param {Object} parentItem - Parent item with { label, path, icon (optional) }
 * @returns {Object} Created parent item with id
 */
export const addParentItem = (parentItem) => {
  const items = getDynamicSidebarItems();
  const newItem = {
    id: `dynamic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    label: parentItem.label,
    path: parentItem.path || `/${parentItem.label.toLowerCase().replace(/\s+/g, '-')}`,
    iconName: 'IconMenu2', // Store icon name as string, will be resolved in sidebarConfig
    iconUrl: parentItem.iconUrl || null, // Store uploaded icon image URL (base64)
    type: 'parent',
    children: [],
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveDynamicSidebarItems(items);
  return newItem;
};

/**
 * Add a child item to a parent
 * @param {string} parentId - ID of the parent item
 * @param {Object} childItem - Child item with { label, path }
 * @returns {Object} Created child item with id
 */
export const addChildItem = (parentId, childItem) => {
  const items = getDynamicSidebarItems();
  const parent = items.find((item) => item.id === parentId);
  
  if (!parent) {
    throw new Error(`Parent item with id ${parentId} not found`);
  }

  const newChild = {
    id: `dynamic-child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    label: childItem.label,
    path: childItem.path || `${parent.path}/${childItem.label.toLowerCase().replace(/\s+/g, '-')}`,
    createdAt: new Date().toISOString(),
  };

  if (!parent.children) {
    parent.children = [];
  }
  parent.children.push(newChild);
  saveDynamicSidebarItems(items);
  return newChild;
};

/**
 * Update a parent item
 * @param {string} id - ID of the item to update
 * @param {Object} updates - Fields to update
 */
export const updateParentItem = (id, updates) => {
  const items = getDynamicSidebarItems();
  const item = items.find((item) => item.id === id);
  
  if (!item) {
    throw new Error(`Item with id ${id} not found`);
  }

  // Ensure iconName and iconUrl are preserved if not in updates
  const updateData = { ...updates };
  if (!updateData.iconName && item.iconName) {
    updateData.iconName = item.iconName;
  } else if (!updateData.iconName) {
    updateData.iconName = 'IconMenu2';
  }
  
  // Preserve iconUrl if not being updated (empty string means remove, null means keep existing)
  if (updateData.iconUrl === undefined && item.iconUrl) {
    updateData.iconUrl = item.iconUrl;
  } else if (updateData.iconUrl === '') {
    updateData.iconUrl = null;
  }

  Object.assign(item, updateData, { updatedAt: new Date().toISOString() });
  saveDynamicSidebarItems(items);
  return item;
};

/**
 * Update a child item
 * @param {string} parentId - ID of the parent item
 * @param {string} childId - ID of the child item
 * @param {Object} updates - Fields to update
 */
export const updateChildItem = (parentId, childId, updates) => {
  const items = getDynamicSidebarItems();
  const parent = items.find((item) => item.id === parentId);
  
  if (!parent || !parent.children) {
    throw new Error(`Parent or child not found`);
  }

  const child = parent.children.find((c) => c.id === childId);
  if (!child) {
    throw new Error(`Child item with id ${childId} not found`);
  }

  Object.assign(child, updates, { updatedAt: new Date().toISOString() });
  saveDynamicSidebarItems(items);
  return child;
};

/**
 * Delete a parent item (and all its children)
 * @param {string} id - ID of the item to delete
 */
export const deleteParentItem = (id) => {
  const items = getDynamicSidebarItems();
  const filtered = items.filter((item) => item.id !== id);
  saveDynamicSidebarItems(filtered);
};

/**
 * Delete a child item
 * @param {string} parentId - ID of the parent item
 * @param {string} childId - ID of the child item to delete
 */
export const deleteChildItem = (parentId, childId) => {
  const items = getDynamicSidebarItems();
  const parent = items.find((item) => item.id === parentId);
  
  if (!parent || !parent.children) {
    throw new Error(`Parent or child not found`);
  }

  parent.children = parent.children.filter((c) => c.id !== childId);
  saveDynamicSidebarItems(items);
};

/**
 * Get a parent item by ID
 * @param {string} id - ID of the item
 * @returns {Object|null} Parent item or null
 */
export const getParentItem = (id) => {
  const items = getDynamicSidebarItems();
  return items.find((item) => item.id === id) || null;
};



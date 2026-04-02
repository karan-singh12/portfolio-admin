import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Button,
  TextInput,
  Stack,
  Group,
  Table,
  ActionIcon,
  Badge,
  Modal,
  Select,
  Divider,
  Text,
  Paper,
  FileButton,
  Image,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconPlus, IconTrash, IconEdit, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  getDynamicSidebarItems,
  addParentItem,
  addChildItem,
  deleteParentItem,
  deleteChildItem,
  updateParentItem,
  updateChildItem,
} from '@/services/sidebarService';

const SidebarManager = () => {
  const [items, setItems] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [editingChild, setEditingChild] = useState(null);
  const [expandedParents, setExpandedParents] = useState({});
  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  const parentForm = useForm({
    initialValues: {
      label: '',
      path: '',
      iconUrl: '',
    },
    validate: {
      label: (value) => (!value ? 'Label is required' : null),
    },
  });

  const childForm = useForm({
    initialValues: {
      label: '',
      path: '',
    },
    validate: {
      label: (value) => (!value ? 'Label is required' : null),
    },
  });

  useEffect(() => {
    loadItems();
    // Listen for updates from other components
    window.addEventListener('sidebarItemsUpdated', loadItems);
    return () => {
      window.removeEventListener('sidebarItemsUpdated', loadItems);
    };
  }, []);

  const loadItems = () => {
    const dynamicItems = getDynamicSidebarItems();
    setItems(dynamicItems);
  };

  // Convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle icon file selection
  const handleIconFileChange = async (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification({
          title: 'Error',
          message: 'Please select an image file',
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

      try {
        const base64 = await convertFileToBase64(file);
        setIconFile(file);
        setIconPreview(base64);
        parentForm.setFieldValue('iconUrl', base64);
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to process image',
          color: 'red',
        });
      }
    }
  };

  const handleAddParent = () => {
    setEditingParent(null);
    setIconPreview(null);
    setIconFile(null);
    parentForm.reset();
    setParentModalOpen(true);
  };

  const handleEditParent = (item) => {
    setEditingParent(item);
    setIconPreview(item.iconUrl || null);
    setIconFile(null);
    parentForm.setValues({
      label: item.label,
      path: item.path,
      iconUrl: item.iconUrl || '',
    });
    setParentModalOpen(true);
  };

  const handleSaveParent = (values) => {
    try {
      if (editingParent) {
        updateParentItem(editingParent.id, values);
        showNotification({
          title: 'Success',
          message: 'Parent item updated successfully',
          color: 'green',
        });
      } else {
        addParentItem(values);
        showNotification({
          title: 'Success',
          message: 'Parent item added successfully',
          color: 'green',
        });
      }
      loadItems();
      setParentModalOpen(false);
      parentForm.reset();
      setIconPreview(null);
      setIconFile(null);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to save parent item',
        color: 'red',
      });
    }
  };

  const handleDeleteParent = (id) => {
    if (window.confirm('Are you sure you want to delete this parent item and all its children?')) {
      try {
        deleteParentItem(id);
        showNotification({
          title: 'Success',
          message: 'Parent item deleted successfully',
          color: 'green',
        });
        loadItems();
      } catch (error) {
        showNotification({
          title: 'Error',
          message: error.message || 'Failed to delete parent item',
          color: 'red',
        });
      }
    }
  };

  const handleAddChild = (parentId) => {
    setSelectedParent(parentId);
    setEditingChild(null);
    childForm.reset();
    setChildModalOpen(true);
  };

  const handleEditChild = (parentId, child) => {
    setSelectedParent(parentId);
    setEditingChild(child);
    childForm.setValues({
      label: child.label,
      path: child.path,
    });
    setChildModalOpen(true);
  };

  const handleSaveChild = (values) => {
    try {
      if (editingChild) {
        updateChildItem(selectedParent, editingChild.id, values);
        showNotification({
          title: 'Success',
          message: 'Child item updated successfully',
          color: 'green',
        });
      } else {
        addChildItem(selectedParent, values);
        showNotification({
          title: 'Success',
          message: 'Child item added successfully',
          color: 'green',
        });
      }
      loadItems();
      setChildModalOpen(false);
      childForm.reset();
      setSelectedParent(null);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to save child item',
        color: 'red',
      });
    }
  };

  const handleDeleteChild = (parentId, childId) => {
    if (window.confirm('Are you sure you want to delete this child item?')) {
      try {
        deleteChildItem(parentId, childId);
        showNotification({
          title: 'Success',
          message: 'Child item deleted successfully',
          color: 'green',
        });
        loadItems();
      } catch (error) {
        showNotification({
          title: 'Error',
          message: error.message || 'Failed to delete child item',
          color: 'red',
        });
      }
    }
  };

  const toggleParent = (id) => {
    setExpandedParents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>Sidebar Management</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddParent}
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Add Parent Item
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          {items.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No sidebar items yet. Click "Add Parent Item" to get started.
            </Text>
          ) : (
            <Stack gap="md">
              {items.map((parent) => (
                <Paper key={parent.id} p="md" withBorder radius="md">
                  <Group justify="space-between" mb="xs">
                    <Group>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => toggleParent(parent.id)}
                        size="sm"
                      >
                        {expandedParents[parent.id] ? (
                          <IconChevronUp size={16} />
                        ) : (
                          <IconChevronDown size={16} />
                        )}
                      </ActionIcon>
                      {parent.iconUrl && (
                        <Box
                          style={{
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Image
                            src={parent.iconUrl}
                            alt={parent.label}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      )}
                      <Text fw={600}>{parent.label}</Text>
                      <Badge variant="light" color="blue">
                        {parent.children?.length || 0} children
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <ActionIcon
                        color="blue"
                        variant="light"
                        onClick={() => handleAddChild(parent.id)}
                        title="Add Child"
                      >
                        <IconPlus size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="orange"
                        variant="light"
                        onClick={() => handleEditParent(parent)}
                        title="Edit Parent"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleDeleteParent(parent.id)}
                        title="Delete Parent"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  {expandedParents[parent.id] && (
                    <>
                      <Divider my="sm" />
                      {parent.children && parent.children.length > 0 ? (
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Label</Table.Th>
                              <Table.Th>Path</Table.Th>
                              <Table.Th style={{ width: '120px' }}>Actions</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {parent.children.map((child) => (
                              <Table.Tr key={child.id}>
                                <Table.Td>{child.label}</Table.Td>
                                <Table.Td>
                                  <Text size="sm" c="dimmed">
                                    {child.path}
                                  </Text>
                                </Table.Td>
                                <Table.Td>
                                  <Group gap="xs">
                                    <ActionIcon
                                      color="orange"
                                      variant="light"
                                      size="sm"
                                      onClick={() => handleEditChild(parent.id, child)}
                                      title="Edit"
                                    >
                                      <IconEdit size={14} />
                                    </ActionIcon>
                                    <ActionIcon
                                      color="red"
                                      variant="light"
                                      size="sm"
                                      onClick={() => handleDeleteChild(parent.id, child.id)}
                                      title="Delete"
                                    >
                                      <IconTrash size={14} />
                                    </ActionIcon>
                                  </Group>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      ) : (
                        <Text size="sm" c="dimmed" ta="center" py="md">
                          No child items. Click the + button to add one.
                        </Text>
                      )}
                    </>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Card>

        {/* Parent Item Modal */}
        <Modal
          opened={parentModalOpen}
          onClose={() => {
            setParentModalOpen(false);
            parentForm.reset();
            setIconPreview(null);
            setIconFile(null);
            setEditingParent(null);
          }}
          title={editingParent ? 'Edit Parent Item' : 'Add Parent Item'}
          centered
          size="md"
        >
          <form onSubmit={parentForm.onSubmit(handleSaveParent)}>
            <Stack gap="md">
              <TextInput
                label="Label"
                placeholder="e.g., Live Room Management"
                required
                {...parentForm.getInputProps('label')}
              />
              <TextInput
                label="Path"
                placeholder="e.g., /live-room-management"
                description="Leave empty to auto-generate from label"
                {...parentForm.getInputProps('path')}
              />
              
              {/* Icon Upload Section */}
              <Box>
                <Text size="sm" fw={500} mb="xs">
                  Icon (Optional)
                </Text>
                <Text size="xs" c="dimmed" mb="sm">
                  Upload an icon image for this menu item (Max 2MB, PNG/JPG/SVG)
                </Text>
                
                <Group gap="md" align="flex-start">
                  {iconPreview && (
                    <Box
                      style={{
                        width: 64,
                        height: 64,
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--bg-secondary)',
                      }}
                    >
                      <Image
                        src={iconPreview}
                        alt="Icon preview"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                  )}
                  
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <FileButton
                      onChange={handleIconFileChange}
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    >
                      {(props) => (
                        <Button
                          {...props}
                          variant="light"
                          size="sm"
                          style={{ width: '100%' }}
                        >
                          {iconPreview ? 'Change Icon' : 'Upload Icon'}
                        </Button>
                      )}
                    </FileButton>
                    
                    {iconPreview && (
                      <Button
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={() => {
                          setIconPreview(null);
                          setIconFile(null);
                          parentForm.setFieldValue('iconUrl', '');
                        }}
                      >
                        Remove Icon
                      </Button>
                    )}
                  </Stack>
                </Group>
              </Box>

              <Group justify="flex-end" mt="md">
                <Button
                  variant="subtle"
                  onClick={() => {
                    setParentModalOpen(false);
                    parentForm.reset();
                    setIconPreview(null);
                    setIconFile(null);
                    setEditingParent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: 'var(--primary-color)' }}>
                  {editingParent ? 'Update' : 'Add'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Child Item Modal */}
        <Modal
          opened={childModalOpen}
          onClose={() => {
            setChildModalOpen(false);
            childForm.reset();
            setSelectedParent(null);
            setEditingChild(null);
          }}
          title={editingChild ? 'Edit Child Item' : 'Add Child Item'}
          centered
        >
          <form onSubmit={childForm.onSubmit(handleSaveChild)}>
            <Stack gap="md">
              <TextInput
                label="Label"
                placeholder="e.g., cam2cam"
                required
                {...childForm.getInputProps('label')}
              />
              <TextInput
                label="Path"
                placeholder="e.g., /live-room-management/cam2cam"
                description="Leave empty to auto-generate from parent path and label"
                {...childForm.getInputProps('path')}
              />
              <Group justify="flex-end" mt="md">
                <Button
                  variant="subtle"
                  onClick={() => {
                    setChildModalOpen(false);
                    childForm.reset();
                    setSelectedParent(null);
                    setEditingChild(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: 'var(--primary-color)' }}>
                  {editingChild ? 'Update' : 'Add'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </AdminLayout>
  );
};

export default SidebarManager;


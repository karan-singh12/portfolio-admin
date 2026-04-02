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
  Checkbox,
  Tabs,
  Textarea,
  Switch,
  NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconChevronDown,
  IconChevronUp,
  IconSettings,
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getSidebarItems } from '@/config/sidebarConfig';
import {
  getModuleConfigurations,
  saveModuleConfiguration,
  deleteModuleConfiguration,
  getFieldTypes,
  getColumnTypes,
} from '@/services/moduleConfigService';

const ModuleConfigManager = () => {
  const [configs, setConfigs] = useState([]);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(null);
  const [expandedConfigs, setExpandedConfigs] = useState({});

  const fieldTypes = getFieldTypes();
  const columnTypes = getColumnTypes();

  const configForm = useForm({
    initialValues: {
      sidebarItemId: '',
      sidebarItemLabel: '',
      components: {
        list: true,
        create: true,
        update: true,
        view: true,
      },
      listConfig: {
        columns: [],
        actions: {
          addButton: true,
          addButtonPath: '',
          viewButton: true,
          editButton: true,
          deleteButton: true,
          statusToggle: false,
        },
        pagination: {
          enabled: true,
          pageSizes: [10, 20, 50, 100],
          defaultPageSize: 10,
        },
        search: {
          enabled: true,
        },
      },
      formConfig: {
        fields: [],
        addPath: '',
        editPath: '',
        viewPath: '',
      },
    },
    validate: {
      sidebarItemId: (value) => (!value ? 'Sidebar item is required' : null),
    },
  });

  useEffect(() => {
    loadConfigs();
    loadSidebarItems();
    window.addEventListener('moduleConfigsUpdated', loadConfigs);
    return () => {
      window.removeEventListener('moduleConfigsUpdated', loadConfigs);
    };
  }, []);

  const loadConfigs = () => {
    const allConfigs = getModuleConfigurations();
    setConfigs(allConfigs);
  };

  const loadSidebarItems = () => {
    const items = getSidebarItems();
    // Remove duplicates by using a Map with id as key
    const uniqueItemsMap = new Map();
    items.forEach((item) => {
      if (!uniqueItemsMap.has(item.id)) {
        uniqueItemsMap.set(item.id, item);
      }
    });
    // Convert back to array
    const uniqueItems = Array.from(uniqueItemsMap.values());
    setSidebarItems(uniqueItems);
  };

  const handleAddConfig = () => {
    setEditingConfig(null);
    setSelectedSidebarItem(null);
    configForm.reset();
    setConfigModalOpen(true);
  };

  const handleEditConfig = (config) => {
    setEditingConfig(config);
    const sidebarItem = sidebarItems.find((item) => item.id === config.sidebarItemId);
    setSelectedSidebarItem(sidebarItem);
    configForm.setValues(config);
    setConfigModalOpen(true);
  };

  const handleSidebarItemSelect = (itemId) => {
    const item = sidebarItems.find((i) => i.id === itemId);
    setSelectedSidebarItem(item);
    configForm.setFieldValue('sidebarItemId', itemId);
    configForm.setFieldValue('sidebarItemLabel', item?.label || '');
    
    // Auto-generate paths if not editing
    if (!editingConfig && item) {
      const basePath = item.path || `/${item.label.toLowerCase().replace(/\s+/g, '-')}`;
      configForm.setFieldValue('listConfig.actions.addButtonPath', `${basePath}/add`);
      configForm.setFieldValue('formConfig.addPath', `${basePath}/add`);
      configForm.setFieldValue('formConfig.editPath', `${basePath}/edit/:id`);
      configForm.setFieldValue('formConfig.viewPath', `${basePath}/view/:id`);
    }
  };

  const handleSaveConfig = (values) => {
    try {
      const configToSave = {
        ...values,
        id: editingConfig?.id || `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      saveModuleConfiguration(configToSave);
      showNotification({
        title: 'Success',
        message: 'Module configuration saved successfully',
        color: 'green',
      });
      loadConfigs();
      loadSidebarItems();
      setConfigModalOpen(false);
      configForm.reset();
      setEditingConfig(null);
      setSelectedSidebarItem(null);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to save configuration',
        color: 'red',
      });
    }
  };

  const handleDeleteConfig = (configId) => {
    if (window.confirm('Are you sure you want to delete this module configuration?')) {
      try {
        const config = configs.find((c) => c.id === configId);
        if (config) {
          deleteModuleConfiguration(config.sidebarItemId);
          showNotification({
            title: 'Success',
            message: 'Module configuration deleted successfully',
            color: 'green',
          });
          loadConfigs();
          loadSidebarItems();
        }
      } catch (error) {
        showNotification({
          title: 'Error',
          message: error.message || 'Failed to delete configuration',
          color: 'red',
        });
      }
    }
  };

  const toggleConfig = (id) => {
    setExpandedConfigs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const addColumn = () => {
    const currentColumns = configForm.values.listConfig.columns || [];
    configForm.setFieldValue('listConfig.columns', [
      ...currentColumns,
      {
        id: `col-${Date.now()}`,
        key: '',
        label: '',
        type: 'text',
        visible: true,
      },
    ]);
  };

  const removeColumn = (columnId) => {
    const currentColumns = configForm.values.listConfig.columns || [];
    configForm.setFieldValue(
      'listConfig.columns',
      currentColumns.filter((col) => col.id !== columnId)
    );
  };

  const updateColumn = (columnId, field, value) => {
    const currentColumns = configForm.values.listConfig.columns || [];
    const updatedColumns = currentColumns.map((col) =>
      col.id === columnId ? { ...col, [field]: value } : col
    );
    configForm.setFieldValue('listConfig.columns', updatedColumns);
  };

  const addFormField = () => {
    const currentFields = configForm.values.formConfig.fields || [];
    configForm.setFieldValue('formConfig.fields', [
      ...currentFields,
      {
        id: `field-${Date.now()}`,
        name: '',
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        visible: true,
      },
    ]);
  };

  const removeFormField = (fieldId) => {
    const currentFields = configForm.values.formConfig.fields || [];
    configForm.setFieldValue(
      'formConfig.fields',
      currentFields.filter((field) => field.id !== fieldId)
    );
  };

  const updateFormField = (fieldId, field, value) => {
    const currentFields = configForm.values.formConfig.fields || [];
    const updatedFields = currentFields.map((f) =>
      f.id === fieldId ? { ...f, [field]: value } : f
    );
    configForm.setFieldValue('formConfig.fields', updatedFields);
  };

  const getSidebarItemLabel = (sidebarItemId) => {
    const item = sidebarItems.find((i) => i.id === sidebarItemId);
    return item?.label || sidebarItemId;
  };

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>Module Configuration Manager</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddConfig}
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Add Module Configuration
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          {configs.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No module configurations yet. Click "Add Module Configuration" to get started.
            </Text>
          ) : (
            <Stack gap="md">
              {configs.map((config) => (
                <Paper key={config.id} p="md" withBorder radius="md">
                  <Group justify="space-between" mb="xs">
                    <Group>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => toggleConfig(config.id)}
                        size="sm"
                      >
                        {expandedConfigs[config.id] ? (
                          <IconChevronUp size={16} />
                        ) : (
                          <IconChevronDown size={16} />
                        )}
                      </ActionIcon>
                      <IconSettings size={20} color="var(--primary-color)" />
                      <Text fw={600}>{getSidebarItemLabel(config.sidebarItemId)}</Text>
                      <Badge variant="light" color="blue">
                        {config.listConfig?.columns?.length || 0} columns
                      </Badge>
                      <Badge variant="light" color="green">
                        {config.formConfig?.fields?.length || 0} fields
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <ActionIcon
                        color="orange"
                        variant="light"
                        onClick={() => handleEditConfig(config)}
                        title="Edit Configuration"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleDeleteConfig(config.id)}
                        title="Delete Configuration"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  {expandedConfigs[config.id] && (
                    <>
                      <Divider my="sm" />
                      <Stack gap="xs">
                        <Group>
                          <Text size="sm" fw={500}>Components:</Text>
                          {config.components?.list && <Badge size="sm">List</Badge>}
                          {config.components?.create && <Badge size="sm">Create</Badge>}
                          {config.components?.update && <Badge size="sm">Update</Badge>}
                          {config.components?.view && <Badge size="sm">View</Badge>}
                        </Group>
                        <Text size="sm" c="dimmed">
                          Add Button Path: {config.listConfig?.actions?.addButtonPath || 'N/A'}
                        </Text>
                        <Text size="sm" c="dimmed">
                          Columns: {config.listConfig?.columns?.map((c) => c.label).join(', ') || 'None'}
                        </Text>
                        <Text size="sm" c="dimmed">
                          Form Fields: {config.formConfig?.fields?.map((f) => f.label).join(', ') || 'None'}
                        </Text>
                      </Stack>
                    </>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Card>

        {/* Configuration Modal */}
        <Modal
          opened={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
            configForm.reset();
            setEditingConfig(null);
            setSelectedSidebarItem(null);
          }}
          title={editingConfig ? 'Edit Module Configuration' : 'Add Module Configuration'}
          size="xl"
          centered
        >
          <form onSubmit={configForm.onSubmit(handleSaveConfig)}>
            <Tabs defaultValue="basic">
              <Tabs.List>
                <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
                <Tabs.Tab value="components">Components</Tabs.Tab>
                <Tabs.Tab value="list">List Configuration</Tabs.Tab>
                <Tabs.Tab value="form">Form Configuration</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="basic" pt="md">
                <Stack gap="md">
                  <Select
                    label="Select Sidebar Item"
                    placeholder="Choose a sidebar item to configure"
                    description="Select which sidebar menu item you want to configure"
                    data={sidebarItems.map((item) => {
                      const existingConfigs = getModuleConfigurations();
                      const isConfigured = existingConfigs.some((c) => c.sidebarItemId === item.id);
                      return {
                        value: item.id,
                        label: isConfigured && !editingConfig 
                          ? `${item.label} (Already Configured)` 
                          : item.label,
                        disabled: isConfigured && !editingConfig,
                      };
                    })}
                    value={configForm.values.sidebarItemId}
                    onChange={handleSidebarItemSelect}
                    disabled={!!editingConfig}
                    searchable
                    error={configForm.errors.sidebarItemId}
                  />
                  {selectedSidebarItem && (
                    <Paper p="sm" withBorder style={{ backgroundColor: 'var(--card-bg)' }}>
                      <Stack gap="xs">
                        <Group>
                          <Text size="sm" fw={500}>Selected Item:</Text>
                          <Badge variant="light" color="blue">
                            {selectedSidebarItem.label}
                          </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                          <strong>Path:</strong> {selectedSidebarItem.path}
                        </Text>
                        {selectedSidebarItem.children && selectedSidebarItem.children.length > 0 && (
                          <Text size="sm" c="dimmed">
                            <strong>Has {selectedSidebarItem.children.length} sub-items</strong>
                          </Text>
                        )}
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="components" pt="md">
                <Stack gap="md">
                  <Text fw={500} size="sm">Enable Components:</Text>
                  <Checkbox
                    label="List Page"
                    checked={configForm.values.components.list}
                    onChange={(e) =>
                      configForm.setFieldValue('components.list', e.currentTarget.checked)
                    }
                  />
                  <Checkbox
                    label="Create Page"
                    checked={configForm.values.components.create}
                    onChange={(e) =>
                      configForm.setFieldValue('components.create', e.currentTarget.checked)
                    }
                  />
                  <Checkbox
                    label="Update/Edit Page"
                    checked={configForm.values.components.update}
                    onChange={(e) =>
                      configForm.setFieldValue('components.update', e.currentTarget.checked)
                    }
                  />
                  <Checkbox
                    label="View Page"
                    checked={configForm.values.components.view}
                    onChange={(e) =>
                      configForm.setFieldValue('components.view', e.currentTarget.checked)
                    }
                  />
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="list" pt="md">
                <Stack gap="md">
                  <Divider label="List Actions Configuration" labelPosition="left" />
                  
                  <Stack gap="sm">
                    <Checkbox
                      label="Show Add Button"
                      checked={configForm.values.listConfig.actions.addButton}
                      onChange={(e) =>
                        configForm.setFieldValue(
                          'listConfig.actions.addButton',
                          e.currentTarget.checked
                        )
                      }
                    />
                    {configForm.values.listConfig.actions.addButton && (
                      <TextInput
                        label="Add Button Navigation Path"
                        placeholder="/module/add"
                        description="Where to navigate when Add button is clicked"
                        {...configForm.getInputProps('listConfig.actions.addButtonPath')}
                      />
                    )}

                    <Checkbox
                      label="Show View Button"
                      checked={configForm.values.listConfig.actions.viewButton}
                      onChange={(e) =>
                        configForm.setFieldValue(
                          'listConfig.actions.viewButton',
                          e.currentTarget.checked
                        )
                      }
                    />
                    <Checkbox
                      label="Show Edit Button"
                      checked={configForm.values.listConfig.actions.editButton}
                      onChange={(e) =>
                        configForm.setFieldValue(
                          'listConfig.actions.editButton',
                          e.currentTarget.checked
                        )
                      }
                    />
                    <Checkbox
                      label="Show Delete Button"
                      checked={configForm.values.listConfig.actions.deleteButton}
                      onChange={(e) =>
                        configForm.setFieldValue(
                          'listConfig.actions.deleteButton',
                          e.currentTarget.checked
                        )
                      }
                    />
                    <Checkbox
                      label="Show Status Toggle"
                      checked={configForm.values.listConfig.actions.statusToggle}
                      onChange={(e) =>
                        configForm.setFieldValue(
                          'listConfig.actions.statusToggle',
                          e.currentTarget.checked
                        )
                      }
                    />
                  </Stack>

                  <Divider label="Table Columns Configuration" labelPosition="left" />

                  <Group justify="space-between" mb="xs">
                    <Text fw={500} size="sm">Add Columns:</Text>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconPlus size={14} />}
                        onClick={addColumn}
                      >
                        Add Custom Column
                      </Button>
                    </Group>
                  </Group>

                  <Group gap="xs" mb="md">
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasIndex = configForm.values.listConfig.columns?.some(c => c.key === 'index' || c.type === 'index');
                        if (!hasIndex) {
                          addColumn();
                          const cols = configForm.values.listConfig.columns || [];
                          const lastCol = cols[cols.length - 1];
                          if (lastCol) {
                            updateColumn(lastCol.id, 'key', 'index');
                            updateColumn(lastCol.id, 'label', 'Sr. No.');
                            updateColumn(lastCol.id, 'type', 'index');
                          }
                        }
                      }}
                    >
                      + Index
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasId = configForm.values.listConfig.columns?.some(c => c.key === 'id');
                        if (!hasId) {
                          addColumn();
                          const cols = configForm.values.listConfig.columns || [];
                          const lastCol = cols[cols.length - 1];
                          if (lastCol) {
                            updateColumn(lastCol.id, 'key', 'id');
                            updateColumn(lastCol.id, 'label', 'ID');
                            updateColumn(lastCol.id, 'type', 'id');
                          }
                        }
                      }}
                    >
                      + ID
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasName = configForm.values.listConfig.columns?.some(c => c.key === 'name');
                        if (!hasName) {
                          addColumn();
                          const cols = configForm.values.listConfig.columns || [];
                          const lastCol = cols[cols.length - 1];
                          if (lastCol) {
                            updateColumn(lastCol.id, 'key', 'name');
                            updateColumn(lastCol.id, 'label', 'Name');
                            updateColumn(lastCol.id, 'type', 'text');
                          }
                        }
                      }}
                    >
                      + Name
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasEmail = configForm.values.listConfig.columns?.some(c => c.key === 'email');
                        if (!hasEmail) {
                          addColumn();
                          const cols = configForm.values.listConfig.columns || [];
                          const lastCol = cols[cols.length - 1];
                          if (lastCol) {
                            updateColumn(lastCol.id, 'key', 'email');
                            updateColumn(lastCol.id, 'label', 'Email');
                            updateColumn(lastCol.id, 'type', 'email');
                          }
                        }
                      }}
                    >
                      + Email
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasPhone = configForm.values.listConfig.columns?.some(c => c.key === 'phone');
                        if (!hasPhone) {
                          addColumn();
                          const cols = configForm.values.listConfig.columns || [];
                          const lastCol = cols[cols.length - 1];
                          if (lastCol) {
                            updateColumn(lastCol.id, 'key', 'phone');
                            updateColumn(lastCol.id, 'label', 'Phone');
                            updateColumn(lastCol.id, 'type', 'phone');
                          }
                        }
                      }}
                    >
                      + Phone
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasDesc = configForm.values.listConfig.columns?.some(c => c.key === 'description');
                        if (!hasDesc) {
                          addColumn();
                          const cols = configForm.values.listConfig.columns || [];
                          const lastCol = cols[cols.length - 1];
                          if (lastCol) {
                            updateColumn(lastCol.id, 'key', 'description');
                            updateColumn(lastCol.id, 'label', 'Description');
                            updateColumn(lastCol.id, 'type', 'description');
                          }
                        }
                      }}
                    >
                      + Description
                    </Button>
                  </Group>

                  {configForm.values.listConfig.columns?.length > 0 ? (
                    <Stack gap="sm">
                      {configForm.values.listConfig.columns.map((column, index) => (
                        <Paper key={column.id} p="sm" withBorder style={{ backgroundColor: 'var(--card-bg)' }}>
                          <Group align="flex-start">
                            <Stack gap="xs" style={{ flex: 1 }}>
                              <Group grow>
                                <TextInput
                                  label="Column Key"
                                  placeholder="e.g., name, email, id"
                                  description="API response field name"
                                  value={column.key}
                                  onChange={(e) =>
                                    updateColumn(column.id, 'key', e.target.value)
                                  }
                                  size="xs"
                                  required
                                />
                                <TextInput
                                  label="Column Label"
                                  placeholder="e.g., Name, Email, ID"
                                  description="Display name in table header"
                                  value={column.label}
                                  onChange={(e) =>
                                    updateColumn(column.id, 'label', e.target.value)
                                  }
                                  size="xs"
                                  required
                                />
                              </Group>
                              <Select
                                label="Column Type"
                                description="How to display the data"
                                data={columnTypes}
                                value={column.type}
                                onChange={(value) =>
                                  updateColumn(column.id, 'type', value)
                                }
                                size="xs"
                                required
                              />
                              <Switch
                                label="Visible in Table"
                                checked={column.visible}
                                onChange={(e) =>
                                  updateColumn(column.id, 'visible', e.currentTarget.checked)
                                }
                                size="sm"
                              />
                            </Stack>
                            <ActionIcon
                              color="red"
                              variant="light"
                              onClick={() => removeColumn(column.id)}
                              mt="md"
                              title="Remove Column"
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Paper p="md" withBorder style={{ backgroundColor: 'var(--card-bg)' }}>
                      <Text size="sm" c="dimmed" ta="center">
                        No columns added yet. Use quick add buttons above or click "Add Custom Column" to add one.
                      </Text>
                    </Paper>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="form" pt="md">
                <Stack gap="md">
                  <Divider label="Page Paths Configuration" labelPosition="left" />
                  
                  <Stack gap="sm">
                    <TextInput
                      label="Add Page Path"
                      placeholder="/module/add"
                      description="Route path for create/add page"
                      {...configForm.getInputProps('formConfig.addPath')}
                    />
                    <TextInput
                      label="Edit Page Path"
                      placeholder="/module/edit/:id"
                      description="Route path for edit page (use :id for dynamic ID)"
                      {...configForm.getInputProps('formConfig.editPath')}
                    />
                    <TextInput
                      label="View Page Path"
                      placeholder="/module/view/:id"
                      description="Route path for view page (use :id for dynamic ID)"
                      {...configForm.getInputProps('formConfig.viewPath')}
                    />
                  </Stack>

                  <Divider label="Form Fields Configuration" labelPosition="left" />

                  <Group justify="space-between" mb="xs">
                    <Text fw={500} size="sm">Add Form Fields:</Text>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconPlus size={14} />}
                        onClick={addFormField}
                      >
                        Add Custom Field
                      </Button>
                    </Group>
                  </Group>

                  <Group gap="xs" mb="md">
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasName = configForm.values.formConfig.fields?.some(f => f.name === 'name');
                        if (!hasName) {
                          addFormField();
                          const fields = configForm.values.formConfig.fields || [];
                          const lastField = fields[fields.length - 1];
                          if (lastField) {
                            updateFormField(lastField.id, 'name', 'name');
                            updateFormField(lastField.id, 'label', 'Name');
                            updateFormField(lastField.id, 'type', 'text');
                            updateFormField(lastField.id, 'required', true);
                            updateFormField(lastField.id, 'placeholder', 'Enter name');
                          }
                        }
                      }}
                    >
                      + Name
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasEmail = configForm.values.formConfig.fields?.some(f => f.name === 'email');
                        if (!hasEmail) {
                          addFormField();
                          const fields = configForm.values.formConfig.fields || [];
                          const lastField = fields[fields.length - 1];
                          if (lastField) {
                            updateFormField(lastField.id, 'name', 'email');
                            updateFormField(lastField.id, 'label', 'Email');
                            updateFormField(lastField.id, 'type', 'email');
                            updateFormField(lastField.id, 'required', true);
                            updateFormField(lastField.id, 'placeholder', 'Enter email');
                          }
                        }
                      }}
                    >
                      + Email
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasPhone = configForm.values.formConfig.fields?.some(f => f.name === 'phone');
                        if (!hasPhone) {
                          addFormField();
                          const fields = configForm.values.formConfig.fields || [];
                          const lastField = fields[fields.length - 1];
                          if (lastField) {
                            updateFormField(lastField.id, 'name', 'phone');
                            updateFormField(lastField.id, 'label', 'Phone');
                            updateFormField(lastField.id, 'type', 'text');
                            updateFormField(lastField.id, 'required', false);
                            updateFormField(lastField.id, 'placeholder', 'Enter phone number');
                          }
                        }
                      }}
                    >
                      + Phone
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const hasDesc = configForm.values.formConfig.fields?.some(f => f.name === 'description');
                        if (!hasDesc) {
                          addFormField();
                          const fields = configForm.values.formConfig.fields || [];
                          const lastField = fields[fields.length - 1];
                          if (lastField) {
                            updateFormField(lastField.id, 'name', 'description');
                            updateFormField(lastField.id, 'label', 'Description');
                            updateFormField(lastField.id, 'type', 'textarea');
                            updateFormField(lastField.id, 'required', false);
                            updateFormField(lastField.id, 'placeholder', 'Enter description');
                          }
                        }
                      }}
                    >
                      + Description
                    </Button>
                  </Group>

                  {configForm.values.formConfig.fields?.length > 0 ? (
                    <Stack gap="sm">
                      {configForm.values.formConfig.fields.map((field) => (
                        <Paper key={field.id} p="sm" withBorder style={{ backgroundColor: 'var(--card-bg)' }}>
                          <Group align="flex-start">
                            <Stack gap="xs" style={{ flex: 1 }}>
                              <Group grow>
                                <TextInput
                                  label="Field Name (Key)"
                                  placeholder="e.g., name, email, phone"
                                  description="API field name"
                                  value={field.name}
                                  onChange={(e) =>
                                    updateFormField(field.id, 'name', e.target.value)
                                  }
                                  size="xs"
                                  required
                                />
                                <TextInput
                                  label="Field Label"
                                  placeholder="e.g., Name, Email, Phone"
                                  description="Display label"
                                  value={field.label}
                                  onChange={(e) =>
                                    updateFormField(field.id, 'label', e.target.value)
                                  }
                                  size="xs"
                                  required
                                />
                              </Group>
                              <Select
                                label="Field Type"
                                description="Input field type"
                                data={fieldTypes}
                                value={field.type}
                                onChange={(value) =>
                                  updateFormField(field.id, 'type', value)
                                }
                                size="xs"
                                required
                              />
                              <TextInput
                                label="Placeholder"
                                placeholder="Enter placeholder text"
                                description="Hint text shown in empty field"
                                value={field.placeholder}
                                onChange={(e) =>
                                  updateFormField(field.id, 'placeholder', e.target.value)
                                }
                                size="xs"
                              />
                              <Group>
                                <Switch
                                  label="Required Field"
                                  description="Field must be filled"
                                  checked={field.required}
                                  onChange={(e) =>
                                    updateFormField(
                                      field.id,
                                      'required',
                                      e.currentTarget.checked
                                    )
                                  }
                                  size="sm"
                                  color="red"
                                />
                                <Switch
                                  label="Visible in Form"
                                  description="Show/hide field"
                                  checked={field.visible}
                                  onChange={(e) =>
                                    updateFormField(
                                      field.id,
                                      'visible',
                                      e.currentTarget.checked
                                    )
                                  }
                                  size="sm"
                                />
                              </Group>
                            </Stack>
                            <ActionIcon
                              color="red"
                              variant="light"
                              onClick={() => removeFormField(field.id)}
                              mt="md"
                              title="Remove Field"
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Paper p="md" withBorder style={{ backgroundColor: 'var(--card-bg)' }}>
                      <Text size="sm" c="dimmed" ta="center">
                        No fields added yet. Use quick add buttons above or click "Add Custom Field" to add one.
                      </Text>
                    </Paper>
                  )}
                </Stack>
              </Tabs.Panel>
            </Tabs>

            <Group justify="flex-end" mt="xl">
              <Button
                variant="subtle"
                onClick={() => {
                  setConfigModalOpen(false);
                  configForm.reset();
                  setEditingConfig(null);
                  setSelectedSidebarItem(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" style={{ backgroundColor: 'var(--primary-color)' }}>
                {editingConfig ? 'Update' : 'Save'} Configuration
              </Button>
            </Group>
          </form>
        </Modal>
      </Stack>
    </AdminLayout>
  );
};

export default ModuleConfigManager;


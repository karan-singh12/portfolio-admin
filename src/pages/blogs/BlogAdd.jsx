import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Title,
  Button,
  TextInput,
  Textarea,
  Stack,
  Group,
  Image,
  FileButton,
  Paper,
  Text,
  ActionIcon,
  Divider,
  Select,
  Box,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
  IconPlus, 
  IconTrash, 
  IconUpload, 
  IconChevronUp, 
  IconChevronDown,
  IconTypography,
  IconPhoto
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';
import { convertImageToBase64 } from '@/services/globalSettingsService';

const BlogAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      subtitle: '',
      thumbnail: null,
      author: 'Admin',
      status: 'active',
      sections: [
        { id: Date.now(), type: 'text', title: '', subtitle: '', content: '', points: [] }
      ],
    },
    validate: {
      title: (value) => (value.length < 1 ? 'Title is required' : null),
    },
  });

  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      form.setFieldValue('thumbnail', base64);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to upload thumbnail',
        color: 'red',
      });
    }
  };

  const handleSectionImageUpload = async (index, file) => {
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      form.setFieldValue(`sections.${index}.content`, base64);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to upload section image',
        color: 'red',
      });
    }
  };

  const addSection = (type) => {
    form.insertListItem('sections', {
      id: Date.now() + Math.random(),
      type,
      title: '',
      subtitle: '',
      content: '',
      points: [],
    });
  };

  const addPoint = (sectionIndex) => {
    const current = form.values.sections[sectionIndex].points || [];
    form.setFieldValue(`sections.${sectionIndex}.points`, [...current, '']);
  };

  const removePoint = (sectionIndex, pointIndex) => {
    const current = form.values.sections[sectionIndex].points || [];
    form.setFieldValue(
      `sections.${sectionIndex}.points`,
      current.filter((_, i) => i !== pointIndex)
    );
  };

  const updatePoint = (sectionIndex, pointIndex, value) => {
    const current = [...(form.values.sections[sectionIndex].points || [])];
    current[pointIndex] = value;
    form.setFieldValue(`sections.${sectionIndex}.points`, current);
  };

  const removeSection = (index) => {
    if (form.values.sections.length > 1) {
      form.removeListItem('sections', index);
    } else {
      showNotification({
        title: 'Note',
        message: 'At least one section is required',
        color: 'blue',
      });
    }
  };

  const moveSection = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < form.values.sections.length) {
      form.reorderListItem('sections', { from: index, to: newIndex });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await AllServices.blogs.create(values);
      showNotification({
        title: 'Success',
        message: 'Blog created successfully',
        color: 'green',
      });
      navigate('/blogs');
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to create blog',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Add New Blog</Title>
          <Group>
            <Button variant="subtle" onClick={() => navigate('/blogs')}>
              Cancel
            </Button>
            <Button 
              loading={loading} 
              onClick={() => form.onSubmit(handleSubmit)()}
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Save Blog
            </Button>
          </Group>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl">
            {/* Basic Info */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={4}>Basic Information</Title>
                <Group grow align="flex-start">
                  <Stack gap="md">
                    <TextInput
                      label="Blog Title"
                      placeholder="Enter blog title"
                      required
                      {...form.getInputProps('title')}
                    />
                    <TextInput
                      label="Subtitle"
                      placeholder="Enter short description"
                      {...form.getInputProps('subtitle')}
                    />
                    <Group grow>
                      <TextInput
                        label="Author"
                        placeholder="Admin"
                        {...form.getInputProps('author')}
                      />
                      <Select
                        label="Status"
                        data={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                        ]}
                        {...form.getInputProps('status')}
                      />
                    </Group>
                  </Stack>

                  <Stack gap="xs" align="center" style={{ maxWidth: 300 }}>
                    <Text size="sm" fw={500}>Thumbnail</Text>
                    <Paper 
                      withBorder 
                      style={{ 
                        width: '100%', 
                        height: 180, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      {form.values.thumbnail ? (
                        <>
                          <Image src={form.values.thumbnail} height={180} />
                          <ActionIcon 
                            color="red" 
                            variant="filled" 
                            style={{ position: 'absolute', top: 5, right: 5 }}
                            onClick={() => form.setFieldValue('thumbnail', null)}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </>
                      ) : (
                        <Stack align="center" gap="xs">
                          <IconPhoto size={40} color="var(--text-muted)" />
                          <Text size="xs" c="dimmed">No thumbnail selected</Text>
                        </Stack>
                      )}
                    </Paper>
                    <FileButton onChange={handleThumbnailUpload} accept="image/*">
                      {(props) => (
                        <Button {...props} variant="light" leftSection={<IconUpload size={16} />}>
                          Upload Thumbnail
                        </Button>
                      )}
                    </FileButton>
                  </Stack>
                </Group>
              </Stack>
            </Card>

            {/* Dynamic Sections */}
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4}>Blog Content Sections</Title>
                <Group>
                  <Button 
                    size="xs" 
                    variant="outline" 
                    leftSection={<IconTypography size={14} />}
                    onClick={() => addSection('text')}
                  >
                    Add Text Section
                  </Button>
                  <Button 
                    size="xs" 
                    variant="outline" 
                    leftSection={<IconPhoto size={14} />}
                    onClick={() => addSection('image')}
                  >
                    Add Image Section
                  </Button>
                </Group>
              </Group>

              {form.values.sections.map((section, index) => (
                <Card key={section.id} shadow="xs" radius="md" withBorder>
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <Badge variant="filled" color={section.type === 'text' ? 'blue' : 'orange'}>
                          Section {index + 1}: {section.type.toUpperCase()}
                        </Badge>
                      </Group>
                      <Group gap={5}>
                        <ActionIcon 
                          variant="subtle" 
                          disabled={index === 0} 
                          onClick={() => moveSection(index, 'up')}
                        >
                          <IconChevronUp size={16} />
                        </ActionIcon>
                        <ActionIcon 
                          variant="subtle" 
                          disabled={index === form.values.sections.length - 1} 
                          onClick={() => moveSection(index, 'down')}
                        >
                          <IconChevronDown size={16} />
                        </ActionIcon>
                        <Divider orientation="vertical" />
                        <ActionIcon 
                          variant="subtle" 
                          color="red" 
                          onClick={() => removeSection(index)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>

                    <Group grow align="flex-start">
                      <TextInput
                        label="Section Title (Optional)"
                        placeholder="Enter section title"
                        {...form.getInputProps(`sections.${index}.title`)}
                      />
                      <TextInput
                        label="Section Subtitle (Optional)"
                        placeholder="Enter section subtitle"
                        {...form.getInputProps(`sections.${index}.subtitle`)}
                      />
                    </Group>

                    {section.type === 'text' ? (
                      <Stack gap="md">
                        <Textarea
                          label="Content"
                          placeholder="Write paragraph content for this section..."
                          description="Free-form paragraph text shown above the bullet points"
                          minRows={3}
                          autosize
                          {...form.getInputProps(`sections.${index}.content`)}
                        />

                        <Stack gap="xs">
                          <Group justify="space-between" align="center">
                            <Text size="sm" fw={500}>Points <Text span c="dimmed" size="xs">(Optional bullet list)</Text></Text>
                            <Button
                              size="xs"
                              variant="light"
                              leftSection={<IconPlus size={12} />}
                              onClick={() => addPoint(index)}
                            >
                              Add Point
                            </Button>
                          </Group>

                          {(section.points || []).length === 0 && (
                            <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                              No points added yet. Click "Add Point" to create bullet points.
                            </Text>
                          )}

                          {(section.points || []).map((point, pIdx) => (
                            <Group key={pIdx} gap="xs" align="center">
                              <Text size="sm" c="dimmed" style={{ minWidth: 20 }}>•</Text>
                              <TextInput
                                style={{ flex: 1 }}
                                placeholder={`Point ${pIdx + 1}...`}
                                value={point}
                                onChange={(e) => updatePoint(index, pIdx, e.target.value)}
                              />
                              <ActionIcon
                                color="red"
                                variant="subtle"
                                onClick={() => removePoint(index, pIdx)}
                              >
                                <IconTrash size={14} />
                              </ActionIcon>
                            </Group>
                          ))}
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack gap="xs" align="center">
                        <Paper 
                          withBorder 
                          style={{ 
                            width: '100%', 
                            maxHeight: 300, 
                            minHeight: 150, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          {section.content ? (
                            <Image src={section.content} style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }} />
                          ) : (
                            <Stack align="center" gap="xs">
                              <IconPhoto size={40} color="var(--text-muted)" />
                              <Text size="xs" c="dimmed">No image selected</Text>
                            </Stack>
                          )}
                        </Paper>
                        <FileButton onChange={(file) => handleSectionImageUpload(index, file)} accept="image/*">
                          {(props) => (
                            <Button {...props} variant="light" size="xs" leftSection={<IconUpload size={14} />}>
                              {section.content ? 'Replace Image' : 'Upload Section Image'}
                            </Button>
                          )}
                        </FileButton>
                      </Stack>
                    )}
                  </Stack>
                </Card>
              ))}

              <Button 
                variant="dashed" 
                fullWidth 
                py="xl" 
                leftSection={<IconPlus size={20} />}
                onClick={() => addSection('text')}
              >
                Add Another Section
              </Button>
            </Stack>

            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => navigate('/blogs')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={loading}
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Create Blog Post
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AdminLayout>
  );
};

export default BlogAdd;

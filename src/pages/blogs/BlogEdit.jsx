import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Badge,
  Loader,
  Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
  IconPlus, 
  IconTrash, 
  IconUpload, 
  IconChevronUp, 
  IconChevronDown,
  IconTypography,
  IconPhoto,
  IconArrowLeft
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';
import { convertImageToBase64 } from '@/services/globalSettingsService';

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm({
    initialValues: {
      title: '',
      subtitle: '',
      thumbnail: null,
      author: 'Admin',
      status: 'active',
      sections: [],
    },
    validate: {
      title: (value) => (value.length < 1 ? 'Title is required' : null),
    },
  });

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setFetching(true);
      const response = await AllServices.blogs.getById(id);
      if (response.data) {
        form.setValues(response.data);
      } else {
        showNotification({
          title: 'Error',
          message: 'Blog not found',
          color: 'red',
        });
        navigate('/blogs');
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch blog details',
        color: 'red',
      });
    } finally {
      setFetching(false);
    }
  };

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
    });
  };

  const removeSection = (index) => {
    form.removeListItem('sections', index);
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
      await AllServices.blogs.update(id, values);
      showNotification({
        title: 'Success',
        message: 'Blog updated successfully',
        color: 'green',
      });
      navigate('/blogs');
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to update blog',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <Center style={{ height: '50vh' }}>
          <Loader size="lg" />
        </Center>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="subtle" onClick={() => navigate('/blogs')}>
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={1}>Edit Blog Post</Title>
          </Group>
          <Group>
            <Button variant="subtle" onClick={() => navigate('/blogs')}>
              Cancel
            </Button>
            <Button 
              loading={loading} 
              onClick={() => form.onSubmit(handleSubmit)()}
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Update Blog
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
                          Change Thumbnail
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
                      <Textarea
                        label="Content"
                        placeholder="Enter text content here..."
                        minRows={4}
                        autosize
                        {...form.getInputProps(`sections.${index}.content`)}
                      />
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
                Update Blog Post
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AdminLayout>
  );
};

export default BlogEdit;

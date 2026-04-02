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
  Select,
  Divider,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
  IconTrash, 
  IconUpload, 
  IconPhoto
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';
import { convertImageToBase64 } from '@/services/globalSettingsService';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      thumbnail: null,
      category: '',
      link: {
        text: 'View Project',
        href: '',
      },
      status: 'active',
    },
    validate: {
      title: (value) => (value.length < 1 ? 'Title is required' : null),
      description: (value) => (value.length < 1 ? 'Description is required' : null),
      'link.href': (value) => (value.length < 1 ? 'Link URL is required' : null),
    },
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setFetching(true);
        const response = await AllServices.projects.getById(id);
        const project = response.data;
        if (project) {
          form.setValues({
            title: project.title || '',
            description: project.description || '',
            thumbnail: project.thumbnail || null,
            category: project.category || '',
            link: {
              text: project.link?.text || 'View Project',
              href: project.link?.href || '',
            },
            status: project.status || 'active',
          });
        }
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to fetch project details',
          color: 'red',
        });
        navigate('/projects');
      } finally {
        setFetching(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

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

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await AllServices.projects.update(id, values);
      showNotification({
        title: 'Success',
        message: 'Project updated successfully',
        color: 'green',
      });
      navigate('/projects');
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to update project',
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
          <Title order={1}>Edit Project</Title>
          <Group>
            <Button variant="subtle" onClick={() => navigate('/projects')}>
              Cancel
            </Button>
            <Button 
              loading={loading} 
              onClick={() => form.onSubmit(handleSubmit)()}
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Update Project
            </Button>
          </Group>
        </Group>

        <Box style={{ position: 'relative' }}>
          <LoadingOverlay visible={fetching} overlayProps={{ blur: 2 }} />
          
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="xl">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={4}>General Information</Title>
                  <Group grow align="flex-start">
                    <Stack gap="md">
                      <TextInput
                        label="Project Title"
                        placeholder="Enter project title"
                        required
                        {...form.getInputProps('title')}
                      />
                      <Select
                        label="Category"
                        placeholder="Select category"
                        data={[
                          'Full Stack',
                          'Frontend',
                          'Backend',
                          'Mobile',
                          'AI/ML',
                          'UI/UX',
                          'Other',
                        ]}
                        searchable
                        {...form.getInputProps('category')}
                      />
                      <Select
                        label="Status"
                        data={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                        ]}
                        {...form.getInputProps('status')}
                      />
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

                  <Textarea
                    label="Description"
                    placeholder="Enter project description"
                    required
                    minRows={4}
                    {...form.getInputProps('description')}
                  />

                  <Divider label="External Link" labelPosition="center" />
                  
                  <Group grow>
                    <TextInput
                      label="Link Button Text"
                      placeholder="View Project"
                      {...form.getInputProps('link.text')}
                    />
                    <TextInput
                      label="Link URL"
                      placeholder="https://example.com"
                      required
                      {...form.getInputProps('link.href')}
                    />
                  </Group>
                </Stack>
              </Card>

              <Group justify="flex-end">
                <Button variant="subtle" onClick={() => navigate('/projects')}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  loading={loading}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  Update Project
                </Button>
              </Group>
            </Stack>
          </form>
        </Box>
      </Stack>
    </AdminLayout>
  );
};

export default ProjectEdit;

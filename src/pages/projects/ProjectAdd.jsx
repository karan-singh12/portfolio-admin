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
  Select,
  Divider,
  SimpleGrid,
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

const ProjectAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      whatIDid: '',
      images: [],
    },
    validate: {
      title: (value) => (value.length < 1 ? 'Title is required' : null),
      description: (value) => (value.length < 1 ? 'Description is required' : null),
      'link.href': (value) => (value.length < 1 ? 'Link URL is required' : null),
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

  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    try {
      const promises = files.map(file => convertImageToBase64(file));
      const base64s = await Promise.all(promises);
      form.setFieldValue('images', [...form.values.images, ...base64s]);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to upload gallery images',
        color: 'red',
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        whatIDid: values.whatIDid.split('\n').filter(line => line.trim() !== ''),
      };
      await AllServices.projects.create(payload);
      showNotification({
        title: 'Success',
        message: 'Project created successfully',
        color: 'green',
      });
      navigate('/projects');
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to create project',
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
          <Title order={1}>Add New Project</Title>
          <Group>
            <Button variant="subtle" onClick={() => navigate('/projects')}>
              Cancel
            </Button>
            <Button 
              loading={loading} 
              onClick={() => form.onSubmit(handleSubmit)()}
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Save Project
            </Button>
          </Group>
        </Group>

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

                <Textarea
                  label="What I Did (one point per line)"
                  placeholder="Designed the UI in Figma&#10;Implemented backend with Node.js&#10;Optimized database queries"
                  minRows={4}
                  {...form.getInputProps('whatIDid')}
                />

                <Divider label="Project Gallery" labelPosition="center" />
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>Gallery Images</Text>
                    <FileButton onChange={handleGalleryUpload} accept="image/*" multiple>
                      {(props) => (
                        <Button {...props} variant="light" size="xs" leftSection={<IconUpload size={14} />}>
                          Add Images
                        </Button>
                      )}
                    </FileButton>
                  </Group>
                  
                  <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
                    {form.values.images.map((img, index) => (
                      <Paper 
                        key={index}
                        withBorder 
                        style={{ 
                          position: 'relative',
                          aspectRatio: '1/1',
                          overflow: 'hidden'
                        }}
                      >
                        <Image src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <ActionIcon 
                          color="red" 
                          variant="filled" 
                          style={{ position: 'absolute', top: 5, right: 5 }}
                          onClick={() => {
                            const newImages = [...form.values.images];
                            newImages.splice(index, 1);
                            form.setFieldValue('images', newImages);
                          }}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Paper>
                    ))}
                    {form.values.images.length === 0 && (
                      <Paper 
                        withBorder 
                        p="xl"
                        style={{ 
                          gridColumn: '1 / -1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 120,
                          borderStyle: 'dashed'
                        }}
                      >
                        <IconPhoto size={30} color="var(--text-muted)" />
                        <Text size="xs" c="dimmed" mt={5}>No gallery images added</Text>
                      </Paper>
                    )}
                  </SimpleGrid>
                </Stack>

                <Divider label="External Link" labelPosition="center" />
                
                <Group grow>
                  <TextInput
                    label="Link Button Text"
                    placeholder="e.g., View Demo, GitHub, etc."
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
                Create Project
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AdminLayout>
  );
};

export default ProjectAdd;

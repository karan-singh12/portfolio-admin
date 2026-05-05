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
  SimpleGrid,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconTrash,
  IconUpload,
  IconPhoto,
  IconPlus,
  IconGripVertical,
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
      whatIDid: [''],
      images: [],
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
          // Support both array (new) and string (legacy) formats
          let points = [''];
          if (Array.isArray(project.whatIDid) && project.whatIDid.length > 0) {
            points = project.whatIDid;
          } else if (typeof project.whatIDid === 'string' && project.whatIDid.trim()) {
            // Legacy: split by newline if stored as string
            points = project.whatIDid.split('\n').filter((l) => l.trim() !== '');
            if (points.length === 0) points = [''];
          }
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
            whatIDid: points,
            images: project.images || [],
          });
        }
      } catch {
        showNotification({ title: 'Error', message: 'Failed to fetch project details', color: 'red' });
        navigate('/projects');
      } finally {
        setFetching(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  // ── whatIDid helpers ──────────────────────────────────────
  const addPoint = () => {
    form.setFieldValue('whatIDid', [...form.values.whatIDid, '']);
  };

  const removePoint = (index) => {
    const updated = form.values.whatIDid.filter((_, i) => i !== index);
    form.setFieldValue('whatIDid', updated.length > 0 ? updated : ['']);
  };

  const updatePoint = (index, value) => {
    const updated = [...form.values.whatIDid];
    updated[index] = value;
    form.setFieldValue('whatIDid', updated);
  };

  // ── image helpers ─────────────────────────────────────────
  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      form.setFieldValue('thumbnail', base64);
    } catch {
      showNotification({ title: 'Error', message: 'Failed to upload thumbnail', color: 'red' });
    }
  };

  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    try {
      const base64s = await Promise.all(files.map((f) => convertImageToBase64(f)));
      form.setFieldValue('images', [...form.values.images, ...base64s]);
    } catch {
      showNotification({ title: 'Error', message: 'Failed to upload gallery images', color: 'red' });
    }
  };

  // ── submit ────────────────────────────────────────────────
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        whatIDid: values.whatIDid.filter((p) => p.trim() !== ''),
      };
      await AllServices.projects.update(id, payload);
      showNotification({ title: 'Success', message: 'Project updated successfully', color: 'green' });
      navigate('/projects');
    } catch {
      showNotification({ title: 'Error', message: 'Failed to update project', color: 'red' });
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
            <Button variant="subtle" onClick={() => navigate('/projects')}>Cancel</Button>
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
                        data={['Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'UI/UX', 'Other']}
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
                          position: 'relative',
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

                  {/* ── Role & Responsibilities ── */}
                  <Divider label="Role & Responsibilities" labelPosition="center" />
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Text size="sm" fw={500} c="dimmed">
                        Add each responsibility as a separate point. Each point can span multiple lines.
                      </Text>
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconPlus size={14} />}
                        onClick={addPoint}
                        style={{ color: 'var(--primary-color)' }}
                      >
                        Add Point
                      </Button>
                    </Group>

                    {form.values.whatIDid.map((point, index) => (
                      <Paper
                        key={index}
                        withBorder
                        p="sm"
                        radius="md"
                        style={{ position: 'relative', backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <Group align="flex-start" gap="xs" wrap="nowrap">
                          <ThemeIcon
                            size={28}
                            radius="sm"
                            variant="light"
                            color="orange"
                            style={{ marginTop: 2, flexShrink: 0 }}
                          >
                            <IconGripVertical size={14} />
                          </ThemeIcon>
                          <Textarea
                            placeholder={`Point ${index + 1} — e.g., Designed and implemented the authentication module using JWT and refresh tokens...`}
                            value={point}
                            onChange={(e) => updatePoint(index, e.currentTarget.value)}
                            minRows={2}
                            autosize
                            style={{ flex: 1 }}
                            styles={{ input: { fontSize: '14px' } }}
                          />
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => removePoint(index)}
                            style={{ marginTop: 2, flexShrink: 0 }}
                            disabled={form.values.whatIDid.length === 1}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                        <Text size="xs" c="dimmed" mt={4} ml={36}>
                          Point {index + 1}
                        </Text>
                      </Paper>
                    ))}

                    <Button
                      variant="dashed"
                      fullWidth
                      leftSection={<IconPlus size={16} />}
                      onClick={addPoint}
                      style={{
                        border: '1.5px dashed var(--border-color)',
                        color: 'var(--text-muted)',
                        backgroundColor: 'transparent',
                      }}
                    >
                      Add Another Point
                    </Button>
                  </Stack>

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
                          style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}
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
                            borderStyle: 'dashed',
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
                <Button variant="subtle" onClick={() => navigate('/projects')}>Cancel</Button>
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

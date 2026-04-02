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
  Checkbox,
  MultiSelect,
  Grid,
  Loader,
  Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
  IconPlus, 
  IconTrash, 
  IconUpload, 
  IconPhoto,
  IconArrowLeft
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';
import { convertImageToBase64 } from '@/services/globalSettingsService';

const ExperienceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm({
    initialValues: {
      company: '',
      logo: null,
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      technologies: [],
      status: 'active',
    },
    validate: {
      company: (value) => (value.length < 1 ? 'Company name is required' : null),
      role: (value) => (value.length < 1 ? 'Role is required' : null),
      startDate: (value) => (value.length < 1 ? 'Start date is required' : null),
    },
  });

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      setFetching(true);
      const response = await AllServices.experience.getById(id);
      if (response.data) {
        form.setValues(response.data);
      } else {
        showNotification({
          title: 'Error',
          message: 'Experience record not found',
          color: 'red',
        });
        navigate('/experience');
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch details',
        color: 'red',
      });
    } finally {
      setFetching(false);
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      form.setFieldValue('logo', base64);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to upload logo',
        color: 'red',
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await AllServices.experience.update(id, values);
      showNotification({
        title: 'Success',
        message: 'Experience updated successfully',
        color: 'green',
      });
      navigate('/experience');
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to update experience',
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
            <ActionIcon variant="subtle" onClick={() => navigate('/experience')}>
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={1}>Edit Experience</Title>
          </Group>
          <Group>
            <Button variant="subtle" onClick={() => navigate('/experience')}>
              Cancel
            </Button>
            <Button 
              loading={loading} 
              onClick={() => form.onSubmit(handleSubmit)()}
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Update Experience
            </Button>
          </Group>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl">
            <Grid gutter="xl">
              {/* Left Column - Company & Logo */}
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md" align="center">
                    <Title order={4} ta="left" style={{ width: '100%' }}>Company Logo</Title>
                    <Paper 
                      withBorder 
                      style={{ 
                        width: 150, 
                        height: 150, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        overflow: 'hidden',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '8px'
                      }}
                    >
                      {form.values.logo ? (
                        <Image src={form.values.logo} height={150} fit="contain" />
                      ) : (
                        <Stack align="center" gap="xs">
                          <IconPhoto size={40} color="var(--text-muted)" />
                          <Text size="xs" c="dimmed">No logo uploaded</Text>
                        </Stack>
                      )}
                    </Paper>
                    <FileButton onChange={handleLogoUpload} accept="image/*">
                      {(props) => (
                        <Button {...props} variant="light" leftSection={<IconUpload size={14} />}>
                          {form.values.logo ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                      )}
                    </FileButton>
                  </Stack>
                </Card>
              </Grid.Col>

              {/* Right Column - Details */}
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={4}>Experience Details</Title>
                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Company Name"
                          placeholder="e.g. Google"
                          required
                          {...form.getInputProps('company')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Role/Title"
                          placeholder="e.g. Senior Developer"
                          required
                          {...form.getInputProps('role')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Location"
                          placeholder="e.g. New York, Remote"
                          {...form.getInputProps('location')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <MultiSelect
                          label="Technologies"
                          placeholder="Search or add technologies"
                          data={['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind', 'Python', 'AWS', 'Docker']}
                          searchable
                          creatable
                          getCreateLabel={(query) => `+ Add ${query}`}
                          onCreate={(query) => {
                            const item = { value: query, label: query };
                            return item;
                          }}
                          {...form.getInputProps('technologies')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                          label="Start Date"
                          placeholder="e.g. Jan 2022"
                          required
                          {...form.getInputProps('startDate')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                          label="End Date"
                          placeholder="e.g. Dec 2023"
                          disabled={form.values.current}
                          {...form.getInputProps('endDate')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
                        <Checkbox
                          label="Currently Working Here"
                          {...form.getInputProps('current', { type: 'checkbox' })}
                        />
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <Textarea
                          label="Description / Responsibilities"
                          placeholder="What did you do there?"
                          minRows={6}
                          autosize
                          {...form.getInputProps('description')}
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="xl">
              <Button variant="subtle" onClick={() => navigate('/experience')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={loading}
                size="md"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Update Experience
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AdminLayout>
  );
};

export default ExperienceEdit;

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
  Badge,
  Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
  IconPlus, 
  IconTrash, 
  IconUpload, 
  IconChevronUp, 
  IconChevronDown,
  IconCode,
  IconPhoto,
  IconCheck
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';
import { convertImageToBase64 } from '@/services/globalSettingsService';

const DSAAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      difficulty: 'Medium',
      question: '',
      description: '',
      status: 'active',
      solutions: [
        { id: Date.now(), description: '', image: null, output: '' }
      ],
    },
    validate: {
      title: (value) => (value.length < 1 ? 'Title is required' : null),
      question: (value) => (value.length < 1 ? 'Question is required' : null),
    },
  });

  const handleSolutionImageUpload = async (index, file) => {
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      form.setFieldValue(`solutions.${index}.image`, base64);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to upload image',
        color: 'red',
      });
    }
  };

  const addSolution = () => {
    form.insertListItem('solutions', {
      id: Date.now(),
      description: '',
      image: null,
      output: '',
    });
  };

  const removeSolution = (index) => {
    if (form.values.solutions.length > 1) {
      form.removeListItem('solutions', index);
    } else {
      showNotification({
        title: 'Note',
        message: 'At least one solution is required',
        color: 'blue',
      });
    }
  };

  const moveSolution = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < form.values.solutions.length) {
      form.reorderListItem('solutions', { from: index, to: newIndex });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await AllServices.dsa.create(values);
      showNotification({
        title: 'Success',
        message: 'DSA Problem created successfully',
        color: 'green',
      });
      navigate('/dsa');
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to create problem',
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
          <Title order={1}>Add DSA Problem</Title>
          <Group>
            <Button variant="subtle" onClick={() => navigate('/dsa')}>
              Cancel
            </Button>
            <Button 
              loading={loading} 
              onClick={() => form.onSubmit(handleSubmit)()}
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Save Problem
            </Button>
          </Group>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl">
            {/* Basic Info */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={4}>Problem Details</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <TextInput
                      label="Problem Title"
                      placeholder="e.g. Two Sum, Reverse Linked List"
                      required
                      {...form.getInputProps('title')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Select
                      label="Difficulty"
                      data={['Easy', 'Medium', 'Hard']}
                      {...form.getInputProps('difficulty')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="The Question"
                      placeholder="Enter the problem statement here..."
                      required
                      minRows={3}
                      autosize
                      {...form.getInputProps('question')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Description & Examples"
                      placeholder="Provide additional context, constraints, and examples..."
                      minRows={5}
                      autosize
                      {...form.getInputProps('description')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* Solutions Section */}
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4}>Solutions</Title>
                <Button 
                  size="xs" 
                  variant="outline" 
                  leftSection={<IconPlus size={14} />}
                  onClick={addSolution}
                >
                  Add Another Solution
                </Button>
              </Group>

              {form.values.solutions.map((solution, index) => (
                <Card key={solution.id} shadow="xs" radius="md" withBorder>
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Badge variant="filled" color="blue">
                        Solution {index + 1}
                      </Badge>
                      <Group gap={5}>
                        <ActionIcon 
                          variant="subtle" 
                          disabled={index === 0} 
                          onClick={() => moveSolution(index, 'up')}
                        >
                          <IconChevronUp size={16} />
                        </ActionIcon>
                        <ActionIcon 
                          variant="subtle" 
                          disabled={index === form.values.solutions.length - 1} 
                          onClick={() => moveSolution(index, 'down')}
                        >
                          <IconChevronDown size={16} />
                        </ActionIcon>
                        <Divider orientation="vertical" />
                        <ActionIcon 
                          variant="subtle" 
                          color="red" 
                          onClick={() => removeSolution(index)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>

                    <Textarea
                      label="Solution Description"
                      placeholder="Explain the approach (e.g. Brute Force, Optimal using Hash Map)..."
                      minRows={3}
                      autosize
                      {...form.getInputProps(`solutions.${index}.description`)}
                    />

                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="xs">
                          <Text size="sm" fw={500}>Code/Visual Representation</Text>
                          <Paper 
                            withBorder 
                            style={{ 
                              height: 200, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              overflow: 'hidden',
                              backgroundColor: 'var(--bg-secondary)'
                            }}
                          >
                            {solution.image ? (
                              <Image src={solution.image} height={200} fit="contain" />
                            ) : (
                              <Stack align="center" gap="xs">
                                <IconPhoto size={40} color="var(--text-muted)" />
                                <Text size="xs" c="dimmed">No image uploaded</Text>
                              </Stack>
                            )}
                          </Paper>
                          <FileButton onChange={(file) => handleSolutionImageUpload(index, file)} accept="image/*">
                            {(props) => (
                              <Button {...props} variant="light" size="xs" leftSection={<IconUpload size={14} />}>
                                {solution.image ? 'Change Image' : 'Upload Image'}
                              </Button>
                            )}
                          </FileButton>
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Textarea
                          label="Sample Output"
                          placeholder="Show what the result looks like..."
                          minRows={8}
                          styles={{ input: { fontFamily: 'monospace', fontSize: '13px' } }}
                          {...form.getInputProps(`solutions.${index}.output`)}
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>
              ))}
            </Stack>

            <Group justify="flex-end" mt="xl">
              <Button variant="subtle" onClick={() => navigate('/dsa')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={loading}
                size="md"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Create DSA Problem
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AdminLayout>
  );
};

// Add Grid to imports since I used it but forgot to add it
export default DSAAdd;

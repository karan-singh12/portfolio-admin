import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Title, Button, TextInput, Textarea, Stack, Group,
  Image, FileButton, Paper, Text, ActionIcon, Divider,
  Select, Badge, Menu,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconPlus, IconTrash, IconUpload, IconChevronUp, IconChevronDown,
  IconTypography, IconPhoto, IconList, IconCode, IconChevronDown as IconMenuDown,
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';
import { convertImageToBase64 } from '@/services/globalSettingsService';

// ─── helpers ────────────────────────────────────────────────────────────────
const newBlock = (type) => ({ id: Date.now() + Math.random(), type, value: type === 'points' ? [''] : '' });
const newSection = () => ({ id: Date.now() + Math.random(), title: '', subtitle: '', contentBlocks: [newBlock('text')] });

const BLOCK_COLORS = { text: 'blue', image: 'orange', points: 'green', code: 'violet' };
const BLOCK_LABELS = { text: 'Paragraph', image: 'Image', points: 'Bullet List', code: 'Code' };

// ─── component ───────────────────────────────────────────────────────────────
const BlogAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '', subtitle: '', thumbnail: null, author: 'Admin', status: 'active',
      sections: [newSection()],
    },
    validate: { title: (v) => (v.length < 1 ? 'Title is required' : null) },
  });

  // ── thumbnail ──────────────────────────────────────────────────────────────
  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    try { form.setFieldValue('thumbnail', await convertImageToBase64(file)); }
    catch { showNotification({ title: 'Error', message: 'Failed to upload thumbnail', color: 'red' }); }
  };

  // ── section helpers ────────────────────────────────────────────────────────
  const addSection = () => form.insertListItem('sections', newSection());
  const removeSection = (si) => {
    if (form.values.sections.length <= 1) return showNotification({ title: 'Note', message: 'At least one section required', color: 'blue' });
    form.removeListItem('sections', si);
  };
  const moveSection = (si, dir) => {
    const to = dir === 'up' ? si - 1 : si + 1;
    if (to >= 0 && to < form.values.sections.length) form.reorderListItem('sections', { from: si, to });
  };

  // ── block helpers ──────────────────────────────────────────────────────────
  const addBlock = (si, type) => {
    const blocks = [...form.values.sections[si].contentBlocks, newBlock(type)];
    form.setFieldValue(`sections.${si}.contentBlocks`, blocks);
  };
  const removeBlock = (si, bi) => {
    const blocks = form.values.sections[si].contentBlocks.filter((_, i) => i !== bi);
    form.setFieldValue(`sections.${si}.contentBlocks`, blocks.length ? blocks : [newBlock('text')]);
  };
  const moveBlock = (si, bi, dir) => {
    const blocks = [...form.values.sections[si].contentBlocks];
    const to = dir === 'up' ? bi - 1 : bi + 1;
    if (to < 0 || to >= blocks.length) return;
    [blocks[bi], blocks[to]] = [blocks[to], blocks[bi]];
    form.setFieldValue(`sections.${si}.contentBlocks`, blocks);
  };
  const updateBlockValue = (si, bi, value) => {
    const blocks = [...form.values.sections[si].contentBlocks];
    blocks[bi] = { ...blocks[bi], value };
    form.setFieldValue(`sections.${si}.contentBlocks`, blocks);
  };

  // ── points helpers ─────────────────────────────────────────────────────────
  const addPoint = (si, bi) => updateBlockValue(si, bi, [...(form.values.sections[si].contentBlocks[bi].value || []), '']);
  const removePoint = (si, bi, pi) => {
    const pts = form.values.sections[si].contentBlocks[bi].value.filter((_, i) => i !== pi);
    updateBlockValue(si, bi, pts.length ? pts : ['']);
  };
  const updatePoint = (si, bi, pi, val) => {
    const pts = [...form.values.sections[si].contentBlocks[bi].value];
    pts[pi] = val;
    updateBlockValue(si, bi, pts);
  };

  // ── image upload ───────────────────────────────────────────────────────────
  const handleBlockImageUpload = async (si, bi, file) => {
    if (!file) return;
    try { updateBlockValue(si, bi, await convertImageToBase64(file)); }
    catch { showNotification({ title: 'Error', message: 'Failed to upload image', color: 'red' }); }
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await AllServices.blogs.create(values);
      showNotification({ title: 'Success', message: 'Blog created successfully', color: 'green' });
      navigate('/blogs');
    } catch {
      showNotification({ title: 'Error', message: 'Failed to create blog', color: 'red' });
    } finally { setLoading(false); }
  };

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Add New Blog</Title>
          <Group>
            <Button variant="subtle" onClick={() => navigate('/blogs')}>Cancel</Button>
            <Button loading={loading} onClick={() => form.onSubmit(handleSubmit)()} style={{ backgroundColor: 'var(--primary-color)' }}>
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
                    <TextInput label="Blog Title" placeholder="Enter blog title" required {...form.getInputProps('title')} />
                    <TextInput label="Subtitle" placeholder="Short description" {...form.getInputProps('subtitle')} />
                    <Group grow>
                      <TextInput label="Author" placeholder="Admin" {...form.getInputProps('author')} />
                      <Select label="Status" data={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} {...form.getInputProps('status')} />
                    </Group>
                  </Stack>

                  <Stack gap="xs" align="center" style={{ maxWidth: 300 }}>
                    <Text size="sm" fw={500}>Thumbnail</Text>
                    <Paper withBorder style={{ width: '100%', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                      {form.values.thumbnail ? (
                        <>
                          <Image src={form.values.thumbnail} height={180} />
                          <ActionIcon color="red" variant="filled" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => form.setFieldValue('thumbnail', null)}>
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
                      {(props) => <Button {...props} variant="light" leftSection={<IconUpload size={16} />}>Upload Thumbnail</Button>}
                    </FileButton>
                  </Stack>
                </Group>
              </Stack>
            </Card>

            {/* Sections */}
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4}>Content Sections</Title>
                <Button size="xs" variant="outline" leftSection={<IconPlus size={14} />} onClick={addSection}>
                  Add Section
                </Button>
              </Group>

              {form.values.sections.map((section, si) => (
                <Card key={section.id} shadow="xs" radius="md" withBorder>
                  <Stack gap="md">
                    {/* Section header */}
                    <Group justify="space-between">
                      <Badge variant="light" color="indigo">Section {si + 1}</Badge>
                      <Group gap={4}>
                        <ActionIcon variant="subtle" disabled={si === 0} onClick={() => moveSection(si, 'up')}><IconChevronUp size={16} /></ActionIcon>
                        <ActionIcon variant="subtle" disabled={si === form.values.sections.length - 1} onClick={() => moveSection(si, 'down')}><IconChevronDown size={16} /></ActionIcon>
                        <Divider orientation="vertical" />
                        <ActionIcon variant="subtle" color="red" onClick={() => removeSection(si)}><IconTrash size={16} /></ActionIcon>
                      </Group>
                    </Group>

                    <Group grow>
                      <TextInput label="Section Title (Optional)" placeholder="e.g. Introduction" {...form.getInputProps(`sections.${si}.title`)} />
                      <TextInput label="Section Subtitle (Optional)" placeholder="Optional subtitle" {...form.getInputProps(`sections.${si}.subtitle`)} />
                    </Group>

                    {/* Content Blocks */}
                    <Stack gap="sm">
                      <Text size="sm" fw={500} c="dimmed">Content Blocks</Text>

                      {(section.contentBlocks || []).map((block, bi) => (
                        <Paper key={block.id} withBorder p="sm" radius="md" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                          <Stack gap="xs">
                            {/* Block toolbar */}
                            <Group justify="space-between">
                              <Badge size="xs" color={BLOCK_COLORS[block.type]} variant="filled">
                                {BLOCK_LABELS[block.type]}
                              </Badge>
                              <Group gap={4}>
                                <ActionIcon size="xs" variant="subtle" disabled={bi === 0} onClick={() => moveBlock(si, bi, 'up')}><IconChevronUp size={12} /></ActionIcon>
                                <ActionIcon size="xs" variant="subtle" disabled={bi === section.contentBlocks.length - 1} onClick={() => moveBlock(si, bi, 'down')}><IconChevronDown size={12} /></ActionIcon>
                                <ActionIcon size="xs" variant="subtle" color="red" onClick={() => removeBlock(si, bi)}><IconTrash size={12} /></ActionIcon>
                              </Group>
                            </Group>

                            {/* Block content */}
                            {block.type === 'text' && (
                              <Textarea
                                placeholder="Write paragraph content..."
                                minRows={3}
                                autosize
                                value={block.value}
                                onChange={(e) => updateBlockValue(si, bi, e.currentTarget.value)}
                              />
                            )}

                            {block.type === 'code' && (
                              <Textarea
                                placeholder="Paste your code snippet here..."
                                minRows={4}
                                autosize
                                styles={{ input: { fontFamily: 'monospace', fontSize: '13px' } }}
                                value={block.value}
                                onChange={(e) => updateBlockValue(si, bi, e.currentTarget.value)}
                              />
                            )}

                            {block.type === 'image' && (
                              <Stack gap="xs" align="center">
                                <Paper withBorder style={{ width: '100%', minHeight: 120, maxHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                  {block.value ? (
                                    <img src={block.value} alt="block" style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }} />
                                  ) : (
                                    <Stack align="center" gap="xs">
                                      <IconPhoto size={32} color="var(--text-muted)" />
                                      <Text size="xs" c="dimmed">No image selected</Text>
                                    </Stack>
                                  )}
                                </Paper>
                                <FileButton onChange={(file) => handleBlockImageUpload(si, bi, file)} accept="image/*">
                                  {(props) => (
                                    <Button {...props} variant="light" size="xs" leftSection={<IconUpload size={13} />}>
                                      {block.value ? 'Replace Image' : 'Upload Image'}
                                    </Button>
                                  )}
                                </FileButton>
                              </Stack>
                            )}

                            {block.type === 'points' && (
                              <Stack gap="xs">
                                {(block.value || ['']).map((point, pi) => (
                                  <Group key={pi} gap="xs">
                                    <Text size="sm" c="dimmed" style={{ minWidth: 16 }}>•</Text>
                                    <TextInput
                                      style={{ flex: 1 }}
                                      placeholder={`Point ${pi + 1}...`}
                                      value={point}
                                      onChange={(e) => updatePoint(si, bi, pi, e.target.value)}
                                    />
                                    <ActionIcon color="red" variant="subtle" onClick={() => removePoint(si, bi, pi)} disabled={(block.value || []).length <= 1}>
                                      <IconTrash size={13} />
                                    </ActionIcon>
                                  </Group>
                                ))}
                                <Button size="xs" variant="light" leftSection={<IconPlus size={12} />} onClick={() => addPoint(si, bi)}>
                                  Add Point
                                </Button>
                              </Stack>
                            )}
                          </Stack>
                        </Paper>
                      ))}

                      {/* Add block menu */}
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <Button
                            variant="dashed"
                            size="xs"
                            leftSection={<IconPlus size={13} />}
                            style={{ border: '1.5px dashed var(--border-color)', color: 'var(--text-muted)', backgroundColor: 'transparent' }}
                          >
                            Add Content Block
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Block Type</Menu.Label>
                          <Menu.Item leftSection={<IconTypography size={14} />} onClick={() => addBlock(si, 'text')}>Paragraph</Menu.Item>
                          <Menu.Item leftSection={<IconPhoto size={14} />} onClick={() => addBlock(si, 'image')}>Image</Menu.Item>
                          <Menu.Item leftSection={<IconList size={14} />} onClick={() => addBlock(si, 'points')}>Bullet List</Menu.Item>
                          <Menu.Item leftSection={<IconCode size={14} />} onClick={() => addBlock(si, 'code')}>Code Block</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Stack>
                  </Stack>
                </Card>
              ))}

              <Button
                variant="dashed" fullWidth py="xl" leftSection={<IconPlus size={20} />} onClick={addSection}
                style={{ border: '2px dashed var(--border-color)', color: 'var(--text-muted)', backgroundColor: 'transparent' }}
              >
                Add Another Section
              </Button>
            </Stack>

            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => navigate('/blogs')}>Cancel</Button>
              <Button type="submit" loading={loading} style={{ backgroundColor: 'var(--primary-color)' }}>Create Blog Post</Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AdminLayout>
  );
};

export default BlogAdd;

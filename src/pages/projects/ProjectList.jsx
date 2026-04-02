import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Title,
  Button,
  TextInput,
  Group,
  Table,
  Badge,
  ActionIcon,
  Text,
  Stack,
  Pagination,
  Select,
  Menu,
  Image,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDots,
  IconExternalLink,
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, [page, pageSize, search]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await AllServices.projects.list({
        page,
        pageSize,
        search,
      });
      setProjects(response.data?.data || []);
      setTotal(response.data?.total || 0);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch projects',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await AllServices.projects.remove(id);
        showNotification({
          title: 'Success',
          message: 'Project deleted successfully',
          color: 'green',
        });
        fetchProjects();
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to delete project',
          color: 'red',
        });
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await AllServices.projects.changeStatus(id, status);
      showNotification({
        title: 'Success',
        message: 'Project status updated',
        color: 'green',
      });
      fetchProjects();
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to update status',
        color: 'red',
      });
    }
  };

  const rows = projects.map((project) => (
    <Table.Tr key={project.id}>
      <Table.Td>
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            width={60}
            height={40}
            radius="sm"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 40,
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'var(--text-muted)',
            }}
          >
            No Image
          </div>
        )}
      </Table.Td>
      <Table.Td>
        <Stack gap={0}>
          <Text fw={500} lineClamp={1}>
            {project.title || 'Untitled Project'}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {project.category || 'No category'}
          </Text>
        </Stack>
      </Table.Td>
      <Table.Td>
        <Text size="sm" lineClamp={2} style={{ maxWidth: '300px' }}>
          {project.description || 'No description'}
        </Text>
      </Table.Td>
      <Table.Td>
        {project.link?.href ? (
          <ActionIcon 
            variant="subtle" 
            color="blue" 
            component="a" 
            href={project.link.href} 
            target="_blank"
          >
            <IconExternalLink size={16} />
          </ActionIcon>
        ) : '-'}
      </Table.Td>
      <Table.Td>
        <Badge 
          color={project.status === 'active' ? 'green' : 'gray'}
          variant="light"
        >
          {project.status || 'inactive'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="orange"
            onClick={() => navigate(`/projects/edit/${project.id}`)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <Menu shadow="md" width={160}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() =>
                  handleStatusChange(
                    project.id,
                    project.status === 'active' ? 'inactive' : 'active'
                  )
                }
              >
                {project.status === 'active' ? 'Deactivate' : 'Activate'}
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() => handleDelete(project.id)}
                leftSection={<IconTrash size={14} />}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Projects</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/projects/add')}
            style={{
              backgroundColor: 'var(--primary-color)',
            }}
          >
            Add Project
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <TextInput
            placeholder="Search projects..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            mb="md"
            style={{ maxWidth: 360 }}
          />

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={80}>Thumbnail</Table.Th>
                <Table.Th>Title & Category</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Link</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    Loading...
                  </Table.Td>
                </Table.Tr>
              ) : rows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    No projects found
                  </Table.Td>
                </Table.Tr>
              ) : (
                rows
              )}
            </Table.Tbody>
          </Table>

          {total > 0 && (
            <Group justify="flex-end" mt="md" gap="md">
              <Group gap="xs" align="center">
                <Text size="sm" c="dimmed">
                  Show:
                </Text>
                <Select
                  value={pageSize.toString()}
                  onChange={(value) => {
                    const next = Number(value || 10);
                    setPageSize(next);
                    setPage(1);
                  }}
                  data={['10', '20', '30', '50']}
                  style={{ width: 80 }}
                  size="xs"
                />
              </Group>
              <Pagination
                value={page}
                onChange={setPage}
                total={Math.ceil(total / pageSize)}
                size="sm"
              />
            </Group>
          )}
        </Card>
      </Stack>
    </AdminLayout>
  );
};

export default ProjectList;

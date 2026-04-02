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
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDots,
  IconCode,
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';

const DSAList = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProblems();
  }, [page, pageSize, search]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await AllServices.dsa.list({
        page,
        pageSize,
        search,
      });
      setProblems(response.data?.data || response.data || []);
      setTotal(response.data?.total || 0);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch DSA problems',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await AllServices.dsa.remove(id);
        showNotification({
          title: 'Success',
          message: 'Problem deleted successfully',
          color: 'green',
        });
        fetchProblems();
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to delete problem',
          color: 'red',
        });
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await AllServices.dsa.changeStatus(id, status);
      showNotification({
        title: 'Success',
        message: 'Problem status updated',
        color: 'green',
      });
      fetchProblems();
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to update status',
        color: 'red',
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'gray';
    }
  };

  const rows = problems.map((problem) => (
    <Table.Tr key={problem.id}>
      <Table.Td>
        <Group gap="sm">
          <IconCode size={18} color="var(--primary-color)" />
          <Text fw={500}>{problem.title || 'Untitled Problem'}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={getDifficultyColor(problem.difficulty)} variant="light">
          {problem.difficulty || 'Medium'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : '-'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge 
          color={problem.status === 'active' ? 'green' : 'gray'}
          variant="dot"
        >
          {problem.status || 'inactive'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="orange"
            onClick={() => navigate(`/dsa/edit/${problem.id}`)}
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
                    problem.id,
                    problem.status === 'active' ? 'inactive' : 'active'
                  )
                }
              >
                {problem.status === 'active' ? 'Deactivate' : 'Activate'}
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() => handleDelete(problem.id)}
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
          <Title order={1}>DSA Problems</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/dsa/add')}
            style={{
              backgroundColor: 'var(--primary-color)',
            }}
          >
            Add Problem
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <TextInput
            placeholder="Search problems..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            mb="md"
            style={{ maxWidth: 360 }}
          />

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Problem Title</Table.Th>
                <Table.Th>Difficulty</Table.Th>
                <Table.Th>Created At</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" py="xl">
                    Loading...
                  </Table.Td>
                </Table.Tr>
              ) : rows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" py="xl">
                    No problems found
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

export default DSAList;

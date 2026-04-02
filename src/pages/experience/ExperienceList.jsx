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
  Avatar,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDots,
  IconBriefcase,
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';

const ExperienceList = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchExperiences();
  }, [page, pageSize, search]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await AllServices.experience.list({
        page,
        pageSize,
        search,
      });
      setExperiences(response.data?.data || response.data || []);
      setTotal(response.data?.total || 0);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch job experience',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await AllServices.experience.remove(id);
        showNotification({
          title: 'Success',
          message: 'Record deleted successfully',
          color: 'green',
        });
        fetchExperiences();
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to delete record',
          color: 'red',
        });
      }
    }
  };

  const rows = experiences.map((exp) => (
    <Table.Tr key={exp.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar src={exp.logo} radius="sm" size="md">
            <IconBriefcase size={20} />
          </Avatar>
          <Stack gap={0}>
            <Text fw={500}>{exp.company || 'Unknown Company'}</Text>
            <Text size="xs" c="dimmed">{exp.location}</Text>
          </Stack>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={500}>{exp.role || 'N/A'}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge 
          color={exp.status === 'active' ? 'green' : 'gray'}
          variant="dot"
        >
          {exp.status || 'inactive'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="orange"
            onClick={() => navigate(`/experience/edit/${exp.id}`)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDelete(exp.id)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Job Experience</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/experience/add')}
            style={{
              backgroundColor: 'var(--primary-color)',
            }}
          >
            Add Experience
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <TextInput
            placeholder="Search company or role..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            mb="md"
            style={{ maxWidth: 360 }}
          />

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Company</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Period</Table.Th>
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
                    No experience records found
                  </Table.Td>
                </Table.Tr>
              ) : (
                rows
              )}
            </Table.Tbody>
          </Table>

          {total > 0 && (
            <Group justify="flex-end" mt="md" gap="md">
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

export default ExperienceList;

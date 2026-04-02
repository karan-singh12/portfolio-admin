import {
  Grid,
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Button,
  Avatar,
} from '@mantine/core';
import {
  IconNews,
  IconCode,
  IconBriefcase,
  IconEye,
  IconTrendingUp,
  IconPlus,
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Blogs',
      value: '24',
      change: '+3 new',
      trend: 'up',
      icon: IconNews,
      color: 'blue',
      path: '/blogs',
    },
    {
      title: 'DSA Problems',
      value: '42',
      change: '+5 new',
      trend: 'up',
      icon: IconCode,
      color: 'green',
      path: '/dsa',
    },
    {
      title: 'Experience',
      value: '5',
      change: 'Recent',
      trend: 'up',
      icon: IconBriefcase,
      color: 'orange',
      path: '/experience',
    },
    {
      title: 'Total Views',
      value: '12.4K',
      change: '+15%',
      trend: 'up',
      icon: IconEye,
      color: 'violet',
      path: '/blogs',
    },
  ];

  const viewsData = [
    { name: 'Mon', views: 400 },
    { name: 'Tue', views: 300 },
    { name: 'Wed', views: 500 },
    { name: 'Thu', views: 450 },
    { name: 'Fri', views: 600 },
    { name: 'Sat', views: 550 },
    { name: 'Sun', views: 700 },
  ];

  const recentContent = [
    { id: 1, title: 'Understanding React Server Components', type: 'blog', date: '2 hours ago' },
    { id: 2, title: 'Two Sum Problem - Optimized', type: 'dsa', date: '5 hours ago' },
    { id: 3, title: 'Deep dive into TypeScript Generics', type: 'blog', date: 'Yesterday' },
    { id: 4, title: 'Senior Frontend Developer at Google', type: 'experience', date: '2 days ago' },
  ];

  return (
    <AdminLayout>
      <Stack gap="lg">
        {/* Hero Section */}
        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Card
              radius="lg"
              padding="xl"
              className="card-animated hover-lift"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 64, 175, 0.9) 50%, rgba(59, 130, 246, 0.9) 100%)',
                color: '#ffffff',
                border: 'none',
                overflow: 'hidden',
              }}
            >
              <Group justify="space-between" align="flex-start">
                <Stack gap="sm">
                  <Text size="xs" fw={500} c="rgba(226,232,240,0.8)">
                    Welcome back to your workspace 👋
                  </Text>
                  <Title order={2} c="#ffffff">
                    Portfolio Admin
                  </Title>
                  <Text size="sm" c="rgba(226,232,240,0.85)" maw={360}>
                    Manage your professional presence. Update your blog, share DSA solutions, and keep your experience up to date.
                  </Text>
                  <Group gap="sm" mt="md">
                    <Button
                      size="sm"
                      onClick={() => navigate('/blogs/add')}
                      className="button-animated"
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '999px',
                        paddingInline: '1.5rem',
                      }}
                      leftSection={<IconPlus size={16} />}
                    >
                      New Blog Post
                    </Button>
                    <Button
                      size="sm"
                      variant="subtle"
                      onClick={() => navigate('/dsa/add')}
                      className="button-animated"
                      style={{
                        color: '#e2e8f0',
                        borderRadius: '999px',
                      }}
                    >
                      Add DSA Solution
                    </Button>
                  </Group>
                </Stack>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card
              radius="lg"
              padding="xl"
              className="card-animated hover-lift"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,64,175,0.9) 60%, rgba(37,99,235,0.9) 100%)',
                color: '#ffffff',
                border: 'none',
              }}
            >
              <Text size="xs" fw={500} c="rgba(226,232,240,0.8)" mb={8}>
                Portfolio Tip
              </Text>
              <Title order={4} mb="sm">
                Keep your content fresh
              </Title>
              <Text size="sm" c="rgba(226,232,240,0.85)" mb="md">
                Regularly posting blogs and DSA problems increases your visibility to potential recruiters.
              </Text>
              <Button
                size="xs"
                variant="white"
                onClick={() => navigate('/blogs')}
                className="button-animated"
                style={{
                  color: '#0f172a',
                  borderRadius: '999px',
                }}
              >
                View all content
              </Button>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Stats Cards */}
        <Grid>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid.Col key={stat.title} span={{ base: 12, sm: 6, md: 3 }}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  onClick={() => navigate(stat.path)}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">
                      {stat.title}
                    </Text>
                    <Icon
                      size={24}
                      color={`var(--${stat.color}-color)`}
                      className="hover-scale"
                    />
                  </Group>
                  <Text size="xl" fw={700}>
                    {stat.value}
                  </Text>
                  <Group gap={4} mt="xs">
                    <IconTrendingUp size={16} color="green" />
                    <Text size="sm" c="green">
                      {stat.change}
                    </Text>
                    <Text size="sm" c="dimmed">
                      this week
                    </Text>
                  </Group>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>

        {/* Charts and Recent Activity */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className="card-animated"
              style={{ animationDelay: '0.4s' }}
            >
              <Title order={3} mb="md">
                Visitor Engagement
              </Title>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={viewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="var(--primary-color)" 
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className="card-animated"
              style={{ animationDelay: '0.5s' }}
            >
              <Title order={3} mb="md">
                Recent Activity
              </Title>
              <Stack gap="md">
                {recentContent.map((item) => (
                  <Group key={item.id} justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                      <Avatar color={item.type === 'blog' ? 'blue' : item.type === 'dsa' ? 'green' : 'orange'} radius="sm">
                        {item.type === 'blog' ? <IconNews size={20} /> : item.type === 'dsa' ? <IconCode size={20} /> : <IconBriefcase size={20} />}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {item.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {item.date}
                        </Text>
                      </div>
                    </Group>
                    <Badge size="xs" variant="light" color={item.type === 'blog' ? 'blue' : item.type === 'dsa' ? 'green' : 'orange'}>
                      {item.type}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </AdminLayout>
  );
};

export default Dashboard;


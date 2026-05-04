import {
  Grid,
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Button,
  ThemeIcon,
  Paper,
} from '@mantine/core';
import {
  IconNews,
  IconCode,
  IconBriefcase,
  IconEye,
  IconTrendingUp,
  IconPlus,
  IconArrowUpRight,
} from '@tabler/icons-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Blogs',
      value: '24',
      change: '+3 this week',
      icon: IconNews,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
      path: '/blogs',
    },
    {
      title: 'DSA Problems',
      value: '42',
      change: '+5 this week',
      icon: IconCode,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.08)',
      path: '/dsa',
    },
    {
      title: 'Experience',
      value: '5',
      change: 'Up to date',
      icon: IconBriefcase,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      path: '/experience',
    },
    {
      title: 'Total Views',
      value: '12.4K',
      change: '+15% this month',
      icon: IconEye,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.08)',
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
    { id: 1, title: 'Understanding React Server Components', type: 'blog', date: '2 hours ago', color: 'blue' },
    { id: 2, title: 'Two Sum Problem - Optimized', type: 'dsa', date: '5 hours ago', color: 'green' },
    { id: 3, title: 'Deep dive into TypeScript Generics', type: 'blog', date: 'Yesterday', color: 'blue' },
    { id: 4, title: 'Senior Frontend Developer', type: 'experience', date: '2 days ago', color: 'orange' },
  ];

  const typeIcon = { blog: IconNews, dsa: IconCode, experience: IconBriefcase };

  return (
    <AdminLayout>
      <Stack gap="lg">

        {/* Welcome Hero */}
        <Card
          radius="xl"
          padding={0}
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.25) 0%, transparent 55%), radial-gradient(circle at 10% 80%, rgba(59,130,246,0.15) 0%, transparent 50%)',
          }} />
          <Group justify="space-between" align="flex-start" p="xl" style={{ position: 'relative', zIndex: 1 }}>
            <Stack gap={6}>
              <Text size="xs" fw={500} c="rgba(226,232,240,0.7)" tt="uppercase" ls="0.8px">
                Welcome back 👋
              </Text>
              <Title order={2} c="white" style={{ letterSpacing: '-0.5px' }}>
                {user?.name ? `Hi, ${user.name.split(' ')[0]}!` : 'Portfolio Admin'}
              </Title>
              <Text size="sm" c="rgba(226,232,240,0.8)" maw={380} lh={1.6}>
                Manage your blog posts, track DSA solutions, and keep your experience up to date — all in one place.
              </Text>
              <Group gap="sm" mt="md">
                <Button
                  size="sm"
                  onClick={() => navigate('/blogs/add')}
                  leftSection={<IconPlus size={15} />}
                  style={{
                    background: 'var(--primary-color)',
                    borderRadius: '999px',
                    paddingInline: '1.25rem',
                    fontWeight: 600,
                  }}
                >
                  New Blog
                </Button>
                <Button
                  size="sm"
                  variant="white"
                  onClick={() => navigate('/blogs')}
                  style={{
                    borderRadius: '999px',
                    color: '#1e3a8a',
                    fontWeight: 600,
                    paddingInline: '1.25rem',
                  }}
                >
                  View All Content
                </Button>
              </Group>
            </Stack>

            <Paper
              p="md"
              radius="lg"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                maxWidth: 220,
              }}
            >
              <Text size="xs" c="rgba(226,232,240,0.7)" mb={4} fw={500}>💡 Pro Tip</Text>
              <Text size="sm" c="rgba(226,232,240,0.9)" lh={1.5}>
                Posting consistently boosts recruiter visibility.
              </Text>
            </Paper>
          </Group>
        </Card>

        {/* Stat Cards */}
        <Grid>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Grid.Col key={stat.title} span={{ base: 12, sm: 6, md: 3 }}>
                <Card
                  shadow="xs"
                  padding="lg"
                  radius="lg"
                  withBorder
                  onClick={() => navigate(stat.path)}
                  className="hover-lift"
                  style={{
                    cursor: 'pointer',
                    borderLeft: `3px solid ${stat.color}`,
                  }}
                >
                  <Group justify="space-between" mb="sm">
                    <ThemeIcon
                      size={40}
                      radius="md"
                      style={{ background: stat.bg, color: stat.color }}
                      variant="filled"
                    >
                      <Icon size={20} />
                    </ThemeIcon>
                    <IconArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </Group>
                  <Text fw={800} lh={1} mb={4} style={{ fontSize: '1.75rem', color: 'var(--text-dark)' }}>
                    {stat.value}
                  </Text>
                  <Text size="xs" c="dimmed" fw={500} mb={6}>
                    {stat.title}
                  </Text>
                  <Group gap={4}>
                    <IconTrendingUp size={13} color="#10b981" />
                    <Text size="xs" c="teal" fw={500}>
                      {stat.change}
                    </Text>
                  </Group>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>

        {/* Chart + Activity */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="xs" padding="xl" radius="lg" withBorder style={{ height: '100%' }}>
              <Group justify="space-between" mb="md">
                <div>
                  <Title order={4} style={{ letterSpacing: '-0.3px' }}>Visitor Engagement</Title>
                  <Text size="xs" c="dimmed">Weekly views overview</Text>
                </div>
                <Badge variant="light" color="blue" size="sm">This Week</Badge>
              </Group>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={viewsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 10,
                      fontSize: 13,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--primary-color)"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: 'var(--primary-color)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="xs" padding="xl" radius="lg" withBorder style={{ height: '100%' }}>
              <Group justify="space-between" mb="lg">
                <div>
                  <Title order={4} style={{ letterSpacing: '-0.3px' }}>Recent Activity</Title>
                  <Text size="xs" c="dimmed">Latest updates</Text>
                </div>
              </Group>
              <Stack gap={0}>
                {recentContent.map((item, idx) => {
                  const Icon = typeIcon[item.type];
                  const isLast = idx === recentContent.length - 1;
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: 12, paddingBottom: isLast ? 0 : 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                        <ThemeIcon
                          size={30}
                          radius="md"
                          variant="light"
                          color={item.color}
                          style={{ flexShrink: 0 }}
                        >
                          <Icon size={14} />
                        </ThemeIcon>
                        {!isLast && (
                          <div style={{
                            flex: 1,
                            width: 1,
                            background: 'var(--border-color)',
                            margin: '4px 0',
                            minHeight: 16,
                          }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                        <Text size="sm" fw={500} lineClamp={1} style={{ color: 'var(--text-dark)', lineHeight: 1.3 }}>
                          {item.title}
                        </Text>
                        <Group gap={6} mt={3}>
                          <Badge size="xs" variant="light" color={item.color} radius="sm">
                            {item.type}
                          </Badge>
                          <Text size="xs" c="dimmed">{item.date}</Text>
                        </Group>
                      </div>
                    </div>
                  );
                })}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

      </Stack>
    </AdminLayout>
  );
};

export default Dashboard;

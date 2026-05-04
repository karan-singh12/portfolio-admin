import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Group,
  Text,
  Menu,
  Avatar,
  ActionIcon,
  Indicator,
  Divider,
} from '@mantine/core';
import {
  IconLogout,
  IconUser,
  IconSettings,
  IconBell,
  IconChevronDown,
} from '@tabler/icons-react';
import { logoutUser } from '@/store/slices/authSlice';
import { showNotification } from '@mantine/notifications';
import { BRANDING } from '@/config/branding';
import { getImageUrl } from '@/utils/helpers';

const AppNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleLogout = () => {
    dispatch(logoutUser());
    showNotification({
      title: 'Logged out',
      message: 'You have been successfully logged out',
      color: 'blue',
    });
    navigate('/login');
  };

  return (
    <div
      style={{
        height: '100%',
        paddingInline: '1.5rem',
        backgroundColor: 'var(--navbar-bg)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 1px 3px var(--navbar-shadow)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Group justify="space-between" style={{ width: '100%' }}>
        {/* Left — Brand */}
        <Group gap="xs">
          <Text
            fw={700}
            size="md"
            style={{
              background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.3px',
            }}
          >
            {BRANDING.FULL_NAME}
          </Text>
          <Text size="xs" c="dimmed" style={{ fontWeight: 400 }}>
            / Admin
          </Text>
        </Group>

        {/* Right — Actions + User */}
        <Group gap="sm">
          {/* Date chip */}
          <Text
            size="xs"
            c="dimmed"
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            📅 {dateLabel}
          </Text>

          {/* Notification Bell */}
          <Indicator color="red" size={7} offset={3} processing>
            <ActionIcon
              variant="subtle"
              radius="xl"
              size="lg"
              color="gray"
              onClick={() => showNotification({ title: '🔔 No new notifications', message: "You're all caught up!", color: 'gray', autoClose: 2000 })}
            >
              <IconBell size={18} />
            </ActionIcon>
          </Indicator>

          <Divider orientation="vertical" style={{ height: 24, alignSelf: 'center' }} />

          {/* User Menu */}
          <Menu shadow="lg" width={210} radius="md" position="bottom-end">
            <Menu.Target>
              <Group
                gap="xs"
                style={{
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Avatar
                  color="orange"
                  radius="xl"
                  size="sm"
                  src={getImageUrl(user?.avatarUrl)}
                  style={{ border: '2px solid var(--primary-color)' }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <div style={{ lineHeight: 1.2 }}>
                  <Text size="sm" fw={600} style={{ color: 'var(--text-dark)' }}>
                    {user?.name || 'User'}
                  </Text>
                  <Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>
                    {user?.role || 'admin'}
                  </Text>
                </div>
                <IconChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: 2 }} />
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label style={{ fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Account
              </Menu.Label>
              <Menu.Item
                leftSection={<IconUser size={15} />}
                onClick={() => navigate('/settings/profile')}
              >
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSettings size={15} />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={15} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </div>
  );
};

export default AppNavbar;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Group,
  Button,
  Text,
  Menu,
  Avatar,
  Badge,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconLogout,
  IconUser,
  IconSettings,
} from '@tabler/icons-react';
import { logoutUser } from '@/store/slices/authSlice';
import { setTheme } from '@/store/slices/themeSlice';
import { showNotification } from '@mantine/notifications';
import { THEMES } from '@/config/constants';
import { BRANDING } from '@/config/branding';
import { getImageUrl } from '@/utils/helpers';

const AppNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentTheme } = useSelector((state) => state.theme);
  const { toggleColorScheme } = useMantineColorScheme();

  const handleLogout = () => {
    dispatch(logoutUser());
    showNotification({
      title: 'Logged out',
      message: 'You have been successfully logged out',
      color: 'blue',
    });
    navigate('/login');
  };

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
    const darkThemes = ['dark', 'dark_pro', 'midnight_blue'];
    if (darkThemes.includes(theme)) {
      toggleColorScheme();
    }
    showNotification({
      title: '✨ Theme Changed',
      message: `Switched to theme: ${theme}`,
      color: 'green',
      autoClose: 2000,
    });
  };

  return (
    <div
      style={{
        height: '100%',
        padding: '1rem',
        backgroundColor: 'var(--navbar-bg)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 2px 4px var(--navbar-shadow)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Group justify="space-between" style={{ width: '100%' }}>
        <Group>
          <Text fw={600} size="lg" c="var(--primary-color)">
            {BRANDING.FULL_NAME}
          </Text>
        </Group>

        <Group>
          {/* User Menu */}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group style={{ cursor: 'pointer' }}>
                <Avatar 
                  color="primary" 
                  radius="xl"
                  src={getImageUrl(user?.avatarUrl)}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <div>
                  <Text size="sm" fw={500}>
                    {user?.name || 'User'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user?.role || 'Role'}
                  </Text>
                </div>
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={<IconUser size={16} />}
                onClick={() => navigate('/settings/profile')}
              >
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
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


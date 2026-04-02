import { AppShell, Container, Stack } from '@mantine/core';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import AppNavbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';

const AdminLayout = ({ children }) => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <AppShell
      navbar={{
        width: sidebarOpen ? 280 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: true },
      }}
      header={{ height: 60 }}
      padding={0}
      style={{
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Header>
        <AppNavbar />
      </AppShell.Header>

      <AppShell.Main
        style={{
          minHeight: '100vh',
        }}
      >
        <Container size="xl" p={0} px="sm">
          <Stack gap="md" className="page-transition" style={{ paddingTop: '70px' }}>
            <Breadcrumbs />
            {children}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;


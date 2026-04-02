import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollArea, Group, Text, Burger, Collapse, Image } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { getSidebarItems } from '@/config/sidebarConfig';
import { APP_FLAGS } from '@/config/constants';
import Logo from '@/components/common/Logo';
import '@/styles/sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { role } = useSelector((state) => state.auth);
  const [opened, setOpened] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  // Load sidebar items (static + dynamic)
  useEffect(() => {
    const loadMenuItems = () => {
      const allItems = getSidebarItems();
      setMenuItems(allItems);
    };

    loadMenuItems();

    // Listen for updates when dynamic items change
    window.addEventListener('sidebarItemsUpdated', loadMenuItems);
    return () => {
      window.removeEventListener('sidebarItemsUpdated', loadMenuItems);
    };
  }, []);

  // No need for role-based filtering in simplified version. All authenticated users see all items.
  const filteredMenuItems = menuItems;

  const toggleItem = (id) => {
    setOpened((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div
      className="sidebar"
      style={{
        width: sidebarOpen ? 280 : 80,
        padding: '1rem',
        transition: 'width 0.3s ease',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div className="sidebar-header" style={{
        padding: sidebarOpen ? '1.5rem 1.25rem' : '1.75rem 0.75rem',
        borderBottom: sidebarOpen ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        marginBottom: sidebarOpen ? '1.25rem' : '0.75rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: sidebarOpen ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)' : 'transparent',
      }}>
        <Group 
          justify={sidebarOpen ? "space-between" : "center"} 
          align="center"
          gap={sidebarOpen ? "md" : "xs"}
          style={{ width: '100%' }}
        >
          <Group 
            gap={sidebarOpen ? "md" : "xs"} 
            align="center" 
            style={{ 
              flex: sidebarOpen ? 1 : 'none',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              width: sidebarOpen ? 'auto' : '100%',
              minWidth: 0,
            }}
          >
            <Logo 
              size={sidebarOpen ? "medium" : "small"}
              showText={sidebarOpen}
              variant="default"
            />
          </Group>
          {sidebarOpen && (
            <Burger
              opened={sidebarOpen}
              onClick={() => dispatch(toggleSidebar())}
              size="sm"
              color="var(--sidebar-text)"
              style={{
                opacity: 0.7,
                transition: 'opacity 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            />
          )}
          {!sidebarOpen && (
            <Burger
              opened={false}
              onClick={() => dispatch(toggleSidebar())}
              size="sm"
              color="var(--sidebar-text)"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '0.5rem',
                opacity: 0.7,
                transition: 'opacity 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            />
          )}
        </Group>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ScrollArea style={{ height: sidebarOpen ? 'calc(100vh - 140px)' : 'calc(100vh - 100px)' }}>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon || IconMenu2; // Fallback to IconMenu2 if icon is missing
          const isActive = location.pathname === item.path;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = opened[item.id];
          const hasCustomIcon = item.iconUrl; // Check if custom icon image is uploaded

          if (!hasChildren) {
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className="sidebar-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  backgroundColor: isActive
                    ? 'var(--sidebar-active)'
                    : 'transparent',
                  color: isActive
                    ? 'var(--primary-color)'
                    : 'var(--sidebar-text)',
                }}
              >
                {hasCustomIcon ? (
                  <Image
                    src={item.iconUrl}
                    alt={item.label}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: sidebarOpen ? '12px' : '0',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Icon
                    size={20}
                    style={{ marginRight: sidebarOpen ? '12px' : '0' }}
                  />
                )}
                {sidebarOpen && <Text size="sm">{item.label}</Text>}
              </NavLink>
            );
          }

          return (
            <div key={item.id}>
              <div
                className="sidebar-item sidebar-parent"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  backgroundColor: isOpen
                    ? 'var(--sidebar-active)'
                    : 'transparent',
                  color: 'var(--sidebar-text)',
                }}
                onClick={() => toggleItem(item.id)}
              >
                {hasCustomIcon ? (
                  <Image
                    src={item.iconUrl}
                    alt={item.label}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: sidebarOpen ? '12px' : '0',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Icon
                    size={20}
                    style={{ marginRight: sidebarOpen ? '12px' : '0' }}
                  />
                )}
                {sidebarOpen && (
                  <Text size="sm" style={{ flex: 1 }}>
                    {item.label}
                  </Text>
                )}
              </div>
              {sidebarOpen && (
                <Collapse in={isOpen}>
                  {item.children.map((child) => {
                    const childActive = location.pathname === child.path;
                    return (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className="sidebar-sub-item"
                        style={{
                          paddingLeft: '2.5rem',
                          marginBottom: '4px',
                          borderRadius: '8px',
                          backgroundColor: childActive
                            ? 'var(--sidebar-active)'
                            : 'transparent',
                          color: childActive
                            ? 'var(--primary-color)'
                            : 'var(--sidebar-text)',
                        }}
                      >
                        {child.label}
                      </NavLink>
                    );
                  })}
                </Collapse>
              )}
            </div>
          );
        })}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;


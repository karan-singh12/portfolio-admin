import {
  IconDashboard,
  IconPackage,
  IconCategory,
  IconShoppingCart,
  IconBox,
  IconUsers,
  IconTicket,
  IconStar,
  IconUsersGroup,
  IconChartBar,
  IconSettings,
  IconMenu2,
  IconNews,
  IconCode,
  IconBriefcase,
} from '@tabler/icons-react';
// Static sidebar configuration
const STATIC_SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: IconDashboard,
    path: '/dashboard',
  },
  {
    id: 'blogs',
    label: 'Blogs',
    icon: IconNews,
    path: '/blogs',
  },
  {
    id: 'dsa',
    label: 'DSA Problems',
    icon: IconCode,
    path: '/dsa',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: IconBox,
    path: '/projects',
  },
  {
    id: 'experience',
    label: 'Job Experience',
    icon: IconBriefcase,
    path: '/experience',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: IconSettings,
    path: '/settings',
    children: [
      {
        id: 'settings-profile',
        label: 'Profile',
        path: '/settings/profile',
      },
    ],
  },
];

// Merge static and dynamic sidebar items
// This function is called to get the complete sidebar configuration
export const getSidebarItems = () => {
  return STATIC_SIDEBAR_ITEMS;
};

// Export static items for backward compatibility
export const SIDEBAR_ITEMS = STATIC_SIDEBAR_ITEMS;


import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumbs as MantineBreadcrumbs } from '@mantine/core';

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paths = location.pathname.split('/').filter((path) => path);

  const breadcrumbItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    ...paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const title = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { title, href };
    }),
  ];

  return (
    <div
      style={{
        padding: 0,
        marginTop: 0,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <MantineBreadcrumbs
        separator={
          <span
            style={{
              color: '#6b7280',
              margin: '0 8px',
              fontSize: '12px',
              display: 'inline-block',
              lineHeight: 1,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#6b7280',
            }}
          >
            
          </span>
        }
        separatorMargin={0}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          if (isLast) {
            return (
              <span
                key={item.href}
                style={{
                  fontWeight: 400,
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textDecoration: 'none',
                  lineHeight: '1.5',
                }}
              >
                {item.title}
              </span>
            );
          }

          return (
            <span
              key={item.href}
              style={{
                textDecoration: 'none',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.5',
                cursor: 'pointer',
              }}
              onClick={() => navigate(item.href)}
            >
              {item.title}
            </span>
          );
        })}
      </MantineBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;


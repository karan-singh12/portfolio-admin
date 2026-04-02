import { Loader } from '@mantine/core';

const LoadingSpinner = ({ size = 'lg', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Loader size={size} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Loader size={size} />
    </div>
  );
};

export default LoadingSpinner;


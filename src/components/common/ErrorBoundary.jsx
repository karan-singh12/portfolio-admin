import { Component } from 'react';
import { Button, Card, Text, Title, Container } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="md" style={{ marginTop: '5rem' }}>
          <Card shadow="md" padding="xl" radius="md">
            <div style={{ textAlign: 'center' }}>
              <IconAlertCircle size={64} color="red" style={{ marginBottom: '1rem' }} />
              <Title order={2} mb="md">
                Something went wrong
              </Title>
              <Text color="dimmed" mb="xl">
                {this.state.error?.message || 'An unexpected error occurred'}
              </Text>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/dashboard';
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


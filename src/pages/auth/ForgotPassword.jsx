import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  TextInput,
  Button,
  Text,
  Stack,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconCheck, IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { AllServices } from '@/services/AllServices';
import { showNotification } from '@mantine/notifications';
import Logo from '@/components/common/Logo';
import '@/styles/auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await AllServices.auth.forgotPassword(values.email);
      setSuccess(true);
      showNotification({
        title: 'Success',
        message: 'Password reset link sent to your email',
        color: 'green',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to send reset link',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <Container size={440} my={0}>
          <Paper className="auth-paper">
            <Logo size="large" showText={true} variant="auth" />
            <Stack align="center" gap="lg">
              <div className="auth-success-icon">
                <IconCheck size={48} color="#22c55e" strokeWidth={3} />
              </div>
              <Title order={2} ta="center" c="var(--text-dark)" fw={700}>
                Check your email
              </Title>
              <Text 
                c="dimmed" 
                size="sm" 
                ta="center"
                style={{ 
                  fontSize: '15px',
                  lineHeight: '1.6',
                  maxWidth: '320px',
                  color: 'var(--text-light)'
                }}
              >
                We've sent a password reset link to{' '}
                <strong style={{ color: 'var(--primary-color)' }}>
                  {form.values.email}
                </strong>
                <br />
                Please check your inbox and follow the instructions.
              </Text>
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                leftSection={<IconArrowLeft size={18} />}
                fullWidth
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  marginTop: '1rem'
                }}
              >
                Back to Login
              </Button>
            </Stack>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Container size={440} my={0}>
        <Paper className="auth-paper">
          <Logo size="large" showText={true} variant="auth" />
          
          <Title 
            order={2} 
            ta="center" 
            mb="sm" 
            c="var(--primary-color)"
            fw={700}
            style={{ letterSpacing: '-0.5px' }}
          >
            Forgot Password?
          </Title>
          
          <Text 
            c="dimmed" 
            size="sm" 
            ta="center" 
            mb="xl"
            style={{ 
              fontSize: '15px',
              lineHeight: '1.6',
              color: 'var(--text-light)'
            }}
          >
            No worries! Enter your email address and we'll send you a link to reset your password.
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                required
                leftSection={<IconMail size={18} />}
                {...form.getInputProps('email')}
                size="md"
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                rightSection={!loading && <IconArrowRight size={18} />}
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  marginTop: '0.5rem'
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Anchor
                component="button"
                type="button"
                size="sm"
                onClick={() => navigate('/login')}
                style={{ 
                  alignSelf: 'center',
                  marginTop: '0.5rem'
                }}
                leftSection={<IconArrowLeft size={16} />}
              >
                Back to Login
              </Anchor>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default ForgotPassword;


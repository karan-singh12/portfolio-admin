import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Stack,
  Anchor,
  Alert,
  Image,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconAlertCircle, IconMail, IconLock, IconArrowRight, IconPhoto } from '@tabler/icons-react';
import { loginUser } from '@/store/slices/authSlice';
import { showNotification } from '@mantine/notifications';
import { getLogoUrl } from '@/services/globalSettingsService';
import { BRANDING } from '@/config/branding';
import '@/styles/auth.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formError, setFormError] = useState(null);
  const [logoImage, setLogoImage] = useState(getLogoUrl());
  const [logoError, setLogoError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      setFormError(null);
      const result = await dispatch(loginUser(values)).unwrap();
      showNotification({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      });
      navigate('/dashboard');
    } catch (err) {
      setFormError(err || 'Login failed. Please try again.');
      showNotification({
        title: 'Error',
        message: err || 'Login failed',
        color: 'red',
      });
    }
  };

  return (
    <div className="auth-container auth-container-fullscreen">
      <Paper className="auth-paper-split auth-paper-fullscreen">
        {/* Left Side - Logo Display Only */}
        <div className="auth-left-panel">
          <div className="auth-logo-section">
            {/* Admin Panel Title - Commented out */}
            {/* <Text 
              size="xl" 
              fw={700} 
              c="var(--primary-color)" 
              mb="lg"
              ta="center"
              style={{ letterSpacing: '-0.5px', fontSize: '28px' }}
            >
              {BRANDING.FULL_NAME}
            </Text> */}
            
            <div className="auth-logo-display-area">
              {logoError ? (
                <div className="auth-logo-fallback">
                  <IconPhoto size={80} />
                  <Text size="lg" c="dimmed" mt="md" fw={600}>
                    {BRANDING.LOGO_INITIALS || 'AP'}
                  </Text>
                </div>
              ) : (
                <Image
                  src={logoImage}
                  alt="Logo"
                  className="auth-logo-image"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>
          </div>
        </div>

          {/* Right Side - Login Form */}
          <div className="auth-right-panel">
            <div className="auth-form-wrapper">
              <Text 
                size="lg" 
                fw={600} 
                mb="xs"
                style={{ 
                  color: 'var(--text-dark)',
                  fontSize: '18px'
                }}
              >
                Welcome Back
              </Text>
              
              <Text 
                c="dimmed" 
                size="sm" 
                mb="xl"
                style={{ 
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: 'var(--text-light)'
                }}
              >
                Please sign in to continue
              </Text>

              {formError && (
                <Alert
                  icon={<IconAlertCircle size={18} />}
                  title="Authentication Error"
                  color="red"
                  mb="md"
                  radius="md"
                >
                  {formError}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label="Email Address"
                    placeholder="Enter your email"
                    required
                    leftSection={<IconMail size={18} />}
                    {...register('email')}
                    error={errors.email?.message}
                    size="md"
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    required
                    leftSection={<IconLock size={18} />}
                    {...register('password')}
                    error={errors.password?.message}
                    size="md"
                  />

                  <Anchor
                    component="button"
                    type="button"
                    size="sm"
                    onClick={() => navigate('/forgot-password')}
                    style={{ 
                      alignSelf: 'flex-end',
                      marginTop: '-0.5rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Forgot your password?
                  </Anchor>

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
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Stack>
              </form>

              <div className="demo-credentials">
                <Text className="demo-credentials-text" size="sm" ta="center">
                  <strong>Demo Credentials:</strong><br />
                  admin@bakery.com / password123
                </Text>
                {/* Mock Mode Badge - Commented out */}
                {/* <div className="mock-mode-badge">
                  Mock Mode Enabled
                </div> */}
              </div>
            </div>
          </div>
        </Paper>
    </div>
  );
};

export default Login;


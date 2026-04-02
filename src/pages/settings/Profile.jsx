import { useState } from 'react';
import { Card, Title, Button, TextInput, Stack, Group, Avatar, FileInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import AdminLayout from '@/components/layout/AdminLayout';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from '@mantine/notifications';
import { AllServices } from '@/services/AllServices';
import { updateUser } from '@/store/slices/authSlice';
import { IconFileCv } from '@tabler/icons-react';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phoneNumber', values.phoneNumber);
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await AllServices.auth.updateProfile(formData);
      
      if (response.data.status === 200) {
        dispatch(updateUser(response.data.data));
        showNotification({
          title: 'Success',
          message: 'Profile updated',
          color: 'green',
        });
        setResumeFile(null); // Clear file selection
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update profile',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Title order={1}>Profile Settings</Title>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md" align="center" mb="md">
            <Avatar 
                size={120} 
                color="primary" 
                src={avatarPreview || (user?.avatarUrl ? `http://localhost:5001${user.avatarUrl}` : null)}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Title order={3}>{user?.name || 'User'}</Title>
          </Stack>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput label="Full Name" required {...form.getInputProps('name')} />
              <TextInput label="Email Address" required type="email" {...form.getInputProps('email')} />
              <TextInput label="Phone Number" {...form.getInputProps('phoneNumber')} />
              
              <FileInput 
                label="Profile Photo" 
                placeholder="Upload new avatar" 
                accept="image/png,image/jpeg"
                onChange={(file) => {
                    setAvatarFile(file);
                    if (file) {
                        setAvatarPreview(URL.createObjectURL(file));
                    } else {
                        setAvatarPreview(null);
                    }
                }}
                value={avatarFile}
                clearable
              />

              <FileInput 
                label="Resume (PDF)" 
                placeholder="Upload your CV" 
                accept="application/pdf"
                leftSection={<IconFileCv size={18} />}
                onChange={setResumeFile}
                value={resumeFile}
                clearable
                description={user?.resumeUrl ? "Current resume exists. Upload to replace." : "No resume uploaded."}
              />

              <Group justify="flex-end">
                <Button type="submit" loading={loading} style={{ backgroundColor: 'var(--primary-color)' }}>
                  Save All Changes
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>
      </Stack>
    </AdminLayout>
  );
};

export default Profile;


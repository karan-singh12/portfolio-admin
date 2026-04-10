import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AllServices } from '@/services/AllServices';
import { STORAGE_KEYS, APP_FLAGS, MOCK_USER } from '@/config/constants';
import { mockDelay } from '@/utils/mockData';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Mock mode: Check credentials against mock user
      if (APP_FLAGS.ENABLE_MOCK_API) {
        await mockDelay(800); // Simulate API delay
        
        if (
          credentials.email === MOCK_USER.email &&
          credentials.password === MOCK_USER.password
        ) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, MOCK_USER.token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_USER.user));
          return { token: MOCK_USER.token, user: MOCK_USER.user };
        } else {
          return rejectWithValue('Invalid email or password');
        }
      }

      // Real API call
      const response = await AllServices.auth.login(credentials);
      // The backend response is { message, status, data: { token, result, permissions } }
      const { token, result } = response.data.data;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result));
      return { token, user: result };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  return null;
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) return null;

  try {
    // Fetch fresh user details from the server to ensure we're in sync
    const response = await AllServices.auth.getAdminDetails();
    const freshUser = response.data.data;
    
    // Update localStorage with fresh data
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
    
    return {
      token,
      user: freshUser,
    };
  } catch (error) {
    // If token is invalid or request fails, clear everything
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
});

const initialState = {
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  user: localStorage.getItem(STORAGE_KEYS.USER)
    ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))
    : null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getDashboard = createAsyncThunk(
  'dashboard/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/dashboard');
      // Add null check and default values
      return {
        courses: response.data?.dashboard?.courses || [],
        activity: response.data?.dashboard?.activity || []
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch dashboard data'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: {
      courses: [],
      activity: []
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || { courses: [], activity: [] };
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = { courses: [], activity: [] };
      });
  },
});

export default dashboardSlice.reducer; 
"use client";
import axiosInstance from "@/utils/axiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';

interface AuthState {
    user: {
        id: number;
        username: string;
        email: string;
    } | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ username, email, password, confirmPassword }: { username: string; email: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('auth/signup/', {
                username,
                email,
                password,
                confirmPassword,
            });
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Signup failed');
        }
    }
)
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login/', {
                email,
                password,
            });
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const regenerateAccessToken = createAsyncThunk(
    'auth/regenerateAccessToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('auth/regenerateAccessToken/');
            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to regenerate access token');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("auth/logout/");
            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Logout failed")
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.pending, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(regenerateAccessToken.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(signup.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
    },
});


export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
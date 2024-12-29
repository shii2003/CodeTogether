"use client";
import axios from "axios";
import store from "@/store";
import { regenerateAccessToken, logout } from "@/store/slices/authSlice";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4004/api',
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalReqest = error.config;

        if (originalReqest.url.includes('/auth/login/')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalReqest._retry) {
            originalReqest._retry = true;

            try {

                await store.dispatch(regenerateAccessToken()).unwrap();
                return axiosInstance(originalReqest);

            } catch (error) {
                store.dispatch(logout());
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
import axios from 'axios';
import { getSession } from 'next-auth/react';

export const baseApi = axios.create({
  baseURL: '/api',
});

baseApi.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

baseApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  },
);

import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

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
  async (error) => {
    if (error.response.status === 403) {
      await signOut();
    }
    return Promise.reject(error);
  },
);

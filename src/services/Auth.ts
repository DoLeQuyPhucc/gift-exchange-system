import axiosInstance from '@/api/axiosInstance';
import { LoginResponse } from '@/types/types';

export const login = async (phone: string) => {
  const response = await axiosInstance.post<LoginResponse>(
    'authentication/login',
    {
      phone,
    },
  );
  return response.data;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await axiosInstance.post('authentication/logout', {
    refreshToken,
  });
  return response.data;
};
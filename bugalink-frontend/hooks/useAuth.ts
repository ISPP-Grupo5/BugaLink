import axios from '@/lib/axios';
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    // Retrieve the access token from local storage
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  const login = async (email, password) => {
    // Make a POST request to obtain the access token and refresh token
    try {
      const { data } = await axios.post('/auth/login/', {
        email,
        password,
      });
      setAccessToken(data.access);
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      return { status: 200, data: { message: 'Login successful' } };
    } catch (error) {
      return { status: error.response.status, data: error.response.data };
    }
  };

  const logout = () => {
    setAccessToken('');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return { accessToken, login, logout };
};

export default useAuth;

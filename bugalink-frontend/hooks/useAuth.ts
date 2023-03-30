import UserI from '@/interfaces/user';
import axios from '@/lib/axios';
import { getUserToken } from '@/utils/jwt';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState<UserI>();

  useEffect(() => {
    // Retrieve the access token from local storage
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      fetchUser();
      setAccessToken(storedAccessToken);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { userId } = getUserToken();
      const response = await axios.get('/users/' + userId);
      setUser(response.data);
    } catch (error) {
      setUser({
        id: 0,
        email: '',
        first_name: '',
        last_name: '',
        photo: null,
        passenger: 1,
        driver: null,
      });
    }
  };

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

  return { accessToken, login, logout, user };
};

export default useAuth;

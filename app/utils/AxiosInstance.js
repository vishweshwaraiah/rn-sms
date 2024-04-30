import axios from 'axios';
import { ProdServerUri } from '@/utils/Globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

const allHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// allHeaders['Content-Type'] = 'multipart/form-data';
// Usage: await AxiosInstance.get('/users');
// Automatically includes the Authorization header, don't forget to import

const AxiosInstance = axios.create({
  baseURL: ProdServerUri, // Your API base URL
  headers: allHeaders,
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;

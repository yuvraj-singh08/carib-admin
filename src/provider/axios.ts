import axios, { AxiosInstance } from "axios";

export const createAxiosInstance = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_BACKEND_URL as string;

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseURL,  
    headers: {  
      'Content-Type': 'application/json',
    }
  });
  
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = window.localStorage.getItem('authToken');  // Use the correct key 'token'
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;  
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const axiosInstance = createAxiosInstance();

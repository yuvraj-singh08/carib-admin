import axios, { AxiosInstance } from "axios";

export const createAxiosInstance = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_BACKEND_URL as string;
  console.log("baseURL",baseURL)
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = window.localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403) {
        window.localStorage.removeItem('authToken');  // Remove the token from localStorage
        window.location.reload();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const axiosInstance = createAxiosInstance();

import axios, { AxiosRequestConfig } from 'axios';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:9780/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    // const accessToken = localStorage.getItem('serviceToken');
    // if (accessToken) {
    //   config.headers['Authorization'] = `Bearer ${accessToken}`;
    // }
     config.headers['Authorization'] = `${import.meta.env.TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response.status === 401 && !window.location.href.includes('/login')) {
    //   redirectWithBasePath('/maintenance/500');
    // }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};

export function redirectWithBasePath(path: string) {
  const basePath = import.meta.env.VITE_APP_BASE_NAME || process.env.VITE_APP_BASE_NAME || ''; // adjust for Vite, CRA, etc.
  window.location.pathname = `${basePath.replace(/\/$/, '')}${path}`;
}

// import axios, { AxiosRequestConfig } from 'axios';

// // Define your API configurations
// const API_CONFIGS = {
//   primary: {
//     baseURL: import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:9780/',
//     tokenSource: 'serviceToken' // localStorage key
//   },
//   secondary: {
//     baseURL: import.meta.env.VITE_APP_SECONDARY_API_URL || 'http://127.0.0.1:9781/',
//     tokenSource: 'secondaryToken' // localStorage key
//   }
// };

// // Create separate axios instances for each API
// const createAxiosInstance = (config: { baseURL: string; tokenSource: string }) => {
//   const instance = axios.create({ baseURL: config.baseURL });

//   instance.interceptors.request.use(
//     async (requestConfig) => {
//       const accessToken = localStorage.getItem(config.tokenSource);
//       if (accessToken) {
//         requestConfig.headers['Authorization'] = `Bearer ${accessToken}`;
//       }
//       return requestConfig;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   instance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401 && !window.location.href.includes('/login')) {
//         redirectWithBasePath('/maintenance/500');
//       }
//       return Promise.reject((error.response && error.response.data) || 'Wrong Services');
//     }
//   );

//   return instance;
// };

// // Create instances for both APIs
// export const axiosServices = createAxiosInstance(API_CONFIGS.primary);
// export const secondaryAxios = createAxiosInstance(API_CONFIGS.secondary);

// // Default export (backward compatibility)
// export default axiosServices;

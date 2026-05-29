import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendURL) {
  throw new Error(
    "NEXT_PUBLIC_BACKEND_URL is missing in your environment variables."
  );
}

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const headers = AxiosHeaders.from(config.headers);

    if (config.data instanceof FormData) {
      headers.delete("Content-Type");
      headers.delete("content-type");

      config.headers = headers;

      return config;
    }

    headers.set("Content-Type", "application/json");

    config.headers = headers;

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: unknown,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    const status = error.response?.status;

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;

      isRefreshing = true;

      try {
        await axiosInstance.post(
          "/api/auth/v1/refresh-token"
        );

        processQueue(null);

        isRefreshing = false;

        return axiosInstance(originalRequest);

      } catch (refreshError: unknown) {
        const refreshAxiosError =
          refreshError as AxiosError;

        console.error(
          refreshAxiosError.response?.data
        );

        processQueue(refreshError, null);

        isRefreshing = false;

        const refreshStatus =
          refreshAxiosError.response?.status;

        if (
          refreshStatus === 401 ||
          refreshStatus === 403
        ) {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      }
    }

    console.error({
      url: originalRequest.url,
      method: originalRequest.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
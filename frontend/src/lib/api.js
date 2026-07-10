import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // sends the httpOnly JWT cookie
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Session expired / not logged in -- let calling code redirect
    }
    return Promise.reject(err);
  }
);

export default api;

import keycloak from "@/keycloak";
import axios, { type AxiosRequestConfig } from "axios";

export const fetchAuthenticated = async <T>(
  endpoint: string,
  options?: {
    headers?: AxiosRequestConfig["headers"];
    method?: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
  },
) => {
  if (!options) options = {};
  if (!options.headers) options.headers = {};
  if (keycloak.token) {
    options.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return axios.request<T>({
    url: endpoint,
    method: options.method ?? "GET",
    headers: options.headers,
    data: options.data,
  });
};

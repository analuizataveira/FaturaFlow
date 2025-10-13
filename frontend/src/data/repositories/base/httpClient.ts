import axios, { AxiosInstance } from "axios";

export const httpClient: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

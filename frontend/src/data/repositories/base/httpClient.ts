import axios, { AxiosInstance } from "axios";

export const httpClient: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 120000, // 2 minutos para uploads de PDF
  headers: {
    "Content-Type": "application/json",
  },
});

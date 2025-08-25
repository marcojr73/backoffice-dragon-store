import axios from 'axios';

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default apiService;

export interface TResponseDefault<T> {
  success: boolean;
  status: number;
  message?: string;
  data?: T;
}

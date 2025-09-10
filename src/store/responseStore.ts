import { create } from 'zustand';

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

interface ResponseStore {
  isLoading: boolean;
  error: { message: string } | null;
  response: ResponseData | null;
  setLoading: (loading: boolean) => void;
  setError: (error: { message: string } | null) => void;
  setResponse: (response: ResponseData | null) => void;
  reset: () => void;
}

export const useResponseStore = create<ResponseStore>((set) => ({
  isLoading: false,
  error: null,
  response: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setResponse: (response) => set({ response }),
  reset: () => set({ response: null, error: null, isLoading: false })
}));

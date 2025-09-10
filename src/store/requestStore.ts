import { create } from 'zustand';
import type { RequestConfig, HttpMethod, QueryParam, Header, BodyType, FormDataEntry } from '../types/request';
import { v4 as uuidv4 } from 'uuid';

interface RequestStore {
  request: RequestConfig;
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setQueryParams: (params: QueryParam[]) => void;
  addQueryParam: () => void;
  updateQueryParam: (id: string, updates: Partial<QueryParam>) => void;
  removeQueryParam: (id: string) => void;
  setHeaders: (headers: Header[]) => void;
  addHeader: () => void;
  updateHeader: (id: string, updates: Partial<Header>) => void;
  removeHeader: (id: string) => void;
  setBodyType: (type: BodyType) => void;
  setBodyContent: (content: string | FormDataEntry[]) => void;
}

export const useRequestStore = create<RequestStore>((set) => ({
  request: {
    method: 'GET',
    url: '',
    queryParams: [],
    headers: [],
    body: {
      type: 'none',
      content: ''
    }
  },
  
  setMethod: (method) => set((state) => ({ 
    request: { ...state.request, method } 
  })),
  
  setUrl: (url) => set((state) => ({ 
    request: { ...state.request, url } 
  })),

  setQueryParams: (queryParams) => set((state) => ({
    request: { ...state.request, queryParams }
  })),
  
  addQueryParam: () => set((state) => ({
    request: {
      ...state.request,
      queryParams: [
        ...state.request.queryParams,
        { id: uuidv4(), key: '', value: '', enabled: true }
      ]
    }
  })),
  
  updateQueryParam: (id, updates) => set((state) => ({
    request: {
      ...state.request,
      queryParams: state.request.queryParams.map(param =>
        param.id === id ? { ...param, ...updates } : param
      )
    }
  })),
  
  removeQueryParam: (id) => set((state) => ({
    request: {
      ...state.request,
      queryParams: state.request.queryParams.filter(param => param.id !== id)
    }
  })),

  setHeaders: (headers) => set((state) => ({
    request: { ...state.request, headers }
  })),
  
  addHeader: () => set((state) => ({
    request: {
      ...state.request,
      headers: [
        ...state.request.headers,
        { id: uuidv4(), key: '', value: '', enabled: true }
      ]
    }
  })),
  
  updateHeader: (id, updates) => set((state) => ({
    request: {
      ...state.request,
      headers: state.request.headers.map(header =>
        header.id === id ? { ...header, ...updates } : header
      )
    }
  })),
  
  removeHeader: (id) => set((state) => ({
    request: {
      ...state.request,
      headers: state.request.headers.filter(header => header.id !== id)
    }
  })),
  
  setBodyType: (type) => set((state) => {
    // Initialize empty content based on the type
    const content = type === 'form-data' || type === 'url-encoded' ? [] : '';
    
    return {
      request: {
        ...state.request,
        body: { type, content }
      }
    };
  }),
  
  setBodyContent: (content) => set((state) => ({
    request: {
      ...state.request,
      body: state.request.body ? {
        ...state.request.body,
        content
      } : undefined
    }
  }))
}));

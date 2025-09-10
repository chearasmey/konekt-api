import type { RequestConfig } from './request';

export interface SavedRequest {
  id: string;
  name: string;
  request: RequestConfig;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  requests: SavedRequest[];
  createdAt: string;
  updatedAt: string;
}

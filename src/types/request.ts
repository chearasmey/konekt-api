export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export interface QueryParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export type BodyType = 'json' | 'form-data' | 'url-encoded' | 'raw' | 'none';

export interface FormDataEntry {
  id: string;
  key: string;
  value: string | File;
  type: 'text' | 'file';
  enabled: boolean;
}

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  queryParams: QueryParam[];
  headers: Header[];
  body?: {
    type: BodyType;
    content: string | FormDataEntry[];
  };
}

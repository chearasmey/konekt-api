import { useRequestStore } from '@/store/requestStore';
import { useResponseStore } from '@/store/responseStore';
import type { FormDataEntry } from '@/types/request';

export function useRequest() {
  const { request } = useRequestStore();
  const {
    isLoading,
    error,
    response,
    setLoading,
    setError,
    setResponse,
  } = useResponseStore();

  const buildUrl = () => {
    try {
      if (!request.url) {
        throw new Error('URL is required');
      }
      
      // Add protocol if missing
      let urlStr = request.url;
      if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
        urlStr = 'https://' + urlStr;
      }

      const url = new URL(urlStr);
      
      // Add query parameters
      request.queryParams
        .filter(param => param.enabled && param.key)
        .forEach(param => {
          url.searchParams.append(param.key, param.value);
        });

      return url.toString();
    } catch (err) {
      throw new Error(`Invalid URL: ${request.url}`);
    }
  };

  const buildHeaders = () => {
    const headers = new Headers();
    
    request.headers
      .filter(header => header.enabled)
      .forEach(header => {
        headers.append(header.key, header.value);
      });

    return headers;
  };

  const buildBody = (): BodyInit | null => {
    if (!request.body || request.body.type === 'none') return null;

    switch (request.body.type) {
      case 'json':
        // Ensure JSON is properly stringified
        return JSON.stringify(
          typeof request.body.content === 'string' 
            ? JSON.parse(request.body.content)
            : request.body.content
        );
      
      case 'form-data': {
        const formData = new FormData();
        (request.body.content as FormDataEntry[])
          .filter(entry => entry.enabled)
          .forEach(entry => {
            if (entry.type === 'file' && entry.value instanceof File) {
              formData.append(entry.key, entry.value);
            } else {
              formData.append(entry.key, entry.value.toString());
            }
          });
        return formData;
      }
      
      case 'url-encoded': {
        const params = new URLSearchParams();
        (request.body.content as FormDataEntry[])
          .filter(entry => entry.enabled)
          .forEach(entry => {
            params.append(entry.key, entry.value.toString());
          });
        return params;
      }
      
      case 'raw':
        return request.body.content as string;
      
      default:
        return null;
    }
  };

  const executeRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const startTime = performance.now();
      
      // Don't include body for GET requests
      const config: RequestInit = {
        method: request.method,
        headers: buildHeaders(),
      };

      if (request.method !== 'GET') {
        const body = buildBody();
        if (body !== null) {
          config.body = body;
        }
      }

      // Add cache control headers
      const finalHeaders = new Headers(config.headers);
      finalHeaders.set('Cache-Control', 'no-cache');
      finalHeaders.set('Pragma', 'no-cache');
      config.headers = finalHeaders;

      console.log('Sending request:', {
        url: buildUrl(),
        config
      });

      const response = await fetch(buildUrl(), config);

      let responseText = '';
      try {
        responseText = await response.text();
      } catch (error) {
        console.error('Error reading response text:', error);
        setError({ message: 'Failed to read response body' });
        return;
      }

      const endTime = performance.now();

      // Get response headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const responseData = {
        status: response.status,
        statusText: response.statusText || (response.status === 200 ? 'OK' : ''),
        headers,
        body: responseText,
        time: Math.round(endTime - startTime),
        size: new Blob([responseText]).size
      };

      console.log('Setting response:', responseData);
      
      setResponse(responseData);
    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    execute: executeRequest,
    isLoading,
    error,
    response,
    reset: () => setResponse(null)
  };
}

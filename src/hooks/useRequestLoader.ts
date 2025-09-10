import { useRequestStore } from '@/store/requestStore';
import { useCollectionsStore } from '@/store/collectionsStore';
import type { SavedRequest } from '@/types/collection';

export function useRequestLoader() {
  const { request, setMethod, setUrl, setHeaders, setQueryParams, setBodyType, setBodyContent } = useRequestStore();
  const { 
    collections, 
    activeCollectionId, 
    activeRequestId, 
    setActiveRequest, 
    updateRequest 
  } = useCollectionsStore();

  const loadRequest = (collectionId: string, requestId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    const savedRequest = collection?.requests.find(r => r.id === requestId);

    if (!savedRequest) return;

    setActiveRequest(requestId);
    loadSavedRequest(savedRequest);
  };
  
  const getCurrentRequest = (): SavedRequest | undefined => {
    if (!activeCollectionId || !activeRequestId) return undefined;
    const collection = collections.find(c => c.id === activeCollectionId);
    return collection?.requests.find(r => r.id === activeRequestId);
  };

  const loadSavedRequest = (savedRequest: SavedRequest) => {
    const { request } = savedRequest;

    // Load basic request details
    setMethod(request.method);
    setUrl(request.url);

    // Load headers
    setHeaders(request.headers);

    // Load query parameters
    setQueryParams(request.queryParams);

    // Load body if exists
    if (request.body) {
      setBodyType(request.body.type);
      setBodyContent(request.body.content);
    }
  };

  const updateCurrentRequest = () => {
    const currentRequest = getCurrentRequest();
    if (currentRequest && activeCollectionId) {
      updateRequest(activeCollectionId, currentRequest.id, {
        request: {
          ...request,
          method: request.method,
          url: request.url,
          headers: request.headers,
          queryParams: request.queryParams,
          body: request.body
        }
      });
    }
  };

  return { loadRequest, loadSavedRequest, getCurrentRequest, updateCurrentRequest };
}

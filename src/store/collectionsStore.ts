import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Collection, SavedRequest } from '@/types/collection';
import type { RequestConfig } from '@/types/request';
import { storage, STORAGE_KEYS } from '@/lib/storage';

interface CollectionsStore {
  collections: Collection[];
  activeCollectionId: string | null;
  activeRequestId: string | null;
  
  // Collection operations
  createCollection: (name: string) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  
  // Request operations
  saveRequest: (collectionId: string, name: string, request: RequestConfig) => SavedRequest;
  updateRequest: (collectionId: string, requestId: string, updates: Partial<SavedRequest>) => void;
  deleteRequest: (collectionId: string, requestId: string) => void;
  duplicateRequest: (collectionId: string, requestId: string) => void;
  
  // Active item management
  setActiveCollection: (id: string | null) => void;
  setActiveRequest: (id: string | null) => void;
}

export const useCollectionsStore = create<CollectionsStore>((set, get) => ({
  collections: storage.get(STORAGE_KEYS.COLLECTIONS) || [],
  activeCollectionId: null,
  activeRequestId: null,

  createCollection: (name: string) => {
    const collection: Collection = {
      id: uuidv4(),
      name,
      requests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const newCollections = [...state.collections, collection];
      storage.set(STORAGE_KEYS.COLLECTIONS, newCollections);
      return { collections: newCollections };
    });

    return collection;
  },

  updateCollection: (id: string, updates: Partial<Collection>) => {
    set((state) => {
      const newCollections = state.collections.map((collection) =>
        collection.id === id
          ? {
              ...collection,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : collection
      );
      storage.set(STORAGE_KEYS.COLLECTIONS, newCollections);
      return { collections: newCollections };
    });
  },

  deleteCollection: (id: string) => {
    set((state) => {
      const newCollections = state.collections.filter(
        (collection) => collection.id !== id
      );
      storage.set(STORAGE_KEYS.COLLECTIONS, newCollections);
      return {
        collections: newCollections,
        activeCollectionId: state.activeCollectionId === id ? null : state.activeCollectionId,
        activeRequestId: null,
      };
    });
  },

  saveRequest: (collectionId: string, name: string, request: RequestConfig) => {
    const savedRequest: SavedRequest = {
      id: uuidv4(),
      name,
      request,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const newCollections = state.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: [...collection.requests, savedRequest],
              updatedAt: new Date().toISOString(),
            }
          : collection
      );
      storage.set(STORAGE_KEYS.COLLECTIONS, newCollections);
      return { collections: newCollections };
    });

    return savedRequest;
  },

  updateRequest: (collectionId: string, requestId: string, updates: Partial<SavedRequest>) => {
    set((state) => {
      const newCollections = state.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: collection.requests.map((request) =>
                request.id === requestId
                  ? {
                      ...request,
                      ...updates,
                      updatedAt: new Date().toISOString(),
                    }
                  : request
              ),
              updatedAt: new Date().toISOString(),
            }
          : collection
      );
      storage.set(STORAGE_KEYS.COLLECTIONS, newCollections);
      return { collections: newCollections };
    });
  },

  deleteRequest: (collectionId: string, requestId: string) => {
    set((state) => {
      const newCollections = state.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: collection.requests.filter(
                (request) => request.id !== requestId
              ),
              updatedAt: new Date().toISOString(),
            }
          : collection
      );
      storage.set(STORAGE_KEYS.COLLECTIONS, newCollections);
      return {
        collections: newCollections,
        activeRequestId: state.activeRequestId === requestId ? null : state.activeRequestId,
      };
    });
  },

  duplicateRequest: (collectionId: string, requestId: string) => {
    const state = get();
    const collection = state.collections.find((c) => c.id === collectionId);
    const request = collection?.requests.find((r) => r.id === requestId);

    if (collection && request) {
      const duplicatedRequest: SavedRequest = {
        ...request,
        id: uuidv4(),
        name: `${request.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => {
        const newCollections = state.collections.map((collection) =>
          collection.id === collectionId
            ? {
                ...collection,
                requests: [...collection.requests, duplicatedRequest],
                updatedAt: new Date().toISOString(),
              }
            : collection
        );
        storage.set(STORAGE_KEYS.COLLECTIONS, newCollections);
        return { collections: newCollections };
      });
    }
  },

  setActiveCollection: (id: string | null) => {
    set({ activeCollectionId: id, activeRequestId: null });
  },

  setActiveRequest: (id: string | null) => {
    set({ activeRequestId: id });
  },
}));

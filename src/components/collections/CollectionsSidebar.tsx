import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Plus, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { useCollectionsStore } from '@/store/collectionsStore';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRequestLoader } from '@/hooks/useRequestLoader';
import { EditRequestDialog } from '../request/EditRequestDialog';
import { RenameCollectionDialog } from './RenameCollectionDialog';
import type { SavedRequest, Collection } from '@/types/collection';

export const CollectionsSidebar: React.FC = () => {
  const { 
    collections, 
    activeRequestId,
    createCollection,
    deleteCollection,
    deleteRequest,
    setActiveCollection,
    duplicateRequest
  } = useCollectionsStore();
  
  const { loadRequest } = useRequestLoader();
  
  const [expandedCollections, setExpandedCollections] = React.useState<Set<string>>(new Set());
  const [isNewCollectionDialogOpen, setIsNewCollectionDialogOpen] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');
  const [editRequest, setEditRequest] = React.useState<{request: SavedRequest, collectionId: string} | null>(null);
  const [editCollection, setEditCollection] = React.useState<Collection | null>(null);

  const toggleCollection = (id: string) => {
    setExpandedCollections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="h-full border-r">
      <div className="p-4 border-b">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => setIsNewCollectionDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>

        <Dialog open={isNewCollectionDialogOpen} onOpenChange={setIsNewCollectionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Collection</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Enter collection name"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewCollectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newCollectionName) {
                    createCollection(newCollectionName);
                    setNewCollectionName('');
                    setIsNewCollectionDialogOpen(false);
                  }
                }}
                disabled={!newCollectionName}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {editRequest && (
        <EditRequestDialog
          isOpen={true}
          onClose={() => setEditRequest(null)}
          collectionId={editRequest.collectionId}
          request={editRequest.request}
        />
      )}

      {editCollection && (
        <RenameCollectionDialog
          isOpen={true}
          onClose={() => setEditCollection(null)}
          collection={editCollection}
        />
      )}

      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-2">
          {collections.map((collection) => (
            <Collapsible
              key={collection.id}
              open={expandedCollections.has(collection.id)}
              onOpenChange={() => toggleCollection(collection.id)}
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-accent rounded-md">
                    {expandedCollections.has(collection.id) ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {collection.name}
                  </CollapsibleTrigger>
                </ContextMenuTrigger>
                
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => setEditCollection(collection)}
                  >
                    Rename
                  </ContextMenuItem>
                  <ContextMenuItem 
                    className="text-red-600"
                    onClick={() => deleteCollection(collection.id)}
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              <CollapsibleContent>
                <div className="ml-6 mt-1 space-y-1">
                  {collection.requests.map((request) => (
                    <ContextMenu key={request.id}>
                      <ContextMenuTrigger>
                        <button 
                          type="button"
                          className={`flex items-center w-full p-2 hover:bg-accent rounded-md text-sm ${
                            activeRequestId === request.id ? 'bg-accent' : ''
                          }`}
                          onClick={() => {
                            setActiveCollection(collection.id);
                            loadRequest(collection.id, request.id);
                          }}
                        >
                          <span className="text-xs font-medium mr-2 px-1.5 py-0.5 rounded bg-primary/10">
                            {request.request.method}
                          </span>
                          {request.name}
                        </button>
                      </ContextMenuTrigger>
                      
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => {
                            setEditRequest({
                              request,
                              collectionId: collection.id
                            });
                          }}
                        >
                          Edit
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            duplicateRequest(collection.id, request.id);
                          }}
                        >
                          Duplicate
                        </ContextMenuItem>
                        <ContextMenuItem 
                          className="text-red-600"
                          onClick={() => deleteRequest(collection.id, request.id)}
                        >
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

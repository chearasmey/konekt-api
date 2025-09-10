import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollectionsStore } from '@/store/collectionsStore';
import { useRequestStore } from '@/store/requestStore';
import { Plus } from 'lucide-react';

interface SaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveRequestDialog({ isOpen, onClose }: SaveRequestDialogProps) {
  const [requestName, setRequestName] = React.useState('');
  const [selectedCollection, setSelectedCollection] = React.useState<string>('');
  const [isCreatingCollection, setIsCreatingCollection] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');
  
  const { collections, createCollection, saveRequest } = useCollectionsStore();
  const { request } = useRequestStore();

  const handleSave = () => {
    if (!requestName) return;

    let targetCollectionId = selectedCollection;

    if (isCreatingCollection && newCollectionName) {
      const newCollection = createCollection(newCollectionName);
      targetCollectionId = newCollection.id;
    }

    if (targetCollectionId) {
      saveRequest(targetCollectionId, requestName, request);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setRequestName('');
    setSelectedCollection('');
    setIsCreatingCollection(false);
    setNewCollectionName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="request-name">Request Name</Label>
            <Input
              id="request-name"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Enter request name"
            />
          </div>

          {!isCreatingCollection ? (
            <div className="space-y-2">
              <Label>Collection</Label>
              <div className="flex space-x-2">
                <Select
                  value={selectedCollection}
                  onValueChange={setSelectedCollection}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsCreatingCollection(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="collection-name">New Collection Name</Label>
              <div className="flex space-x-2">
                <Input
                  id="collection-name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Enter collection name"
                />
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingCollection(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!requestName || (!selectedCollection && !newCollectionName)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

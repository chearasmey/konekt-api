import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollectionsStore } from '@/store/collectionsStore';
import type { Collection } from '@/types/collection';

interface RenameCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
}

export function RenameCollectionDialog({ isOpen, onClose, collection }: RenameCollectionDialogProps) {
  const [collectionName, setCollectionName] = React.useState(collection.name);
  
  React.useEffect(() => {
    setCollectionName(collection.name);
  }, [collection]);

  const { updateCollection } = useCollectionsStore();

  const handleSave = () => {
    if (!collectionName) return;

    updateCollection(collection.id, {
      name: collectionName
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Collection</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="collection-name">Collection Name</Label>
          <Input
            id="collection-name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Enter collection name"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!collectionName}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

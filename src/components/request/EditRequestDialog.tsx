import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollectionsStore } from '@/store/collectionsStore';
import type { SavedRequest } from '@/types/collection';

interface EditRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
  request: SavedRequest;
}

export function EditRequestDialog({ isOpen, onClose, collectionId, request }: EditRequestDialogProps) {
  const [requestName, setRequestName] = React.useState(request.name);
  const [requestUrl, setRequestUrl] = React.useState(request.request.url);
  
  React.useEffect(() => {
    setRequestName(request.name);
    setRequestUrl(request.request.url);
  }, [request]);

  const { updateRequest } = useCollectionsStore();

  const handleSave = () => {
    if (!requestName || !requestUrl) return;

    updateRequest(collectionId, request.id, {
      name: requestName,
      request: {
        ...request.request,
        url: requestUrl
      }
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Request</DialogTitle>
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

          <div className="space-y-2">
            <Label htmlFor="request-url">Request URL</Label>
            <Input
              id="request-url"
              value={requestUrl}
              onChange={(e) => setRequestUrl(e.target.value)}
              placeholder="Enter request URL"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!requestName || !requestUrl}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

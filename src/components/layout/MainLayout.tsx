import React from 'react';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable';
import { CollectionsSidebar } from '../collections/CollectionsSidebar';
import { RequestEditor } from '../request/RequestEditor';
import { ResponseViewer } from '../response/ResponseViewer';

export const MainLayout: React.FC = () => {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <CollectionsSidebar />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={40}>
          <RequestEditor />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={40}>
          <ResponseViewer />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

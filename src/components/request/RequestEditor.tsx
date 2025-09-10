import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRequestStore } from '@/store/requestStore';
import { useRequest } from '@/hooks/useRequest';
import type { HttpMethod } from '@/types/request';
import { QueryParamsTable } from './QueryParamsTable';
import { HeadersManager } from './HeadersManager';
import { RequestBody } from './RequestBody';
import { SaveRequestDialog } from './SaveRequestDialog';
import { useRequestLoader } from '@/hooks/useRequestLoader';

const httpMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-green-500',
  POST: 'bg-blue-500',
  PUT: 'bg-yellow-500',
  DELETE: 'bg-red-500',
  PATCH: 'bg-purple-500',
  OPTIONS: 'bg-gray-500'
};

export const RequestEditor: React.FC = () => {
  const { request, setMethod, setUrl } = useRequestStore();
  const { execute, isLoading } = useRequest();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
  const { updateCurrentRequest, getCurrentRequest } = useRequestLoader();
  const isEditing = Boolean(getCurrentRequest());

  return (
    <div className="h-full flex flex-col">
      <Card className="m-4">
        <div className="p-4 space-y-4">
          <div className="flex space-x-2">
            <Select value={request.method} onValueChange={(value: HttpMethod) => setMethod(value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {httpMethods.map((method) => (
                  <SelectItem 
                    key={method} 
                    value={method}
                    onClick={() => updateCurrentRequest()}
                  >
                    <Badge className={methodColors[method]}>
                      {method}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input 
              placeholder="Enter request URL" 
              value={request.url}
              onChange={(e) => {
                setUrl(e.target.value);
                updateCurrentRequest();
              }}
              className="flex-1"
            />
            
            <div className="flex space-x-2">
              <Button
                onClick={execute}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSaveDialogOpen(true)}
              >
                Save
              </Button>
            </div>

            <SaveRequestDialog
              isOpen={isSaveDialogOpen}
              onClose={() => setIsSaveDialogOpen(false)}
            />
          </div>
        </div>
      </Card>

      <Card className="m-4 flex-1">
        <Tabs defaultValue="params">
          <TabsList className="p-2">
            <TabsTrigger value="params">Query Params</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
          </TabsList>

          <TabsContent value="params" className="mt-0">
            <QueryParamsTable />
          </TabsContent>

          <TabsContent value="headers" className="mt-0">
            <HeadersManager />
          </TabsContent>

          <TabsContent value="body" className="mt-0">
            <RequestBody />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

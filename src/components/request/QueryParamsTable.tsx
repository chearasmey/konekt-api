import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useRequestStore } from '@/store/requestStore';
import { useRequestLoader } from '@/hooks/useRequestLoader';

export function QueryParamsTable() {
  const { request, addQueryParam, updateQueryParam, removeQueryParam } = useRequestStore();
  const { updateCurrentRequest } = useRequestLoader();

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Query Parameters</h3>
        <Button variant="outline" size="sm" onClick={() => {
          addQueryParam();
          updateCurrentRequest();
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Parameter
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {request.queryParams.map((param) => (
            <TableRow key={param.id}>
              <TableCell>
                <Checkbox
                  checked={param.enabled}
                  onCheckedChange={(checked) => {
                    updateQueryParam(param.id, { enabled: Boolean(checked) });
                    updateCurrentRequest();
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={param.key}
                  onChange={(e) => {
                    updateQueryParam(param.id, { key: e.target.value });
                    updateCurrentRequest();
                  }}
                  placeholder="Parameter name"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={param.value}
                  onChange={(e) => {
                    updateQueryParam(param.id, { value: e.target.value });
                    updateCurrentRequest();
                  }}
                  placeholder="Parameter value"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    removeQueryParam(param.id);
                    updateCurrentRequest();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useRequestStore } from '@/store/requestStore';
import { useRequestLoader } from '@/hooks/useRequestLoader';

const commonHeaders = {
  'Accept': [
    'application/json',
    'application/xml',
    'text/plain',
    '*/*'
  ],
  'Content-Type': [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain'
  ],
  'Authorization': ['Bearer ', 'Basic '],
  'Cache-Control': ['no-cache', 'no-store', 'max-age=0'],
  'Accept-Language': ['en-US', 'en-GB', '*']
};

export function HeadersManager() {
  const { request, addHeader, updateHeader, removeHeader } = useRequestStore();
  const { updateCurrentRequest } = useRequestLoader();

  const handleCommonHeaderSelect = (headerId: string, headerKey: string) => {
    updateHeader(headerId, { key: headerKey });
    updateCurrentRequest();
  };

  const handleCommonValueSelect = (headerId: string, value: string) => {
    updateHeader(headerId, { value });
    updateCurrentRequest();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Headers</h3>
        <Button variant="outline" size="sm" onClick={() => {
          addHeader();
          updateCurrentRequest();
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Header
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
          {request.headers.map((header) => (
            <TableRow key={header.id}>
              <TableCell>
                <Checkbox
                  checked={header.enabled}
                  onCheckedChange={(checked) => {
                    updateHeader(header.id, { enabled: Boolean(checked) });
                    updateCurrentRequest();
                  }}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={header.key}
                  onValueChange={(value) => handleCommonHeaderSelect(header.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select or type header" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(commonHeaders).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {header.key && commonHeaders[header.key as keyof typeof commonHeaders] ? (
                  <Select
                    value={header.value}
                    onValueChange={(value) => handleCommonValueSelect(header.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or type value" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonHeaders[header.key as keyof typeof commonHeaders].map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={header.value}
                    onChange={(e) => {
                      updateHeader(header.id, { value: e.target.value });
                      updateCurrentRequest();
                    }}
                    placeholder="Header value"
                  />
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    removeHeader(header.id);
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

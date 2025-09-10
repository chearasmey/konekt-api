import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useRequestStore } from '@/store/requestStore';
import { useRequestLoader } from '@/hooks/useRequestLoader';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { BodyType, FormDataEntry } from '@/types/request';
import CodeEditor from '@uiw/react-textarea-code-editor';

export function RequestBody() {
  const [jsonError, setJsonError] = React.useState<string | null>(null);
  const { request, setBodyType, setBodyContent } = useRequestStore();
  const { updateCurrentRequest } = useRequestLoader();

  const [collapsedLines, setCollapsedLines] = React.useState<Record<number, boolean>>({});
  
  const formatJson = (content: string): string => {
    try {
      const parsed = JSON.parse(content);
      // Format with exact 2 spaces indentation and ensure each key-value pair is on its own line
      const formatted = JSON.stringify(parsed, null, 2)
        .replace(/\n/g, '\n')  // Ensure consistent line endings
        .replace(/([{,])\s*\n\s*"/g, '$1\n  "'); // Ensure line break after { and commas
      return formatted;
    } catch {
      return content;
    }
  };
  
  const toggleLineCollapse = (lineNumber: number) => {
    setCollapsedLines(prev => ({
      ...prev,
      [lineNumber]: !prev[lineNumber]
    }));
  };

  const handleJsonChange = (content: string) => {
    setBodyContent(content);
    // Only try to validate if there's content and it's not just whitespace
    if (content.trim()) {
      try {
        JSON.parse(content);
        setJsonError(null);
      } catch (err) {
        setJsonError((err as Error).message);
      }
    } else {
      setJsonError(null);
    }
    updateCurrentRequest();
  };

  const handleFormDataChange = (entries: FormDataEntry[]) => {
    setBodyContent(entries);
    updateCurrentRequest();
  };

  const getFormContent = () => {
    if (!request.body) return [];
    if (!request.body.content) return [];
    return Array.isArray(request.body.content) ? request.body.content : [];
  };

  const addFormDataEntry = () => {
    const currentEntries = getFormContent();
    handleFormDataChange([
      ...currentEntries,
      { id: uuidv4(), key: '', value: '', type: 'text', enabled: true }
    ]);
  };

  const updateFormDataEntry = (id: string, updates: Partial<FormDataEntry>) => {
    const currentEntries = getFormContent();
    handleFormDataChange(
      currentEntries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const removeFormDataEntry = (id: string) => {
    const currentEntries = getFormContent();
    handleFormDataChange(currentEntries.filter(entry => entry.id !== id));
  };

  const handleFileChange = async (id: string, file: File) => {
    updateFormDataEntry(id, { value: file, type: 'file' });
  };

  // Initialize or fix content when body type changes
  React.useEffect(() => {
    const bodyType = request.body?.type || 'json';
    const currentContent = request.body?.content;

    if (bodyType === 'form-data' || bodyType === 'url-encoded') {
      if (!Array.isArray(currentContent)) {
        setBodyContent([]);
      }
    } else if (bodyType === 'json' || bodyType === 'raw') {
      if (typeof currentContent !== 'string') {
        setBodyContent('');
      }
    }
  }, [request.body?.type, request.body?.content, setBodyContent]);

  const renderFormTable = (includeFileOption = true) => {
    const entries = getFormContent();
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            {includeFileOption && <TableHead className="w-[100px]">Type</TableHead>}
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <Checkbox
                  checked={entry.enabled}
                  onCheckedChange={(checked) => 
                    updateFormDataEntry(entry.id, { enabled: Boolean(checked) })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={entry.key}
                  onChange={(e) => updateFormDataEntry(entry.id, { key: e.target.value })}
                  placeholder="Key"
                />
              </TableCell>
              <TableCell>
                {(!includeFileOption || entry.type === 'text') ? (
                  <Input
                    value={entry.value as string}
                    onChange={(e) => updateFormDataEntry(entry.id, { value: e.target.value })}
                    placeholder="Value"
                  />
                ) : (
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(entry.id, file);
                    }}
                  />
                )}
              </TableCell>
              {includeFileOption && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFormDataEntry(entry.id, { 
                      type: entry.type === 'text' ? 'file' : 'text',
                      value: '' 
                    })}
                  >
                    {entry.type === 'text' ? 'Text' : 'File'}
                  </Button>
                </TableCell>
              )}
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFormDataEntry(entry.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <Tabs
        defaultValue="json"
        value={request.body?.type || 'json'}
        onValueChange={(value) => {
          setBodyType(value as BodyType);
        }}
      >
        <TabsList>
          <TabsTrigger value="json">
            JSON
          </TabsTrigger>
          <TabsTrigger value="form-data">
            Form Data
          </TabsTrigger>
          <TabsTrigger value="url-encoded">
            URL Encoded
          </TabsTrigger>
          <TabsTrigger value="raw">
            Raw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="json" className="mt-4">
          <div className="space-y-2">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const content = typeof request.body?.content === 'string' ? request.body.content : '';
                  const formatted = formatJson(content);
                  handleJsonChange(formatted);
                }}
              >
                Format JSON
              </Button>
            </div>
            <div className={`w-full overflow-hidden rounded-md border ${jsonError ? 'border-red-500' : ''}`}>
              <div className="relative">
                <CodeEditor
                  value={typeof request.body?.content === 'string' ? request.body.content : ''}
                  language="json"
                  placeholder="Enter JSON data"
                  onChange={(e) => handleJsonChange(e.target.value)}
                  padding={15}
                  data-line-numbers="true"
                  className="w-full text-xs font-mono bg-transparent min-h-[256px] pl-12 [&>textarea]:outline-none"
                />
                <div
                  className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 flex flex-col px-0 pt-[15px] text-xs font-mono text-muted-foreground select-none leading-normal border-r border-border"
                >
                  {(typeof request.body?.content === 'string' ? request.body.content.split('\n') : ['']).map((line, i) => {
                    const lineContent = line.trim();
                    const showChevron = lineContent.endsWith('{') || lineContent.endsWith('[');
                    return (
                      <button
                        type="button"
                        key={`line-${line}-${i}`}
                        className="group flex items-center hover:bg-muted/80 w-full h-[20px]"
                        onClick={() => showChevron && toggleLineCollapse(i)}
                        disabled={!showChevron}
                        aria-label={`Toggle line ${i + 1} ${collapsedLines[i] ? 'expand' : 'collapse'}`}
                      >
                        {showChevron && (
                          <span className="w-3 h-full flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity">
                            {collapsedLines[i] ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronUp className="h-3 w-3" />
                            )}
                          </span>
                        )}
                        {!showChevron && <span className="w-3" />}
                        <span className="w-7 text-right pr-2">{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {jsonError && (
              <p className="text-sm text-red-500">{jsonError}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="form-data" className="mt-4">
          <div className="space-y-4">
            <Button variant="outline" size="sm" onClick={addFormDataEntry}>
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
            {renderFormTable(true)}
          </div>
        </TabsContent>

        <TabsContent value="url-encoded" className="mt-4">
          <div className="space-y-4">
            <Button variant="outline" size="sm" onClick={addFormDataEntry}>
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
            {renderFormTable(false)}
          </div>
        </TabsContent>

        <TabsContent value="raw" className="mt-4">
          <textarea
            className="w-full h-64 font-mono text-sm p-2 rounded-md border"
            value={typeof request.body?.content === 'string' ? request.body.content : ''}
            onChange={(e) => setBodyContent(e.target.value)}
            placeholder="Enter raw content"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

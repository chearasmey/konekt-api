import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from '@/components/ui/toast';
import { useResponseStore } from '@/store/responseStore';
import { syntaxHighlight } from '@/lib/formatJson';

const ResponseContent: React.FC<{ content: string }> = ({ content }) => {
  const formattedContent = React.useMemo(() => {
    return (
      <div 
        role="tree"
        aria-label="JSON viewer"
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(content) }}
        className="font-mono leading-relaxed [&_.json-viewer]:relative [&_.line]:flex [&_.line]:items-center hover:[&_.line]:bg-muted/50 [&_.expander]:h-4 [&_.expander]:w-4 [&_.expander]:hover:bg-muted/50 [&_.expander]:rounded [&_.line-number]:text-muted-foreground [&_.line-number]:min-w-[3ch] [&_.line-number]:mr-4 [&_.line-number]:select-none [&_.line-number]:border-r [&_.line-number]:border-r-border [&_.line-number]:text-right [&_.line-number]:pr-2 [&_.content]:ml-4 [&_.content]:border-l [&_.content]:border-l-border [&_.content]:pl-4"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            const target = e.target as HTMLElement;
            if (target.classList.contains('expander')) {
              target.click();
            }
          }
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const expander = target.closest('.expander');
          if (expander) {
            const content = expander.closest('.expandable')?.nextElementSibling;
            if (content?.classList.contains('content')) {
              content.classList.toggle('hidden');
              const icon = expander.querySelector('svg');
              if (icon) {
                icon.classList.toggle('chevron-down');
                icon.classList.toggle('chevron-right');
                const button = expander as HTMLButtonElement;
                button.setAttribute('aria-expanded', content.classList.contains('hidden') ? 'false' : 'true');
              }
            }
          }
        }}
      />
    );
  }, [content]);

  return (
    <div className="relative font-mono text-sm rounded-md">
      <div className="absolute inset-0 bg-muted/30 border rounded-md" />
      <div className="relative p-4 overflow-x-auto">
        {formattedContent}
      </div>
    </div>
  );
};

export const ResponseViewer: React.FC = () => {
  const { response } = useResponseStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const toast = useToast();

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No response yet
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status < 300) return 'bg-green-500';
    if (status < 400) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.showToast('Copied to clipboard');
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="m-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center space-x-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <Badge className={getStatusColor(response.status)}>
                {response.status} {response.statusText}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {response.time}ms
              </span>
              <span className="text-sm text-muted-foreground">
                {formatSize(response.size)}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(response.body)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>

          <CollapsibleContent>
            <div className="p-4">
              <Tabs defaultValue="body">
                <TabsList className="w-full justify-start bg-muted/50">
                  <TabsTrigger value="body">Response</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>

                <TabsContent value="body" className="mt-4">
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    <ResponseContent content={response.body} />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="headers" className="mt-4">
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    <div className="rounded-md border bg-muted/30">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-muted/50">
                            <TableHead className="w-[200px]">Header</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(response.headers).map(([key, value]) => (
                            <TableRow key={key} className="hover:bg-muted/50">
                              <TableCell className="font-mono text-violet-500">{key}</TableCell>
                              <TableCell className="font-mono text-emerald-500">{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

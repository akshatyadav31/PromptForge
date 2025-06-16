import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Heart, TrendingUp } from "lucide-react";
import { getAllPublicPrompts } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CommunityPrompt {
  id: string;
  originalInput: string;
  transformedPrompt: string;
  frameworks: string[];
  parameters: any;
  useCase: string;
  userId: string;
  createdAt: Date;
}

export function CommunityHighlights() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: communityPrompts = [], isLoading, error } = useQuery({
    queryKey: ['community-prompts'],
    queryFn: getAllPublicPrompts,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    retry: false, // Don't retry on permission errors
    throwOnError: false, // Handle errors gracefully
  });

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied to clipboard",
        description: "The enhanced prompt has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getUseCaseColor = (useCase: string) => {
    const colors = {
      'Content Creation': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Technical Documentation': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Creative Writing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Business Communication': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Educational Content': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Marketing Copy': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };
    return colors[useCase as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Community Highlights
          </CardTitle>
          <CardDescription>
            Loading recent community transformations...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Community Highlights
        </CardTitle>
        <CardDescription>
          Recent prompt transformations from the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {error && (
              <div className="text-center py-6 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Community features will be available once authentication is set up</p>
              </div>
            )}
            
            {!error && communityPrompts.slice(0, 8).map((prompt) => (
              <div
                key={prompt.id}
                className={cn(
                  "p-4 rounded-lg border transition-all cursor-pointer",
                  selectedPrompt === prompt.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedPrompt(selectedPrompt === prompt.id ? null : prompt.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className={getUseCaseColor(prompt.useCase)}
                      >
                        {prompt.useCase}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(prompt.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium mb-1 line-clamp-2">
                      {prompt.originalInput}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Frameworks:</span>
                      {prompt.frameworks.map((framework: string) => (
                        <Badge key={framework} variant="outline" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPrompt(prompt.transformedPrompt);
                    }}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                {selectedPrompt === prompt.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Enhanced Prompt:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                        {prompt.transformedPrompt}
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyPrompt(prompt.transformedPrompt)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Enhanced Prompt
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {!error && !isLoading && communityPrompts.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No community prompts yet</p>
                <p className="text-xs">Create and share the first prompt!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, Circle, Copy, Download, Star } from "lucide-react";
import type { EnhancedPrompt } from "../types/prompt";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/firestore-analytics";
import { useAuth } from "@/hooks/useAuth";

interface TransformationPanelProps {
  enhancedPrompt: EnhancedPrompt | null;
  isAnalyzing: boolean;
}

export function TransformationPanel({ enhancedPrompt, isAnalyzing }: TransformationPanelProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCopy = async () => {
    if (!enhancedPrompt) return;
    
    try {
      await navigator.clipboard.writeText(enhancedPrompt.finalPrompt);
      
      // Track analytics
      if (user) {
        trackEvent({
          userId: user.uid,
          eventType: 'prompt_copied',
          eventData: {
            useCase: enhancedPrompt.useCase,
            frameworks: enhancedPrompt.detectedFrameworks.filter(f => f.applicable).map(f => f.framework)
          }
        });
      }
      
      toast({
        title: "Copied!",
        description: "Enhanced prompt copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (!enhancedPrompt) return;
    
    // Track analytics
    if (user) {
      trackEvent({
        userId: user.uid,
        eventType: 'prompt_exported',
        eventData: {
          useCase: enhancedPrompt.useCase,
          frameworks: enhancedPrompt.detectedFrameworks.filter(f => f.applicable).map(f => f.framework)
        }
      });
    }
    
    const content = `# Enhanced Prompt\n\n${enhancedPrompt.finalPrompt}\n\n## Original Input\n${enhancedPrompt.originalInput}\n\n## Parameters\n${JSON.stringify(enhancedPrompt.parameters, null, 2)}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-prompt.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your request and applying frameworks...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!enhancedPrompt) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter your request and click "Analyze & Transform" to see the enhanced prompt</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Framework Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 text-secondary mr-2" />
            Smart Framework Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            {enhancedPrompt.detectedFrameworks.map((framework) => (
              <Badge 
                key={framework.framework}
                variant={framework.applicable ? "default" : "secondary"}
                className={`flex items-center space-x-2 px-3 py-2 ${
                  framework.applicable 
                    ? framework.framework === 'TCREI' 
                      ? 'bg-violet-100 text-violet-800 border-violet-200' 
                      : framework.framework === 'RSTI'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {framework.applicable ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
                <span className="font-medium">{framework.framework}</span>
                <span className="text-xs">
                  {framework.applicable ? `${framework.confidence}%` : 'Not applicable'}
                </span>
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {enhancedPrompt.detectedFrameworks.find(f => f.applicable)?.reason || 
             'Framework selection based on input analysis and content type detection.'}
          </p>
        </CardContent>
      </Card>

      {/* Transformation Steps */}
      {enhancedPrompt.transformationSteps.map((step, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="bg-secondary text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">
                  {index + 1}
                </span>
                {step.title}
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {step.status === 'complete' ? 'Complete' : step.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{step.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(step.components).map(([key, value]) => (
                <div 
                  key={key}
                  className={`p-4 rounded-lg ${
                    step.framework === 'TCREI' 
                      ? 'bg-violet-50 border border-violet-200'
                      : step.framework === 'RSTI'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <h4 className={`font-medium mb-2 ${
                    step.framework === 'TCREI' 
                      ? 'text-violet-900'
                      : step.framework === 'RSTI'
                      ? 'text-blue-900'
                      : 'text-green-900'
                  }`}>
                    {key}
                  </h4>
                  <p className={`text-sm ${
                    step.framework === 'TCREI' 
                      ? 'text-violet-800'
                      : step.framework === 'RSTI'
                      ? 'text-blue-800'
                      : 'text-green-800'
                  }`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Final Enhanced Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-warning mr-2" />
              Enhanced Prompt Output
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCopy} size="sm">
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
            <pre className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap font-sans">
              {enhancedPrompt.finalPrompt}
            </pre>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-sm text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>
                <strong>Enhancement Complete:</strong> Your basic request has been transformed into a comprehensive, structured prompt that's significantly more detailed and specific.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

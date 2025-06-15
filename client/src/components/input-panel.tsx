import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Megaphone, Code, Palette, TrendingUp, Wand2, Bot, Settings } from "lucide-react";
import type { PromptParameters } from "../types/prompt";

interface InputPanelProps {
  input: string;
  setInput: (input: string) => void;
  parameters: PromptParameters;
  setParameters: (parameters: PromptParameters) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  useAI: boolean;
  setUseAI: (useAI: boolean) => void;
}

const templates = [
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing",
    template: "Help me create compelling marketing copy for a new product launch"
  },
  {
    id: "technical", 
    icon: Code,
    title: "Technical",
    template: "Generate comprehensive API documentation for a REST service"
  },
  {
    id: "creative",
    icon: Palette, 
    title: "Creative",
    template: "Write an engaging short story with a twist ending"
  },
  {
    id: "analysis",
    icon: TrendingUp,
    title: "Analysis", 
    template: "Analyze customer feedback data and provide actionable insights"
  }
];

export function InputPanel({ 
  input, 
  setInput, 
  parameters, 
  setParameters, 
  onAnalyze, 
  isAnalyzing,
  selectedModel,
  setSelectedModel,
  useAI,
  setUseAI
}: InputPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setInput(template.template);
      setSelectedTemplate(templateId);
    }
  };

  const updateParameter = <K extends keyof PromptParameters>(
    key: K,
    value: PromptParameters[K]
  ) => {
    setParameters({
      ...parameters,
      [key]: value
    });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <PenTool className="h-5 w-5 text-primary mr-2" />
          Input Your Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Input */}
        <div>
          <Label htmlFor="basicInput" className="text-sm font-medium text-gray-700 mb-2 block">
            What do you need help with?
          </Label>
          <Textarea 
            id="basicInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-32 resize-none"
            placeholder="e.g., Help me write a blog post about coffee"
          />
        </div>

        {/* Template Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Quick Templates
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className="h-auto p-3 text-left justify-start"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex flex-col items-start">
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-sm font-medium">{template.title}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Audience Level
            </Label>
            <Select
              value={parameters.audienceLevel}
              onValueChange={(value) => updateParameter('audienceLevel', value as PromptParameters['audienceLevel'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Tone
            </Label>
            <Select
              value={parameters.tone}
              onValueChange={(value) => updateParameter('tone', value as PromptParameters['tone'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Output Format
            </Label>
            <Select
              value={parameters.outputFormat}
              onValueChange={(value) => updateParameter('outputFormat', value as PromptParameters['outputFormat'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="bullet-points">Bullet Points</SelectItem>
                <SelectItem value="step-by-step">Step-by-step</SelectItem>
                <SelectItem value="qa-format">Q&A Format</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Word Count: <span className="text-primary">{parameters.wordCount}</span>
            </Label>
            <Slider
              value={[parameters.wordCount]}
              onValueChange={(value) => updateParameter('wordCount', value[0])}
              min={200}
              max={2000}
              step={100}
              className="w-full"
            />
          </div>
        </div>

        {/* AI Enhancement Settings */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center">
              <Bot className="h-4 w-4 mr-2" />
              AI Enhancement
            </Label>
            <Switch
              checked={useAI}
              onCheckedChange={setUseAI}
            />
          </div>
          
          {useAI && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                AI Model
              </Label>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepseek/deepseek-r1-0528:free">DeepSeek R1 (Free)</SelectItem>
                  <SelectItem value="openai/gpt-4o-mini">GPT-4o Mini (Fast)</SelectItem>
                  <SelectItem value="openai/gpt-4o">GPT-4o (Best)</SelectItem>
                  <SelectItem value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</SelectItem>
                  <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="anthropic/claude-3-haiku">Claude 3 Haiku</SelectItem>
                  <SelectItem value="google/gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button 
          onClick={onAnalyze} 
          disabled={isAnalyzing || !input.trim()}
          className="w-full"
        >
          {useAI ? <Bot className="h-4 w-4 mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
          {isAnalyzing ? 'Analyzing...' : useAI ? 'AI Enhance' : 'Rule-Based Transform'}
        </Button>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { InputPanel } from "@/components/input-panel";
import { TransformationPanel } from "@/components/transformation-panel";
import { PromptLibrary } from "@/components/prompt-library";
import { FrameworkDetector } from "@/lib/framework-detector";
import { PromptTransformer } from "@/lib/prompt-transformer";
import { savePromptToFirestore } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { PromptParameters, EnhancedPrompt } from "@/types/prompt";

export default function Home() {
  const [input, setInput] = useState("Help me write a blog post about coffee");
  const [parameters, setParameters] = useState<PromptParameters>({
    audienceLevel: 'intermediate',
    tone: 'professional',
    outputFormat: 'article',
    wordCount: 800
  });
  const [enhancedPrompt, setEnhancedPrompt] = useState<EnhancedPrompt | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const savePromptMutation = useMutation({
    mutationFn: async (promptData: {
      originalInput: string;
      transformedPrompt: string;
      frameworks: string[];
      parameters: PromptParameters;
      useCase: string;
    }) => {
      if (!user) {
        throw new Error("User must be authenticated to save prompts");
      }
      
      return await savePromptToFirestore({
        ...promptData,
        userId: user.uid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-prompts', user?.uid] });
      toast({
        title: "Prompt saved successfully",
        description: "Your enhanced prompt has been saved to your library",
      });
    },
    onError: (error) => {
      console.error("Failed to save prompt:", error);
      toast({
        title: "Failed to save prompt",
        description: "There was an error saving your prompt. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay for UX
    setTimeout(() => {
      try {
        // Detect frameworks
        const detectedFrameworks = FrameworkDetector.detectFrameworks(input);
        
        // Determine use case based on input
        const useCase = determineUseCase(input);
        
        // Transform the prompt
        const enhanced = PromptTransformer.transformPrompt(
          input,
          detectedFrameworks,
          parameters,
          useCase
        );
        
        setEnhancedPrompt(enhanced);
        
        // Save to backend
        savePromptMutation.mutate({
          originalInput: input,
          transformedPrompt: enhanced.finalPrompt,
          frameworks: detectedFrameworks.filter(f => f.applicable).map(f => f.framework),
          parameters: parameters,
          useCase: useCase
        });
        
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  const determineUseCase = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('marketing') || lowerInput.includes('copy') || lowerInput.includes('ad')) {
      return 'marketing';
    } else if (lowerInput.includes('code') || lowerInput.includes('api') || lowerInput.includes('technical')) {
      return 'technical';
    } else if (lowerInput.includes('story') || lowerInput.includes('creative') || lowerInput.includes('write')) {
      return 'creative';
    } else if (lowerInput.includes('analyze') || lowerInput.includes('data') || lowerInput.includes('insight')) {
      return 'analysis';
    }
    return 'general';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InputPanel
              input={input}
              setInput={setInput}
              parameters={parameters}
              setParameters={setParameters}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
          
          <div className="lg:col-span-2">
            <TransformationPanel
              enhancedPrompt={enhancedPrompt}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
        
        <PromptLibrary />
      </main>
    </div>
  );
}

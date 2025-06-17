import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { InputPanel } from "@/components/input-panel";
import { TransformationPanel } from "@/components/transformation-panel";
import { PromptLibrary } from "@/components/prompt-library";
import { CommunityHighlights } from "@/components/community-highlights";
import { FrameworkDetector } from "@/lib/framework-detector";
import { PromptTransformer } from "@/lib/prompt-transformer";
import { OpenRouterService } from "@/lib/openrouter";
import { savePromptToFirestore } from "@/lib/firebase";
import { trackEvent } from "@/lib/firestore-analytics";
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
  const [selectedModel, setSelectedModel] = useState('deepseek/deepseek-r1-0528:free');
  const [useAI, setUseAI] = useState(true);

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
    onError: (error: any) => {
      console.log("Prompt saving unavailable:", error);
      // Don't show error toast for permission issues - saving is optional
      if (error?.code !== 'permission-denied') {
        toast({
          title: "Could not save prompt",
          description: "Prompt enhancement completed successfully",
        });
      }
    }
  });

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    
    try {
      // Detect frameworks
      const detectedFrameworks = FrameworkDetector.detectFrameworks(input);
      
      // Determine use case based on input
      const useCase = determineUseCase(input);
      
      let finalPrompt: string;
          let enhanced: EnhancedPrompt;

          // Always generate rule-based transformation steps
          const ruleBasedEnhanced = PromptTransformer.transformPrompt(
            input,
            detectedFrameworks,
            parameters,
            useCase
          );

          if (useAI) {
            try {
              // Use AI-powered enhancement
              const openRouterService = new OpenRouterService();
              const applicableFrameworks = detectedFrameworks.filter(f => f.applicable).map(f => f.framework);
              
              finalPrompt = await openRouterService.generateEnhancedPrompt(
                input,
                applicableFrameworks,
                parameters,
                useCase,
                selectedModel
              );

              // Combine AI-generated step with rule-based steps
              enhanced = {
                originalInput: input,
                detectedFrameworks,
                transformationSteps: [
                  {
                    framework: 'AI Enhanced',
                    title: `AI-Generated Prompt using ${selectedModel}`,
                    description: `Enhanced using ${applicableFrameworks.join(' + ')} frameworks with AI assistance`,
                    components: {
                      'AI Model': selectedModel,
                      'Frameworks Applied': applicableFrameworks.join(', '),
                      'Enhancement Type': 'AI-Powered Transformation'
                    },
                    status: 'complete' as const
                  },
                  ...ruleBasedEnhanced.transformationSteps // Add rule-based steps
                ],
                finalPrompt,
                parameters,
                useCase
              };
            } catch (aiError) {
              console.error('AI enhancement failed, falling back to rule-based:', aiError);
              toast({
                title: "AI enhancement failed",
                description: "Using rule-based enhancement instead",
                variant: "destructive",
              });
              
              // Fallback to rule-based enhancement
              enhanced = ruleBasedEnhanced;
            }
          } else {
            // Use rule-based enhancement
            enhanced = ruleBasedEnhanced;
          }
      
      setEnhancedPrompt(enhanced);
      
      // Save to Firebase if user is authenticated (optional)
      if (user) {
        try {
          const applicableFrameworks = detectedFrameworks.filter(f => f.applicable).map(f => f.framework);
          
          savePromptMutation.mutate({
            originalInput: input,
            transformedPrompt: enhanced.finalPrompt,
            frameworks: applicableFrameworks,
            parameters: parameters,
            useCase: useCase
          });

          // Track analytics event (silent fail if not authorized)
          try {
            await trackEvent({
              userId: user.uid,
              eventType: 'prompt_created',
              eventData: {
                frameworks: applicableFrameworks,
                useCase: useCase,
                parameters: parameters,
                aiModel: useAI ? selectedModel : 'rule-based'
              }
            });

            await trackEvent({
              userId: user.uid,
              eventType: 'framework_applied',
              eventData: {
                frameworks: applicableFrameworks,
                useCase: useCase,
                enhancementType: useAI ? 'ai' : 'rule-based'
              }
            });
          } catch (analyticsError) {
            // Analytics tracking is optional - don't block the main flow
            console.log('Analytics tracking unavailable:', analyticsError);
          }
        } catch (saveError) {
          // Saving is optional - don't block the enhancement
          console.log('Prompt saving unavailable:', saveError);
        }
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Enhancement failed",
        description: "Please try again or check your settings",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <InputPanel
              input={input}
              setInput={setInput}
              parameters={parameters}
              setParameters={setParameters}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              useAI={useAI}
              setUseAI={setUseAI}
            />
          </div>
          
          <div className="lg:col-span-2">
            <TransformationPanel
              enhancedPrompt={enhancedPrompt}
              isAnalyzing={isAnalyzing}
            />
          </div>
          
          <div className="lg:col-span-1">
            <CommunityHighlights />
          </div>
        </div>
        
        <PromptLibrary />
      </main>
    </div>
  );
}

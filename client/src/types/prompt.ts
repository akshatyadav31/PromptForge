export interface PromptParameters {
  audienceLevel: 'beginner' | 'intermediate' | 'expert';
  tone: 'formal' | 'professional' | 'casual' | 'friendly';
  outputFormat: 'article' | 'bullet-points' | 'step-by-step' | 'qa-format';
  wordCount: number;
}

export interface FrameworkDetection {
  framework: 'TCREI' | 'RSTI' | 'TFCDC';
  confidence: number;
  applicable: boolean;
  reason: string;
}

export interface TransformationStep {
  framework: string;
  title: string;
  description: string;
  components: {
    [key: string]: string;
  };
  status: 'pending' | 'complete' | 'in-progress';
}

export interface EnhancedPrompt {
  originalInput: string;
  detectedFrameworks: FrameworkDetection[];
  transformationSteps: TransformationStep[];
  finalPrompt: string;
  parameters: PromptParameters;
  useCase: string;
}

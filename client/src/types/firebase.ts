export interface FirebasePrompt {
  id: string;
  originalInput: string;
  transformedPrompt: string;
  frameworks: string[];
  parameters: {
    audienceLevel: 'beginner' | 'intermediate' | 'expert';
    tone: 'formal' | 'professional' | 'casual' | 'friendly';
    outputFormat: 'article' | 'bullet-points' | 'step-by-step' | 'qa-format';
    wordCount: number;
  };
  useCase: string;
  userId: string;
  createdAt: Date;
}
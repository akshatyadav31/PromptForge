import type { FrameworkDetection } from '../types/prompt';

export class FrameworkDetector {
  private static contentCreationKeywords = [
    'write', 'create', 'generate', 'blog', 'article', 'post', 'content', 
    'copy', 'marketing', 'story', 'essay', 'guide', 'tutorial'
  ];

  private static technicalKeywords = [
    'code', 'api', 'documentation', 'debug', 'implement', 'function',
    'algorithm', 'software', 'programming', 'development', 'technical'
  ];

  private static refinementKeywords = [
    'improve', 'refine', 'enhance', 'fix', 'optimize', 'polish',
    'adjust', 'tweak', 'better', 'revise'
  ];

  static detectFrameworks(input: string): FrameworkDetection[] {
    const lowerInput = input.toLowerCase();
    const words = lowerInput.split(/\s+/);
    
    const detections: FrameworkDetection[] = [];

    // TCREI Detection (Task, Context, Resources, Evaluate, Iterate)
    const tcreimatch = this.detectTCREI(lowerInput, words);
    detections.push(tcreimatch);

    // RSTI Detection (Revisit, Separate, Try, Introduce)
    const rstimatch = this.detectRSTI(lowerInput, words);
    detections.push(rstimatch);

    // TFCDC Detection (Thinking, Frameworks, Checkpoints, Debugging, Context)
    const tfdcdmatch = this.detectTFCDC(lowerInput, words);
    detections.push(tfdcdmatch);

    return detections.sort((a, b) => b.confidence - a.confidence);
  }

  private static detectTCREI(input: string, words: string[]): FrameworkDetection {
    let confidence = 0;
    let reasons: string[] = [];

    // Check for content creation indicators
    const contentMatches = words.filter(word => 
      this.contentCreationKeywords.includes(word)
    ).length;
    
    if (contentMatches > 0) {
      confidence += contentMatches * 20;
      reasons.push('Content creation task detected');
    }

    // Check for structure indicators
    if (input.includes('help me') || input.includes('create') || input.includes('write')) {
      confidence += 25;
      reasons.push('Request structure indicates TCREI applicability');
    }

    // Check for complexity indicators
    if (words.length > 5) {
      confidence += 15;
      reasons.push('Complex request benefits from TCREI structure');
    }

    return {
      framework: 'TCREI',
      confidence: Math.min(confidence, 100),
      applicable: confidence > 30,
      reason: reasons.join('; ')
    };
  }

  private static detectRSTI(input: string, words: string[]): FrameworkDetection {
    let confidence = 0;
    let reasons: string[] = [];

    // Check for refinement indicators
    const refinementMatches = words.filter(word => 
      this.refinementKeywords.includes(word)
    ).length;
    
    if (refinementMatches > 0) {
      confidence += refinementMatches * 30;
      reasons.push('Refinement task detected');
    }

    // RSTI is generally applicable for enhancement
    if (input.length > 20) {
      confidence += 20;
      reasons.push('Can benefit from micro-tuning');
    }

    // Check for existing draft indicators
    if (input.includes('already') || input.includes('have') || input.includes('existing')) {
      confidence += 40;
      reasons.push('Existing content refinement');
    }

    return {
      framework: 'RSTI',
      confidence: Math.min(confidence, 100),
      applicable: confidence > 20,
      reason: reasons.join('; ')
    };
  }

  private static detectTFCDC(input: string, words: string[]): FrameworkDetection {
    let confidence = 0;
    let reasons: string[] = [];

    // Check for technical indicators
    const technicalMatches = words.filter(word => 
      this.technicalKeywords.includes(word)
    ).length;
    
    if (technicalMatches > 0) {
      confidence += technicalMatches * 25;
      reasons.push('Technical/software task detected');
    }

    // Check for debugging/problem-solving indicators
    if (input.includes('debug') || input.includes('fix') || input.includes('error')) {
      confidence += 40;
      reasons.push('Debugging workflow applicable');
    }

    // Check for development workflow indicators
    if (input.includes('implement') || input.includes('build') || input.includes('develop')) {
      confidence += 30;
      reasons.push('Development workflow detected');
    }

    return {
      framework: 'TFCDC',
      confidence: Math.min(confidence, 100),
      applicable: confidence > 25,
      reason: reasons.join('; ')
    };
  }
}

import type { PromptParameters, TransformationStep, EnhancedPrompt, FrameworkDetection } from '../types/prompt';

export class PromptTransformer {
  static transformPrompt(
    originalInput: string,
    frameworks: FrameworkDetection[],
    parameters: PromptParameters,
    useCase: string
  ): EnhancedPrompt {
    const applicableFrameworks = frameworks.filter(f => f.applicable);
    const transformationSteps: TransformationStep[] = [];
    
    // Apply primary framework (highest confidence)
    const primaryFramework = applicableFrameworks[0];
    if (primaryFramework) {
      transformationSteps.push(this.applyPrimaryFramework(primaryFramework, originalInput, parameters));
    }

    // Apply secondary framework for enhancement
    const secondaryFramework = applicableFrameworks[1];
    if (secondaryFramework && secondaryFramework.confidence > 50) {
      transformationSteps.push(this.applySecondaryFramework(secondaryFramework, originalInput, parameters));
    }

    const finalPrompt = this.generateFinalPrompt(originalInput, transformationSteps, parameters, useCase);

    return {
      originalInput,
      detectedFrameworks: frameworks,
      transformationSteps,
      finalPrompt,
      parameters,
      useCase
    };
  }

  private static applyPrimaryFramework(
    framework: FrameworkDetection,
    input: string,
    parameters: PromptParameters
  ): TransformationStep {
    switch (framework.framework) {
      case 'TCREI':
        return this.applyTCREI(input, parameters);
      case 'RSTI':
        return this.applyRSTI(input, parameters);
      case 'TFCDC':
        return this.applyTFCDC(input, parameters);
      default:
        throw new Error(`Unknown framework: ${framework.framework}`);
    }
  }

  private static applySecondaryFramework(
    framework: FrameworkDetection,
    input: string,
    parameters: PromptParameters
  ): TransformationStep {
    // For secondary frameworks, apply micro-tuning or enhancement
    return this.applyRSTI(input, parameters, true);
  }

  private static applyTCREI(input: string, parameters: PromptParameters): TransformationStep {
    const task = this.extractTask(input, parameters);
    const context = this.generateContext(parameters);
    const resources = this.generateResources(input);
    const evaluation = this.generateEvaluation(parameters);

    return {
      framework: 'TCREI',
      title: 'TCREI Framework Applied',
      description: 'Structured approach for comprehensive task definition',
      components: {
        'Task': task,
        'Context': context,
        'Resources': resources,
        'Evaluate & Iterate': evaluation
      },
      status: 'complete'
    };
  }

  private static applyRSTI(input: string, parameters: PromptParameters, isSecondary = false): TransformationStep {
    const revisit = this.generateRevisit(input);
    const separate = this.generateSeparate(input, parameters);
    const tryDifferent = this.generateTryDifferent(parameters);
    const introduce = this.generateIntroduce(parameters);

    return {
      framework: 'RSTI',
      title: isSecondary ? 'RSTI Micro-Tuning' : 'RSTI Framework Applied',
      description: isSecondary ? 'Fine-tuning and constraint optimization' : 'Surgical refinements for precision',
      components: {
        'Revisit & Separate': `${revisit}\n\n${separate}`,
        'Try & Introduce Constraints': `${tryDifferent}\n\n${introduce}`
      },
      status: 'complete'
    };
  }

  private static applyTFCDC(input: string, parameters: PromptParameters): TransformationStep {
    const thinking = this.generateThinking(input);
    const frameworks = this.generateFrameworksChoice(input);
    const checkpoints = this.generateCheckpoints(parameters);
    const debugging = this.generateDebugging();
    const context = this.generateDocumentation();

    return {
      framework: 'TFCDC',
      title: 'TFCDC Engineering Workflow',
      description: 'Software engineering approach to problem-solving',
      components: {
        'Thinking': thinking,
        'Frameworks': frameworks,
        'Checkpoints': checkpoints,
        'Debugging': debugging,
        'Context': context
      },
      status: 'complete'
    };
  }

  private static extractTask(input: string, parameters: PromptParameters): string {
    const baseTask = input.replace(/^(help me|please|can you)/i, '').trim();
    return `${baseTask.charAt(0).toUpperCase() + baseTask.slice(1)} that is suitable for ${parameters.audienceLevel} audiences with a ${parameters.tone} tone.`;
  }

  private static generateContext(parameters: PromptParameters): string {
    return `Target audience: ${parameters.audienceLevel} level users. Tone: ${parameters.tone}. Format: ${parameters.outputFormat}. Length: approximately ${parameters.wordCount} words.`;
  }

  private static generateResources(input: string): string {
    if (input.toLowerCase().includes('blog') || input.toLowerCase().includes('article')) {
      return 'Include current trends, expert insights, and credible sources. Reference recent research and industry best practices.';
    } else if (input.toLowerCase().includes('technical') || input.toLowerCase().includes('code')) {
      return 'Reference official documentation, coding standards, and proven methodologies. Include practical examples.';
    } else if (input.toLowerCase().includes('marketing')) {
      return 'Incorporate market research, competitor analysis, and proven marketing principles. Use persuasive language patterns.';
    }
    return 'Gather relevant examples, expert opinions, and authoritative sources to support the content.';
  }

  private static generateEvaluation(parameters: PromptParameters): string {
    return `Review for clarity, ${parameters.tone} tone consistency, ${parameters.audienceLevel}-appropriate language, and ${parameters.outputFormat} structure compliance.`;
  }

  private static generateRevisit(input: string): string {
    return 'Applied proven content creation patterns and established successful prompt structures.';
  }

  private static generateSeparate(input: string, parameters: PromptParameters): string {
    const parts = Math.ceil(parameters.wordCount / 200);
    return `Breaking complex instructions into ${parts} clear, manageable sections with distinct objectives.`;
  }

  private static generateTryDifferent(parameters: PromptParameters): string {
    return `Optimized phrasing for ${parameters.tone} tone and ${parameters.outputFormat} structure to guide optimal AI response patterns.`;
  }

  private static generateIntroduce(parameters: PromptParameters): string {
    return `Added specific constraints: ${parameters.wordCount}-word target, ${parameters.audienceLevel} complexity level, ${parameters.outputFormat} formatting requirements.`;
  }

  private static generateThinking(input: string): string {
    return `Analyze the core requirements: ${input}. Consider the problem space, constraints, and success criteria before implementation.`;
  }

  private static generateFrameworksChoice(input: string): string {
    if (input.toLowerCase().includes('web') || input.toLowerCase().includes('frontend')) {
      return 'Selected React/TypeScript stack with component-based architecture for maintainable, scalable solutions.';
    }
    return 'Choose appropriate libraries, patterns, and architectural approaches that solve the specific problem efficiently.';
  }

  private static generateCheckpoints(parameters: PromptParameters): string {
    return `Implement validation points, logging mechanisms, and incremental testing to verify ${parameters.outputFormat} compliance and quality.`;
  }

  private static generateDebugging(): string {
    return 'Use systematic debugging approaches: isolate issues, trace execution paths, and validate assumptions at each step.';
  }

  private static generateDocumentation(): string {
    return 'Document design decisions, implementation rationale, and maintenance considerations for future reference.';
  }

  private static generateFinalPrompt(
    originalInput: string,
    steps: TransformationStep[],
    parameters: PromptParameters,
    useCase: string
  ): string {
    let prompt = '';

    // Add task definition
    const task = this.extractTask(originalInput, parameters);
    prompt += `**Task:** ${task}\n\n`;

    // Add context and constraints
    prompt += `**Context & Constraints:**\n`;
    prompt += `• Target audience: ${parameters.audienceLevel} level\n`;
    prompt += `• Tone: ${parameters.tone}\n`;
    prompt += `• Format: ${parameters.outputFormat}\n`;
    prompt += `• Length: Approximately ${parameters.wordCount} words\n\n`;

    // Add structure requirements based on format
    prompt += `**Structure Requirements:**\n`;
    if (parameters.outputFormat === 'article') {
      prompt += `1. Start with an engaging introduction\n`;
      prompt += `2. Develop 3-4 main points with clear subheadings\n`;
      prompt += `3. Include practical examples or actionable insights\n`;
      prompt += `4. Conclude with a compelling summary or call-to-action\n\n`;
    } else if (parameters.outputFormat === 'bullet-points') {
      prompt += `1. Begin with a brief overview\n`;
      prompt += `2. Present main points as clear, concise bullet points\n`;
      prompt += `3. Use sub-bullets for supporting details\n`;
      prompt += `4. Prioritize information by importance\n\n`;
    } else if (parameters.outputFormat === 'step-by-step') {
      prompt += `1. Provide a clear objective statement\n`;
      prompt += `2. Break down into numbered, sequential steps\n`;
      prompt += `3. Include prerequisites or required materials\n`;
      prompt += `4. Add tips or troubleshooting notes where relevant\n\n`;
    }

    // Add resources and research guidance
    prompt += `**Resources to Reference:**\n`;
    prompt += this.generateResources(originalInput) + '\n\n';

    // Add quality markers
    prompt += `**Quality Markers:** The final output should be informative yet accessible, encouraging readers to engage with the content while providing immediate value through actionable insights.`;

    return prompt;
  }
}

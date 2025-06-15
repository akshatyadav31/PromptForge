import { prompts, templates, type Prompt, type Template, type InsertPrompt, type InsertTemplate } from "@shared/schema";

export interface IStorage {
  getPrompts(): Promise<Prompt[]>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  getTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
}

export class MemStorage implements IStorage {
  private prompts: Map<number, Prompt>;
  private templates: Map<number, Template>;
  private currentPromptId: number;
  private currentTemplateId: number;

  constructor() {
    this.prompts = new Map();
    this.templates = new Map();
    this.currentPromptId = 1;
    this.currentTemplateId = 1;
    
    // Initialize with some default templates
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const defaultTemplates: Omit<Template, "id">[] = [
      {
        name: "Marketing Copy",
        category: "marketing",
        template: "Create compelling marketing copy for {product/service}",
        frameworks: ["TCREI", "RSTI"],
        description: "Generate persuasive marketing content with clear value propositions"
      },
      {
        name: "Technical Documentation",
        category: "technical",
        template: "Generate comprehensive documentation for {technical_feature}",
        frameworks: ["TFCDC", "TCREI"],
        description: "Create clear, structured technical documentation"
      },
      {
        name: "Creative Writing",
        category: "creative",
        template: "Write an engaging {content_type} about {topic}",
        frameworks: ["TCREI", "RSTI"],
        description: "Craft compelling creative content with narrative structure"
      },
      {
        name: "Data Analysis",
        category: "analysis",
        template: "Analyze {data_type} and provide actionable insights",
        frameworks: ["TCREI", "TFCDC"],
        description: "Generate structured analysis with clear conclusions"
      }
    ];

    defaultTemplates.forEach(template => {
      const id = this.currentTemplateId++;
      this.templates.set(id, { ...template, id });
    });
  }

  async getPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = this.currentPromptId++;
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      createdAt: new Date()
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      template => template.category === category
    );
  }
}

export const storage = new MemStorage();

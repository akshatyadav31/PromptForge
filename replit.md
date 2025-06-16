# PromptForge - AI-Powered Prompt Engineering Tool

## Overview

PromptForge is an intelligent prompt engineering tool that automatically applies proven frameworks (RSTI, TCREI, TFCDC) to transform simple inputs into sophisticated, effective prompts. The application combines Firebase for authentication and data storage with OpenRouter API for AI-powered prompt enhancement, built as a modern React SPA with TypeScript.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **Tailwind CSS** with shadcn/ui components for styling
- **Wouter** for client-side routing
- **TanStack Query** for state management and data fetching
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** configured for PostgreSQL (prepared for future database integration)
- RESTful API endpoints for prompts and templates
- In-memory storage implementation with interface for future database migration

### Authentication & Data Storage
- **Firebase Authentication** with Google OAuth provider
- **Firestore** for real-time data synchronization and storage
- User-specific prompt storage and analytics tracking
- Offline-capable data management

### AI Integration
- **OpenRouter API** integration supporting multiple AI models:
  - DeepSeek R1 (free tier)
  - GPT-4o
  - Claude 3.5
  - Gemini Pro
- Framework detection and prompt transformation algorithms
- Real-time prompt enhancement with detailed explanations

## Key Components

### Framework Detection Engine
- Automatic detection of appropriate prompt engineering frameworks
- Confidence scoring system for framework applicability
- Support for TCREI, RSTI, and TFCDC frameworks

### Prompt Transformation System
- Multi-step transformation pipeline
- Framework-specific enhancement strategies
- Parameter-driven customization (audience level, tone, format, word count)

### User Management
- Firebase-based authentication flow
- User profile management with Google OAuth
- Session persistence and redirect handling

### Analytics & Tracking
- Framework usage statistics
- User interaction tracking
- Performance metrics collection

### Template System
- Pre-built prompt templates by category
- User-customizable template library
- Community template sharing (prepared)

## Data Flow

1. **User Input**: User enters initial prompt and selects parameters
2. **Framework Detection**: System analyzes input to determine applicable frameworks
3. **AI Enhancement**: OpenRouter API processes prompt with selected model
4. **Transformation**: Multi-step enhancement applying detected frameworks
5. **Storage**: Enhanced prompts saved to Firestore with user association
6. **Analytics**: Usage statistics tracked for continuous improvement

## External Dependencies

### APIs
- **Firebase**: Authentication, Firestore database, real-time sync
- **OpenRouter**: AI model access for prompt enhancement

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Icons**: Additional icon sets

### Development Tools
- **Drizzle Kit**: Database schema management
- **ESBuild**: Production bundling
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- Replit-optimized development with live reloading
- Environment variable configuration for API keys
- Local development server on port 5000

### Production Deployment
- **GitHub Pages** for static hosting
- **Vite static build** configuration
- Environment variables via GitHub Secrets
- Firebase hosting compatibility (alternative)

### Build Process
- Client-side Vite build for static assets
- Server-side ESBuild for Express backend
- Separate static build configuration for GitHub Pages
- Asset optimization and code splitting

## Changelog
```
Changelog:
- June 16, 2025. Initial setup
- June 16, 2025. Migration from Replit Agent to standard Replit environment completed
  - Added Firebase authentication with Google OAuth
  - Implemented automatic prompt saving to Firestore
  - Added real-time community highlights feature
  - Configured OpenRouter API integration for AI-powered enhancements
  - Enhanced error handling for Firebase domain authorization
```

## User Preferences

Preferred communication style: Simple, everyday language.
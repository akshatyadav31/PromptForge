# PromptForge - AI-Powered Prompt Engineering Tool

An intelligent prompt engineering tool that automatically applies proven frameworks (RSTI, TCREI, TFCDC) to transform simple inputs into sophisticated, effective prompts.

## Features

- **Smart Framework Detection**: Automatically detects and applies appropriate prompt engineering frameworks
- **AI-Powered Enhancement**: Uses OpenRouter API with multiple AI models (DeepSeek R1, GPT-4o, Claude 3.5, Gemini Pro)
- **Real-time Transformation**: See your prompts enhanced in real-time with detailed explanations
- **Firebase Integration**: Save, sync, and manage your prompts across devices
- **Analytics Tracking**: Monitor framework usage and prompt effectiveness
- **Prompt Library**: Access community prompts and your personal collection

## Deployment to GitHub Pages

### Prerequisites

1. **Firebase Project Setup**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication with Google provider
   - Add your GitHub Pages domain to authorized domains in Authentication > Settings > Authorized domains
   - Note down your `projectId`, `apiKey`, and `appId` from Project Settings

2. **OpenRouter API Key**:
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Get your API key from the dashboard

### Setup Instructions

1. **Fork this repository** to your GitHub account

2. **Configure GitHub Secrets**:
   Go to your repository Settings > Secrets and variables > Actions, and add:
   - `VITE_FIREBASE_API_KEY`: Your Firebase API key
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase app ID
   - `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key

3. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: "GitHub Actions"
   - The deployment workflow will automatically run on pushes to main

4. **Update Firebase Authorized Domains**:
   Add your GitHub Pages domain (e.g., `yourusername.github.io`) to Firebase Authentication > Settings > Authorized domains

### Build Commands

For local development:
```bash
npm install
npm run dev
```

For static build (GitHub Pages):
```bash
npm install
npm run build
```

### Environment Variables

The app requires these environment variables:

- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID  
- `VITE_FIREBASE_APP_ID`: Firebase app ID
- `VITE_OPENROUTER_API_KEY`: OpenRouter API key for AI enhancement

### Architecture

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Firebase Auth with Google provider
- **Database**: Firestore for prompt storage and analytics
- **AI Enhancement**: OpenRouter API with multiple model options
- **Deployment**: Static site compatible with GitHub Pages

### Frameworks Supported

- **RSTI**: Sentence separation and constraint addition
- **TCREI**: Task, Context, Resources, Evaluation, Iteration
- **TFCDC**: Technical framework for development tasks

### AI Models Available

- DeepSeek R1 (Free)
- GPT-4o Mini & GPT-4o
- Claude 3.5 Sonnet & Claude 3 Haiku
- Gemini Pro
- Llama 3.1 8B

## License

MIT License - feel free to use and modify for your projects.
# Chatbot Playground

A simple React-based chatbot playground with Gemini AI integration. This application allows you to interact with Google's Gemini AI model using custom context and prompts.

## Features

- **Chat Interface**: Clean chat window displaying conversation history
- **Context Input**: Add context information to improve AI responses
- **Prompt Generation**: Automatically generates prompts with context placeholders
- **Real-time AI Responses**: Integrates with Google Gemini API
- **Clean Architecture**: Follows SOLID principles with proper separation of concerns

## Architecture

### Backend
- **Express.js** server with TypeScript
- **Services**: Separate services for prompt creation and chat management
- **API Abstraction**: Clean Gemini API client implementation
- **Routes**: RESTful API endpoints for chat operations

### Frontend
- **React** with TypeScript
- **Component-based**: Modular components for each UI section
- **State Management**: Local state management for chat history
- **Responsive Design**: Works on desktop and mobile devices

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env` file

## Development

### Run both frontend and backend:
```bash
pnpm run dev:both
```

### Run individually:
```bash
# Backend only (http://localhost:3001)
pnpm run dev:backend

# Frontend only (http://localhost:5173)
pnpm run dev:frontend
```

## Usage

1. Start the application with `pnpm run dev:both`
2. Open your browser to `http://localhost:5173`
3. Add context information in the "Chat Context" area
4. Type a message in the "Chat Input" area and click "Send"
5. The system will:
   - Generate a prompt using your context
   - Display the generated prompt in "Prompt Output"
   - Send the prompt and chat history to Gemini
   - Display the AI response in the chat window

## API Endpoints

- `POST /api/chat/create-prompt` - Creates a prompt with context
- `POST /api/chat/generate-response` - Generates AI response using chat history
- `GET /health` - Health check endpoint

## Building for Production

```bash
# Build both frontend and backend
pnpm run build

# Build individually
pnpm run build:backend
pnpm run build:frontend

# Start production server
pnpm start
```

## Testing

This project uses Vitest for testing. The following npm scripts are available:

- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage report

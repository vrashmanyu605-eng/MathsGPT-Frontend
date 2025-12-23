# MathsCare - AI Tutor Agent

MathsCare is an AI-powered mathematics tutor application built with React, Vite, TypeScript, and Tailwind CSS. It features a modern, premium UI inspired by next-gen AI interfaces.

## Features

- **Split Interface**:
  - **Left**: Input section for YouTube Video URLs or PDF Document uploads.
  - **Right**: Chat interface for asking questions about the content.
- **AI Analysis**: "Analyze" button simulating deep content understanding.
- **Math Rendering**: Full support for LaTeX/KaTeX math equations in chat.
- **Streaming Responses**: Simulates AI streaming text for a realistic experience.
- **Modern UI**: Glassmorphism, gradients, and micro-interactions.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Icons**: Lucide React
- **Markdown/Math**: react-markdown, remark-math, rehype-katex

## getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/components`: UI Components (Header, InputSection, ChatComponent, AnalyzeButton)
- `src/App.tsx`: Main application logic and layout
- `src/index.css`: Global styles and Tailwind configuration

## Customization

- **Colors**: Configured in `tailwind.config.js`.
- **API**: Currently uses mock data in `App.tsx`. Replace `handleAnalyze` and `handleSend` with real API calls.
# MathsGPT-Frontend

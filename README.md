
# Launchbelt Network Ops

A production-grade aerospace supply chain and engineering operations platform. Built with Next.js and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Environment Variables
The application uses the Gemini API for technical data package analysis. To enable these features, provide an API Key.

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Google Gemini API Key | Optional (Enabled fallback mock data) |

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: @google/genai

## Deployment
This repository is optimized for Vercel. Simply import the project and it will automatically configure the build settings.

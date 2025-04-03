# OpenAI Realtime Console

A Next.js application for interfacing with OpenAI's Realtime API.

## Features

- Real-time voice conversation with OpenAI models
- Event logging for all API interactions
- Tool integrations (weather, image generation)
- Rich presence mode configuration

## Getting Started

### Prerequisites

- Node.js 16.x or later
- An OpenAI API key with access to the Realtime API

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deploying to Vercel

This application is optimized for deployment on Vercel.

1. Push your code to a Git repository
2. Import the project in the Vercel dashboard
3. Set the OPENAI_API_KEY environment variable in the Vercel project settings
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

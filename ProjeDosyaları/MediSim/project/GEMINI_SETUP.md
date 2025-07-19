# Gemini AI Patient Simulation Setup Guide

This project uses Google Gemini AI to simulate patient interactions. Follow the steps below for setup.

## Getting API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" button
4. Generate a new API key
5. Save your API key in a secure location

## Setup

1. Edit the `.env` file:
```env
VITE_GEMINI_API_KEY=your-actual-api-key-here
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm run dev
```

## Usage

1. Select a case and start the simulation
2. Chat with the AI patient in English
3. The patient will behave realistically and only share symptoms they have
4. Different phases:
   - **History**: Patient background and symptoms
   - **Physical Exam**: Physical examination findings
   - **Labs**: Laboratory and imaging results  
   - **Diagnosis**: Submit your final diagnosis

## Features

- ✅ Realistic patient behavior
- ✅ English language support
- ✅ Case-based simulation
- ✅ Step-by-step evaluation
- ✅ Error handling and fallback

## Troubleshooting

- Ensure your API key is correct
- Check your internet connection
- Look for error messages in browser console
- Make sure `.env` file is in the correct location

## Security

- Never commit your API key
- `.env` file should be in `.gitignore`
- Use environment variables in production

@AGENTS.md

# Matchhook — AI Match Cut Generator

## Was ist das?
Multi-modaler AI Match Cut Video Generator. Input (Text, Bild oder Video) → AI Analyse → 10 Style-Previews → Match Cut Video Export.

## Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript 5.8 + Tailwind CSS 4.1
- **State**: Zustand 5.0
- **Animations**: GSAP (KEIN framer-motion!)
- **AI Analyse**: Google Gemini 2.5 Flash
- **AI Bildgen**: Gemini 3.1 Flash Image / Imagen 3
- **Video**: Remotion 4.0
- **Auth/DB**: Supabase
- **Payments**: Stripe

## Branding
- **Name**: Matchhook
- **Primary**: Violet #6C3CE0
- **Accent**: Cyan #00D4FF
- **Surface Dark**: #0A0A0F
- **Font Display**: Space Grotesk
- **Font Body**: DM Sans

## VERBOTEN
- KEIN framer-motion
- KEIN sed fuer File-Editing
- Keine Pakete aelter als 6 Monate

## Environment Variables
```
GOOGLE_GEMINI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

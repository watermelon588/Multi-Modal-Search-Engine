# PROJECT: Multimodal Semantic Search UI

## STACK
- Vite + React (JavaScript)
- Tailwind CSS
- Framer Motion
- React Router

## DESIGN PRINCIPLES
- Dark theme (pure black + subtle gradients)
- Minimal, premium UI
- Glassmorphism + blur
- Cinematic / space aesthetic
- Inspired by: Vercel, Linear, Apple, Awwwards

## CORE FEATURE
Single centered search box that supports:
- text input
- image upload
- audio upload
- video upload

## BEHAVIOR
- On submit → navigate to /search?q=<query>
- No backend logic
- Only frontend routing

## STRUCTURE
- components/
  - Navbar.jsx
  - SearchBar.jsx
  - Hero.jsx
- pages/
  - Home.jsx
  - Search.jsx

## ANIMATIONS
- Use Framer Motion
- Smooth fade + scale animations
- Subtle interactions only

## RULES
- Keep code clean and modular
- Avoid unnecessary libraries
- Focus on UI quality
- Use Tailwind only for styling
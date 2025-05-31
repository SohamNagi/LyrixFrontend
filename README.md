# Lyrix Frontend

A modern React application for browsing and analyzing multilingual lyrics, built with shadcn/ui components and React Router.

## Features

- **Modern UI**: Built with shadcn/ui components for a clean, accessible interface
- **Responsive Design**: Fully responsive layout with sidebar navigation
- **Multilingual Support**: View lyrics in English, Hindi, and Urdu
- **Interactive Analysis**: Click on any line to get detailed analysis, translation, and interpretation
- **Author & Song Browse**: Browse songs by author or view all songs
- **Real-time Backend Integration**: Connects to Spring Boot backend API

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **shadcn/ui** components built on Radix UI
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## API Configuration

The application automatically switches between development and production API endpoints:

- **Development**: `http://localhost:8080/api` (requires local backend)
- **Production**: `https://lyrixbackend.onrender.com/api`

## Migration Notes

This frontend was migrated from DaisyUI to shadcn/ui components while maintaining React Router for navigation. Key changes include:

1. **Component Library**: Replaced DaisyUI with shadcn/ui for better TypeScript support and customization
2. **Layout System**: Changed from Navbar/Footer to Sidebar/Header layout
3. **Design System**: Implemented consistent theming with CSS custom properties
4. **API Integration**: Centralized API configuration for easy environment switching
5. **Build System**: Updated to use Vite with proper TypeScript configuration


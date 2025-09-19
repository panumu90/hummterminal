# Overview

This is a web application that showcases successful AI customer service implementations (case studies) in Finnish. The application presents six real-world examples of companies that have successfully implemented AI-powered customer service solutions, along with an interactive chat interface powered by OpenAI's GPT-5 model. Users can explore detailed case studies from companies like Alibaba, Autodesk, Swedbank, Verkkokauppa.com, Nordea, and Fonecta, and ask questions about implementation details, costs, and technical specifics through the chat interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite for build tooling and development
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with CSS custom properties for theming, including dark mode support

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for case data retrieval and chat functionality
- **Development**: Hot module replacement via Vite integration in development mode
- **Build**: esbuild for production server bundling

## Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM
- **ORM**: Drizzle with Zod schema validation for type safety
- **Connection**: Neon Database serverless PostgreSQL (based on @neondatabase/serverless dependency)
- **Schema**: Two main entities - cases (AI implementation examples) and chat_messages (conversation history)
- **Development Storage**: In-memory storage implementation for development/demo purposes

## Authentication and Authorization
- No authentication system implemented - this is a public showcase application
- Session handling infrastructure present (connect-pg-simple) but not actively used
- API endpoints are publicly accessible

## External Dependencies

### Third-party Services
- **OpenAI API**: GPT-5 model integration for the chat interface functionality
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Replit**: Development environment integration with custom Vite plugins for error handling and cartographer

### UI/UX Libraries
- **Radix UI**: Comprehensive primitive component library for accessible UI components
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel/slider functionality
- **React Hook Form**: Form state management with @hookform/resolvers for validation

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **PostCSS**: CSS processing with Autoprefixer
- **date-fns**: Date manipulation utilities
- **class-variance-authority**: Type-safe CSS class variants
- **clsx & tailwind-merge**: Conditional CSS class composition
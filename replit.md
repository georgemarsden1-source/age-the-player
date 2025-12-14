# Pitch Perfect: Football Quiz

## Overview

A web-based quiz game where players test their knowledge of professional footballers' ages. Users guess the ages of famous football players in a timed, multi-round format, earn points based on accuracy, and compete on a global leaderboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing (3 routes: home, game, results)
- **State Management**: Zustand for global game state (player name, scores, current round, game status)
- **Data Fetching**: TanStack React Query for server state management
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and UI feedback

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for game operations
  - `GET /api/players/random` - Fetch random players for a game session
  - `POST /api/scores` - Submit a completed game score
  - `GET /api/scores/leaderboard` - Retrieve top scores
- **Development Mode**: Vite middleware integration for hot module replacement

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Three tables defined in `shared/schema.ts`
  - `users` - User accounts (id, username, password)
  - `players` - Football player data (name, birth date, age, nationality, team, position, rating)
  - `scores` - Game results (player name, total score, timestamp)
- **Migrations**: Drizzle Kit for database schema management (`db:push` command)

### Game Logic
- **Scoring System**: Points based on age guess accuracy (calculated in frontend store)
- **Round Structure**: 10 rounds per game, each featuring a different player
- **Player Data**: Seeded from FIFA player CSV data, filtered to top-rated players (80+ rating)

### Build System
- **Client Build**: Vite outputs to `dist/public`
- **Server Build**: esbuild bundles server code to `dist/index.cjs`
- **Production**: Single Node.js process serves both API and static files

## External Dependencies

### Database
- PostgreSQL database (connection via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe database operations
- `connect-pg-simple` for session storage (available but not currently used)

### UI Libraries
- Radix UI primitives for accessible components
- Lucide React for icons
- Embla Carousel for carousel functionality
- Sonner for toast notifications

### Data Processing
- `csv-parse` for parsing player data from CSV files
- `date-fns` for date manipulation and age calculations
- `zod` with `drizzle-zod` for schema validation

### Development Tools
- Replit-specific plugins for development experience (cartographer, dev banner, runtime error overlay)
- Custom Vite plugin for OpenGraph meta image handling
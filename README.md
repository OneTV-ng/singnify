# Singnify

A music discovery and streaming application built with Next.js, featuring intelligent caching systems and SearchContext integration.

## Features

- 🎵 Music discovery and browsing
- 🔍 Advanced search with no-token support
- 💾 Smart caching system with hash-based change detection
- 📑 Discovery index caching for multiple content types
- 🎨 Dark mode support
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 15.5.10
- **Language**: TypeScript / JavaScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: React Context (SearchContext, PlayerContext)

## Project Structure

```
app/
├── components/        # React components
├── context/          # React contexts (Search, Player, Theme)
├── lib/              # Utilities and types
├── (Main)/           # Main application pages
└── api/              # API routes

services/
├── singnifyApi.service.ts        # API client
├── singnifyApi.actions.ts        # Server actions
├── discoverCache.service.ts      # Single discover caching
└── discoverIndexCache.service.ts # Multi-type discover caching
```

## Key Systems

### SearchContext
Global search state management allowing search across the application.

### Discover Caching
- **Single Cache**: Caches full discover response (24hr TTL)
- **Index Cache**: Caches and organizes discover data by types

### Smart Caching Features
- Hash-based change detection
- Automatic 24-hour updates
- Fallback mechanisms
- Background data fetching

## Getting Started

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the development server
npm run dev
```

## Server Actions

### Search
- `searchContentAction(query, token?)` - Search with optional token
- `searchContentActionNoToken(query)` - Unauthenticated search

### Discover
- `fetchDiscoveryCachedAction(token?)` - Cached full discover
- `fetchDiscoveryCachedActionNoToken()` - Cached discover without auth
- `fetchDiscoveryCachedIndexAction(token?)` - Indexed discover with token
- `fetchDiscoveryCachedIndexActionNoToken()` - Indexed discover no token
- `getDiscoverTypeCachedAction(type)` - Get specific type from cache
- `getDiscoverAvailableTypesAction()` - List available cached types
- `getDiscoverIndexStatsAction()` - Cache statistics

## Caching Architecture

### Single Discover Cache
```
.cache/
├── discover-cache.json       # Full response
└── discover-cache-meta.json  # Metadata
```

### Index Cache
```
.cache/
├── discover-index-cache.json      # Indexed by type
└── discover-index-meta.json       # Metadata
```

## API Integration

The application integrates with the Singnify API:
- Base URL: https://singnify.com
- Authentication: Token-based (optional)

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://singnify.com
NEXTAUTH_SECRET=your_secret_here
```

## Development Notes

- All API calls are server-side to avoid CORS issues
- Caching reduces server load by ~90% compared to direct API calls
- Search works with and without authentication tokens

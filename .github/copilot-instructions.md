# Open European Book - AI Coding Agent Instructions

## Project Overview
A Next.js 15 application for searching and requesting European library books through the Finna API. The app features a single-page search interface that queries Finnish library collections and displays book results with cover images.

## Tech Stack & Key Dependencies
- **Next.js 15** with App Router and Turbopack for dev/build
- **React 19** with TypeScript strict mode
- **Tailwind CSS v4** with custom design tokens
- **ESLint** with Next.js config and flat config format
- **Finna API** integration for Finnish library search

## Project Structure & Conventions

### Development Commands
```bash
npm run dev    # Start with Turbopack (--turbopack flag)
npm run build  # Build with Turbopack
npm run lint   # ESLint check
```

### API Architecture
- **Route:** `/api/search` - GET endpoint for book search
- **External API:** Finna API (`https://api.finna.fi/api/v1/search`)
- **Image Service:** Finna Cover API for book thumbnails
- **Error Handling:** Structured error responses with appropriate HTTP codes

### Type Patterns
Define clean interfaces for API responses:
```typescript
type SearchResult = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  imageId: string | null;
  library: string | null;
  isbn: string | null;
};
```

### Data Normalization
The Finna API returns complex localized objects. Use helper functions to extract simple strings:
```typescript
const getString = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (hasStringValue(v)) return v.value;
  return "";
};
```

### Styling Conventions
- Use Tailwind utility classes with responsive breakpoints
- Custom CSS variables in `globals.css` for theme colors
- Mobile-first responsive design with `max-[400px]:` breakpoints
- Dark mode support with `dark:` variants
- Centered layout: 100% width on mobile, 630px on desktop

### Client-Side Patterns
- All interactive components use `"use client"` directive
- State management with React hooks (useState for forms/loading)
- Form handling with preventDefault and proper validation
- Loading states and error boundaries for API calls

### Image Handling
- Next.js Image component for optimization
- Finna Cover API with dynamic URL parameters
- Fallback placeholder divs for missing images
- Fixed aspect ratios (64x96px thumbnails)

## Critical Integration Points

### Finna API Configuration
- **Search filters:** Format restricted to `0/Book/` for books only
- **Required fields:** Use `field[]` params to limit response size
- **Caching:** Disabled with `cache: "no-store"` for fresh results
- **Rate limiting:** Consider implementing if scaling

### Next.js Image Optimization
Remote image domains must be configured in `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "api.finna.fi",
    },
  ],
}
```

## Development Workflows

### Adding New Features
1. Create TypeScript interfaces first
2. Implement API route in `/api` directory
3. Add client-side state management
4. Style with Tailwind utilities
5. Test responsive behavior

### API Route Development
- Use Next.js 15 App Router conventions (`route.ts`)
- Handle URL search params with `NextRequest`
- Return proper JSON responses with status codes
- Log API calls for debugging

### Styling Guidelines
- Use semantic color tokens: `bg-foreground`, `text-background`
- Implement dark mode variants consistently
- Follow mobile-first responsive patterns
- Maintain consistent spacing with Tailwind scale

## Known Limitations & Considerations
- Finna API responses include complex localized objects requiring normalization
- No authentication system currently implemented
- "Request to scan" button is placeholder functionality
- Search limited to Finnish library collections
- No pagination implemented (20 result limit)
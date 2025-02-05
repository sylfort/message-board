# Technical Context

## Technologies Used
- **Supabase**: PostgreSQL database with realtime capabilities
- **TypeScript**: Strongly typed JavaScript
- **Next.js**: React framework for server-side rendering

## Development Setup
- **Database Client**: @supabase/supabase-js
- **Environment Variables**:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Script Execution**:
  - ts-node for running TypeScript scripts
  - ES module configuration required for imports

## Database Implementation
- **Schema**: Defined in lib/database.types.ts
- **Client**: Initialized in lib/supabaseClient.ts
- **Types**: User, ChatMessage, JobPost, LinkPreview

## Technical Constraints
- Must follow repository pattern for data access
- Error handling must follow project standards
- All database changes require ADR documentation
- Scripts must use ES module syntax for imports

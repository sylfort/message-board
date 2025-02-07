# System Architecture Patterns

## Database Implementation
- **Supabase Integration**
  - Client initialized in `lib/supabaseClient.ts`
  - Uses environment variables for configuration
  - Exports client instance and types

- **Database Schema**
  - Defined in `lib/database.types.ts`
  - Core tables:
    - User: Profile information
    - ChatMessage: Messages in chat rooms
    - JobPost: Job listings
    - LinkPreview: Metadata for shared links
  - Schema verification process:
    - Temporary script in `tmp/verifySchema.ts`
    - Uses ES module imports
    - Validates table structure and relationships
  - **Schema verified against Supabase database on 2025-02-07. No discrepancies found.**

- **Data Access**
  - Repository pattern implementation in progress
  - Error handling following project standards

## Next Steps
1. Resolve ES module import issues in verification script (Completed - no issues)
2. Complete repository pattern implementation
3. Add integration tests for database operations
4. Document schema changes in ADR if needed

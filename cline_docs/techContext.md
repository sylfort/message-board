# Technical Context

## Message Board Architecture

### Server Actions
- Added server actions for handling message operations
- `fetchMessages()`: Fetches messages from Supabase
- `postMessage(content: string)`: Posts new message to Supabase

### Database Integration
## Technical Constraints
- Must follow repository pattern for data access
- Error handling must follow project standards
- All database changes require ADR documentation
- Scripts must use ES module syntax for imports

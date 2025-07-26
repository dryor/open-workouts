# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Philosophy

This project follows the **Philosophy of Software Design** principles. All code contributions must adhere to these guidelines:

### Core Principles

1. **Complexity is the Enemy**
   - The greatest limitation in writing software is our ability to understand systems we create
   - Always choose the design that minimizes complexity
   - Two types of complexity: dependencies and obscurity

2. **Working Code Isn't Enough**
   - Strategic programming: invest time to produce clean designs
   - Tactical programming leads to tactical tornadoes (messy, hard-to-maintain code)
   - Always consider long-term maintainability over short-term convenience

3. **Modules Should Be Deep**
   - Best modules provide powerful functionality with simple interfaces
   - Shallow modules (simple interface, simple implementation) don't provide much value
   - Deep modules hide complexity behind clean, simple interfaces

4. **Interfaces Should Be Simple and General**
   - General-purpose interfaces are usually simpler than special-purpose ones
   - Avoid interfaces that force users to be aware of internal implementation details
   - Design interfaces that are intuitive and easy to use correctly

5. **Information Hiding and Leakage**
   - Each module should encapsulate knowledge that other modules don't need
   - Information leakage occurs when design decisions are reflected in multiple modules
   - Avoid temporal decomposition (splitting based on order of execution rather than information hiding)

6. **Different Layer, Different Abstraction**
   - Adjacent layers should provide different abstractions
   - Pass-through methods/variables indicate design problems
   - Each layer should add significant functionality

### Comments (Critical for This Project)

**Comments should be strategic, not overwhelming. Focus on clarity over quantity:**

1. **When TO Comment**
   - Complex business logic or algorithms
   - Non-obvious design decisions and trade-offs
   - Public APIs and interfaces (required)
   - Tricky code segments that aren't self-explanatory
   - Cross-module dependencies and interactions
   - Security-critical code sections

2. **When NOT TO Comment**
   - Self-explanatory function names and obvious code
   - Simple getters, setters, and basic operations
   - Code that clearly expresses its intent
   - Repetitive patterns that are obvious from context
   - Every variable assignment or simple statements
   - Constructor parameter assignments to properties

3. **Interface Comments (Required for Public APIs Only)**
   - Public methods/functions must have JSDoc comments describing:
     - What the method does (high-level behavior)
     - Parameters and return values
     - Side effects and exceptions
     - Preconditions and postconditions
   - Private/internal functions: only comment if logic is complex

4. **Implementation Comments (Selective)**
   - Explain WHY, not WHAT
   - Document non-obvious design decisions
   - Clarify complex algorithms or business logic
   - Break up long methods into logical sections
   - Avoid commenting every line or obvious operations

5. **Cross-Module Comments**
   - Document dependencies between modules
   - Explain how different parts of the system work together
   - Clarify design patterns and architectural decisions

**Comment Examples:**
```typescript
/**
 * Authenticates user credentials against Supabase and establishes session.
 * 
 * This method handles the complete login flow including credential validation,
 * session creation, and error handling for various failure scenarios.
 * 
 * @param credentials - User email and password
 * @returns Promise resolving to authenticated user session
 * @throws AuthError when credentials are invalid or user is unverified
 * @throws NetworkError when Supabase service is unavailable
 */
async function authenticateUser(credentials: LoginCredentials): Promise<UserSession>

// Calculate workout intensity based on heart rate zones and duration
// Uses Karvonen formula: Target HR = ((max HR - resting HR) × intensity) + resting HR
const intensity = calculateWorkoutIntensity(heartRate, duration, userProfile);
```

### Error Handling Philosophy

1. **Define Errors Out of Existence**
   - Design APIs to make errors impossible rather than detecting them
   - Use type systems to prevent invalid states
   - Prefer functions that can't fail over those that handle failures

2. **Exception Aggregation**
   - Handle exceptions at the highest level possible
   - Don't scatter exception handling throughout the code
   - Create centralized error handling mechanisms

### Design Process

1. **Start with Interface Design**
   - Design the interface before implementation
   - Write comments for the interface first
   - Consider multiple approaches before choosing one

2. **Incremental Development**
   - Build systems incrementally with frequent integration
   - Start simple and add complexity gradually
   - Refactor continuously to maintain clean design

3. **Code Review Focus**
   - Review for complexity reduction opportunities
   - Ensure proper commenting and documentation
   - Verify interfaces are simple and general

## Research and Documentation Guidelines

**When working with SDKs, libraries, or external services, always research official documentation:**

### Mandatory Research Scenarios

1. **Before Using Any SDK/Library**
   - Always check the official documentation for the latest version
   - Verify installation instructions and setup procedures
   - Review breaking changes in recent versions
   - Check for deprecated methods or patterns

2. **When Implementing New Features**
   - Research best practices from official documentation
   - Look for official examples and code samples
   - Check for recommended patterns and architectural approaches
   - Verify security considerations and guidelines

3. **When Encountering Errors or Issues**
   - Consult official troubleshooting guides first
   - Check known issues and limitations in documentation
   - Review migration guides if upgrading versions
   - Look for official community forums or GitHub issues

### Research Process

1. **Primary Sources (Always Check First)**
   - Official documentation websites
   - Official GitHub repositories
   - Official API references
   - Official getting started guides

2. **Version Verification**
   - Always use WebSearch to find the latest stable version
   - Check for LTS (Long Term Support) versions when available
   - Verify compatibility with existing project dependencies
   - Review changelog for recent updates

3. **Implementation Research**
   - Use WebFetch to read official documentation pages
   - Search for official code examples and tutorials
   - Check official SDK/library installation guides
   - Review official best practices and recommendations

### Examples of When to Research

- **Installing Supabase SDK**: Check latest version, installation method, and setup guide
- **Implementing shadcn/ui components**: Verify latest component API and installation
- **Setting up Next.js middleware**: Review official middleware documentation and examples
- **Configuring TypeScript**: Check latest TypeScript version and recommended config
- **Adding new dependencies**: Research official documentation before adding to package.json

### Documentation Standards

- Always reference the official documentation URL in comments when implementing SDK features
- Include version numbers in comments when using specific API features
- Document any deviations from official recommendations with explanations
- Keep track of which official guides were followed for future reference

## Project Overview

Open Workouts is an open source workout tracking web app focused on simplicity and progress visualization. The project uses a monorepo structure with pnpm workspaces.

## Architecture

This is a monorepo with the following structure:
- `apps/web-app/` - Next.js 15 web application with React 19, TypeScript, and Tailwind CSS v4
- `shared/` - Shared packages and utilities (currently empty)

The web app uses:
- **Framework**: Next.js 15 with App Router and Turbopack for development
- **UI**: React 19 with TypeScript and Tailwind CSS v4
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Linting**: ESLint with Next.js configuration

## Development Commands

From the root directory:
```bash
# Install dependencies
pnpm install

# Start development server (all apps)
pnpm dev

# Build all packages
pnpm build
```

From the web-app directory (`apps/web-app/`):
```bash
# Start Next.js development server with Turbopack
pnpm dev

# Build the Next.js application
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## Planned Features

Based on the documentation in `apps/web-app/docs/user-authentication-module.md`, the project is planning to implement:

- **User Authentication**: Using Supabase Auth with email/password registration, email verification, and password reset
- **Database**: Supabase PostgreSQL for user data storage
- **UI Components**: shadcn/ui components with React Hook Form and Zod validation
- **Route Protection**: Next.js middleware for server-side route protection
- **Design**: Dark mode by default with responsive mobile design

The authentication module follows interface-based design principles with Supabase as the implementation layer.

## Key Files

- `apps/web-app/src/app/layout.tsx` - Root layout with font configuration
- `apps/web-app/src/app/page.tsx` - Default Next.js homepage
- `apps/web-app/eslint.config.mjs` - ESLint configuration using FlatCompat
- `pnpm-workspace.yaml` - Workspace configuration for monorepo structure
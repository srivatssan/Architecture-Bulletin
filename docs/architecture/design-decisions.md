# Architecture Design Decisions (ADR)

**Project:** Architecture-Bulletin
**Version:** 1.0
**Date:** 2025-11-18

---

## ADR-001: Use GitHub as Backend Storage

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The application needs to store bulletin posts, attachments, artifacts, conversations, and configuration data. Traditional options include setting up a database server (PostgreSQL, MongoDB) and backend API, or using a Backend-as-a-Service (Firebase, Supabase).

**Decision:**

Use GitHub repository as the backend storage layer, storing all data as JSON files and attachments as binary files in a structured directory hierarchy.

**Rationale:**

1. **Zero Infrastructure Cost**: GitHub provides free private repositories with sufficient storage
2. **Built-in Version Control**: Every change is a Git commit with full audit trail
3. **No Server Management**: Eliminates need for database servers, maintenance, backups
4. **Authentication Included**: GitHub OAuth provides secure authentication
5. **Team Familiarity**: Development team already uses GitHub daily
6. **API Access**: GitHub REST API (via Octokit) provides programmatic access
7. **Simplicity**: Single repository to manage, no separate database to configure

**Consequences:**

- **Positive**:
  - Complete audit trail via Git history
  - Zero infrastructure costs
  - Simple deployment (static site only)
  - Automatic backups via Git
  - Can rollback to any previous state

- **Negative**:
  - Limited to GitHub API rate limits (5000 req/hour authenticated)
  - No complex queries (must fetch and filter client-side)
  - File size limits (10MB per file via API, can use LFS for larger)
  - Latency higher than traditional database (API round-trip)
  - Scalability constraints (designed for small teams)

**Alternatives Considered:**

1. **PostgreSQL + Express API**: More scalable but requires server hosting (~$20/mo), maintenance
2. **Firebase**: Easy to use but paid tier required, vendor lock-in
3. **Supabase**: Similar to Firebase but open-source, still requires separate backend

---

## ADR-002: Deploy as Static Site on GitHub Pages

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The application needs to be deployed and accessible to users. Options include traditional web servers, cloud platforms (AWS/Azure/GCP), serverless platforms (Vercel/Netlify), or static hosting (GitHub Pages).

**Decision:**

Deploy as a static React application on GitHub Pages using Vite build tool.

**Rationale:**

1. **Zero Hosting Cost**: GitHub Pages is free for public repos
2. **Global CDN**: Automatic CDN distribution for fast load times
3. **HTTPS Enforced**: Automatic SSL certificates
4. **Simple CI/CD**: GitHub Actions can build and deploy automatically
5. **Aligns with Stack**: Since using GitHub for backend, keeps everything in GitHub ecosystem
6. **No Server to Maintain**: Static assets only, no server-side code

**Consequences:**

- **Positive**:
  - Zero hosting costs
  - Automatic HTTPS and CDN
  - Simple deployment workflow
  - High availability (GitHub's infrastructure)
  - Fast page loads (static assets)

- **Negative**:
  - No server-side logic (all logic in browser)
  - API tokens stored client-side (sessionStorage/localStorage)
  - Cannot use traditional backend patterns
  - Limited to static content + client-side JavaScript

**Alternatives Considered:**

1. **Vercel/Netlify**: Similar static hosting but adds another service dependency
2. **AWS S3 + CloudFront**: More complex setup, requires AWS account
3. **Traditional Web Server**: Expensive, overkill for static content

---

## ADR-003: Use Context API for State Management

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The React application needs global state management for user authentication, posts data, notifications, and configuration. Options include Redux, MobX, Zustand, Recoil, or React's built-in Context API.

**Decision:**

Use React Context API with hooks for global state management.

**Rationale:**

1. **Built-in Solution**: No external dependencies
2. **Sufficient for Scale**: Application has limited complexity (5 users, 50 posts)
3. **Simple Learning Curve**: Team already familiar with React hooks
4. **Lightweight**: No boilerplate compared to Redux
5. **TypeScript-Friendly**: Works well with JavaScript
6. **Performance**: Sufficient for small-scale application

**Consequences:**

- **Positive**:
  - No additional dependencies
  - Simple to understand and maintain
  - Fast development
  - Built-in React patterns

- **Negative**:
  - Less structured than Redux (no actions/reducers convention)
  - Can cause unnecessary re-renders if not optimized
  - No built-in DevTools (unlike Redux)
  - May need refactoring if app grows significantly

**Alternatives Considered:**

1. **Redux Toolkit**: More structured but adds complexity and learning curve
2. **Zustand**: Simpler than Redux but external dependency
3. **Recoil**: Atomic state management but overkill for this scale
4. **MobX**: Reactive but different mental model

---

## ADR-004: Use JavaScript Instead of TypeScript

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The project needs to choose between JavaScript and TypeScript for development.

**Decision:**

Use JavaScript (ES2020+) with JSDoc comments for type hints.

**Rationale:**

1. **Faster MVP Development**: No type definitions to write
2. **Lower Learning Curve**: JavaScript more accessible to contributors
3. **Smaller Bundle**: No TypeScript compilation overhead
4. **Simpler Setup**: Less tooling configuration
5. **Can Migrate Later**: Easy to migrate to TypeScript if needed

**Consequences:**

- **Positive**:
  - Faster initial development
  - Simpler tooling
  - Easier onboarding for new developers
  - Smaller build artifacts

- **Negative**:
  - No compile-time type checking
  - More prone to runtime errors
  - Less IDE assistance (though JSDoc helps)
  - May need migration if project grows

**Alternatives Considered:**

1. **TypeScript**: Better type safety but slower development for MVP

---

## ADR-005: Use Tailwind CSS for Styling

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The application needs a styling solution. Options include traditional CSS, CSS modules, CSS-in-JS (styled-components, Emotion), or utility-first frameworks (Tailwind CSS).

**Decision:**

Use Tailwind CSS for all styling.

**Rationale:**

1. **Rapid Development**: Utility classes enable fast UI development
2. **Consistency**: Design tokens built-in (colors, spacing, typography)
3. **No CSS Naming**: Avoid naming conventions (BEM, etc.)
4. **Responsive**: Built-in responsive utilities
5. **Small Bundle**: PurgeCSS removes unused styles
6. **Popular**: Large community, extensive documentation

**Consequences:**

- **Positive**:
  - Fast UI development
  - Consistent design system
  - Smaller CSS bundle (after purge)
  - Great documentation and examples

- **Negative**:
  - Utility classes can make JSX verbose
  - Learning curve for utility-first approach
  - Requires build step (PostCSS)

**Alternatives Considered:**

1. **CSS Modules**: More traditional but requires naming conventions
2. **styled-components**: Great for component styling but adds runtime overhead
3. **Plain CSS**: Simple but harder to maintain consistency

---

## ADR-006: Use Vite Instead of Create React App

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The project needs a build tool for React development. Traditional choice is Create React App (CRA), but newer tools like Vite have emerged.

**Decision:**

Use Vite as the build tool and development server.

**Rationale:**

1. **Faster Dev Server**: Vite uses native ES modules (instant HMR)
2. **Faster Builds**: Optimized production builds with Rollup
3. **Modern**: Designed for modern browsers and frameworks
4. **Better DX**: Faster feedback loop during development
5. **CRA Maintenance**: CRA is in maintenance mode
6. **Smaller Config**: Less configuration needed

**Consequences:**

- **Positive**:
  - Sub-second dev server startup
  - Instant Hot Module Replacement (HMR)
  - Faster builds
  - Better developer experience

- **Negative**:
  - Newer tool (less mature than CRA)
  - Different configuration patterns

**Alternatives Considered:**

1. **Create React App**: More mature but slower, maintenance mode
2. **Next.js**: Overkill for static site, adds SSR complexity
3. **Parcel**: Simple but less popular than Vite

---

## ADR-007: Use GitHub OAuth Only (No Email/Password)

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The application needs user authentication. Options include traditional email/password, social OAuth (GitHub, Google, etc.), or hybrid approach.

**Decision:**

Use GitHub OAuth as the only authentication method.

**Rationale:**

1. **Aligned with Backend**: Since using GitHub as backend, OAuth is natural fit
2. **No Password Management**: GitHub handles all password security
3. **No User Database**: No need to store user credentials
4. **Team Already Has GitHub**: All target users already have GitHub accounts
5. **Simpler Implementation**: OAuth flow easier than building auth system

**Consequences:**

- **Positive**:
  - No passwords to manage or secure
  - No user registration flow needed
  - Leverages existing GitHub accounts
  - GitHub handles 2FA, security

- **Negative**:
  - Requires GitHub account (not an issue for target users)
  - Vendor dependency on GitHub
  - Cannot support users without GitHub accounts

**Alternatives Considered:**

1. **Email/Password**: Requires password hashing, storage, reset flows
2. **Multiple OAuth Providers**: Adds complexity, not needed for target users

---

## ADR-008: Store Files as Base64 in GitHub (with 10MB Limit)

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The application needs to handle file attachments and artifacts. GitHub API supports creating/updating files via base64 encoding.

**Decision:**

Store files as base64-encoded content via GitHub API, with client-side enforcement of 10MB per file limit.

**Rationale:**

1. **GitHub API Pattern**: Standard way to upload files via API
2. **No Separate Storage**: Everything in single repository
3. **Version Controlled**: Files tracked in Git history
4. **Simple Implementation**: Straightforward base64 encode/decode

**Consequences:**

- **Positive**:
  - All data in one repository
  - Version control for files
  - Simple implementation
  - No separate file storage service

- **Negative**:
  - 10MB limit per file (GitHub API limitation without LFS)
  - Base64 encoding increases file size by ~33%
  - Large files slow down Git operations

**Mitigations:**

- Enforce 10MB limit on frontend
- For larger files, could implement Git LFS in future
- Recommend compressing files before upload

**Alternatives Considered:**

1. **Git LFS**: Handles large files but requires additional setup
2. **Separate Object Storage**: (S3, etc.) adds external dependency and costs

---

## ADR-009: Implement Role-Based Access Control (RBAC)

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The application has two user types with different permissions: admins and architects. Need to control access to features and data.

**Decision:**

Implement Role-Based Access Control (RBAC) with roles defined in `config/settings.json`.

**Rationale:**

1. **Clear Separation**: Admins and architects have distinct responsibilities
2. **Centralized Configuration**: Roles managed in config file
3. **Simple Implementation**: Check role before rendering UI or allowing actions
4. **Extensible**: Easy to add more roles in future if needed

**Consequences:**

- **Positive**:
  - Clear permission model
  - Easy to audit who can do what
  - Simple implementation in UI (conditional rendering)
  - Configuration-driven (no code changes to add users)

- **Negative**:
  - Role list in GitHub repo (visible to all users)
  - Client-side enforcement only (no server to validate)
  - Users could bypass UI checks by manipulating browser

**Mitigations:**

- GitHub repository permissions provide server-side access control
- UI checks prevent accidental misuse
- Git commit history provides audit trail

**Alternatives Considered:**

1. **Attribute-Based Access Control (ABAC)**: Too complex for current needs
2. **No Access Control**: All users have same permissions (not acceptable)

---

## ADR-010: Use Octokit for GitHub API Integration

**Date:** 2025-11-18
**Status:** Accepted

**Context:**

The application needs to interact with GitHub API for all data operations. Options include using raw fetch/axios calls or using a GitHub-specific library.

**Decision:**

Use Octokit.js (@octokit/rest) for all GitHub API interactions.

**Rationale:**

1. **Official Library**: Maintained by GitHub
2. **Type-Safe**: Provides TypeScript definitions (helps even in JS)
3. **Handles Auth**: Built-in token authentication
4. **Rate Limit Handling**: Automatic rate limit detection
5. **Retry Logic**: Built-in retry for transient failures
6. **Well-Documented**: Extensive documentation and examples

**Consequences:**

- **Positive**:
  - Simplified API calls
  - Better error handling
  - Automatic rate limit management
  - Type hints in IDE

- **Negative**:
  - External dependency (~100KB)
  - Adds abstraction layer over API

**Alternatives Considered:**

1. **Raw Fetch API**: More control but more boilerplate
2. **Axios**: General HTTP client but lacks GitHub-specific features

---

## Summary of Key Decisions

| ADR | Decision | Impact |
|-----|----------|--------|
| ADR-001 | GitHub as Backend | Defines entire data architecture |
| ADR-002 | GitHub Pages Hosting | Zero-cost, simple deployment |
| ADR-003 | Context API | State management approach |
| ADR-004 | JavaScript over TypeScript | Development speed vs. type safety |
| ADR-005 | Tailwind CSS | Styling methodology |
| ADR-006 | Vite Build Tool | Development experience |
| ADR-007 | GitHub OAuth Only | Authentication strategy |
| ADR-008 | Base64 File Storage | File handling approach |
| ADR-009 | RBAC | Authorization model |
| ADR-010 | Octokit Library | API integration approach |

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Author:** Architecture & Design Agent
**Status:** Ready for Reference

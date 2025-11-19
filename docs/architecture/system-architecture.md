# System Architecture

**Project:** Architecture-Bulletin
**Version:** 1.0
**Date:** 2025-11-18
**Status:** Draft

## 1. Overview

Architecture-Bulletin is a static web application that serves as a team deliverables bulletin board system. The application leverages GitHub as both the authentication provider (via GitHub OAuth) and the backend storage layer (via GitHub API), eliminating the need for traditional server infrastructure. This serverless architecture enables zero-cost deployment on GitHub Pages while maintaining robust version control and audit trails through Git.

The system enables administrators to post architecture deliverable requests with attachments, assign tasks to architects, and track progress. Architects can view bulletins, self-assign to tasks, upload deliverable artifacts with version control, and engage in threaded conversations with administrators.

## 2. Architecture Pattern

**Pattern:** **Jamstack Architecture** (JavaScript, APIs, and Markup) with **GitHub-as-a-Backend (GaaB)**

**Justification:**

The Jamstack architecture is ideal for this project because:

1. **Serverless Deployment:** GitHub Pages provides free, reliable static hosting with built-in CDN
2. **Git-Based Storage:** Leverages GitHub repository as database, providing version control and audit trails
3. **Cost Efficiency:** Zero infrastructure costs (no servers, databases, or backend services to manage)
4. **Security:** Authentication handled by GitHub OAuth (no passwords to manage)
5. **Simplicity:** Eliminates backend complexity while maintaining full functionality
6. **Performance:** Pre-built static assets served via CDN with minimal latency
7. **Developer Experience:** Single codebase, easy to develop and deploy

The GitHub-as-a-Backend pattern is appropriate because:
- Small team size (5 users) fits within GitHub API rate limits
- Limited data volume (50 active tasks) is manageable in Git repository
- Strong audit requirements benefit from Git's version control
- Team already uses GitHub, reducing onboarding friction

## 3. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Web Browser                       │
│                  (Chrome Desktop Only)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    GitHub Pages CDN                          │
│            (Serves Static React Application)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Downloads HTML/CSS/JS
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              React Single Page Application                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Presentation Layer (React Components)                 │ │
│  │  - Pages: Login, Dashboard, PostDetail, ControlPanel  │ │
│  │  - Components: PostCard, CommentThread, FileUpload    │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐ │
│  │  State Management Layer (React Context + Hooks)        │ │
│  │  - AuthContext: User session, role                     │ │
│  │  - PostsContext: Bulletin posts data                   │ │
│  │  - NotificationsContext: Admin notifications           │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐ │
│  │  Service Layer (API Integration)                       │ │
│  │  - GitHubAuthService: OAuth flow                       │ │
│  │  - GitHubDataService: CRUD operations via Octokit     │ │
│  │  - FileService: Upload/download artifacts              │ │
│  └────────────────────┬───────────────────────────────────┘ │
└────────────────────────┼──────────────────────────────────────┘
                         │
                         │ GitHub API Calls (REST)
                         │ Authorization: token <oauth_token>
                         │
┌────────────────────────▼──────────────────────────────────┐
│                    GitHub Platform                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  GitHub OAuth Service                                 │ │
│  │  - User authentication                                │ │
│  │  - Access token generation                            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  GitHub API (REST v3)                                 │ │
│  │  - Repository contents API                            │ │
│  │  - File creation/update/delete                        │ │
│  │  - Commit operations                                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Data Repository (architecture-bulletin-data)         │ │
│  │  Structure:                                            │ │
│  │  ├── config/                                           │ │
│  │  │   ├── architects.json                              │ │
│  │  │   ├── statuses.json                                │ │
│  │  │   └── settings.json                                │ │
│  │  ├── posts/                                            │ │
│  │  │   ├── post-001.json                                │ │
│  │  │   ├── post-002.json                                │ │
│  │  │   └── ...                                           │ │
│  │  ├── attachments/                                      │ │
│  │  │   ├── post-001/                                     │ │
│  │  │   │   ├── diagram.png                              │ │
│  │  │   │   └── spec.pdf                                 │ │
│  │  │   └── ...                                           │ │
│  │  ├── artifacts/                                        │ │
│  │  │   ├── post-001/                                     │ │
│  │  │   │   ├── v1/deliverable.pdf                       │ │
│  │  │   │   ├── v2/deliverable-updated.pdf               │ │
│  │  │   │   └── ...                                       │ │
│  │  │   └── ...                                           │ │
│  │  ├── conversations/                                    │ │
│  │  │   ├── post-001-comments.json                       │ │
│  │  │   └── ...                                           │ │
│  │  ├── notifications/                                    │ │
│  │  │   └── notifications.json                           │ │
│  │  └── archive/                                          │ │
│  │      └── archived-posts.json                          │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 4. Component Breakdown

### Frontend Components

The React application follows a feature-based component organization:

#### **Pages/Views:**
- **LoginPage** - GitHub OAuth authentication landing
- **DashboardPage** - Main bulletin board view with search/filter
- **PostDetailPage** - Detailed view of single post with comments and artifacts
- **ControlPanelPage** - Admin configuration interface
- **ArchivePage** - View archived/exported posts

#### **Layout Components:**
- **Header** - Navigation, user avatar, notification bell
- **Sidebar** - Quick filters, My Tasks, Statistics
- **Footer** - Version info, help links

#### **Feature Components:**

**Authentication:**
- `LoginButton` - GitHub OAuth login trigger
- `UserAvatar` - Display user info and logout

**Post Management:**
- `PostCard` - Compact post display for list view
- `PostForm` - Create/edit post form
- `PostFilters` - Search and filter controls
- `StatusBadge` - Visual status indicator
- `TaskLimitBanner` - Warning when 50 tasks reached

**Architect Assignment:**
- `ArchitectDropdown` - Multi-select architect picker
- `AssignToMeButton` - Self-assignment control
- `ArchitectList` - Display assigned architects

**Artifacts:**
- `ArtifactUpload` - File upload with drag-and-drop
- `ArtifactVersionList` - Display version history
- `ImagePreview` - Thumbnail and full-size modal
- `FileIcon` - Display file type icons

**Conversations:**
- `CommentThread` - Threaded conversation display
- `CommentForm` - Add comment/reply
- `CommentItem` - Single comment with timestamp

**Notifications:**
- `NotificationBell` - Icon with unread count
- `NotificationDropdown` - List of notifications
- `NotificationItem` - Single notification entry

**Control Panel:**
- `ArchitectManager` - CRUD for architect list
- `StatusManager` - CRUD for status configurations
- `BannerEditor` - Edit task limit banner message

#### **Common/Shared Components:**
- `Button` - Reusable button with variants
- `Input` - Form input with validation
- `Textarea` - Multi-line text input
- `Dropdown` - Select dropdown
- `Modal` - Reusable modal dialog
- `ConfirmDialog` - Confirmation prompt
- `Spinner` - Loading indicator
- `ErrorMessage` - Error display
- `SuccessMessage` - Success feedback

#### **State Management (React Context):**

**AuthContext:**
- User authentication state
- GitHub token management
- User role (admin/architect)
- Login/logout functions

**PostsContext:**
- All bulletin posts
- Filtered posts
- CRUD operations
- Search/filter state

**NotificationsContext:**
- Admin notifications
- Unread count
- Mark as read functionality

**ConfigContext:**
- Architect list
- Status configurations
- Task limit settings

#### **Routing (React Router):**

```javascript
/                      → DashboardPage (redirects to /login if not authenticated)
/login                 → LoginPage
/callback              → GitHub OAuth callback handler
/posts/:id             → PostDetailPage
/control-panel         → ControlPanelPage (admin only)
/archive               → ArchivePage (admin only)
```

### Service Layer

The service layer handles all external API communications:

#### **GitHubAuthService:**
- `initiateOAuth()` - Redirect to GitHub OAuth
- `handleCallback(code)` - Exchange code for token
- `getUser Profile(token)` - Fetch user details
- `getUserRole(username)` - Determine admin/architect role
- `logout()` - Clear session

#### **GitHubDataService (using Octokit):**
- `getPosts()` - Fetch all post JSON files
- `getPost(id)` - Fetch single post
- `createPost(data)` - Create new post JSON
- `updatePost(id, data)` - Update post JSON
- `deletePost(id)` - Delete post and related files
- `getAttachments(postId)` - List post attachments
- `uploadAttachment(postId, file)` - Upload file to GitHub
- `deleteAttachment(postId, filename)` - Remove attachment

#### **ArtifactService:**
- `uploadArtifact(postId, version, files)` - Upload artifact version
- `getArtifacts(postId)` - Get all versions
- `downloadArtifact(postId, version, filename)` - Download file

#### **ConversationService:**
- `getComments(postId)` - Fetch conversation thread
- `addComment(postId, comment)` - Add new comment
- `addReply(postId, commentId, reply)` - Reply to comment

#### **NotificationService:**
- `getNotifications()` - Fetch admin notifications
- `createNotification(type, data)` - Add notification
- `markAsRead(id)` - Mark notification read

#### **ConfigService:**
- `getArchitects()` - Fetch architect list
- `updateArchitects(list)` - Update architect config
- `getStatuses()` - Fetch status configurations
- `updateStatuses(list)` - Update status config
- `getSettings()` - Fetch app settings
- `updateSettings(settings)` - Update settings

## 5. Communication Patterns

### Client-GitHub Communication

**Authentication Flow:**
1. User clicks "Login with GitHub"
2. Browser redirects to GitHub OAuth authorization
3. User approves
4. GitHub redirects to `/callback?code=xxx`
5. App exchanges code for access token (via GitHub OAuth app)
6. Token stored in sessionStorage/localStorage
7. All subsequent API calls include: `Authorization: token <token>`

**Data Operations:**

**Read (GET):**
```javascript
// Using Octokit
const octokit = new Octokit({ auth: token });
const response = await octokit.rest.repos.getContent({
  owner, repo, path: 'posts/post-001.json'
});
const content = JSON.parse(atob(response.data.content));
```

**Create/Update (PUT):**
```javascript
const content = btoa(JSON.stringify(data));
await octokit.rest.repos.createOrUpdateFileContents({
  owner, repo, path: 'posts/post-001.json',
  message: 'Create/update post',
  content, sha: existingSha // Required for updates
});
```

**Delete (DELETE):**
```javascript
await octokit.rest.repos.deleteFile({
  owner, repo, path: 'posts/post-001.json',
  message: 'Delete post', sha
});
```

**File Upload (for attachments/artifacts):**
- Files stored as base64-encoded content
- Large files (>1MB) use Git LFS or chunked uploads

### Rate Limiting Strategy

GitHub API limits: 5000 requests/hour (authenticated)

**Mitigation:**
- Cache fetched data in Context state
- Batch operations where possible
- Implement request debouncing for search/filter
- Show loading states, avoid redundant calls
- Poll for updates only when necessary (not real-time)

## 6. Technology Stack Mapping

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 18.3 | Component-based UI |
| **Language** | JavaScript (ES2020+) | Application logic |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **Build Tool** | Vite 5.4 | Fast development and optimized builds |
| **Routing** | React Router 6 | Client-side routing |
| **State Management** | Context API + Hooks | Global state management |
| **HTTP Client** | Octokit (@octokit/rest) | GitHub API integration |
| **Authentication** | GitHub OAuth 2.0 | User authentication |
| **Data Storage** | GitHub Repository | File-based data persistence |
| **Hosting** | GitHub Pages | Static site hosting with CDN |
| **CI/CD** | GitHub Actions | Automated build and deployment |
| **Testing** | Vitest + React Testing Library | Unit and integration testing |
| **Linting** | ESLint | Code quality |
| **Formatting** | Prettier | Code formatting |

## 7. Scalability Strategy

### Current Scale (Phase 1)
- **Users:** 5 concurrent users
- **Data:** 50 active tasks, 100 total (with archive)
- **Files:** ~500 attachments/artifacts (50 tasks × 10 avg files)
- **API Calls:** ~200/hour during active usage

### Scalability Considerations

**Horizontal Scaling:**
- Static app inherently scales via GitHub Pages CDN
- No server-side bottlenecks
- CDN handles traffic spikes

**Caching:**
- Browser caching for static assets (HTML/CSS/JS)
- Context state caching for fetched data
- LocalStorage for user preferences and session

**GitHub API Limits:**
- Current usage well within 5000 req/hour limit
- If scaling beyond 20 users, consider:
  - Request batching and pagination
  - Implement polling backoff strategies
  - Cache data more aggressively
  - Use GitHub GraphQL API for efficiency

**Data Volume:**
- Git repository size: ~50MB max (with LFS for large files)
- If exceeding, archive old data to separate repos
- Export feature enables offloading historical data

**Future Scaling Options (if needed):**
1. Add caching layer (Cloudflare Workers, service worker)
2. Implement incremental data loading
3. Use GitHub GraphQL API for complex queries
4. Consider hybrid architecture with lightweight serverless functions

## 8. Design Patterns to Use

### Architectural Patterns

**1. Repository Pattern (for GitHub Data Access)**
```javascript
class PostRepository {
  constructor(octokit, owner, repo) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
  }

  async getAll() { /* Fetch all posts */ }
  async getById(id) { /* Fetch single post */ }
  async create(post) { /* Create new post */ }
  async update(id, post) { /* Update post */ }
  async delete(id) { /* Delete post */ }
}
```

**2. Service Layer Pattern**
```javascript
class PostService {
  constructor(postRepository) {
    this.repository = postRepository;
  }

  async getPosts(filters) {
    const posts = await this.repository.getAll();
    return this.applyFilters(posts, filters);
  }
}
```

**3. Provider Pattern (React Context)**
```javascript
<AuthProvider>
  <PostsProvider>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </PostsProvider>
</AuthProvider>
```

**4. Custom Hooks Pattern**
```javascript
const useAuth = () => useContext(AuthContext);
const usePosts = () => useContext(PostsContext);
const useNotifications = () => useContext(NotificationsContext);
```

**5. Higher-Order Component Pattern (for route protection)**
```javascript
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <AccessDenied />;
  return children;
};
```

### Component Patterns

**6. Compound Component Pattern (for complex UI)**
```javascript
<PostCard>
  <PostCard.Header />
  <PostCard.Body />
  <PostCard.Footer />
</PostCard>
```

**7. Render Props Pattern (for reusable logic)**
```javascript
<FileUpload
  render={({ files, upload }) => (
    <UploadButton onClick={upload} files={files} />
  )}
/>
```

**8. Container/Presentational Pattern**
- Container: Logic, data fetching, state (e.g., `PostListContainer`)
- Presentational: UI, props-based (e.g., `PostList`)

## 9. Cross-Cutting Concerns

### Logging

**Strategy:** Client-side logging with structured format

```javascript
class Logger {
  log(level, message, context) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level, message, context,
      user: getCurrentUser(),
    }));
  }
}
```

**What to Log:**
- Authentication events (login, logout, failures)
- API errors and rate limit warnings
- User actions (create post, upload file)
- Performance metrics (API latency)

### Error Handling

**Global Error Boundary:**
```javascript
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

**API Error Handling:**
```javascript
try {
  const response = await githubDataService.createPost(data);
} catch (error) {
  if (error.status === 401) {
    // Token expired, re-authenticate
  } else if (error.status === 403) {
    // Rate limit exceeded, show message
  } else if (error.status === 404) {
    // Resource not found
  } else {
    // Generic error
  }
  logger.error('Failed to create post', { error });
  showErrorMessage(error.message);
}
```

**User-Friendly Error Messages:**
- "Unable to load posts. Please refresh the page."
- "GitHub API rate limit exceeded. Please try again in a few minutes."
- "Failed to upload file. Ensure it's under 10MB."

### Configuration

**Environment Variables (.env):**
```
VITE_GITHUB_CLIENT_ID=your_client_id
VITE_GITHUB_REPO_OWNER=your_username
VITE_GITHUB_REPO_NAME=architecture-bulletin-data
VITE_APP_TITLE=Architecture Bulletin
```

**Configuration Files (in GitHub repo):**
- `config/architects.json` - List of architects
- `config/statuses.json` - Status configurations
- `config/settings.json` - App settings (task limit, banner message)

### Monitoring

**Client-Side Monitoring:**
- Browser console for development
- User-reported issues via GitHub Issues
- Performance monitoring via Web Vitals

**GitHub Actions Monitoring:**
- Build success/failure notifications
- Deployment status

**Metrics to Track:**
- Page load time
- API call latency
- Error rates
- GitHub API rate limit usage

## 10. Security Considerations

See `docs/architecture/security-architecture.md` for detailed security architecture.

**Key Security Measures:**
- HTTPS only (enforced by GitHub Pages)
- GitHub OAuth for authentication (no password management)
- Role-based access control (admin/architect)
- Input sanitization to prevent XSS
- Content Security Policy headers
- Secure token storage
- GitHub API rate limit awareness

## 11. Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Developer Pushes Code to GitHub                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ git push
                   │
┌──────────────────▼──────────────────────────────────────┐
│  GitHub Repository (main branch)                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Triggers
                   │
┌──────────────────▼──────────────────────────────────────┐
│  GitHub Actions Workflow (.github/workflows/deploy.yml) │
│  1. Checkout code                                        │
│  2. Install dependencies (npm install)                   │
│  3. Run tests (npm test)                                 │
│  4. Build production bundle (npm run build)              │
│  5. Deploy to gh-pages branch                            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Deploys
                   │
┌──────────────────▼──────────────────────────────────────┐
│  gh-pages Branch (contains built static files)           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Serves via
                   │
┌──────────────────▼──────────────────────────────────────┐
│  GitHub Pages CDN                                        │
│  URL: https://username.github.io/Architecture-Bulletin/  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTPS
                   │
┌──────────────────▼──────────────────────────────────────┐
│  End Users (Chrome Desktop Browser)                      │
└─────────────────────────────────────────────────────────┘
```

## 12. Data Flow Diagrams

### Create Post Flow

```
Admin → PostForm → Validation → PostService
                                     ↓
                         GitHubDataService (Octokit)
                                     ↓
                         GitHub API (createOrUpdateFileContents)
                                     ↓
                         GitHub Repo: posts/post-{id}.json created
                                     ↓
                         FileService uploads attachments
                                     ↓
                         GitHub Repo: attachments/post-{id}/* created
                                     ↓
                         Success response
                                     ↓
                         PostsContext updated
                                     ↓
                         UI refresh → Post appears in bulletin board
```

### Architect Self-Assignment Flow

```
Architect → PostDetailPage → "Assign to Me" button clicked
                                     ↓
                         PostService.assignArchitect(postId, username)
                                     ↓
                         GitHubDataService.updatePost(id, { assigned: [...existing, username] })
                                     ↓
                         GitHub API updates post-{id}.json
                                     ↓
                         Git commit created: "Architect {username} self-assigned to post {id}"
                                     ↓
                         PostsContext updated
                                     ↓
                         UI updates: Post now shows architect as assigned
```

### Notification Flow (Escalation)

```
Admin/Architect → Changes status to "Escalate"
                                     ↓
                         PostService.updateStatus(postId, "escalate")
                                     ↓
                         Check if status = "escalate" → Trigger notification
                                     ↓
                         NotificationService.createNotification({
                           type: "escalation",
                           postId, postTitle, escalatedBy, timestamp
                         })
                                     ↓
                         GitHub Repo: notifications/notifications.json updated
                                     ↓
                         NotificationsContext updated
                                     ↓
                         All admin users see notification bell increment
```

## 13. Key Architectural Decisions

See `docs/architecture/design-decisions.md` for detailed ADRs.

**Summary of Key Decisions:**

1. **GitHub as Backend** - Eliminates server costs, provides version control
2. **Static Site Architecture** - Simplicity, security, cost efficiency
3. **Context API over Redux** - Simpler for small-scale state management
4. **Vite over CRA** - Faster builds, better DX
5. **JavaScript over TypeScript** - Faster development for MVP (can migrate later)
6. **Tailwind CSS** - Rapid UI development with utility classes
7. **GitHub OAuth only** - Reduces complexity, leverages existing GitHub accounts
8. **File-based storage** - Fits naturally with Git, enables audit trails

## 14. Performance Optimization Strategies

1. **Code Splitting:** Lazy load pages and heavy components
   ```javascript
   const ControlPanel = lazy(() => import('./pages/ControlPanelPage'));
   ```

2. **Memoization:** Avoid unnecessary re-renders
   ```javascript
   const PostCard = memo(({ post }) => { /* ... */ });
   ```

3. **Debounced Search:** Reduce API calls during typing
   ```javascript
   const debouncedSearch = debounce(searchPosts, 300);
   ```

4. **Pagination:** Load posts in batches
   ```javascript
   const [page, setPage] = useState(1);
   const postsPerPage = 20;
   ```

5. **Image Optimization:** Compress and lazy-load images
   ```javascript
   <img loading="lazy" src={thumbnail} />
   ```

6. **Service Worker Caching:** Cache static assets and API responses

## 15. Testing Strategy

See testing agents for detailed test plans.

**Unit Tests:**
- Component tests (React Testing Library)
- Service layer tests (mock Octokit)
- Utility function tests

**Integration Tests:**
- Context provider interactions
- Service + Repository integration
- GitHub API integration (with mocked responses)

**End-to-End Tests:**
- User flows from BRD (using Vitest or Playwright)
- Authentication flow
- Create post → Assign → Upload artifact → Close

**Performance Tests:**
- Lighthouse CI for Core Web Vitals
- Bundle size monitoring

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Author:** Architecture & Design Agent
**Status:** Ready for Development

# Component Diagram

**Project:** Architecture-Bulletin
**Version:** 1.0
**Date:** 2025-11-18

## React Application Structure

```
Architecture-Bulletin/src/
├── main.jsx                     # Application entry point
├── App.jsx                      # Root component with routing
├── index.css                    # Global styles (Tailwind)
│
├── pages/                       # Page components (route targets)
│   ├── LoginPage.jsx            # GitHub OAuth login
│   ├── CallbackPage.jsx         # OAuth callback handler
│   ├── DashboardPage.jsx        # Main bulletin board view
│   ├── PostDetailPage.jsx       # Single post detail view
│   ├── ControlPanelPage.jsx    # Admin configuration (admin only)
│   ├── ArchivePage.jsx          # Archived posts view (admin only)
│   └── NotFoundPage.jsx         # 404 page
│
├── components/                  # Reusable UI components
│   ├── layout/
│   │   ├── Header.jsx           # Navigation, user menu, notifications
│   │   ├── Sidebar.jsx          # Filters, quick actions
│   │   └── Footer.jsx           # App version, help links
│   │
│   ├── auth/
│   │   ├── LoginButton.jsx      # GitHub OAuth login trigger
│   │   ├── UserAvatar.jsx       # User profile display
│   │   └── ProtectedRoute.jsx   # Route guard for auth
│   │
│   ├── posts/
│   │   ├── PostCard.jsx         # Compact post for list view
│   │   ├── PostList.jsx         # List of PostCard components
│   │   ├── PostForm.jsx         # Create/edit post form
│   │   ├── PostFilters.jsx      # Search and filter controls
│   │   ├── StatusBadge.jsx      # Visual status indicator
│   │   └── TaskLimitBanner.jsx  # 50-task limit warning
│   │
│   ├── architects/
│   │   ├── ArchitectDropdown.jsx    # Multi-select architect picker
│   │   ├── AssignToMeButton.jsx     # Self-assignment button
│   │   └── ArchitectList.jsx        # Display assigned architects
│   │
│   ├── artifacts/
│   │   ├── ArtifactUpload.jsx       # File upload component
│   │   ├── ArtifactVersionList.jsx  # Version history table
│   │   ├── ImagePreview.jsx         # Image thumbnail + modal
│   │   └── FileIcon.jsx             # File type icon display
│   │
│   ├── conversations/
│   │   ├── CommentThread.jsx        # Full conversation display
│   │   ├── CommentForm.jsx          # Add comment/reply form
│   │   └── CommentItem.jsx          # Single comment component
│   │
│   ├── notifications/
│   │   ├── NotificationBell.jsx     # Bell icon with count
│   │   ├── NotificationDropdown.jsx # Notification list dropdown
│   │   └── NotificationItem.jsx     # Single notification
│   │
│   ├── control-panel/
│   │   ├── ArchitectManager.jsx     # CRUD for architects
│   │   ├── StatusManager.jsx        # CRUD for statuses
│   │   └── BannerEditor.jsx         # Edit task limit banner
│   │
│   └── common/                  # Shared/generic components
│       ├── Button.jsx           # Reusable button
│       ├── Input.jsx            # Form input with validation
│       ├── Textarea.jsx         # Multi-line text input
│       ├── Dropdown.jsx         # Select dropdown
│       ├── Modal.jsx            # Reusable modal dialog
│       ├── ConfirmDialog.jsx    # Confirmation prompt
│       ├── Spinner.jsx          # Loading indicator
│       ├── ErrorMessage.jsx     # Error display
│       └── SuccessMessage.jsx   # Success feedback
│
├── contexts/                    # React Context providers
│   ├── AuthContext.jsx          # User authentication state
│   ├── PostsContext.jsx         # Bulletin posts data
│   ├── NotificationsContext.jsx # Admin notifications
│   └── ConfigContext.jsx        # App configuration
│
├── services/                    # External API integration
│   ├── githubAuthService.js     # GitHub OAuth operations
│   ├── githubDataService.js     # CRUD via GitHub API (Octokit)
│   ├── postService.js           # Post-specific operations
│   ├── artifactService.js       # Artifact upload/download
│   ├── conversationService.js   # Comment thread operations
│   ├── notificationService.js   # Notification management
│   └── configService.js         # Configuration CRUD
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.js               # Access AuthContext
│   ├── usePosts.js              # Access PostsContext
│   ├── useNotifications.js      # Access NotificationsContext
│   ├── useConfig.js             # Access ConfigContext
│   ├── useDebounce.js           # Debounce hook for search
│   └── useLocalStorage.js       # LocalStorage helper
│
├── utils/                       # Utility functions
│   ├── validators.js            # Form validation functions
│   ├── formatters.js            # Date/text formatting
│   ├── helpers.js               # General helper functions
│   ├── constants.js             # App constants
│   └── logger.js                # Logging utility
│
└── types/                       # JSDoc type definitions (for JS)
    ├── post.types.js            # Post-related types
    ├── user.types.js            # User-related types
    └── config.types.js          # Configuration types
```

## Component Responsibilities

### Pages (Route Targets)

**LoginPage**
- Renders GitHub OAuth login button
- Handles OAuth initiation

**CallbackPage**
- Receives OAuth callback
- Exchanges code for token
- Determines user role
- Redirects to Dashboard

**DashboardPage**
- Displays bulletin board (PostList)
- Shows filters (PostFilters)
- Handles search/filter state
- Shows task limit banner if needed

**PostDetailPage**
- Displays single post details
- Shows assigned architects
- Lists attachments and artifacts
- Displays conversation thread
- Allows status changes (based on role)
- Shows closure notes

**ControlPanelPage** (Admin only)
- Tabbed interface:
  - Architects tab (ArchitectManager)
  - Statuses tab (StatusManager)
  - Settings tab (BannerEditor)

**ArchivePage** (Admin only)
- Lists archived posts
- Allows unarchiving
- Provides export functionality

### Layout Components

**Header**
- App logo/title
- Navigation links
- User avatar with dropdown (logout)
- Notification bell (admins only)
- Role badge (admin/architect)

**Sidebar** (optional, can be part of Dashboard)
- Quick filters (status, architect, date)
- "My Tasks" filter
- Statistics (task counts by status)

**Footer**
- App version
- Help/documentation link
- GitHub repository link

### Feature Components

**PostCard**
- Displays post summary
- Shows status badge
- Shows assigned architects
- Shows created date
- Click to navigate to detail

**PostForm**
- Input fields: title, description, concerned parties
- Status dropdown
- Architect multi-select
- File upload for attachments
- Form validation
- Submit creates/updates post

**PostFilters**
- Search input (debounced)
- Status filter dropdown
- Architect filter dropdown
- Date range picker
- Clear filters button

**ArchitectDropdown**
- Multi-select dropdown
- Fetches architect list from config
- Allows admin to assign/unassign
- Disables if admin-locked

**AssignToMeButton**
- Shows for architects on unassigned posts
- Adds current user to assigned list
- Disabled if already assigned or admin-locked

**ArtifactUpload**
- Drag-and-drop file upload
- File size validation (10MB limit)
- Progress indicator
- Generates version number
- Uploads to GitHub artifacts folder

**ArtifactVersionList**
- Table showing all versions
- Columns: version, uploaded by, date, files
- Download button for each file
- Image preview for images

**CommentThread**
- Displays all comments and replies
- Indents replies (2-level threading)
- Shows author, role, timestamp
- Reply button on each comment

**NotificationBell**
- Icon with unread count badge
- Clickable to open dropdown
- Shows different colors for priority

**ArchitectManager** (Control Panel)
- Table of architects
- Add new architect form
- Activate/deactivate toggle
- Remove button (with warning if assigned)
- Saves to config/architects.json

### Common Components

**Button**
- Variants: primary, secondary, danger, ghost
- Sizes: small, medium, large
- Loading state
- Disabled state

**Input**
- Label, placeholder, value, onChange
- Validation error display
- Types: text, email, number, date

**Modal**
- Overlay background
- Close button
- Header, body, footer slots
- Click outside to close
- ESC key to close

**ConfirmDialog**
- Extends Modal
- Confirmation message
- Confirm/Cancel buttons
- Optional danger variant

## Contexts and State Management

### AuthContext

**State:**
```javascript
{
  user: { username, name, avatar, email, role },
  token: 'github_oauth_token',
  isAuthenticated: boolean,
  isLoading: boolean
}
```

**Actions:**
- `login(token, user)`
- `logout()`
- `checkAuth()` - Validate stored token
- `getUserRole(username)` - Fetch role from config

### PostsContext

**State:**
```javascript
{
  posts: [...], // All posts
  filteredPosts: [...], // After search/filter
  selectedPost: {...}, // Currently viewed post
  isLoading: boolean,
  filters: { status, architect, search, dateRange }
}
```

**Actions:**
- `fetchPosts()` - Load all posts from GitHub
- `getPost(id)` - Fetch single post
- `createPost(data, files)` - Create new post
- `updatePost(id, data)` - Update existing post
- `deletePost(id)` - Delete post and files
- `setFilters(filters)` - Update filter state
- `searchPosts(query)` - Filter by search query

### NotificationsContext

**State:**
```javascript
{
  notifications: [...],
  unreadCount: number,
  isLoading: boolean
}
```

**Actions:**
- `fetchNotifications()` - Load from GitHub
- `markAsRead(id)` - Mark notification read
- `createNotification(type, data)` - Add new notification

### ConfigContext

**State:**
```javascript
{
  architects: [...],
  statuses: [...],
  settings: {...},
  isLoading: boolean
}
```

**Actions:**
- `fetchConfig()` - Load all config files
- `updateArchitects(list)` - Save architects config
- `updateStatuses(list)` - Save statuses config
- `updateSettings(settings)` - Save settings config

## Services Layer

### githubAuthService

**Methods:**
- `initiateOAuth()` - Redirect to GitHub
- `handleCallback(code, state)` - Exchange code for token
- `getUserProfile(token)` - Fetch user details
- `logout()` - Clear session

### githubDataService (Octokit wrapper)

**Methods:**
- `getFileContent(path)` - Read file from repo
- `createFile(path, content, message)` - Create new file
- `updateFile(path, content, sha, message)` - Update existing file
- `deleteFile(path, sha, message)` - Delete file
- `listDirectory(path)` - List files in directory
- `uploadBinaryFile(path, buffer, message)` - Upload binary (attachments)

### postService

**Methods:**
- `getAllPosts()` - Fetch all post JSONs
- `getPost(id)` - Fetch single post
- `createPost(data)` - Create post JSON
- `updatePost(id, data)` - Update post JSON
- `deletePost(id)` - Delete post and related files
- `uploadAttachment(postId, file)` - Upload attachment
- `assignArchitect(postId, username)` - Add architect to post
- `updateStatus(postId, status)` - Change post status

### artifactService

**Methods:**
- `uploadArtifact(postId, version, files)` - Upload artifact version
- `getArtifacts(postId)` - Get all versions for post
- `downloadArtifact(postId, version, filename)` - Download file

### conversationService

**Methods:**
- `getComments(postId)` - Fetch conversation thread
- `addComment(postId, text)` - Add top-level comment
- `addReply(postId, commentId, text)` - Reply to comment

### notificationService

**Methods:**
- `getNotifications()` - Fetch notifications.json
- `createNotification(type, data)` - Add notification
- `markAsRead(id)` - Mark as read

### configService

**Methods:**
- `getArchitects()` - Fetch architects.json
- `updateArchitects(list)` - Save architects.json
- `getStatuses()` - Fetch statuses.json
- `updateStatuses(list)` - Save statuses.json
- `getSettings()` - Fetch settings.json
- `updateSettings(settings)` - Save settings.json

## Data Flow Patterns

### Page Load
```
User navigates → Page component
                    ↓
            Uses Context hook (useAuth, usePosts)
                    ↓
            Context checks if data loaded
                    ↓
            If not → Call service to fetch from GitHub
                    ↓
            Service uses Octokit → GitHub API
                    ↓
            Data returned → Update Context state
                    ↓
            Component re-renders with data
```

### Create Post
```
User fills form → PostForm component
                      ↓
              Validates input
                      ↓
              Calls usePosts().createPost(data, files)
                      ↓
              PostsContext → postService.createPost()
                      ↓
              postService → githubDataService.createFile()
                      ↓
              Octokit → GitHub API (creates JSON)
                      ↓
              For each file → Upload attachment
                      ↓
              Update post JSON with attachment metadata
                      ↓
              Return success → Update PostsContext state
                      ↓
              UI updates → Show success message
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Author:** Architecture & Design Agent
**Status:** Ready for Development

# Local Development Setup Guide

## Overview

The Architecture Bulletin application now supports **local development mode** with username/password authentication and filesystem-based data storage. This allows you to run and test the application immediately without setting up GitHub OAuth or a GitHub data repository.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000/Architecture-Bulletin/**

### 3. Login with Demo Credentials

The application will open in your default browser. You'll see the login page with two authentication modes:

**Local Login Mode** (default):
- **Admin User**: `admin` / `admin123`
- **Architect 1**: `architect1` / `arch123`
- **Architect 2**: `architect2` / `arch123`

Click the quick-login buttons or manually enter credentials.

## Authentication Modes

### Local Authentication (Default)

- **Mode**: Filesystem-based with JSON config
- **User Database**: `public/local-data/config/users.json`
- **Data Storage**: Browser localStorage + static files
- **Best For**: Local development and testing

### GitHub OAuth (Production)

- **Mode**: GitHub OAuth 2.0
- **Data Storage**: GitHub repository as backend
- **Requires**: GitHub OAuth app setup (see WORKSPACE_SETUP.md)
- **Best For**: Production deployment

Toggle between modes using the buttons on the login page.

## Local Data Structure

All local data is stored in `public/local-data/`:

```
public/local-data/
├── config/
│   ├── users.json          # User accounts and roles
│   ├── architects.json     # Architect configuration
│   ├── statuses.json       # Task status definitions
│   └── settings.json       # Application settings
├── posts/                  # Bulletin posts (JSON files)
│   ├── post-0001.json
│   ├── post-0002.json
│   ├── post-0003.json
│   └── post-0004.json
├── attachments/            # File uploads (base64 in localStorage)
├── artifacts/              # Versioned deliverables
├── conversations/          # Comment threads
├── notifications/          # User notifications
└── archive/                # Archived posts
```

## Sample Data

The application comes with **4 sample posts** demonstrating different workflow states:

1. **Design System Update** (New - Unassigned)
   - Status: New
   - Demonstrates: Task creation workflow

2. **API Gateway Migration** (Assigned - In Progress)
   - Status: Assigned
   - Assigned to: architect1
   - Admin-assigned: Yes
   - Demonstrates: Active task in progress

3. **Database Sharding Strategy** (Submitted for Review)
   - Status: Submitted
   - Assigned to: architect2
   - Demonstrates: Pending admin review

4. **Logging Standardization** (Closed)
   - Status: Closed
   - Assigned to: architect1
   - Demonstrates: Completed project

## User Roles & Permissions

### Admin User (`admin`)
- Create, edit, and delete all posts
- Assign architects to tasks (locked assignments)
- Update application settings
- Manage architect configuration
- Close and approve tasks
- View control panel

### Architect Users (`architect1`, `architect2`)
- View all posts
- Self-assign to unassigned tasks
- Update assigned tasks
- Submit tasks for review
- Upload artifacts and attachments
- Add comments to posts

## Development Workflow

### Testing as Different Roles

1. **Login as Admin** to:
   - Create new bulletin posts
   - Assign tasks to architects
   - Review and close submissions

2. **Logout and Login as Architect** to:
   - View assigned tasks
   - Self-assign to open tasks
   - Submit work for review
   - Upload deliverables

3. **Switch Between Users** to simulate team collaboration

### Creating New Posts

As admin:
1. Navigate to Dashboard
2. Click "Create Post" button
3. Fill in title, description, concerned parties
4. Upload attachments (optional)
5. Assign architect or leave unassigned
6. Submit

### Managing Local Data

**Add New Users**: Edit `public/local-data/config/users.json`

```json
{
  "username": "newuser",
  "password": "password123",
  "role": "architect",
  "displayName": "New User",
  "email": "newuser@example.com",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=newuser",
  "active": true
}
```

**Modify Statuses**: Edit `public/local-data/config/statuses.json`

**Adjust Settings**: Edit `public/local-data/config/settings.json`

**Reset Data**: Delete `localStorage` in browser DevTools or:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

## Data Persistence

### How Local Data Works

**Reads**: Files served from `public/local-data/` via Vite dev server
**Writes**: Stored in browser `localStorage` with prefix `local_data_`
**Priority**: localStorage data overrides static files

This hybrid approach allows:
- Quick startup with pre-populated data
- Persistent changes during development
- Easy reset by clearing localStorage

### Data Lifecycle

1. App starts → Reads from `/local-data/config/users.json`
2. User logs in → Token stored in `sessionStorage`
3. User creates post → Saved to `localStorage.local_data_posts/post-0005.json`
4. Page refresh → Post loads from localStorage (not file)
5. localStorage cleared → Falls back to static files

## Environment Configuration

The app uses `APP_MODE` constant (defaults to `'local'`):

**Option 1: Default (no .env needed)**
```javascript
// In src/utils/constants.js
export const APP_MODE = import.meta.env.VITE_APP_MODE || 'local';
```

**Option 2: Explicit .env configuration**
```bash
# .env.local
VITE_APP_MODE=local
```

**Switch to GitHub Mode**:
```bash
VITE_APP_MODE=github
```

## Common Issues & Solutions

### Issue: "Cannot find users.json"
**Solution**: Ensure `public/local-data/config/users.json` exists
```bash
ls -la public/local-data/config/
```

### Issue: Login fails after code changes
**Solution**: Clear localStorage and refresh
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Issue: Posts not showing up
**Solution**: Check browser console for errors. Verify posts exist:
```bash
ls -la public/local-data/posts/
```

### Issue: Changes not persisting
**Solution**: Check localStorage in DevTools (Application → Local Storage)

### Issue: Vite base path incorrect
**Solution**: Update `vite.config.js` base path:
```javascript
export default defineConfig({
  base: '/Architecture-Bulletin/', // For GitHub Pages
  // OR
  base: '/',                       // For local development
})
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run linting
npm run lint

# Type checking (if TypeScript)
npm run type-check
```

## Browser DevTools Tips

### Inspect Authentication State

```javascript
// Check current user
JSON.parse(sessionStorage.getItem('user'))

// Check auth token
sessionStorage.getItem('auth_token')

// Check auth mode
sessionStorage.getItem('auth_mode')
```

### Inspect Local Data

```javascript
// List all localStorage keys
Object.keys(localStorage).filter(k => k.startsWith('local_data_'))

// View a specific post
JSON.parse(localStorage.getItem('local_data_posts/post-0001.json'))

// View posts index
JSON.parse(localStorage.getItem('local_data_index_posts'))
```

### Debug API Calls

Open DevTools → Network tab → Filter by "Fetch/XHR" to see data operations

## Next Steps

### Once Local Testing is Complete

1. **Setup GitHub OAuth** (see WORKSPACE_SETUP.md)
   - Create GitHub OAuth App
   - Deploy OAuth proxy (Netlify/Vercel)
   - Update .env with credentials

2. **Create GitHub Data Repository**
   - Initialize repository structure
   - Set up config files
   - Configure permissions

3. **Deploy Application**
   - Build: `npm run build`
   - Deploy to GitHub Pages / Netlify / Vercel
   - Configure environment variables

4. **Switch to Production Mode**
   ```bash
   VITE_APP_MODE=github
   ```

## Additional Resources

- **Architecture Documentation**: `docs/architecture/`
- **Code Review Report**: `docs/code-review/review-report.md`
- **Security Analysis**: `docs/code-review/security-report.md`
- **Workspace Setup**: `WORKSPACE_SETUP.md`
- **Developer Summary**: `DEVELOPER_AGENT_SUMMARY.md`

## Support

For issues or questions:
1. Check console for error messages
2. Verify data files exist in `public/local-data/`
3. Clear localStorage and retry
4. Review this guide's troubleshooting section

---

**Enjoy exploring the Architecture Bulletin application in local mode!**

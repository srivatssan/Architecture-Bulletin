# Architecture Bulletin

> Team Deliverables Bulletin Board - Manage architecture team tasks with GitHub backend storage

[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Overview

**Architecture Bulletin** is a fully-functional React-based bulletin board application for managing architecture team deliverables, task assignments, and collaboration. It uses a **GitHub repository as the backend**, providing persistent storage, version control, and zero infrastructure costs.

### Key Features

- 📝 **Post Management** - Create, edit, delete, and archive bulletin posts
- 👥 **Role-Based Access** - Admin and Architect roles with different permissions
- 📎 **File Attachments** - Upload topic artifacts and proof of work files
- 💬 **Real-Time Chat** - Threaded conversations on each post
- 🔔 **Notifications** - Admin alerts for architect actions
- 🗄️ **GitHub Backend** - All data stored in GitHub repository with full version history
- 🔐 **Local Authentication** - Username/password auth for development
- 🏗️ **Dual Storage Modes** - Local (development) or GitHub (production)

## Architecture

This project uses a **separated repository architecture**:

- **`Architecture-Bulletin`** (this repo) - React application code
- **[`architecture-bulletin-data`](https://github.com/srivatssan/architecture-bulletin-data)** - Data storage repository

This separation provides:
- ✅ Clean commit history (code vs data changes)
- ✅ Scalable architecture (app on CDN, data in GitHub)
- ✅ Security flexibility (public app, private data if needed)
- ✅ Better collaboration (developers vs. users)

## Tech Stack

- **Frontend Framework**: React 18.3 with Hooks
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **State Management**: Context API + useCallback/useMemo
- **Routing**: React Router v6
- **GitHub Integration**: Octokit REST API client
- **Storage Backend**: GitHub repository (via API)
- **Development**: localStorage for local development
- **Testing**: Vitest + React Testing Library

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- GitHub account (for GitHub backend mode)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srivatssan/Architecture-Bulletin.git
   cd Architecture-Bulletin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (local mode):**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local`:
   ```env
   VITE_APP_MODE=local
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Login:**
   - Open http://localhost:3000/
   - **Admin**: `admin` / `admin123`
   - **Architect**: `architect1` / `arch123`

### GitHub Backend Setup

To use GitHub as the backend storage (recommended for production):

1. **Create GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens?type=beta
   - Create fine-grained token with:
     - Repository access: Select `architecture-bulletin-data`
     - Permissions: Contents (Read and write)

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local`:
   ```env
   VITE_GITHUB_REPO_OWNER=your-github-username
   VITE_GITHUB_DATA_REPO=architecture-bulletin-data
   VITE_GITHUB_BRANCH=main
   VITE_GITHUB_PAT=your-github-personal-access-token
   VITE_APP_MODE=local
   ```

3. **Run migration script:**
   ```bash
   npm run migrate
   ```

   This will:
   - Create the `architecture-bulletin-data` repository
   - Upload all local data to GitHub
   - Provide migration summary

4. **Switch to GitHub mode:**

   Update `.env.local`:
   ```env
   VITE_APP_MODE=github
   ```

5. **Restart server:**
   ```bash
   npm run dev
   ```

For detailed migration instructions, see [GITHUB_MIGRATION.md](./GITHUB_MIGRATION.md).

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests with Vitest |
| `npm run migrate` | Migrate local data to GitHub |
| `npm run deploy` | Deploy to GitHub Pages |

## Project Structure

```
Architecture-Bulletin/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── auth/           # Authentication components
│   │   ├── chat/           # Chat panel component
│   │   └── posts/          # Post-related components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API and data services
│   │   ├── githubDataService.js    # GitHub API integration
│   │   ├── localDataService.js     # Local storage
│   │   ├── postService.js          # Post CRUD operations
│   │   └── notificationService.js  # Notifications
│   └── utils/              # Utility functions
├── public/
│   └── local-data/         # Local development data (gitignored)
├── docs/                   # Documentation
│   ├── architecture/       # Architecture & design docs
│   ├── requirements/       # BRD and requirements
│   └── code-review/        # Code review reports
├── scripts/
│   └── migrate-to-github.js  # GitHub migration script
├── .env.example            # Environment template
└── vite.config.js          # Vite configuration
```

## User Guide

### For Administrators

1. **Create Posts:**
   - Click "+ Create Post" on dashboard
   - Fill in title, description, concerned parties
   - Upload topic artifacts (optional)
   - Submit to create

2. **Assign Architects:**
   - Open any post
   - Use "Assigned to" dropdown in sidebar
   - Select architect and confirm

3. **Manage Posts:**
   - Edit post details
   - Archive completed posts (frees up slot in 50-post limit)
   - Delete posts if needed

4. **Monitor Progress:**
   - Dashboard shows all active posts
   - Filter by status (New, Assigned, Submitted, Closed)
   - View architect assignments

### For Architects

1. **View Posts:**
   - Dashboard shows all available tasks
   - Filter by status or search

2. **Work on Tasks:**
   - Self-assign from available posts
   - Upload proof of work files
   - Update status to "Submitted" when complete

3. **Collaborate:**
   - Use chat panel to discuss with admin/team
   - View attached topic artifacts
   - Track your assigned tasks

## Documentation

- **[GITHUB_MIGRATION.md](./GITHUB_MIGRATION.md)** - Complete guide to GitHub backend migration
- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Local development setup
- **[DEVELOPER_AGENT_SUMMARY.md](./DEVELOPER_AGENT_SUMMARY.md)** - Development summary
- **[docs/requirements/](./docs/requirements/)** - Business requirements and user stories
- **[docs/architecture/](./docs/architecture/)** - System architecture and design decisions
- **[docs/code-review/](./docs/code-review/)** - Code review and security reports

## Deployment

### Deploy to GitHub Pages

```bash
npm run build
npm run deploy
```

The app will be available at: `https://yourusername.github.io/Architecture-Bulletin/`

**Important:** Configure GitHub backend before deploying:
1. Set up data repository
2. Run migration script
3. Update `.env.local` with `VITE_APP_MODE=github`
4. Build and deploy

## How It Works

### Data Storage Modes

#### Local Mode (Development)
- Data stored in `public/local-data/` JSON files
- Browser localStorage for quick reads
- Perfect for development and testing
- No GitHub account required

#### GitHub Mode (Production)
- Data stored in `architecture-bulletin-data` repository
- Every action creates a GitHub commit
- Full version control and history
- Persistent, backed up, collaborative

### GitHub Backend Flow

1. User creates a post in the app
2. App calls `postService.createPost()`
3. Service calls `githubDataService.saveJsonFile()`
4. Octokit creates/updates file via GitHub API
5. New commit appears in data repository
6. Data persisted with commit message and timestamp

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Vite will automatically try port 3001, 3002, etc.
# Or manually specify:
npm run dev -- --port 3005
```

**GitHub API rate limit:**
- You have 5000 requests/hour with PAT token
- Check remaining: Visit https://api.github.com/rate_limit
- Wait for reset or optimize request patterns

**Migration failed:**
- Ensure PAT token has access to the data repository
- Check token permissions (Contents: Read and write)
- Verify repository exists on GitHub

**Data not loading:**
- Check browser console for errors
- Verify `VITE_APP_MODE` in `.env.local`
- Ensure GitHub repository is accessible
- Check PAT token validity

## Security

- **Environment Variables**: Never commit `.env.local` (gitignored)
- **PAT Token**: Keep secure, rotate regularly, use fine-grained permissions
- **Data Repository**: Can be private for sensitive data
- **Authentication**: Currently local (username/password), can integrate GitHub OAuth

## Contributing

This project was built using a multi-agent development approach with Claude Code:

1. ✅ Requirements Gathering Agent
2. ✅ Business Requirements Agent
3. ✅ Architecture & Design Agent
4. ✅ Developer Agent
5. ✅ Code Review Agent
6. ✅ Documentation Agent

For contributions:
1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check [GITHUB_MIGRATION.md](./GITHUB_MIGRATION.md) for setup help
- Review [Troubleshooting](#troubleshooting) section
- Create an issue on GitHub

---

**Built with Claude Code** 🤖

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

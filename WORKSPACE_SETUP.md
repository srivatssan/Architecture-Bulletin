# Architecture Bulletin - Workspace Setup Guide

Welcome to the **Architecture Bulletin** project! This guide will help you set up your development environment and get the application running.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Overview](#project-overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [GitHub OAuth Setup](#github-oauth-setup)
- [GitHub Repository Setup](#github-repository-setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Deployment to GitHub Pages](#deployment-to-github-pages)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- A **GitHub account** ([Sign up](https://github.com/))

Verify installations:
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
git --version
```

## 📖 Project Overview

**Architecture Bulletin** is a team deliverables bulletin board application that:

- ✅ Runs as a static React app on GitHub Pages
- ✅ Uses GitHub as the backend storage (via GitHub API)
- ✅ Supports admin and architect user roles
- ✅ Manages tasks with statuses: New, Assigned-InProgress, Closed
- ✅ Enables file attachments and threaded conversations
- ✅ Authenticates users via GitHub OAuth

### Tech Stack

- **Frontend**: Vite + React + JavaScript
- **Styling**: Tailwind CSS
- **State Management**: Context API + Hooks
- **Routing**: React Router
- **Backend**: GitHub API (via Octokit)
- **Authentication**: GitHub OAuth
- **Deployment**: GitHub Pages
- **Testing**: Vitest + React Testing Library

## 📦 Installation

1. **Navigate to the project directory:**
   ```bash
   cd Architecture-Bulletin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install all required packages listed in `package.json`.

## ⚙️ Configuration

### Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and configure the following variables:**

   ```env
   # GitHub OAuth Client ID (see GitHub OAuth Setup below)
   VITE_GITHUB_CLIENT_ID=your_actual_client_id

   # GitHub Repository for storing bulletin data
   VITE_GITHUB_REPO_OWNER=your_github_username
   VITE_GITHUB_REPO_NAME=architecture-bulletin-data

   # Application Configuration
   VITE_APP_TITLE=Architecture Bulletin
   VITE_APP_DESCRIPTION=Team Deliverables Bulletin Board
   ```

## 🔐 GitHub OAuth Setup

To enable GitHub authentication, you need to create a GitHub OAuth App:

### Step 1: Create OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: Architecture Bulletin
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/callback`
4. Click **"Register application"**

### Step 2: Get Client ID and Secret

1. After creating the app, you'll see your **Client ID** - copy this
2. Generate a new **Client Secret** and copy it (you'll need this for production)
3. Add the **Client ID** to your `.env` file:
   ```env
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   ```

### Step 3: Update for Production

When deploying to GitHub Pages, update the OAuth App settings:
- **Homepage URL**: `https://yourusername.github.io/Architecture-Bulletin/`
- **Authorization callback URL**: `https://yourusername.github.io/Architecture-Bulletin/callback`

## 📂 GitHub Repository Setup

This application stores bulletins, tasks, and artifacts in a separate GitHub repository.

### Create Data Repository

1. Create a new GitHub repository named `architecture-bulletin-data` (or your preferred name)
2. Initialize it with a README
3. Create the following directory structure:

   ```
   architecture-bulletin-data/
   ├── bulletins/           # Bulletin posts
   ├── tasks/               # Task definitions
   ├── artifacts/           # Uploaded artifacts
   └── conversations/       # Task conversations
   ```

4. Update your `.env` file with the repository details:
   ```env
   VITE_GITHUB_REPO_OWNER=your_username
   VITE_GITHUB_REPO_NAME=architecture-bulletin-data
   ```

## 🚀 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will open at: `http://localhost:3000`

### Production Build

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests with Vitest |
| `npm run test:ui` | Run tests with UI interface |
| `npm run test:coverage` | Generate test coverage report |
| `npm run deploy` | Build and deploy to GitHub Pages |

## 📁 Project Structure

```
Architecture-Bulletin/
├── .agent-system/          # Agent system configuration (if applicable)
├── docs/                   # Documentation
│   ├── requirements/       # Business requirements
│   ├── architecture/       # Architecture documents
│   ├── testing/           # Test documentation
│   ├── deployment/        # Deployment guides
│   └── tech-stack.json    # Tech stack decisions
├── src/                   # Source code
│   ├── components/        # React components (to be created)
│   ├── contexts/          # Context API providers (to be created)
│   ├── hooks/             # Custom React hooks (to be created)
│   ├── services/          # API services (GitHub API integration)
│   ├── utils/             # Utility functions
│   ├── test/              # Test setup
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles with Tailwind
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   ├── functional/        # Functional tests
│   └── regression/        # Regression tests
├── public/                # Static assets
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vitest.config.js       # Vitest test configuration
├── .eslintrc.cjs          # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md              # Project documentation
```

## 🔄 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write code in `src/`
- Follow the existing code style
- Add tests for new features

### 3. Run Tests
```bash
npm run test
```

### 4. Lint and Format
```bash
npm run lint
npm run format
```

### 5. Commit Changes
```bash
git add .
git commit -m "feat: your feature description"
```

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

## 🌐 Deployment to GitHub Pages

### First-Time Deployment Setup

1. **Install gh-pages** (already in devDependencies):
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `vite.config.js`** base path (already configured):
   ```js
   base: '/Architecture-Bulletin/'
   ```

3. **Update your GitHub OAuth app** callback URL to production URL

### Deploy

Deploy to GitHub Pages:

```bash
npm run deploy
```

This will:
1. Build the production bundle
2. Push the `dist/` folder to the `gh-pages` branch
3. Make it available at: `https://yourusername.github.io/Architecture-Bulletin/`

### Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** section
3. Set source to `gh-pages` branch
4. Save

Your app will be live in a few minutes!

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.js
```

### Issue: OAuth callback fails

**Solution:**
- Verify your GitHub OAuth app callback URL matches your deployment URL
- Check that `VITE_GITHUB_CLIENT_ID` is correctly set in `.env`
- Ensure you're using HTTPS for production

### Issue: GitHub API rate limit exceeded

**Solution:**
- GitHub API has rate limits (60 requests/hour for unauthenticated, 5000/hour for authenticated)
- Authenticate requests with a personal access token
- Implement caching to reduce API calls

### Issue: Module not found errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Vite build fails

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Issue: Tailwind styles not applying

**Solution:**
- Verify `@tailwind` directives are in `src/index.css`
- Check `tailwind.config.js` content paths include your files
- Restart the dev server

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Octokit Documentation](https://octokit.github.io/rest.js/)
- [Vitest Documentation](https://vitest.dev/)

## 🤝 Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review the documentation links above
3. Search existing GitHub issues
4. Create a new issue with details about your problem

## ✅ Next Steps

After completing this setup:

1. ✅ Dependencies installed
2. ✅ Environment configured
3. ✅ GitHub OAuth app created
4. ✅ Data repository created
5. ✅ Development server running

**You're ready to proceed with the Business Requirements Agent!**

Run `/agent-business-requirements` to define the features and user stories.

---

**Happy Coding!** 🚀

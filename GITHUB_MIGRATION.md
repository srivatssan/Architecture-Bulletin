# GitHub Backend Migration Guide

This guide will help you migrate your Architecture Bulletin application from local storage to GitHub repository backend.

## Current Status

✅ GitHub Personal Access Token configured
✅ Migration script created
✅ GitHub integration code implemented
⏳ Awaiting final configuration steps

## Prerequisites

- [x] GitHub account
- [x] GitHub Personal Access Token (fine-grained) with Contents read/write permission
- [x] Node.js 18+ installed
- [x] All dependencies installed (`npm install`)

## Step-by-Step Migration

### Step 1: Update Environment Configuration

Open `.env.local` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```bash
# Before
VITE_GITHUB_REPO_OWNER=YOUR_GITHUB_USERNAME

# After (example)
VITE_GITHUB_REPO_OWNER=your-actual-github-username
```

The file should look like this:

```env
# GitHub Configuration
VITE_GITHUB_REPO_OWNER=your-actual-github-username
VITE_GITHUB_DATA_REPO=architecture-bulletin-data
VITE_GITHUB_BRANCH=main
VITE_GITHUB_PAT=your-github-personal-access-token

# Application Mode ('local' or 'github')
VITE_APP_MODE=local
```

### Step 2: Run Migration Script

The migration script will:
1. Create a new GitHub repository called `architecture-bulletin-data`
2. Upload all your local data files to the repository

Run the migration:

```bash
npm run migrate
```

You will see:
- Confirmation prompt to create the repository
- Progress of each file upload
- Final summary of migration results

**Expected output:**
```
╔════════════════════════════════════════════════════╗
║  Architecture Bulletin - GitHub Migration Script  ║
╚════════════════════════════════════════════════════╝

Configuration:
  Owner: your-github-username
  Repository: architecture-bulletin-data
  Branch: main
  Local Data Path: /path/to/public/local-data

🔍 Checking if repository exists...
⚠️  Repository not found

📝 Repository does not exist. Create it now? (y/n): y

🔨 Creating repository architecture-bulletin-data...
✅ Repository created successfully

📂 Scanning local data files...
Found X files to migrate

📤 Uploading files to GitHub...

  ✅ config/architects.json
  ✅ config/statuses.json
  ✅ posts/post-0001.json
  ...

╔════════════════════════════════════════════════════╗
║                 Migration Summary                  ║
╚════════════════════════════════════════════════════╝

  Total Files: X
  ✅ Successful: X
  ❌ Failed: 0

  Repository URL: https://github.com/your-username/architecture-bulletin-data

🎉 Migration completed successfully!
```

### Step 3: Verify Migration

1. Visit your new repository at:
   ```
   https://github.com/your-username/architecture-bulletin-data
   ```

2. Check that all files are present:
   - `config/architects.json`
   - `config/statuses.json`
   - `posts/*.json`
   - `attachments/*` (if any)
   - `notifications/*.json`

### Step 4: Switch to GitHub Mode

Once migration is successful, update `.env.local`:

```bash
# Change from:
VITE_APP_MODE=local

# To:
VITE_APP_MODE=github
```

### Step 5: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Start again
npm run dev
```

You should see in the console:
```
GitHub Octokit initialized successfully
```

### Step 6: Test the Application

1. **Login** - Verify authentication works
2. **Dashboard** - Check that posts load from GitHub
3. **Create Post** - Create a new post (it will be saved to GitHub)
4. **Upload Attachments** - Upload files (they will go to GitHub)
5. **Chat** - Send messages (saved to GitHub)
6. **Verify on GitHub** - Check the repository to see new commits

## Troubleshooting

### Error: "Please update VITE_GITHUB_REPO_OWNER"
- You forgot to replace `YOUR_GITHUB_USERNAME` in `.env.local`
- Update it with your actual GitHub username

### Error: "Failed to create repository"
- Repository might already exist
- Check if you have permissions to create repositories
- Verify your PAT token has correct permissions

### Error: "Rate limit exceeded"
- GitHub API has rate limits
- Wait a few minutes and try again
- The script includes automatic retries and delays

### Migration completed with errors
- Some files may have failed to upload
- Check the error messages in the console
- Re-run the migration script (it will skip already uploaded files)

### Data not loading in GitHub mode
- Check browser console for errors
- Verify `VITE_APP_MODE=github` in `.env.local`
- Restart development server
- Check repository permissions (should be public or PAT has access)

## Repository Structure

Your GitHub repository will have this structure:

```
architecture-bulletin-data/
├── config/
│   ├── architects.json       # Architect list
│   ├── statuses.json         # Status definitions
│   └── settings.json         # App settings
├── posts/
│   ├── post-0001.json        # Individual post files
│   ├── post-0002.json
│   └── ...
├── attachments/
│   └── post-XXXX/           # Organized by post ID
│       ├── topic-file.pdf
│       └── proof/
│           └── proof-file.png
├── notifications/
│   └── admin-notifications.json
└── README.md                 # Auto-generated
```

## Benefits of GitHub Backend

✅ **Persistent Storage** - Data is never lost, even if you clear browser storage
✅ **Version Control** - Every change is tracked with commit history
✅ **Collaboration** - Multiple users can access the same data
✅ **Backup** - GitHub provides automatic backups
✅ **Portability** - Deploy anywhere, data stays in GitHub
✅ **Free** - GitHub offers free repository hosting

## Security Notes

⚠️ **Important**: Your `.env.local` file contains your GitHub PAT token. This file is already in `.gitignore` and should NEVER be committed to version control.

- **Keep your PAT token secure**
- **Don't share your `.env.local` file**
- **If token is compromised, revoke it immediately from GitHub settings**
- **Consider making the data repository private if it contains sensitive information**

## Rollback to Local Mode

If you need to switch back to local storage:

1. Update `.env.local`:
   ```bash
   VITE_APP_MODE=local
   ```

2. Restart development server

Your local data is still in `public/local-data/` and will be used again.

## Next Steps

After successful migration:

1. ✅ Remove `public/local-data/` (optional - keep as backup for now)
2. ✅ Deploy application with GitHub backend
3. ✅ Share repository URL with team members
4. ✅ Set up additional architects with their own PAT tokens

## Support

If you encounter issues:
1. Check console for error messages
2. Verify GitHub repository exists and is accessible
3. Check PAT token permissions
4. Review this guide step by step

---

**Generated by Architecture Bulletin Migration Tool**
*Last Updated: 2025-11-19*

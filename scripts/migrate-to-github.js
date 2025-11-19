/**
 * Migration Script: Local Data to GitHub
 *
 * This script migrates all local data files to a GitHub repository.
 *
 * Prerequisites:
 * 1. Create a GitHub repository (e.g., "architecture-bulletin-data")
 * 2. Update .env.local with your GitHub username and PAT token
 * 3. Install dependencies: npm install
 *
 * Usage:
 * node scripts/migrate-to-github.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GITHUB_OWNER = process.env.VITE_GITHUB_REPO_OWNER;
const GITHUB_REPO = process.env.VITE_GITHUB_DATA_REPO || 'architecture-bulletin-data';
const GITHUB_BRANCH = process.env.VITE_GITHUB_BRANCH || 'main';
const GITHUB_PAT = process.env.VITE_GITHUB_PAT;

const LOCAL_DATA_PATH = path.join(__dirname, '..', 'public', 'local-data');

// Validate configuration
if (!GITHUB_OWNER || GITHUB_OWNER === 'YOUR_GITHUB_USERNAME') {
  console.error('❌ Error: Please update VITE_GITHUB_REPO_OWNER in .env.local with your GitHub username');
  process.exit(1);
}

if (!GITHUB_PAT) {
  console.error('❌ Error: VITE_GITHUB_PAT not found in .env.local');
  process.exit(1);
}

// Initialize Octokit
const octokit = new Octokit({
  auth: GITHUB_PAT,
  userAgent: 'Architecture-Bulletin-Migration v1.0',
});

/**
 * Check if repository exists
 */
async function checkRepository() {
  try {
    console.log(`\n🔍 Checking if repository ${GITHUB_OWNER}/${GITHUB_REPO} exists...`);
    await octokit.rest.repos.get({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
    });
    console.log('✅ Repository exists');
    return true;
  } catch (error) {
    if (error.status === 404) {
      console.log('⚠️  Repository not found');
      return false;
    }
    throw error;
  }
}

/**
 * Create repository
 */
async function createRepository() {
  try {
    console.log(`\n🔨 Creating repository ${GITHUB_REPO}...`);
    await octokit.rest.repos.createForAuthenticatedUser({
      name: GITHUB_REPO,
      description: 'Data storage for Architecture Bulletin application',
      private: false,
      auto_init: true, // Initialize with README
    });
    console.log('✅ Repository created successfully');

    // Wait for repository initialization
    console.log('⏳ Waiting for repository initialization...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error('❌ Failed to create repository:', error.message);
    throw error;
  }
}

/**
 * Get all files recursively
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

/**
 * Upload file to GitHub
 */
async function uploadFile(localFilePath, githubPath, retries = 3) {
  try {
    // Read file content
    const fileContent = fs.readFileSync(localFilePath);
    const isTextFile = localFilePath.endsWith('.json') || localFilePath.endsWith('.txt') || localFilePath.endsWith('.md');

    // Convert to base64
    const contentBase64 = isTextFile
      ? Buffer.from(fileContent).toString('base64')
      : fileContent.toString('base64');

    // Upload to GitHub
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: githubPath,
      message: `Migrate: ${githubPath}`,
      content: contentBase64,
      branch: GITHUB_BRANCH,
    });

    console.log(`  ✅ ${githubPath}`);
  } catch (error) {
    if (retries > 0 && error.status === 409) {
      // File already exists, try to get SHA and update
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          path: githubPath,
        });

        const fileContent = fs.readFileSync(localFilePath);
        const contentBase64 = Buffer.from(fileContent).toString('base64');

        await octokit.rest.repos.createOrUpdateFileContents({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          path: githubPath,
          message: `Update: ${githubPath}`,
          content: contentBase64,
          sha: data.sha,
          branch: GITHUB_BRANCH,
        });

        console.log(`  ✅ ${githubPath} (updated)`);
      } catch (updateError) {
        console.error(`  ❌ ${githubPath}: ${updateError.message}`);
      }
    } else {
      console.error(`  ❌ ${githubPath}: ${error.message}`);
      if (retries > 0) {
        console.log(`  🔄 Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return uploadFile(localFilePath, githubPath, retries - 1);
      }
    }
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  Architecture Bulletin - GitHub Migration Script  ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log('Configuration:');
  console.log(`  Owner: ${GITHUB_OWNER}`);
  console.log(`  Repository: ${GITHUB_REPO}`);
  console.log(`  Branch: ${GITHUB_BRANCH}`);
  console.log(`  Local Data Path: ${LOCAL_DATA_PATH}`);

  // Check if local data directory exists
  if (!fs.existsSync(LOCAL_DATA_PATH)) {
    console.error(`\n❌ Error: Local data directory not found: ${LOCAL_DATA_PATH}`);
    process.exit(1);
  }

  // Check/Create repository
  const repoExists = await checkRepository();
  if (!repoExists) {
    console.log('\n📝 Repository does not exist. Creating automatically...');
    await createRepository();
  }

  // Get all files
  console.log('\n📂 Scanning local data files...');
  const allFiles = getAllFiles(LOCAL_DATA_PATH);
  console.log(`Found ${allFiles.length} files to migrate`);

  // Upload files
  console.log('\n📤 Uploading files to GitHub...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const filePath of allFiles) {
    // Get relative path from local-data directory
    const relativePath = path.relative(LOCAL_DATA_PATH, filePath);
    const githubPath = relativePath.replace(/\\/g, '/'); // Convert Windows paths to Unix

    try {
      await uploadFile(filePath, githubPath);
      successCount++;
    } catch (error) {
      errorCount++;
    }

    // Rate limit protection - wait 100ms between uploads
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║                 Migration Summary                  ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  console.log(`  Total Files: ${allFiles.length}`);
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Failed: ${errorCount}`);
  console.log(`\n  Repository URL: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`);

  if (errorCount === 0) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Verify the data at the repository URL above');
    console.log('  2. Update VITE_APP_MODE=github in .env.local');
    console.log('  3. Restart your development server');
  } else {
    console.log('\n⚠️  Migration completed with errors. Please check the logs above.');
  }
}

// Run migration
migrate().catch((error) => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});

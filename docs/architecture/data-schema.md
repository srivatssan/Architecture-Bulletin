# Data Schema - GitHub File Structure

**Project:** Architecture-Bulletin
**Version:** 1.0
**Date:** 2025-11-18

## Overview

Since Architecture-Bulletin uses GitHub repository as the backend storage, the "database schema" is represented as a structured file system with JSON files. This document defines the structure of the data repository and the schema for each JSON file type.

## Repository Structure

```
architecture-bulletin-data/         # Data repository (separate from app repo)
├── README.md                        # Repository documentation
├── .gitignore                       # Ignore temp files
├── config/                          # System configuration
│   ├── architects.json              # List of architects
│   ├── statuses.json                # Status configurations
│   └── settings.json                # App settings
├── posts/                           # Bulletin posts
│   ├── post-0001.json
│   ├── post-0002.json
│   └── ...
├── attachments/                     # Post attachments
│   ├── post-0001/
│   │   ├── requirements-doc.pdf
│   │   ├── architecture-diagram.png
│   │   └── ...
│   ├── post-0002/
│   │   └── ...
│   └── ...
├── artifacts/                       # Deliverable artifacts (versioned)
│   ├── post-0001/
│   │   ├── v1/
│   │   │   ├── design-document.pdf
│   │   │   ├── metadata.json       # Version metadata
│   │   │   └── ...
│   │   ├── v2/
│   │   │   ├── design-document-revised.pdf
│   │   │   ├── metadata.json
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── conversations/                   # Comment threads
│   ├── post-0001-comments.json
│   ├── post-0002-comments.json
│   └── ...
├── closure-notes/                   # Architect closure notes
│   ├── post-0001-notes.json
│   ├── post-0002-notes.json
│   └── ...
├── notifications/                   # Admin notifications
│   └── notifications.json           # Centralized notifications
└── archive/                         # Archived posts
    ├── archived-posts-2025-q1.json
    ├── archived-posts-2025-q2.json
    └── ...
```

## JSON Schema Definitions

### 1. Post Schema

**File:** `posts/post-{id}.json`

```json
{
  "id": "post-0001",
  "title": "API Gateway Architecture Design",
  "description": "Design and document the API Gateway architecture for our microservices platform. Include security considerations, rate limiting strategy, and monitoring approach.",
  "concernedParties": [
    "Platform Team",
    "Security Team",
    "DevOps Team"
  ],
  "status": "Assigned-InProgress",
  "assignedArchitects": [
    "john-doe-gh",
    "jane-smith-gh"
  ],
  "adminAssigned": true,
  "attachments": [
    {
      "filename": "current-architecture.png",
      "path": "attachments/post-0001/current-architecture.png",
      "size": 524288,
      "uploadedBy": "admin-user",
      "uploadedAt": "2025-11-18T10:00:00Z",
      "type": "image/png"
    },
    {
      "filename": "requirements-doc.pdf",
      "path": "attachments/post-0001/requirements-doc.pdf",
      "size": 1048576,
      "uploadedBy": "admin-user",
      "uploadedAt": "2025-11-18T10:05:00Z",
      "type": "application/pdf"
    }
  ],
  "createdAt": "2025-11-18T10:00:00Z",
  "createdBy": "admin-user",
  "updatedAt": "2025-11-18T14:30:00Z",
  "updatedBy": "admin-user",
  "submittedAt": null,
  "submittedBy": null,
  "closedAt": null,
  "closedBy": null,
  "approvedBy": null,
  "isArchived": false,
  "archivedAt": null
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique post identifier (format: post-XXXX) |
| title | string | Yes | Post title (max 200 chars) |
| description | string | Yes | Detailed description |
| concernedParties | string[] | Yes | List of stakeholders/teams |
| status | string | Yes | Current status (see Status Schema) |
| assignedArchitects | string[] | No | GitHub usernames of assigned architects |
| adminAssigned | boolean | Yes | True if admin assigned (locked), false if self-assigned |
| attachments | object[] | No | Array of attachment metadata |
| createdAt | ISO8601 | Yes | Creation timestamp |
| createdBy | string | Yes | GitHub username of creator |
| updatedAt | ISO8601 | Yes | Last update timestamp |
| updatedBy | string | Yes | GitHub username of last updater |
| submittedAt | ISO8601 | No | Timestamp when submitted for review |
| submittedBy | string | No | Architect who submitted |
| closedAt | ISO8601 | No | Timestamp when closed |
| closedBy | string | No | Admin who closed the task |
| approvedBy | string | No | Admin who approved (same as closedBy) |
| isArchived | boolean | Yes | Whether post is archived |
| archivedAt | ISO8601 | No | Timestamp when archived |

### 2. Architect Configuration Schema

**File:** `config/architects.json`

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-18T10:00:00Z",
  "updatedBy": "admin-user",
  "architects": [
    {
      "id": "arch-001",
      "githubUsername": "john-doe-gh",
      "displayName": "John Doe",
      "email": "john.doe@company.com",
      "specialization": "Backend Architecture",
      "status": "active",
      "addedAt": "2025-11-01T09:00:00Z",
      "addedBy": "admin-user",
      "deactivatedAt": null,
      "deactivatedBy": null
    },
    {
      "id": "arch-002",
      "githubUsername": "jane-smith-gh",
      "displayName": "Jane Smith",
      "email": "jane.smith@company.com",
      "specialization": "Frontend Architecture",
      "status": "active",
      "addedAt": "2025-11-01T09:00:00Z",
      "addedBy": "admin-user",
      "deactivatedAt": null,
      "deactivatedBy": null
    }
  ]
}
```

### 3. Status Configuration Schema

**File:** `config/statuses.json`

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-18T10:00:00Z",
  "updatedBy": "admin-user",
  "statuses": [
    {
      "id": "status-new",
      "name": "New",
      "description": "Task created but not yet assigned or started",
      "color": "#6B7280",
      "order": 1,
      "isDefault": true,
      "canTransitionTo": ["status-assigned"],
      "adminOnly": false,
      "triggersNotification": false
    },
    {
      "id": "status-assigned",
      "name": "Assigned-InProgress",
      "description": "Task assigned to architect(s) and work is in progress",
      "color": "#3B82F6",
      "order": 2,
      "isDefault": false,
      "canTransitionTo": ["status-submitted", "status-escalate"],
      "adminOnly": false,
      "triggersNotification": false
    },
    {
      "id": "status-submitted",
      "name": "Submitted for Review",
      "description": "Architect has submitted deliverable for admin review",
      "color": "#8B5CF6",
      "order": 3,
      "isDefault": false,
      "canTransitionTo": ["status-pending", "status-assigned"],
      "adminOnly": false,
      "triggersNotification": false
    },
    {
      "id": "status-pending",
      "name": "Pending Review",
      "description": "Admin is reviewing submitted deliverable",
      "color": "#F59E0B",
      "order": 4,
      "isDefault": false,
      "canTransitionTo": ["status-closed", "status-assigned", "status-escalate"],
      "adminOnly": true,
      "triggersNotification": false
    },
    {
      "id": "status-escalate",
      "name": "Escalate",
      "description": "Task is blocked or requires urgent attention",
      "color": "#EF4444",
      "order": 5,
      "isDefault": false,
      "canTransitionTo": ["status-assigned", "status-closed"],
      "adminOnly": false,
      "triggersNotification": true,
      "notificationType": "escalation"
    },
    {
      "id": "status-closed",
      "name": "Closed",
      "description": "Task completed and approved by admin",
      "color": "#10B981",
      "order": 6,
      "isDefault": false,
      "canTransitionTo": [],
      "adminOnly": true,
      "triggersNotification": true,
      "notificationType": "closure"
    }
  ]
}
```

### 4. Settings Configuration Schema

**File:** `config/settings.json`

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-18T10:00:00Z",
  "updatedBy": "admin-user",
  "taskLimit": {
    "maxActiveTasks": 50,
    "bannerMessage": "We've reached our task capacity of 50 items. Please consider archiving completed tasks to free up space.",
    "showBanner": true
  },
  "adminUsers": [
    "admin-user",
    "admin-user-2"
  ],
  "repositoryConfig": {
    "owner": "your-org",
    "dataRepo": "architecture-bulletin-data"
  },
  "features": {
    "allowSelfAssignment": true,
    "requireApprovalForClosure": true,
    "enableNotifications": true,
    "enableArchive": true,
    "enableExport": true
  }
}
```

### 5. Artifact Version Metadata Schema

**File:** `artifacts/post-{id}/v{version}/metadata.json`

```json
{
  "version": "v1",
  "postId": "post-0001",
  "uploadedBy": "john-doe-gh",
  "uploadedAt": "2025-11-18T15:00:00Z",
  "files": [
    {
      "filename": "api-gateway-design.pdf",
      "path": "artifacts/post-0001/v1/api-gateway-design.pdf",
      "size": 2097152,
      "type": "application/pdf",
      "sha": "a1b2c3d4e5f6...",
      "description": "Initial design document for API Gateway"
    },
    {
      "filename": "architecture-diagram.png",
      "path": "artifacts/post-0001/v1/architecture-diagram.png",
      "size": 524288,
      "type": "image/png",
      "sha": "f6e5d4c3b2a1...",
      "description": "System architecture diagram"
    }
  ],
  "notes": "Initial version based on requirements. Includes security and monitoring sections.",
  "isCurrent": false
}
```

### 6. Conversation Schema

**File:** `conversations/post-{id}-comments.json`

```json
{
  "postId": "post-0001",
  "comments": [
    {
      "id": "comment-001",
      "author": "jane-smith-gh",
      "authorRole": "architect",
      "text": "What is the expected timeline for this deliverable?",
      "createdAt": "2025-11-18T11:00:00Z",
      "updatedAt": "2025-11-18T11:00:00Z",
      "parentId": null,
      "replies": [
        {
          "id": "reply-001",
          "author": "admin-user",
          "authorRole": "admin",
          "text": "Timeline is 2 weeks from assignment. Please let me know if you need any clarifications on the requirements.",
          "createdAt": "2025-11-18T11:30:00Z",
          "updatedAt": "2025-11-18T11:30:00Z",
          "parentId": "comment-001"
        }
      ]
    },
    {
      "id": "comment-002",
      "author": "john-doe-gh",
      "authorRole": "architect",
      "text": "Uploaded v1 of the design document. Please review the security section.",
      "createdAt": "2025-11-18T15:05:00Z",
      "updatedAt": "2025-11-18T15:05:00Z",
      "parentId": null,
      "replies": []
    }
  ]
}
```

### 7. Closure Notes Schema

**File:** `closure-notes/post-{id}-notes.json`

```json
{
  "postId": "post-0001",
  "notes": [
    {
      "id": "note-001",
      "author": "john-doe-gh",
      "text": "Implemented using API Gateway pattern with rate limiting and authentication. Considered serverless approach but chose traditional gateway for better control over routing and monitoring. Security implemented via OAuth2 + JWT tokens. All recommendations from security team incorporated.",
      "createdAt": "2025-11-18T16:00:00Z",
      "updatedAt": "2025-11-18T16:00:00Z",
      "version": "v1"
    },
    {
      "id": "note-002",
      "author": "john-doe-gh",
      "text": "Updated design based on admin feedback. Added more details on monitoring and alerting strategy.",
      "createdAt": "2025-11-19T10:00:00Z",
      "updatedAt": "2025-11-19T10:00:00Z",
      "version": "v2"
    }
  ]
}
```

### 8. Notifications Schema

**File:** `notifications/notifications.json`

```json
{
  "lastUpdated": "2025-11-18T16:30:00Z",
  "notifications": [
    {
      "id": "notif-001",
      "type": "escalation",
      "priority": "high",
      "postId": "post-0001",
      "postTitle": "API Gateway Architecture Design",
      "message": "Task escalated by john-doe-gh",
      "escalatedBy": "john-doe-gh",
      "reason": "Blocked waiting for infrastructure team approval",
      "createdAt": "2025-11-18T16:00:00Z",
      "isRead": false,
      "readBy": [],
      "targetUsers": ["admin-user", "admin-user-2"]
    },
    {
      "id": "notif-002",
      "type": "closure",
      "priority": "normal",
      "postId": "post-0002",
      "postTitle": "Database Schema Design",
      "message": "Task closed by admin-user",
      "closedBy": "admin-user",
      "closedAt": "2025-11-18T16:30:00Z",
      "createdAt": "2025-11-18T16:30:00Z",
      "isRead": false,
      "readBy": [],
      "targetUsers": ["admin-user", "admin-user-2"]
    }
  ]
}
```

### 9. Archive Schema

**File:** `archive/archived-posts-{year}-{quarter}.json`

```json
{
  "period": "2025-Q1",
  "archivedAt": "2025-03-31T23:59:59Z",
  "archivedBy": "admin-user",
  "postCount": 25,
  "posts": [
    {
      "id": "post-0001",
      "title": "API Gateway Architecture Design",
      "status": "Closed",
      "closedAt": "2025-01-15T10:00:00Z",
      "archiveReason": "Completed successfully",
      "originalData": {
        "... full post JSON ..."
      },
      "conversationHistory": {
        "... full conversation JSON ..."
      },
      "artifacts": [
        {
          "version": "v1",
          "metadata": "... artifact metadata ..."
        },
        {
          "version": "v2",
          "metadata": "... artifact metadata ..."
        }
      ]
    }
  ]
}
```

## Data Validation Rules

### Post Validation
- `id` must be unique and follow format `post-XXXX`
- `title` required, max 200 characters
- `description` required, max 5000 characters
- `concernedParties` must be array with at least 1 item
- `status` must match a configured status ID
- `assignedArchitects` must be valid GitHub usernames from architects config
- File attachments max 10MB each

### Architect Validation
- `githubUsername` must be unique
- `displayName` required
- `status` must be "active" or "inactive"

### Status Validation
- `id` must be unique
- `name` required, max 50 characters
- `color` must be valid hex color code
- `order` must be unique integer

### Conversation Validation
- `author` must be valid GitHub username
- `text` required, max 2000 characters per comment
- Thread depth limited to 2 levels (comment + reply)

## Indexing Strategy

Since GitHub repository files don't have traditional database indexes, we implement caching and client-side indexing:

**Client-Side Indexes (in memory):**
1. Posts by ID (Map)
2. Posts by Status (Grouped array)
3. Posts by Assigned Architect (Grouped array)
4. Posts by Date (Sorted array)

**Optimization:**
- Fetch all posts once on app load
- Store in Context state
- Update locally on mutations
- Periodic refresh (every 5 minutes or on-demand)

## Data Integrity

**Referential Integrity:**
- Post references must exist before creating conversations/artifacts
- Architect usernames must exist in config before assignment
- Status IDs must exist in config before use

**Consistency:**
- Atomic commits: All related file changes in single commit
- Commit messages: Structured format for audit trail
  ```
  feat: Create post-0001
  - Created post JSON
  - Uploaded 2 attachments
  - By: admin-user
  ```

**Audit Trail:**
- Git history provides complete audit log
- Every change tracked with timestamp and author
- Can rollback to any previous state via Git

## Migration Strategy

**Initial Setup:**
1. Create data repository
2. Initialize with template config files
3. Set up branch protection (optional)
4. Configure GitHub OAuth app

**Schema Changes:**
- Add `version` field to all JSON files
- If schema changes, increment version
- Write migration scripts to update existing files
- Use GitHub Actions to automate migrations

**Backup:**
- Git history is the backup
- Additional backup: Periodic export to ZIP (via Export feature)
- Store exports in separate repository or cloud storage

## Query Patterns

**Get All Posts:**
```javascript
// Fetch posts directory contents
const { data } = await octokit.rest.repos.getContent({
  owner, repo, path: 'posts'
});

// Fetch each post JSON
const posts = await Promise.all(
  data.map(file => fetchPostJson(file.path))
);
```

**Get Posts by Status:**
```javascript
const activePosts = posts.filter(p => p.status === 'Assigned-InProgress');
```

**Get Posts by Architect:**
```javascript
const myPosts = posts.filter(p =>
  p.assignedArchitects.includes(currentUser)
);
```

**Search Posts:**
```javascript
const results = posts.filter(p =>
  p.title.toLowerCase().includes(query.toLowerCase()) ||
  p.description.toLowerCase().includes(query.toLowerCase())
);
```

## Performance Considerations

**File Size Limits:**
- Individual file size: < 1MB recommended
- Large attachments: Use Git LFS if > 1MB
- Total repository size: < 1GB recommended

**API Call Optimization:**
- Batch fetch posts on load
- Cache in Context state
- Incremental updates for single posts
- Debounce search queries

**Conflict Resolution:**
- Use `sha` parameter for updates to ensure version consistency
- If conflict detected, fetch latest and prompt user
- Implement optimistic updates with rollback on error

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Author:** Architecture & Design Agent
**Status:** Ready for Development

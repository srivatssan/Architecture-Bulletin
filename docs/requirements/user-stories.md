# User Stories

## Epic 1: User Authentication

Priority: **Must Have**

### User Story 1.1: GitHub OAuth Login
**As a** user (admin or architect)
**I want** to log in using my GitHub account
**So that** I can securely access the bulletin board without creating separate credentials

**Acceptance Criteria:**
- [ ] User sees "Login with GitHub" button on landing page
- [ ] Clicking button redirects to GitHub OAuth authorization page
- [ ] After authorization, user is redirected back to application
- [ ] User's GitHub username and avatar are displayed in header
- [ ] User role (admin/architect) is determined based on GitHub username configuration
- [ ] Session persists across browser refreshes
- [ ] User can log out and session is cleared

**Edge Cases:**
- OAuth authorization denied by user → show error message and return to login
- Network error during OAuth → show retry option
- User not in configured admin/architect list → show "unauthorized" message

---

## Epic 2: Bulletin Board Display

Priority: **Must Have**

### User Story 2.1: View All Bulletin Posts
**As an** architect or admin
**I want** to see all bulletin posts in a list view
**So that** I can understand the current team workload and priorities

**Acceptance Criteria:**
- [ ] Bulletin board displays all posts (both assigned and unassigned)
- [ ] Each post card shows: title, status, assigned architects, created date
- [ ] Posts are sorted by created date (newest first) by default
- [ ] Closed posts are visually distinct (grayed out) but still visible
- [ ] Active posts are highlighted with clear visual distinction
- [ ] Empty state message shown when no posts exist
- [ ] Loading state shown while fetching from GitHub

**Edge Cases:**
- No posts exist → show "No bulletins yet" message with "Create Post" button for admins
- GitHub API error → show error message with retry option
- 50+ posts → banner message appears warning admin of task limit

### User Story 2.2: Search and Filter Posts
**As a** user
**I want** to search and filter bulletin posts
**So that** I can quickly find specific tasks or deliverables

**Acceptance Criteria:**
- [ ] Search box filters posts by title, description, or concerned parties
- [ ] Filter dropdown for status (New, Assigned-InProgress, etc.)
- [ ] Filter dropdown for assigned architect (including "Unassigned")
- [ ] Date range filter (created date)
- [ ] Multiple filters can be applied simultaneously
- [ ] Search/filter results update in real-time
- [ ] Clear all filters button resets to default view
- [ ] Filter state persists within session

**Edge Cases:**
- No results match search/filter → show "No posts found" message
- Search with special characters → properly escaped and handled

---

## Epic 3: Post Management (Admin)

Priority: **Must Have**

### User Story 3.1: Create New Bulletin Post
**As an** admin
**I want** to create a new bulletin post
**So that** I can assign architecture deliverables to the team

**Acceptance Criteria:**
- [ ] "Create New Post" button visible to admins only
- [ ] Form includes required fields: Title, Description, Concerned Parties
- [ ] File attachment field accepts one or more files (max 10MB each)
- [ ] Image attachments show preview thumbnails
- [ ] Architect dropdown allows selecting one or more architects (multi-select)
- [ ] Status dropdown with default value "New"
- [ ] Created date auto-populated on save
- [ ] Form validation prevents submission with missing required fields
- [ ] Success message shown after post creation
- [ ] User redirected to post detail view after creation

**Acceptance Criteria (Continued):**
- [ ] Post saved to GitHub repository as structured file
- [ ] Attachments uploaded to GitHub repository

**Edge Cases:**
- File size exceeds 10MB → show error and prevent upload
- Duplicate title → allow but show warning
- Network error during save → show error and allow retry without losing data
- Task limit (50) reached → show banner but allow creation with admin acknowledgment

### User Story 3.2: Edit Existing Post
**As an** admin
**I want** to edit an existing bulletin post
**So that** I can update requirements or correct mistakes

**Acceptance Criteria:**
- [ ] Edit button visible on post detail page for admins
- [ ] Edit form pre-populated with existing data
- [ ] All fields editable (title, description, concerned parties, attachments, assigned architects, status)
- [ ] Can add new attachments without removing existing ones
- [ ] Can remove existing attachments
- [ ] Updated date/timestamp recorded
- [ ] Changes saved to GitHub repository
- [ ] Success message shown after save

**Edge Cases:**
- Post modified by another admin concurrently → show conflict warning
- Network error during save → preserve changes and allow retry

### User Story 3.3: Delete Post
**As an** admin
**I want** to delete a bulletin post
**So that** I can remove cancelled or duplicate tasks

**Acceptance Criteria:**
- [ ] Delete button visible on post detail page for admins
- [ ] Confirmation dialog shown before deletion ("Are you sure?")
- [ ] Post and all associated attachments removed from GitHub
- [ ] Associated conversations and artifacts also deleted
- [ ] User redirected to bulletin board after deletion
- [ ] Success message shown

**Edge Cases:**
- Post has active conversations → show warning in confirmation dialog
- Post has submitted artifacts → show warning in confirmation dialog
- Network error during delete → show error and allow retry

### User Story 3.4: Change Post Status
**As an** admin
**I want** to change the status of a post
**So that** I can reflect the current state of the deliverable

**Acceptance Criteria:**
- [ ] Status dropdown visible on post detail page for admins
- [ ] Can select from: New, Assigned-InProgress, Submitted for Review, Pending Review, Escalate, Closed
- [ ] Changing to "Escalate" triggers notification to all admins
- [ ] Changing to "Closed" marks closed date and captures admin name
- [ ] Only admins can move status to "Closed"
- [ ] Status change saved to GitHub immediately
- [ ] Visual indicator shows status change success

**Edge Cases:**
- Status changed by another admin concurrently → show latest status
- Moving to "Closed" without artifacts → show warning but allow

### User Story 3.5: Assign/Reassign Architects
**As an** admin
**I want** to assign or reassign architects to a post
**So that** I can distribute work based on expertise and availability

**Acceptance Criteria:**
- [ ] Architect dropdown on post detail page (admins only)
- [ ] Can select multiple architects from dropdown
- [ ] Can add architects to existing assignment
- [ ] Can remove architects from assignment
- [ ] Assignment change saved to GitHub immediately
- [ ] Architects see updated assignment on their view
- [ ] Admin-assigned tasks are locked (architects cannot remove themselves)

**Edge Cases:**
- Removing all architects from assigned task → status remains but shows "Unassigned"
- Architect deleted from system but assigned to tasks → show "Unknown User" with warning

---

## Epic 4: Task Assignment (Architect)

Priority: **Must Have**

### User Story 4.1: Self-Assign to Available Task
**As an** architect
**I want** to self-assign to an available task
**So that** I can take ownership of deliverables matching my expertise

**Acceptance Criteria:**
- [ ] "Assign to Me" button visible on unassigned or partially assigned posts
- [ ] Clicking button adds architect to assigned list
- [ ] Multiple architects can self-assign to same task
- [ ] Cannot self-assign if admin has locked assignments
- [ ] Assignment saved to GitHub immediately
- [ ] Post now appears in "My Tasks" filter view
- [ ] No notification sent to admin on self-assignment

**Edge Cases:**
- Two architects self-assign simultaneously → both added to list
- Architect already assigned → button shows "Already Assigned" (disabled)
- Admin removes architect after self-assignment → architect sees updated state

### User Story 4.2: View Assigned vs Unassigned Tasks
**As an** architect
**I want** to distinguish between my assigned and unassigned tasks
**So that** I can prioritize my work

**Acceptance Criteria:**
- [ ] Assigned tasks highlighted with visual indicator (badge, color, icon)
- [ ] Filter option for "My Tasks" shows only assigned tasks
- [ ] Unassigned tasks clearly marked as available
- [ ] Task count shown for "My Tasks" in header/sidebar

**Edge Cases:**
- No assigned tasks → show "No tasks assigned yet"
- All tasks assigned to architect → show count

---

## Epic 5: Artifact Management

Priority: **Must Have**

### User Story 5.1: Upload Deliverable Artifact
**As an** architect
**I want** to upload deliverable artifacts
**So that** I can submit my work for review

**Acceptance Criteria:**
- [ ] Upload button visible on assigned tasks only
- [ ] File upload supports multiple files (max 10MB each)
- [ ] Version number auto-incremented (v1, v2, v3, etc.)
- [ ] Upload timestamp recorded
- [ ] Uploaded by (architect name) recorded
- [ ] Files saved to GitHub repository under task folder
- [ ] Success message shown after upload

**Edge Cases:**
- File exceeds 10MB → show error and prevent upload
- Network error during upload → show error and allow retry
- Unsupported file type → allow but show warning

### User Story 5.2: View Artifact Version History
**As a** user
**I want** to view all versions of uploaded artifacts
**So that** I can track iterations and access previous versions

**Acceptance Criteria:**
- [ ] Artifact section shows list of all versions
- [ ] Each version shows: version number, uploaded by, upload date, file name
- [ ] Can download any version by clicking filename
- [ ] Latest version highlighted as "Current"
- [ ] Image files show thumbnail preview
- [ ] Non-image files show file type icon

**Edge Cases:**
- No artifacts uploaded yet → show "No artifacts uploaded"
- Artifact file deleted from GitHub → show "File not found" error

### User Story 5.3: Add Closure Thoughts/Notes
**As an** architect
**I want** to add notes explaining my deliverable
**So that** admins understand my approach and decisions

**Acceptance Criteria:**
- [ ] Multi-line text area visible on assigned tasks
- [ ] Can add/edit notes multiple times
- [ ] Notes saved to GitHub with timestamp
- [ ] Notes visible to admin and assigned architects only
- [ ] Markdown formatting supported (optional enhancement)

**Edge Cases:**
- Very long notes (10,000+ characters) → allow but show character count
- Notes with special characters → properly escaped

---

## Epic 6: Conversation Threads

Priority: **Must Have**

### User Story 6.1: Start Conversation Thread
**As an** architect
**I want** to ask questions about a bulletin post
**So that** I can get clarification before or during work

**Acceptance Criteria:**
- [ ] Chat/comment section visible on all posts
- [ ] Architect can add comment even before assignment (for questions)
- [ ] Comment includes: message text, author name, timestamp
- [ ] Comments saved to GitHub repository
- [ ] Comments visible only to admin and assigned architects
- [ ] Real-time or near-real-time updates (on page refresh)

**Edge Cases:**
- Unassigned architect posts comment → visible to admins for answering
- Empty comment → validation prevents submission

### User Story 6.2: Reply to Conversation
**As an** admin or architect
**I want** to reply to comments in the thread
**So that** we can have structured discussions

**Acceptance Criteria:**
- [ ] Reply button on each comment
- [ ] Reply indented or threaded under parent comment
- [ ] Reply includes: message text, author name, timestamp
- [ ] Thread depth limited to 2 levels (comment → reply only)
- [ ] All participants in thread can see replies

**Edge Cases:**
- Very long thread (100+ comments) → paginate or scroll
- Concurrent replies → all displayed in chronological order

---

## Epic 7: Notifications

Priority: **Must Have**

### User Story 7.1: Admin Notification for Closed Task
**As an** admin
**I want** to receive notification when a task is closed
**So that** I am aware of completed deliverables

**Acceptance Criteria:**
- [ ] Notification triggered when task status changed to "Closed"
- [ ] Notification shows: task title, closed by (admin name), closed date
- [ ] Notification visible in notification center/panel
- [ ] Unread notification count shown in header
- [ ] Clicking notification navigates to task detail

**Edge Cases:**
- Multiple tasks closed simultaneously → separate notifications for each
- Notification center has 100+ notifications → paginate

### User Story 7.2: Admin Notification for Escalation
**As an** admin
**I want** to receive notification when a task is escalated
**So that** I can address urgent issues quickly

**Acceptance Criteria:**
- [ ] Notification triggered when task status changed to "Escalate"
- [ ] Notification shows: task title, escalated by, escalation reason (if provided)
- [ ] Notification marked as high priority (visual indicator)
- [ ] All admins receive the notification
- [ ] Clicking notification navigates to task detail

**Edge Cases:**
- Admin who escalated also receives notification → can be filtered out
- Escalation de-escalated (status changed) → notification remains for record

---

## Epic 8: Control Panel (Admin Configuration)

Priority: **Must Have**

### User Story 8.1: Manage Architect List
**As an** admin
**I want** to manage the list of architects
**So that** I can control who can be assigned to tasks

**Acceptance Criteria:**
- [ ] Control panel accessible to admins only
- [ ] View list of all architects (name, GitHub username, status)
- [ ] Add new architect by GitHub username
- [ ] Remove architect (with warning if assigned to active tasks)
- [ ] Activate/deactivate architect
- [ ] Architect list stored as JSON file in GitHub repository
- [ ] Changes reflected immediately in assignment dropdowns

**Edge Cases:**
- Add architect with invalid GitHub username → validate and show error
- Remove architect assigned to 10+ tasks → show detailed warning
- Architect list file corrupted → show error and allow manual fix

### User Story 8.2: Manage Status List
**As an** admin
**I want** to customize the available task statuses
**So that** I can adapt the workflow to team needs

**Acceptance Criteria:**
- [ ] View list of all status values
- [ ] Add new custom status
- [ ] Edit status label and description
- [ ] Reorder status sequence
- [ ] Cannot delete statuses in use
- [ ] Status list stored as JSON file in GitHub repository
- [ ] Changes reflected in status dropdowns

**Edge Cases:**
- Delete status used by 20+ tasks → prevent deletion, show error
- Add duplicate status name → show validation error

### User Story 8.3: Configure Task Limit Banner
**As an** admin
**I want** to customize the message shown when task limit is reached
**So that** I can provide context-specific guidance to the team

**Acceptance Criteria:**
- [ ] Text editor for banner message
- [ ] Preview of banner as it will appear
- [ ] Default message provided
- [ ] Banner message stored in GitHub configuration file
- [ ] Banner appears when active task count reaches 50
- [ ] Admin can dismiss banner but it reappears on next login

**Edge Cases:**
- Very long banner message → truncate with "Read more"
- HTML/script in message → sanitized for security

---

## Epic 9: Archive and Export

Priority: **Should Have**

### User Story 9.1: Archive Completed Tasks
**As an** admin
**I want** to archive completed tasks
**So that** the bulletin board remains focused on active work

**Acceptance Criteria:**
- [ ] Archive button visible on closed tasks
- [ ] Bulk archive option (select multiple closed tasks)
- [ ] Confirmation dialog before archiving
- [ ] Archived tasks moved to separate "Archive" view
- [ ] Archived tasks not counted toward 50-task limit
- [ ] Archived tasks remain searchable
- [ ] Can unarchive tasks if needed

**Edge Cases:**
- Archive task with ongoing conversation → preserve all data
- Attempt to archive non-closed task → show error

### User Story 9.2: Export Tasks as Archive
**As an** admin
**I want** to export tasks and artifacts as archive file
**So that** I can maintain offline records for compliance

**Acceptance Criteria:**
- [ ] Export button generates downloadable archive (ZIP)
- [ ] Archive includes: all task data (JSON), artifacts, conversations
- [ ] Can export all tasks or selected date range
- [ ] Export includes metadata (export date, exported by)
- [ ] Folder structure preserved in ZIP
- [ ] Export job shows progress indicator

**Edge Cases:**
- Export with 1000+ artifacts → show progress, may take time
- Export exceeds browser download limit → chunk into multiple files

---

## Epic 10: Image Preview

Priority: **Should Have**

### User Story 10.1: Preview Attached Images
**As a** user
**I want** to preview image attachments inline
**So that** I can quickly review diagrams without downloading

**Acceptance Criteria:**
- [ ] Image files (PNG, JPG, GIF, SVG) display as thumbnails
- [ ] Clicking thumbnail opens full-size preview modal
- [ ] Modal includes zoom controls
- [ ] Non-image files show file type icon
- [ ] Preview works for images in attachments and artifacts

**Edge Cases:**
- Very large image (20MB) → show loading state
- Corrupted image file → show "Cannot preview" message
- Unsupported image format → show file icon instead

---

## Priority Summary

| Priority | Epic Count | Story Count |
|----------|------------|-------------|
| Must Have | 8 | 25 |
| Should Have | 2 | 3 |
| Could Have | 0 | 0 |
| Won't Have | 0 | 0 |

**Total:** 28 user stories across 10 epics

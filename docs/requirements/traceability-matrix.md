# Requirements Traceability Matrix

This matrix maps requirements to user stories, test cases, and implementation status.

## Feature: User Authentication

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-001 | US-1.1: GitHub OAuth Login | Must Have | Successful login as admin | TC-001 | Pending | TBD |
| REQ-002 | US-1.1: GitHub OAuth Login | Must Have | Successful login as architect | TC-002 | Pending | TBD |
| REQ-003 | US-1.1: GitHub OAuth Login | Must Have | Unauthorized user attempts login | TC-003 | Pending | TBD |
| REQ-004 | US-1.1: GitHub OAuth Login | Must Have | User denies OAuth authorization | TC-004 | Pending | TBD |
| REQ-005 | US-1.1: GitHub OAuth Login | Must Have | User logout | TC-005 | Pending | TBD |

## Feature: Bulletin Board Display

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-006 | US-2.1: View All Bulletin Posts | Must Have | View all bulletin posts | TC-006 | Pending | TBD |
| REQ-007 | US-2.1: View All Bulletin Posts | Must Have | Empty bulletin board | TC-007 | Pending | TBD |
| REQ-008 | US-2.1: View All Bulletin Posts | Must Have | Task limit warning banner | TC-008 | Pending | TBD |
| REQ-009 | US-2.2: Search and Filter Posts | Must Have | Search posts by keyword | TC-009 | Pending | TBD |
| REQ-010 | US-2.2: Search and Filter Posts | Must Have | Filter posts by status | TC-010 | Pending | TBD |
| REQ-011 | US-2.2: Search and Filter Posts | Must Have | Filter posts by assigned architect | TC-011 | Pending | TBD |
| REQ-012 | US-2.2: Search and Filter Posts | Must Have | Combined search and filters | TC-012 | Pending | TBD |
| REQ-013 | US-2.2: Search and Filter Posts | Must Have | Clear all filters | TC-013 | Pending | TBD |

## Feature: Post Management (Admin)

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-014 | US-3.1: Create New Bulletin Post | Must Have | Create post with all required fields | TC-014 | Pending | TBD |
| REQ-015 | US-3.1: Create New Bulletin Post | Must Have | Create post with multiple architects | TC-015 | Pending | TBD |
| REQ-016 | US-3.1: Create New Bulletin Post | Must Have | Create post with multiple file attachments | TC-016 | Pending | TBD |
| REQ-017 | US-3.1: Create New Bulletin Post | Must Have | Attempt to create post without required fields | TC-017 | Pending | TBD |
| REQ-018 | US-3.1: Create New Bulletin Post | Must Have | Upload file exceeding size limit | TC-018 | Pending | TBD |
| REQ-019 | US-3.1: Create New Bulletin Post | Must Have | Create post when task limit reached | TC-019 | Pending | TBD |
| REQ-020 | US-3.2: Edit Existing Post | Must Have | Edit post title and description | TC-020 | Pending | TBD |
| REQ-021 | US-3.2: Edit Existing Post | Must Have | Add additional file attachments | TC-021 | Pending | TBD |
| REQ-022 | US-3.2: Edit Existing Post | Must Have | Remove existing attachment | TC-022 | Pending | TBD |
| REQ-023 | US-3.2: Edit Existing Post | Must Have | Change assigned architects | TC-023 | Pending | TBD |
| REQ-024 | US-3.3: Delete Post | Must Have | Delete post with confirmation | TC-024 | Pending | TBD |
| REQ-025 | US-3.3: Delete Post | Must Have | Cancel deletion | TC-025 | Pending | TBD |
| REQ-026 | US-3.3: Delete Post | Must Have | Delete post with active conversations | TC-026 | Pending | TBD |
| REQ-027 | US-3.3: Delete Post | Must Have | Delete post with submitted artifacts | TC-027 | Pending | TBD |
| REQ-028 | US-3.4: Change Post Status | Must Have | Change status to Assigned-InProgress | TC-028 | Pending | TBD |
| REQ-029 | US-3.4: Change Post Status | Must Have | Change status to Escalate (triggers notification) | TC-029 | Pending | TBD |
| REQ-030 | US-3.4: Change Post Status | Must Have | Change status to Closed | TC-030 | Pending | TBD |
| REQ-031 | US-3.4: Change Post Status | Must Have | Architect cannot close task | TC-031 | Pending | TBD |
| REQ-032 | US-3.4: Change Post Status | Must Have | Status transitions (various combinations) | TC-032 | Pending | TBD |
| REQ-033 | US-3.5: Assign/Reassign Architects | Must Have | Assign single architect | TC-033 | Pending | TBD |
| REQ-034 | US-3.5: Assign/Reassign Architects | Must Have | Assign multiple architects | TC-034 | Pending | TBD |
| REQ-035 | US-3.5: Assign/Reassign Architects | Must Have | Reassign task to different architect | TC-035 | Pending | TBD |
| REQ-036 | US-3.5: Assign/Reassign Architects | Must Have | Remove all architects (unassign) | TC-036 | Pending | TBD |

## Feature: Task Assignment (Architect)

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-037 | US-4.1: Self-Assign to Available Task | Must Have | Self-assign to unassigned task | TC-037 | Pending | TBD |
| REQ-038 | US-4.1: Self-Assign to Available Task | Must Have | Multiple architects self-assign to same task | TC-038 | Pending | TBD |
| REQ-039 | US-4.1: Self-Assign to Available Task | Must Have | Cannot self-assign when already assigned | TC-039 | Pending | TBD |
| REQ-040 | US-4.1: Self-Assign to Available Task | Must Have | Cannot reassign admin-locked task | TC-040 | Pending | TBD |
| REQ-041 | US-4.2: View Assigned vs Unassigned | Must Have | View distinction between assigned and unassigned tasks | TC-041 | Pending | TBD |

## Feature: Artifact Management

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-042 | US-5.1: Upload Deliverable Artifact | Must Have | Upload first artifact version | TC-042 | Pending | TBD |
| REQ-043 | US-5.1: Upload Deliverable Artifact | Must Have | Upload subsequent versions | TC-043 | Pending | TBD |
| REQ-044 | US-5.2: View Artifact Version History | Must Have | View artifact version history | TC-044 | Pending | TBD |
| REQ-045 | US-5.1: Upload Deliverable Artifact | Must Have | Upload file exceeding size limit | TC-045 | Pending | TBD |
| REQ-046 | US-5.1: Upload Deliverable Artifact | Must Have | Upload multiple files as single version | TC-046 | Pending | TBD |
| REQ-047 | US-5.2: View Artifact Version History | Must Have | Image preview for uploaded artifacts | TC-047 | Pending | TBD |
| REQ-048 | US-5.3: Add Closure Thoughts | Must Have | Add closure thoughts | TC-048 | Pending | TBD |
| REQ-049 | US-5.3: Add Closure Thoughts | Must Have | Edit existing notes | TC-049 | Pending | TBD |
| REQ-050 | US-5.3: Add Closure Thoughts | Must Have | Long notes with special characters | TC-050 | Pending | TBD |
| REQ-051 | US-5.3: Add Closure Thoughts | Must Have | Notes visible only to authorized users | TC-051 | Pending | TBD |

## Feature: Conversation Threads

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-052 | US-6.1: Start Conversation Thread | Must Have | Architect asks question before assignment | TC-052 | Pending | TBD |
| REQ-053 | US-6.2: Reply to Conversation | Must Have | Admin replies to architect question | TC-053 | Pending | TBD |
| REQ-054 | US-6.2: Reply to Conversation | Must Have | Ongoing conversation between admin and assigned architect | TC-054 | Pending | TBD |
| REQ-055 | US-6.1: Start Conversation Thread | Must Have | Conversation visibility - private to assigned | TC-055 | Pending | TBD |
| REQ-056 | US-6.1: Start Conversation Thread | Must Have | Empty comment validation | TC-056 | Pending | TBD |
| REQ-057 | US-6.2: Reply to Conversation | Must Have | Long conversation thread | TC-057 | Pending | TBD |

## Feature: Notifications

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-058 | US-7.1: Admin Notification for Closed Task | Must Have | Notification when task is closed | TC-058 | Pending | TBD |
| REQ-059 | US-7.2: Admin Notification for Escalation | Must Have | Notification when task is escalated | TC-059 | Pending | TBD |
| REQ-060 | US-7.1: Admin Notification for Closed Task | Must Have | View notification center | TC-060 | Pending | TBD |
| REQ-061 | US-7.1: Admin Notification for Closed Task | Must Have | Mark notification as read | TC-061 | Pending | TBD |
| REQ-062 | US-7.2: Admin Notification for Escalation | Must Have | Multiple notifications for same post | TC-062 | Pending | TBD |

## Feature: Control Panel

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-063 | US-8.1: Manage Architect List | Must Have | View current architect list | TC-063 | Pending | TBD |
| REQ-064 | US-8.1: Manage Architect List | Must Have | Add new architect | TC-064 | Pending | TBD |
| REQ-065 | US-8.1: Manage Architect List | Must Have | Remove architect with no active assignments | TC-065 | Pending | TBD |
| REQ-066 | US-8.1: Manage Architect List | Must Have | Attempt to remove architect with active assignments | TC-066 | Pending | TBD |
| REQ-067 | US-8.1: Manage Architect List | Must Have | Deactivate architect | TC-067 | Pending | TBD |
| REQ-068 | US-8.1: Manage Architect List | Must Have | Reactivate architect | TC-068 | Pending | TBD |
| REQ-069 | US-8.2: Manage Status List | Must Have | Manage status configurations | TC-069 | Pending | TBD |
| REQ-070 | US-8.3: Configure Task Limit Banner | Must Have | Edit banner message | TC-070 | Pending | TBD |
| REQ-071 | US-8.3: Configure Task Limit Banner | Must Have | Preview banner message | TC-071 | Pending | TBD |
| REQ-072 | US-8.3: Configure Task Limit Banner | Must Have | Reset to default message | TC-072 | Pending | TBD |
| REQ-073 | US-8.3: Configure Task Limit Banner | Must Have | Banner appears when limit reached | TC-073 | Pending | TBD |

## Feature: Archive and Export

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-074 | US-9.1: Archive Completed Tasks | Should Have | Archive single completed task | TC-074 | Pending | TBD |
| REQ-075 | US-9.1: Archive Completed Tasks | Should Have | Bulk archive multiple tasks | TC-075 | Pending | TBD |
| REQ-076 | US-9.1: Archive Completed Tasks | Should Have | View archived tasks | TC-076 | Pending | TBD |
| REQ-077 | US-9.1: Archive Completed Tasks | Should Have | Unarchive task | TC-077 | Pending | TBD |
| REQ-078 | US-9.2: Export Tasks as Archive | Should Have | Export tasks as archive file | TC-078 | Pending | TBD |
| REQ-079 | US-9.2: Export Tasks as Archive | Should Have | Export with large dataset | TC-079 | Pending | TBD |
| REQ-080 | US-9.1: Archive Completed Tasks | Should Have | Attempt to archive non-closed task | TC-080 | Pending | TBD |

## Feature: Image Preview

| Req ID | User Story | Priority | Gherkin Scenario | Test Case ID | Status | Assigned To |
|--------|------------|----------|------------------|--------------|--------|-------------|
| REQ-081 | US-10.1: Preview Attached Images | Should Have | Display image thumbnails | TC-081 | Pending | TBD |
| REQ-082 | US-10.1: Preview Attached Images | Should Have | Open full-size image preview | TC-082 | Pending | TBD |
| REQ-083 | US-10.1: Preview Attached Images | Should Have | Preview image artifact | TC-083 | Pending | TBD |
| REQ-084 | US-10.1: Preview Attached Images | Should Have | Handle unsupported image format | TC-084 | Pending | TBD |
| REQ-085 | US-10.1: Preview Attached Images | Should Have | Handle corrupted image file | TC-085 | Pending | TBD |
| REQ-086 | US-10.1: Preview Attached Images | Should Have | Large image preview | TC-086 | Pending | TBD |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Requirements | 86 |
| Must Have | 73 |
| Should Have | 13 |
| Could Have | 0 |
| Won't Have | 0 |
| Test Cases | 86 |
| Features | 10 |
| User Stories | 28 |

---

## Status Definitions

- **Pending:** Requirement identified but not yet implemented
- **In Progress:** Development underway
- **In Review:** Code complete, under review
- **Testing:** In QA testing phase
- **Complete:** Implemented and tested
- **Blocked:** Cannot proceed due to dependency or issue
- **Deferred:** Moved to future release

---

**Note:** Test case IDs (TC-XXX) will be mapped to actual test files created by the Unit Test, Integration Test, and Functional Test agents.

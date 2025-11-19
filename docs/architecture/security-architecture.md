# Security Architecture

**Project:** Architecture-Bulletin
**Version:** 1.0
**Date:** 2025-11-18

## 1. Authentication Strategy

### GitHub OAuth 2.0

**Method:** OAuth 2.0 Authorization Code Flow

**Flow:**
1. User clicks "Login with GitHub"
2. Redirect to `https://github.com/login/oauth/authorize?client_id=XXX&redirect_uri=XXX&scope=repo&state=XXX`
3. User approves application
4. GitHub redirects to `/callback?code=XXX&state=XXX`
5. Exchange authorization code for access token
6. Store token in sessionStorage (cleared on tab close) or localStorage (persists)

**Token Storage:**
- **Recommended**: `sessionStorage` for enhanced security (cleared when tab closes)
- **Alternative**: `localStorage` for convenience (persists across sessions)
- Never store in cookies without httpOnly flag
- Always use secure HTTPS

**Token Expiry:**
- GitHub OAuth tokens don't expire by default
- Implement manual logout to clear token
- Consider implementing periodic re-authentication for high-security scenarios

**Scope Required:**
- `repo`: Full control of private repositories (needed for CRUD operations on data repo)

## 2. Authorization

### Role-Based Access Control (RBAC)

**Roles:**

**Admin:**
- Create, edit, delete posts
- Assign/reassign architects
- Change post status (including close)
- Access control panel
- Manage architects list
- Manage status configurations
- Archive and export posts
- View all posts and conversations

**Architect:**
- View all posts
- Self-assign to available tasks
- Upload artifacts to assigned tasks
- Add closure notes to assigned tasks
- Participate in conversations
- Submit posts for review
- Escalate blocked tasks
- Cannot close tasks
- Cannot access control panel

### Role Determination

Stored in `config/settings.json`:

```json
{
  "adminUsers": ["admin-user-gh", "admin-user-2-gh"],
  ...
}
```

And `config/architects.json`:

```json
{
  "architects": [
    {"githubUsername": "architect-1-gh", ...},
    {"githubUsername": "architect-2-gh", ...}
  ]
}
```

**Role Assignment Logic:**
```javascript
function getUserRole(username, config) {
  if (config.settings.adminUsers.includes(username)) {
    return 'admin';
  }
  if (config.architects.some(a => a.githubUsername === username)) {
    return 'architect';
  }
  return 'unauthorized';
}
```

### Route Protection

```javascript
// Admin-only routes
<ProtectedRoute requireAdmin>
  <ControlPanelPage />
</ProtectedRoute>

// Authenticated routes
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

## 3. Data Protection

### At Rest
- **Encryption**: GitHub infrastructure provides encryption at rest
- **Access Control**: GitHub repository permissions control access to data
- **Sensitive Data**: Do not store passwords, API keys, or secrets in repository
- **PII**: Minimal PII stored (GitHub username, optional email)

### In Transit
- **HTTPS Only**: All communications over TLS 1.3
- **Enforced by GitHub Pages**: Automatic HTTPS redirect
- **Certificate Management**: Handled by GitHub Pages

### GitHub API Token Security
- Never commit tokens to repository
- Store in browser storage (sessionStorage/localStorage)
- Clear on logout
- Include in Authorization header: `Authorization: token <token>`

## 4. Input Validation

### Client-Side Validation

**Post Form:**
- Title: Required, max 200 chars
- Description: Required, max 5000 chars
- Concerned Parties: Required, at least 1 item
- Status: Must be valid status ID
- Architects: Must be valid GitHub usernames

**File Upload:**
- File size: Max 10MB per file
- File types: All allowed, but warn for executables
- Multiple files: Allowed

**Search/Filter:**
- Sanitize input to prevent XSS in search queries
- Escape special characters

### GitHub API Validation

- GitHub API validates file content
- Repository permissions enforce access control
- Rate limiting prevents abuse

### Sanitization

```javascript
// Sanitize HTML to prevent XSS
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(userInput);
```

**Where to Sanitize:**
- Post descriptions (if allowing HTML)
- Comment text
- File names
- Search queries

## 5. OWASP Top 10 Mitigation

| Threat | Risk Level | Mitigation Strategy |
|--------|-----------|-------------------|
| **A01: Broken Access Control** | Medium | - RBAC implementation<br>- Route protection<br>- GitHub repo permissions |
| **A02: Cryptographic Failures** | Low | - HTTPS enforced<br>- GitHub handles encryption<br>- No passwords stored |
| **A03: Injection** | Medium | - Input sanitization<br>- No SQL (using JSON files)<br>- GitHub API prevents malicious commits |
| **A04: Insecure Design** | Low | - Security considered in architecture<br>- Principle of least privilege |
| **A05: Security Misconfiguration** | Medium | - CSP headers<br>- Secure defaults<br>- Regular dependency updates |
| **A06: Vulnerable Components** | Medium | - `npm audit` in CI/CD<br>- Dependabot alerts<br>- Regular updates |
| **A07: Auth & Session** | Low | - GitHub OAuth (no passwords)<br>- Token-based auth<br>- Logout clears session |
| **A08: Software & Data Integrity** | Low | - Git provides integrity<br>- Signed commits (optional) |
| **A09: Logging & Monitoring** | Medium | - Client-side logging<br>- GitHub Actions logs<br>- Error tracking |
| **A10: Server-Side Request Forgery** | N/A | - No server-side code<br>- All requests to GitHub API |

## 6. Security Headers

Configure in `index.html` or via GitHub Pages settings:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://avatars.githubusercontent.com https://raw.githubusercontent.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.github.com https://github.com;
  frame-ancestors 'none';
">

<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
<meta http-equiv="Referrer-Policy" content="no-referrer-when-downgrade">
```

## 7. API Security

### GitHub API Rate Limiting

**Limits:**
- Authenticated: 5000 requests/hour
- Unauthenticated: 60 requests/hour

**Mitigation:**
- Always authenticate requests
- Cache fetched data
- Batch operations
- Implement exponential backoff
- Monitor rate limit headers

**Rate Limit Headers:**
```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1631234567
```

**Handle Rate Limit:**
```javascript
if (error.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
  const resetTime = error.response.headers['x-ratelimit-reset'];
  const waitTime = (resetTime * 1000) - Date.now();
  showError(`Rate limit exceeded. Try again in ${Math.ceil(waitTime / 60000)} minutes.`);
}
```

### CORS

- GitHub API supports CORS
- GitHub Pages serves with appropriate CORS headers
- No additional configuration needed

### Request Size Limits

- File uploads: Max 10MB per file
- JSON payloads: Recommend < 1MB
- GitHub API: Max 100MB per file (with LFS)

## 8. XSS Prevention

### Content Security Policy (CSP)

Implemented via meta tags (see Security Headers section)

### Input Sanitization

```javascript
// For displaying user-generated content
import DOMPurify from 'dompurify';

const PostDescription = ({ description }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(description)
      }}
    />
  );
};
```

### React's Built-In Protection

- React escapes values by default in JSX
- Avoid `dangerouslySetInnerHTML` unless necessary
- When using, always sanitize with DOMPurify

## 9. CSRF Protection

**OAuth State Parameter:**
- Generate random state token before OAuth redirect
- Store in sessionStorage
- Validate on callback
- Prevents CSRF attacks during OAuth flow

```javascript
// Before redirect
const state = generateRandomString(32);
sessionStorage.setItem('oauth_state', state);
window.location = `https://github.com/login/oauth/authorize?state=${state}...`;

// On callback
const returnedState = params.get('state');
const storedState = sessionStorage.getItem('oauth_state');
if (returnedState !== storedState) {
  throw new Error('CSRF detected');
}
```

## 10. Logging & Monitoring

### What to Log

**Authentication Events:**
- Login attempts (success/failure)
- Logout events
- Token refresh
- Unauthorized access attempts

**Data Operations:**
- Post created/updated/deleted
- Artifact uploaded
- Status changes
- Admin configuration changes

**Errors:**
- API errors with status codes
- Rate limit warnings
- Network failures
- Validation errors

### Logging Implementation

```javascript
class Logger {
  log(level, message, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      user: getCurrentUser()?.username,
      ...context
    };

    console.log(JSON.stringify(logEntry));

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // sendToLoggingService(logEntry);
    }
  }

  error(message, error) {
    this.log('error', message, {
      error: error.message,
      stack: error.stack
    });
  }
}
```

### Monitoring

**Client-Side:**
- Browser console (development)
- Error boundaries for React errors
- Performance monitoring (Web Vitals)

**Build/Deploy:**
- GitHub Actions logs
- Build success/failure notifications

## 11. Dependency Security

### npm Audit

Run in CI/CD pipeline:

```yaml
# .github/workflows/security.yml
name: Security Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run npm audit
        run: npm audit --audit-level=moderate
```

### Dependabot

Enable in repository settings to automatically:
- Scan for vulnerable dependencies
- Create PRs to update vulnerable packages

### Regular Updates

- Update dependencies monthly
- Review security advisories
- Test after updates

## 12. Incident Response

### Security Incident Checklist

1. **Detect**: Monitor logs, GitHub notifications, user reports
2. **Assess**: Determine scope and impact
3. **Contain**:
   - Revoke compromised GitHub OAuth tokens
   - Reset admin credentials if needed
   - Remove malicious commits
4. **Recover**:
   - Restore from Git history if needed
   - Apply security patches
5. **Post-Incident**:
   - Document incident
   - Update security measures
   - Communicate with users if needed

### Emergency Contacts

- GitHub Support: https://support.github.com/
- Repository admin: [Contact info]

## 13. Compliance Considerations

### GDPR (if applicable)

**Personal Data Stored:**
- GitHub username
- GitHub email (optional)
- User actions (audit trail via Git commits)

**User Rights:**
- **Right to Access**: Export feature provides data access
- **Right to Erasure**: Admin can delete user data
- **Right to Portability**: Export feature enables data portability

**Data Minimization:**
- Only store necessary data
- No sensitive personal information

### Data Retention

- Active data: Stored indefinitely in repository
- Archived data: Retained as long as configured
- User can request deletion via admin

## 14. Secure Development Practices

### Code Review

- All changes via pull requests
- Security review for auth/authorization changes
- Check for hardcoded secrets

### Secrets Management

- **Never commit secrets to repository**
- Use `.env` files (git-ignored)
- Use GitHub Secrets for CI/CD
- Rotate tokens regularly

### Testing

- Security test cases in test suite
- Test auth flows
- Test authorization (role-based access)
- Test input validation

## 15. Security Checklist

**Before Deployment:**

- [ ] HTTPS enforced (GitHub Pages handles this)
- [ ] GitHub OAuth configured correctly
- [ ] CSP headers configured
- [ ] Input validation implemented
- [ ] XSS sanitization in place
- [ ] Rate limit handling implemented
- [ ] Error messages don't leak sensitive info
- [ ] No secrets in code or commits
- [ ] Dependencies audited (`npm audit`)
- [ ] Role-based access control tested
- [ ] Logout clears session properly
- [ ] CSRF protection in OAuth flow

**Ongoing:**

- [ ] Monitor GitHub security advisories
- [ ] Update dependencies monthly
- [ ] Review access logs periodically
- [ ] Rotate OAuth tokens if compromised
- [ ] Back up data regularly (via export)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Author:** Architecture & Design Agent
**Status:** Ready for Implementation

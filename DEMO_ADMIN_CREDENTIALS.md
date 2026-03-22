# Demo Admin Credentials

## Overview
The Library Management System includes an **AdminDataSeeder** component that automatically creates demo admin accounts on application startup. This ensures a known admin login is always available for demonstrations, interviews, and testing.

## Demo Admin Accounts

### Primary Demo Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Purpose**: Main demo account for UI walkthroughs and feature presentations

### Secondary Demo Admin  
- **Username**: `demoAdmin`
- **Password**: `demo123`
- **Purpose**: Backup demo account for multi-user testing or interview scenarios

## How It Works

On application startup, the `AdminDataSeeder` component (located at `src/main/java/com/anuska/library/libraryms/config/AdminDataSeeder.java`):

1. **Checks** if each demo admin account exists in the database
2. **Creates** the account only if it doesn't already exist (idempotent operation)
3. **Encodes** the password using BCrypt before storing
4. **Logs** the credentials to the console at startup for easy reference

Example startup log output:
```
========================================
DEMO ADMIN ACCOUNTS INITIALIZED
========================================
Available Admin Logins:
  - Username: admin
    Password: admin123
  - Username: demoAdmin
    Password: demo123
========================================
NOTE: Change these credentials in production!
========================================
```

## Usage During Demos/Interviews

### Quick Start
1. Start the application: `mvn spring-boot:run`
2. Wait for startup to complete (logs will show the demo credentials)
3. Use demo admin credentials to log in
4. Access admin-only features:
   - User management (`/admin/users`)
   - Admin dashboard with analytics (`/admin/dashboard`)
   - Borrow trends, recent activity, overdue alerts

### Features Available to Admin
- **User Management Panel**: Add/remove users, promote to admin, enable/disable accounts
- **Analytics Dashboard**: 
  - 7-day borrowing trend chart
  - Recent activity feed
  - Overdue books with fine calculations
- **Book Management**: Add, edit, remove books from catalog
- **Activity Logging**: View borrowing history for audit purposes

## Important Notes

### For Production Deployments
⚠️ **Security Warning**: The demo credentials are hardcoded for development purposes. Before deploying to production:

1. **Remove or Disable** the AdminDataSeeder component
2. **Create** strong admin accounts through secure provisioning
3. **Use environment variables** or secrets manager for production credentials
4. **Implement** proper identity and access management (IAM)

### Idempotent Behavior
The seeder is **idempotent** – running the application multiple times will not create duplicate accounts. Existing accounts are reused.

### Database Persistence
Once created, demo accounts are **permanently stored** in the database. They persist across application restarts unless explicitly deleted via the user management API or database.

## Implementation Details

**File**: `src/main/java/com/anuska/library/libraryms/config/AdminDataSeeder.java`

**Component Type**: Spring `ApplicationRunner` (runs after application context is fully initialized)

**Dependencies**:
- `UserRepository` – checks for existing accounts and persists new ones
- `PasswordEncoder` – encodes passwords using BCrypt

**Method**: `createAdminUserIfNotExists(username, password, description)`
- Private helper method
- Checks if username exists before creating
- Logs creation status for debugging

## Testing the Demo Account

### Via cURL
```bash
# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Access admin dashboard with returned token
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/dashboard/admin
```

### Via PowerShell (Windows)
```powershell
$body = @{username='admin'; password='admin123'} | ConvertTo-Json -Compress
$res = Invoke-RestMethod -Uri 'http://localhost:8081/api/auth/login' `
  -Method Post -ContentType 'application/json' -Body $body
$headers = @{'Authorization' = "Bearer $($res.token)"}
Invoke-RestMethod -Uri 'http://localhost:8081/api/dashboard/admin' -Headers $headers
```

## FAQ

**Q: Can I change the demo credentials?**  
A: The credentials are hardcoded in the `AdminDataSeeder` class. You can modify the `createAdminUserIfNotExists()` calls to use different usernames/passwords, then rebuild and restart.

**Q: What if I accidentally delete a demo account?**  
A: The seeder only creates accounts on startup if they don't exist. If deleted, restart the application and the account will be recreated.

**Q: Are the credentials logged to a file?**  
A: The credentials are logged to the console at startup. Configure log files in `application.properties` to persist them if needed.

**Q: How do I disable the demo accounts for testing?**  
A: Comment out or remove the `@Component` annotation from the `AdminDataSeeder` class, then rebuild.

---

**Created**: March 21, 2026  
**Component**: `AdminDataSeeder`  
**Status**: Active (for development and demos)

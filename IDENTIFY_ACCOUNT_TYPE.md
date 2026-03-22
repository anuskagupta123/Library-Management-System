# How to Identify Admin vs Student Accounts

## Quick Visual Indicators

### 1. **Navbar Display** (Most Obvious)
When you log in, the top navigation bar automatically displays your account type:

#### 👑 ADMIN Account
- Shows: **`admin` 👑 ADMIN`** (with red badge)
- Example after login:
  ```
  ┌─────────────────────────────────────────────────────┐
  │ LibraryMS  |  admin  👑 ADMIN  |  [Logout]           │
  └─────────────────────────────────────────────────────┘
  ```

#### 👤 STUDENT Account  
- Shows: **`username` 👤 STUDENT`** (with blue badge)
- Example after login:
  ```
  ┌─────────────────────────────────────────────────────┐
  │ LibraryMS  |  john_user  👤 STUDENT  |  [Logout]    │
  └─────────────────────────────────────────────────────┘
  ```

---

## 2. **Sidebar Menu Options**
Different menu items appear based on your role:

### **ADMIN sees:**
- 📊 Dashboard
- 📚 Books  
- ➕ Add Book
- 👥 **Manage Users** ← *ADMIN ONLY*
- 📖 My Books

### **STUDENT sees:**
- 📊 Dashboard
- 📚 Books
- 📖 My Books

---

## 3. **Dashboard Appearance**

### **ADMIN Dashboard:**
- Shows library statistics (total, available, issued, overdue)
- Shows borrow trend chart (7-day history)
- Shows recent activity log
- Shows overdue books alerts
- Shows user management button

### **STUDENT Dashboard:**
- Shows their personal borrowed books
- Shows simple book list
- Cannot access any admin features

---

## 4. **Testing with Demo Accounts**

### Demo Credentials Provided:

**Primary Admin Account**
```
Username: admin
Password: admin123
Role: ADMIN (👑 Red badge)
Can: Manage users, view analytics, add/remove books
```

**Secondary Admin Account**  
```
Username: demoAdmin
Password: demo123  
Role: ADMIN (👑 Red badge)
Can: Same as primary admin account
```

**Student Account** (from data.sql)
```
Username: john_user
Password: password
Role: STUDENT/USER (👤 Blue badge)
Can: View books, borrow/return, view dashboard
```

---

## 5. **Step-by-Step: Identify Your Account**

### On Login Page:
1. Enter username and password
2. Click Login

### After Login - Check Navbar:
1. Look at top-right of page
2. See your **username**
3. Look for colored badge next to it:
   - 🔴 **Red badge with 👑** = **ADMIN**
   - 🔵 **Blue badge with 👤** = **STUDENT**

---

## 6. **Badge Reference**

| Badge | Meaning | Access Level |
|-------|---------|--------------|
| 👑 ADMIN (Red) | Administrator | Full access to all features |
| 👤 STUDENT (Blue) | Regular Student User | Limited to personal books only |

---

## 7. **Key Differences Summary**

| Feature | Admin | Student |
|---------|-------|---------|
| **Navbar Badge** | 👑 ADMIN (Red) | 👤 STUDENT (Blue) |
| View Books | ✅ Yes | ✅ Yes |
| Borrow/Return | ✅ Yes | ✅ Yes |
| Add/Remove Books | ✅ Yes | ❌ No |
| Manage Users | ✅ Yes | ❌ No |
| View Dashboard | ✅ Yes (Analytics) | ✅ Yes (Personal) |
| View Trends | ✅ Yes | ❌ No |
| View All Users | ✅ Yes | ❌ No |

---

## 8. **How to Test**

### Quick Test Sequence:

1. **Login as ADMIN**:
   - Use: `admin` / `admin123`
   - See: `admin` 👑 **ADMIN** (red badge)
   - Try: Click "Manage Users" → Works! ✅

2. **Logout**:
   - Click "Logout" button

3. **Login as STUDENT**:
   - Use: `john_user` / `password`  
   - See: `john_user` 👤 **STUDENT** (blue badge)
   - Try: Click "Manage Users" → Not visible! ✅

---

## 9. **Browser Console Verification** (Optional)

If you want to verify programmatically, open browser DevTools (F12) and run:

```javascript
// Check current user info
console.log("Username:", localStorage.getItem("username"));
console.log("Role:", localStorage.getItem("role"));
console.log("Is Admin:", localStorage.getItem("role") === "ADMIN");
```

Output for admin:
```
Username: admin
Role: ADMIN
Is Admin: true
```

Output for student:
```
Username: john_user
Role: USER
Is Admin: false
```

---

## Summary

✅ **The navbar now clearly shows:**
- Your current username
- Your role with a color-coded badge
  - **Red 👑 = Admin** (full permissions)
  - **Blue 👤 = Student** (limited permissions)

This makes it immediately obvious which account type you're using! 🎯

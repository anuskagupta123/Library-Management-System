# User Registration Guide

## Overview
The Library Management System allows anyone to create a new account and start using the application immediately. New users automatically get **STUDENT** role with access to core features like borrowing books and viewing the dashboard.

---

## Step-by-Step Registration & Login

### **Step 1: Navigate to Login Page**
- Visit: `http://localhost:8081` (backend serves frontend)
- Or: `http://localhost:3000` (if running React dev server)
- You'll see the **Login Page**

### **Step 2: Click "Register here" Link**
On the login page, look for the text:
```
Don't have an account? Register here
```
Click on **"Register here"** link to go to registration page

### **Step 3: Fill Registration Form**
On the registration page, enter:
- **Username**: Your desired username (must be unique)
  - Example: `john_doe`, `alice_smith`, `student123`
- **Password**: A strong password (8+ characters recommended)
  - Example: `MyPassword123!`

### **Step 4: Click Register**
Click the **"Register"** button

### **Step 5: Success Message**
You'll see: **"Registration successful!"**
Then automatically redirected to **Login Page**

### **Step 6: Login with Your New Account**
Enter the credentials you just created:
- Username: (what you registered with)
- Password: (what you registered with)
Click **"Login"** button

### **Step 7: You're In!**
You'll be redirected to the Books page and can start using the app!

---

## What You Get as a New User

### **Account Type**: 🔵 STUDENT
After registration, you automatically become a **STUDENT** user.

### **Your Navbar Shows**:
```
LibraryMS | [your_username] 👤 STUDENT | [Logout]
```

### **Features Available**:
✅ **Browse Books** - View all available books in the library
✅ **Search Books** - Find books by title, author, or ISBN
✅ **Borrow Books** - Borrow available books (5-day due date)
✅ **Return Books** - Return borrowed books
✅ **My Books** - View your currently borrowed books
✅ **Dashboard** - See your personal statistics
✅ **Manage Profile** - View your account information

### **Admin Features NOT Available** ❌:
❌ Cannot manage other users
❌ Cannot view library analytics
❌ Cannot add/remove books
❌ Cannot view user list
❌ Menu item "Manage Users" is hidden

---

## Account Validation

### **Username Requirements**
- Must be unique (no duplicates allowed)
- Can contain letters, numbers, underscores
- Minimum 3 characters recommended

### **Password Requirements**
- Minimum 1 character (but 8+ recommended for security)
- Supports special characters
- Passwords are encrypted with BCrypt before storage

### **Registration Will Fail If**:
- Username already exists in system
- Username field is empty
- Password field is empty
- Server connection error

---

## After Registration: What Happens Automatically

1. **Your account is created** in the database
2. **Password is encrypted** using BCrypt hashing
3. **Role is set to "USER"** automatically (STUDENT, not admin)
4. **Account is enabled** by default (can login immediately)
5. **You receive JWT token** on first login
6. **Token stored** in browser (localStorage)

---

## Navigating Between Login & Register

### **From Login Page**:
- Text at bottom: "Don't have an account?"
- Click: **"Register here"** link
- Takes you to: Register page

### **From Register Page**:
- Text at bottom: "Already have an account?"
- Click: **"Login here"** link
- Takes you to: Login page

### **Easy Flow**:
```
Login Page
    ↓
    └─→ "Don't have account?" → Click "Register here"
              ↓
        Register Page
              ↓
          Fill Form
              ↓
        Click "Register"
              ↓
        "Registration Successful"
              ↓
        Auto-redirect to Login
              ↓
        Enter credentials
              ↓
        Click "Login"
              ↓
        ✅ In the App!
```

---

## Example Registration Session

### **User Input**:
```
Username: alice_student
Password: MySecurePass123
```

### **System Processing**:
1. Checks if "alice_student" already exists → ✅ Unique
2. Hashes password with BCrypt → Hash stored
3. Creates user with role="USER"
4. Saves to database
5. Returns success

### **Login with Same Username**:
```
Username: alice_student
Password: MySecurePass123
```

### **System Processing**:
1. Finds user in database
2. Compares password hash
3. Generates JWT token
4. Returns token + role="USER"
5. Browser stores token

### **Navbar Shows**:
```
LibraryMS | alice_student 👤 STUDENT | [Logout]
```

---

## Troubleshooting Registration

### Issue: "Username already exists"
**Solution**: 
- Choose a different username
- Add numbers or underscore to make it unique
- Example: `alice_student` → `alice_student_2`

### Issue: "Registration failed" with no specific message
**Solution**:
- Check that backend is running (port 8081)
- Verify username and password fields are filled
- Try again in a few seconds

### Issue: "Invalid credentials" after registering
**Solution**:
- Make sure password is exactly what you registered with
- Check for capitalization (passwords are case-sensitive)
- Ensure no extra spaces in username/password

### Issue: Can't find "Register here" link
**Solution**:
- Make sure you're on the Login page
- Scroll down to see the register link
- Look at bottom of the form card

---

## Security Notes

### **For Your Account**:
- Choose a strong, unique password
- Don't share your credentials with others
- Your password is encrypted in database
- Use HTTPS in production (currently HTTP for local dev)

### **For the System**:
- Passwords hashed with BCrypt (not plaintext)
- Tokens are JWT with expiration
- Role-based access control enforced
- SQL injection prevented with parameterized queries

---

## Demo Registration

### **Quick Test Account**:
```
Username: testuser_[your_choice]
Password: password123
```

Then login with same credentials.

### **Pre-existing Test Accounts** (no registration needed):
```
Admin Account:
  Username: admin
  Password: admin123
  Role: ADMIN

Student Account:
  Username: john_user  
  Password: password
  Role: USER/STUDENT
```

---

## Viewing Your Account Type

### **Method 1: Check Navbar** (Easiest)
- Look at top-right after login
- See: `[username] 👤 STUDENT` (blue badge)
- Or: `[username] 👑 ADMIN` (red badge)

### **Method 2: Browser Console**
Open DevTools (F12) → Console tab → Type:
```javascript
localStorage.getItem("role")
```
Output: `USER` (for students) or `ADMIN` (for administrators)

---

## FAQ

**Q: Do I need an admin to create my account?**  
A: No! Anyone can self-register anytime without admin approval.

**Q: What if I forget my password?**  
A: Currently no password reset feature. Contact admin to reset.

**Q: Can I change my username after registration?**  
A: Not through the UI. Contact admin if needed.

**Q: Will my account expire?**  
A: No, accounts are persistent until deleted by admin.

**Q: Can I register multiple accounts?**  
A: Yes, but each username must be unique.

**Q: After registration, am I immediately a student or do I need approval?**  
A: You're immediately a student! No approval needed.

**Q: Can a student promote themselves to admin?**  
A: No. Only existing admins can change user roles.

**Q: Is my password sent to the server in cleartext?**  
A: No, use HTTPS in production. Currently HTTP for local dev.

---

## Next Steps After Registration

1. **Explore Books** - Click "Books" to browse the catalog
2. **Borrow a Book** - Click "Borrow" on any available book
3. **View My Books** - Check "My Books" to see current loans
4. **Check Dashboard** - See your personal statistics
5. **Return a Book** - Return when done (within 5-day due date)

---

**Ready to get started?**  
Go to the login page and click "Register here" to create your account! 📚

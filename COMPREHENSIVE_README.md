# Library Management System - Backend API

A comprehensive REST API for managing a library system built with **Spring Boot 3.5**, **Spring Security with JWT**, **PostgreSQL**, and **Spring Data JPA**.

## 🔐 Account Type Identification

After login, check the **navbar** (top-right) to instantly see your account type:

- **🔴 `admin 👑 ADMIN`** = Admin account (red badge with crown) → Full access
- **🔵 `john_user 👤 STUDENT`** = Student account (blue badge with person) → Limited access

**For details**, see [ACCOUNT_TYPE_BADGES.md](./ACCOUNT_TYPE_BADGES.md)

## 📝 User Registration

**Anyone can self-register!** No admin approval needed.

1. Click **"Register here"** link on login page
2. Enter username and password
3. Click **"Register"** button
4. Automatically redirected to login
5. Login with your new credentials
6. You'll become a **🔵 STUDENT** with access to:
   - Browse and borrow books
   - View your borrowed books
   - See your personal dashboard

**New registrations automatically get STUDENT role** (not admin).

👉 **See [USER_REGISTRATION_GUIDE.md](./USER_REGISTRATION_GUIDE.md) for complete walkthrough**

## Features

### Authentication & Authorization
- JWT-based authentication with token expiration handling
- Role-based access control (ADMIN, USER)
- Secure password hashing with BCrypt
- User registration and login endpoints

### Book Management
- **CRUD Operations**: Create, read, update, delete books
- **Search Functionality**:
  - Search by title (partial match)
  - Search by author name
  - Search by ISBN code
- **Borrow/Return System**:
  - Borrow books with 5-day due date
  - Return borrowed books
  - Automatic fine calculation for overdue books

### Fine Management
- **Auto-calculated fines**:
  - ₹1 per day for overdue books
  - Calculated from due date until return date
  - Grace period: 5 days from issue date

### Dashboard & Statistics
- Admin dashboard with library statistics
- Total books, available books, and issued books counts
- User-specific borrowed books list

### API Documentation
- **Swagger/OpenAPI UI** for interactive API exploration
- **REST client file** (.http) for VS Code testing
- Detailed endpoint descriptions and examples

### Error Handling
- Global exception handler with consistent error responses
- Validation error messages with field-level details
- Proper HTTP status codes for all scenarios

### Input Validation
- Jakarta Bean Validation on all DTOs and models
- Username and password validation
- Book details validation (title, author, ISBN)

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 | Programming language |
| Spring Boot | 3.5.10 | Framework |
| Spring Security | 6.5.7 | Authentication & Authorization |
| Spring Data JPA | 6.2.15 | Data access layer |
| PostgreSQL | 16.11 | Database |
| JWT (JJWT) | 0.11.5 | Token generation & validation |
| Hibernate | 6.6.41 | ORM |
| SpringDoc OpenAPI | 2.0.4 | API documentation |
| Jakarta Validation | latest | Input validation |

## Prerequisites

- **Java 17** or higher
- **Maven 3.8+**
- **PostgreSQL 12+** running on localhost:5432
- **Git**

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/libraryms.git
cd libraryms
```

### 2. Database Setup
Create a PostgreSQL database:
```sql
CREATE DATABASE library_db;
```

### 3. Configure Database Connection
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/library_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
```

### 4. Build the Project
```bash
./mvnw clean install
```

### 5. Run the Application
```bash
./mvnw spring-boot:run
```

The application will start on **http://localhost:8080**

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get JWT token | No |

### Books

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/books` | Get all books | Yes | Any |
| GET | `/api/books/{id}` | Get book by ID | Yes | Any |
| GET | `/api/books/search/title?title={query}` | Search by title | Yes | Any |
| GET | `/api/books/search/author?author={query}` | Search by author | Yes | Any |
| GET | `/api/books/search/isbn?isbn={code}` | Search by ISBN | Yes | Any |
| POST | `/api/books` | Create book | Yes | ADMIN |
| PUT | `/api/books/{id}` | Update book | Yes | ADMIN |
| DELETE | `/api/books/{id}` | Delete book | Yes | ADMIN |
| PUT | `/api/books/{id}/borrow` | Borrow a book | Yes | Any |
| PUT | `/api/books/{id}/return` | Return a book | Yes | Any |
| GET | `/api/books/{id}/fine` | Calculate fine | Yes | Any |

### Dashboard

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/dashboard/admin` | Admin statistics | Yes | ADMIN |
| GET | `/api/dashboard/my-books` | My borrowed books | Yes | Any |

## Test Data

Sample users created from `src/main/resources/data.sql`:

| Username | Password | Role | Status |
|----------|----------|------|--------|
| admin | password | ADMIN | Active |
| john_user | password | USER | Active |
| jane_user | password | USER | Active |
| alice_user | password | USER | Active |

Sample books include:
- The Great Gatsby
- To Kill a Mockingbird
- 1984
- The Catcher in the Rye
- Pride and Prejudice
- The Lord of the Rings
- Harry Potter series
- Dune
- And more classic literature

## Demo Admin Accounts

The application includes an **AdminDataSeeder** component that automatically creates demo admin accounts on startup for demonstrations and interviews:

| Username | Password | Purpose |
|----------|----------|---------|
| admin | admin123 | Primary demo admin account |
| demoAdmin | demo123 | Secondary demo admin account |

Both accounts are created automatically on application startup and persist in the database. These credentials are **for development and demo purposes only**. For production deployments, please see [DEMO_ADMIN_CREDENTIALS.md](./DEMO_ADMIN_CREDENTIALS.md) for security recommendations.

**Quick Demo**:
```bash
# Login with demo admin
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Access admin dashboard
curl -H "Authorization: Bearer {token}" \
  http://localhost:8081/api/dashboard/admin
```

For detailed information about demo accounts and setup, see [DEMO_ADMIN_CREDENTIALS.md](./DEMO_ADMIN_CREDENTIALS.md)

## Testing

### Using REST Client (.http file)
1. Open `Library.http` in VS Code
2. Install "REST Client" extension if not already installed
3. Click "Send Request" on any endpoint
4. Update `@token` variable with JWT token from login response

### Using cURL
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get all books (replace {token} with actual JWT)
curl -X GET http://localhost:8080/api/books \
  -H "Authorization: Bearer {token}"
```

### Running Unit Tests
```bash
./mvnw test
```

Run specific test class:
```bash
./mvnw test -Dtest=BookServiceTest
./mvnw test -Dtest=BookControllerTest
```

## API Documentation

### Swagger/OpenAPI UI
Once the application is running, access interactive API documentation:
- **URL**: http://localhost:8080/swagger-ui.html
- **API Docs (JSON)**: http://localhost:8080/v3/api-docs

### Example: Get JWT Token
**Request:**
```bash
POST /api/auth/login HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### Example: Borrow a Book
**Request:**
```bash
PUT /api/books/1/borrow HTTP/1.1
Host: localhost:8080
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "9780743273565",
  "available": false,
  "issuedTo": "admin",
  "dueDate": "2026-03-26T11:15:00",
  "fineAmount": 0.0
}
```

## Project Structure

```
libraryms/
├── src/main/java/com/anuska/library/libraryms/
│   ├── controller/          # REST controllers
│   ├── service/             # Business logic
│   ├── model/               # Entity models
│   ├── dto/                 # Data transfer objects
│   ├── repository/          # Data access
│   ├── security/            # Security configuration
│   ├── exception/           # Custom exceptions
│   └── LibraryManagementSystemApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── data.sql
├── src/test/java/          # Unit and integration tests
├── pom.xml                   # Maven configuration
└── Library.http              # REST client file
```

## Error Handling

### Error Response Format
```json
{
  "status": 400,
  "message": "Error description",
  "timestamp": "2026-03-21T11:15:30"
}
```

### Validation Error Response
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "title": "Title is required",
    "author": "Author must be between 2 and 100 characters"
  },
  "timestamp": "2026-03-21T11:15:30"
}
```

## Security Features

1. **JWT Authentication**: Tokens expire after 7 days
2. **Password Hashing**: BCrypt password encoding
3. **Role-Based Access Control**: ADMIN and USER roles
4. **Exception Handling**: JWT token expiration is handled gracefully
5. **Input Validation**: All user inputs are validated before processing
6. **CORS Support**: Configured for `http://localhost:3000`

## Fine Calculation Logic

Books issued for 5 days. After the due date:
- ₹1 fine per day overdue
- Fine is calculated and stored when book is returned
- Example: If a book due on March 21 is returned on March 25, fine = ₹4

## Improvements Made

✅ **Input Validation**: Added Jakarta Bean Validation to all DTOs and models  
✅ **Error Handling**: Created global exception handler with consistent error responses  
✅ **API Completeness**: Added missing endpoints (getById, search, update)  
✅ **Fine Calculation**: Implemented automatic overdue fine calculation  
✅ **Test Data**: Created sample users and books for testing  
✅ **Unit Tests**: Added comprehensive test cases for services and controllers  
✅ **API Documentation**: Integrated Swagger/OpenAPI with detailed endpoint descriptions  
✅ **REST Client**: Created .http file for easy testing in VS Code  
✅ **Custom Exceptions**: Replaced RuntimeException with specific business exceptions  
✅ **Code Quality**: Applied Spring best practices and proper separation of concerns  

## Future Enhancements

- [ ] Email notifications for book return reminders
- [ ] Book reservation system
- [ ] User profile management
- [ ] Book categories and shelves
- [ ] Advanced search with filters
- [ ] Renewal of borrowed books
- [ ] Payment integration for fine settlement
- [ ] Admin dashboard UI
- [ ] Book ratings and reviews
- [ ] Audit logging

## Troubleshooting

### Port 8080 already in use
```bash
# Kill the process using port 8080
# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Database connection failed
- Ensure PostgreSQL is running
- Check database credentials in `application.properties`
- Verify database exists: `CREATE DATABASE library_db;`

### JWT token expired
- Tokens are stored in-memory and expire after 7 days
- Login again to generate a new token
- See the fixed JWT exception handling  for details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue on GitHub or contact the development team.

---

**Last Updated**: March 21, 2026  
**Version**: 0.0.1-SNAPSHOT  
**Status**: Active Development

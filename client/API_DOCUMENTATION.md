# TalentSphere Backend API Documentation

> **Base URL:** `http://localhost:5000/api`  
> **Version:** 1.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Auth Endpoints](#auth-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Job Endpoints](#job-endpoints)
5. [Application Endpoints](#application-endpoints)
6. [Notification Endpoints](#notification-endpoints)
7. [Admin Endpoints](#admin-endpoints)
8. [Data Models](#data-models)
9. [Error Handling](#error-handling)

---

## Authentication

The API uses **JWT (JSON Web Token)** for authentication.

### How to Authenticate

1. Login via `/api/auth/login`
2. Extract `accessToken` from response
3. Include token in subsequent requests:

```
Authorization: Bearer <accessToken>
```

### Token Details
- **Access Token:** Short-lived (15-30 min)
- **Refresh Token:** Long-lived (stored in HTTP-only cookie)

---

## Auth Endpoints

### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "developer"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | ✅ | Valid email format |
| password | string | ✅ | Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char |
| confirmPassword | string | ✅ | Must match password |
| firstName | string | ✅ | 2-50 characters |
| lastName | string | ✅ | 2-50 characters |
| role | string | ❌ | `developer` (default), `client`, `recruiter` |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "64abc...",
      "email": "user@example.com",
      "role": "developer",
      "isVerified": false
    }
  }
}
```

---

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64abc...",
      "email": "user@example.com",
      "role": "developer",
      "isVerified": true
    },
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "/uploads/avatars/user-123.jpg"
    },
    "accessToken": "eyJhbGc..."
  }
}
```

---

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64abc...",
      "email": "user@example.com",
      "role": "developer",
      "isVerified": true,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "profile": { ... }
  }
}
```

---

### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

---

### Forgot Password
```
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

### Reset Password
```
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

---

### Change Password (Authenticated)
```
POST /api/auth/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

---

### Refresh Token
```
POST /api/auth/refresh-token
```

---

## User Endpoints

> All user endpoints require authentication

### Get User by ID
```
GET /api/users/:id
Authorization: Bearer <token>
```

---

### Update User
```
PUT /api/users/:id
Authorization: Bearer <token>
```

---

### Get User Profile
```
GET /api/users/:id/profile
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "_id": "64abc...",
      "user": "64abc...",
      "firstName": "John",
      "lastName": "Doe",
      "headline": "Senior Full Stack Developer",
      "bio": "5+ years of experience...",
      "avatar": "/uploads/avatars/user-123.jpg",
      "skills": ["React", "Node.js", "MongoDB"],
      "experience": [...],
      "education": [...],
      "location": {
        "city": "San Francisco",
        "country": "USA"
      },
      "socialLinks": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe"
      }
    }
  }
}
```

---

### Update Profile
```
PUT /api/users/:id/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "headline": "Senior Full Stack Developer",
  "bio": "Passionate developer with 5+ years of experience...",
  "phone": "+1234567890",
  "website": "https://johndoe.dev",
  "location": {
    "city": "San Francisco",
    "state": "California",
    "country": "USA"
  },
  "skills": ["React", "Node.js", "MongoDB", "TypeScript"],
  "hourlyRate": 75,
  "availability": "available",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "portfolio": "https://johndoe.dev"
  }
}
```

---

### Add Experience
```
POST /api/users/:id/profile/experience
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "experience": {
    "title": "Senior Developer",
    "company": "Google",
    "location": "Mountain View, CA",
    "from": "2022-01-15",
    "to": null,
    "current": true,
    "description": "Leading a team of 5 developers..."
  }
}
```

---

### Delete Experience
```
DELETE /api/users/:id/profile/experience/:expId
Authorization: Bearer <token>
```

---

### Add Education
```
POST /api/users/:id/profile/education
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "education": {
    "school": "MIT",
    "degree": "Bachelor's",
    "fieldOfStudy": "Computer Science",
    "from": "2016-08-01",
    "to": "2020-05-15",
    "current": false,
    "description": "Graduated with honors..."
  }
}
```

---

### Delete Education
```
DELETE /api/users/:id/profile/education/:eduId
Authorization: Bearer <token>
```

---

### Upload Avatar
```
POST /api/users/:id/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
| Key | Type | Value |
|-----|------|-------|
| avatar | File | image.jpg |

---

### Delete Avatar
```
DELETE /api/users/:id/avatar
Authorization: Bearer <token>
```

---

## Job Endpoints

### Get All Jobs (Public)
```
GET /api/jobs
GET /api/jobs?page=1&limit=10
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |

---

### Search Jobs (Public)
```
GET /api/jobs/search?keyword=react&category=web-development
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| keyword | string | Search in title, description |
| category | string | Job category |
| type | string | `full-time`, `part-time`, `contract`, `freelance`, `internship` |
| experienceLevel | string | `entry`, `mid`, `senior`, `lead`, `executive` |
| locationType | string | `remote`, `onsite`, `hybrid` |
| minBudget | number | Minimum budget |
| maxBudget | number | Maximum budget |
| skills | string | Comma-separated skills |
| page | number | Page number |
| limit | number | Items per page (max 50) |
| sortBy | string | `createdAt`, `budget.max`, `applicationsCount` |
| sortOrder | string | `asc`, `desc` |

---

### Get Featured Jobs (Public)
```
GET /api/jobs/featured
```

---

### Get Job Categories (Public)
```
GET /api/jobs/categories
```

---

### Get Job by ID (Public)
```
GET /api/jobs/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "64abc...",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for...",
      "type": "full-time",
      "category": "web-development",
      "skillsRequired": ["React", "Node.js"],
      "experienceLevel": "senior",
      "budget": {
        "type": "monthly",
        "min": 8000,
        "max": 12000,
        "currency": "USD"
      },
      "location": {
        "type": "remote",
        "country": "USA"
      },
      "status": "open",
      "postedBy": {
        "_id": "64abc...",
        "email": "company@example.com"
      },
      "applicationsCount": 15,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Create Job (Authenticated - Client/Recruiter/Admin)
```
POST /api/jobs
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for an experienced developer... (min 50 chars)",
  "type": "full-time",
  "category": "web-development",
  "skillsRequired": ["React", "Node.js", "MongoDB"],
  "experienceLevel": "senior",
  "budget": {
    "type": "monthly",
    "min": 8000,
    "max": 12000,
    "currency": "USD"
  },
  "location": {
    "type": "remote",
    "country": "USA"
  },
  "requirements": ["5+ years experience", "Strong communication"],
  "benefits": ["Health insurance", "Remote work"]
}
```

**Job Categories:**
- `web-development`
- `mobile-development`
- `ui-ux-design`
- `data-science`
- `devops`
- `cloud-computing`
- `cybersecurity`
- `blockchain`
- `ai-ml`
- `game-development`
- `other`

**Job Types:**
- `full-time`
- `part-time`
- `contract`
- `freelance`
- `internship`

---

### Get My Jobs (Authenticated)
```
GET /api/jobs/user/my-jobs
Authorization: Bearer <token>
```

---

### Update Job (Job Owner)
```
PUT /api/jobs/:id
Authorization: Bearer <token>
```

---

### Delete Job (Job Owner)
```
DELETE /api/jobs/:id
Authorization: Bearer <token>
```

---

## Application Endpoints

> All application endpoints require authentication

### Apply for Job
```
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json (or multipart/form-data with resume)
```

**Request Body:**
```json
{
  "jobId": "64abc...",
  "coverLetter": "I am excited to apply...",
  "proposedRate": {
    "amount": 60,
    "type": "hourly",
    "currency": "USD"
  },
  "availability": {
    "startDate": "2025-01-15",
    "hoursPerWeek": 40
  }
}
```

---

### Get My Applications
```
GET /api/applications/my-applications
Authorization: Bearer <token>
```

---

### Get Applications for Job (Job Owner Only)
```
GET /api/applications/job/:jobId
Authorization: Bearer <token>
```

---

### Get Application by ID
```
GET /api/applications/:id
Authorization: Bearer <token>
```

---

### Update Application Status (Job Owner Only)
```
PUT /api/applications/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shortlisted",
  "note": "Great candidate, schedule interview"
}
```

**Status Values:**
- `pending` - Initial state
- `reviewing` - Under review
- `shortlisted` - Shortlisted
- `interview` - Interview scheduled
- `accepted` - Accepted
- `rejected` - Rejected

---

### Withdraw Application (Applicant Only)
```
DELETE /api/applications/:id
Authorization: Bearer <token>
```

---

### Rate Application (Job Owner Only)
```
POST /api/applications/:id/rate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "score": 4,
  "feedback": "Strong technical skills"
}
```

---

### Add Notes to Application (Job Owner Only)
```
PUT /api/applications/:id/notes
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "notes": "Follow up next week regarding start date"
}
```

---

## Notification Endpoints

> All notification endpoints require authentication

### Get Notifications
```
GET /api/notifications
GET /api/notifications?page=1&limit=20
Authorization: Bearer <token>
```

---

### Get Unread Count
```
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

---

### Mark as Read
```
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

---

### Mark All as Read
```
PUT /api/notifications/read-all
Authorization: Bearer <token>
```

---

### Delete Notification
```
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

---

## Admin Endpoints

> All admin endpoints require **admin** role

### Get Dashboard
```
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalJobs": 45,
      "totalApplications": 320
    },
    "usersByRole": [
      { "_id": "developer", "count": 100 },
      { "_id": "client", "count": 40 },
      { "_id": "recruiter", "count": 10 }
    ],
    "applicationsByStatus": [...],
    "jobsByStatus": [...],
    "recentUsers": [...],
    "recentJobs": [...]
  }
}
```

---

### Get All Users (Admin)
```
GET /api/admin/users
GET /api/admin/users?role=developer&isActive=true&search=john
Authorization: Bearer <admin_token>
```

---

### Update User Status
```
PUT /api/admin/users/:id/status
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "isActive": false,
  "isVerified": true
}
```

---

### Get All Jobs (Admin)
```
GET /api/admin/jobs
GET /api/admin/jobs?status=open
Authorization: Bearer <admin_token>
```

---

### Moderate Job
```
PUT /api/admin/jobs/:id/moderate
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "closed",
  "isFeatured": true
}
```

---

### Get Analytics
```
GET /api/admin/analytics
Authorization: Bearer <admin_token>
```

---

### Broadcast Notification
```
POST /api/admin/broadcast
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Platform Update",
  "message": "New features available!",
  "link": "/announcements",
  "role": "developer"
}
```

---

## Data Models

### User Roles
| Role | Can Post Jobs | Can Apply | Admin Access |
|------|---------------|-----------|--------------|
| developer | ❌ | ✅ | ❌ |
| client | ✅ | ✅ | ❌ |
| recruiter | ✅ | ✅ | ❌ |
| admin | ✅ | ✅ | ✅ |

### Availability Status
- `available` - Open for opportunities
- `busy` - Currently engaged
- `not-available` - Not looking

### Company Size
- `1-10`
- `11-50`
- `51-200`
- `201-500`
- `500+`

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "status": "fail",
  "message": "Error description",
  "error": {
    "statusCode": 400,
    "status": "fail",
    "isOperational": true
  }
}
```

### Common Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 409 | Conflict (duplicate entry) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| General API | 100 requests/15 min |
| Auth endpoints | 10 requests/15 min |
| Password reset | 5 requests/hour |

---

> **Need help?** Contact the backend team for any API questions.

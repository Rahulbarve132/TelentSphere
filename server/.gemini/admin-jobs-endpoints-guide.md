# Admin Jobs API - Complete Guide

## 📋 Overview

There are **THREE separate endpoints** for managing jobs in the admin panel:

| Endpoint | Purpose | Shows |
|----------|---------|-------|
| `GET /api/admin/jobs` | View ALL platform jobs | Every job posted by anyone |
| `GET /api/admin/my-jobs` | View admin's own jobs | Only jobs posted by the logged-in admin |
| `GET /api/jobs/user/my-jobs` | View user's own jobs | Jobs posted by any authenticated user (client/recruiter/admin) |

---

## 🎯 Endpoint 1: Get All Platform Jobs

### **GET `/api/admin/jobs`**
**Access:** Admin Only  
**Purpose:** View and manage ALL jobs on the platform (posted by anyone)

### Query Parameters

| Parameter | Type | Description | Values |
|-----------|------|-------------|--------|
| `page` | Number | Page number (default: 1) | Any positive integer |
| `limit` | Number | Items per page (default: 20) | 1-100 |
| `status` | String | Filter by job status | `draft`, `open`, `closed`, `paused`, `filled` |
| `type` | String | Filter by employment type | `full-time`, `part-time`, `contract`, `freelance`, `internship` |
| `visibility` | String | Filter by visibility | `public`, `private`, `invite-only` |

### Examples

```bash
# Get all jobs on the platform
GET /api/admin/jobs

# Get all open freelance jobs
GET /api/admin/jobs?status=open&type=freelance

# Get all public full-time jobs
GET /api/admin/jobs?type=full-time&visibility=public

# Get all private jobs
GET /api/admin/jobs?visibility=private

# Get draft internships
GET /api/admin/jobs?status=draft&type=internship

# With pagination
GET /api/admin/jobs?page=2&limit=50&status=open
```

### Response
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "...",
        "title": "Senior Full Stack Developer",
        "type": "full-time",
        "status": "open",
        "visibility": "public",
        "postedBy": {
          "_id": "...",
          "email": "client@example.com"
        },
        // ... other fields
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Use Cases
- 📊 Monitor all platform activity
- 🔍 Review jobs from all users
- ⚖️ Moderate content across the platform
- 📈 Generate platform-wide analytics
- 🚨 Find policy violations

---

## 🎯 Endpoint 2: Get Admin's Own Jobs

### **GET `/api/admin/my-jobs`**
**Access:** Admin Only  
**Purpose:** View only jobs posted by the logged-in admin user

### Query Parameters

| Parameter | Type | Description | Values |
|-----------|------|-------------|--------|
| `page` | Number | Page number (default: 1) | Any positive integer |
| `limit` | Number | Items per page (default: 20) | 1-100 |
| `status` | String | Filter by job status | `draft`, `open`, `closed`, `paused`, `filled` |
| `type` | String | Filter by employment type | `full-time`, `part-time`, `contract`, `freelance`, `internship` |
| `visibility` | String | Filter by visibility | `public`, `private`, `invite-only` |

### Examples

```bash
# Get all my jobs
GET /api/admin/my-jobs

# Get my open jobs
GET /api/admin/my-jobs?status=open

# Get my freelance projects
GET /api/admin/my-jobs?type=freelance

# Get my private job listings
GET /api/admin/my-jobs?visibility=private

# Get my draft full-time positions
GET /api/admin/my-jobs?status=draft&type=full-time

# With pagination
GET /api/admin/my-jobs?page=1&limit=10
```

### Response
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "...",
        "title": "Backend Developer",
        "type": "contract",
        "status": "open",
        "visibility": "public",
        "postedBy": "YOUR_ADMIN_ID",
        // ... other fields
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

### Use Cases
- 📝 Manage your own job postings
- ✏️ Edit your listings
- 📊 Track your job performance
- 🎯 Focus on your responsibilities
- 🔄 Update your job statuses

---

## 🎯 Endpoint 3: Get User's Own Jobs (General)

### **GET `/api/jobs/user/my-jobs`**
**Access:** Authenticated Users (Client, Recruiter, Admin)  
**Purpose:** View jobs posted by the current authenticated user

### Query Parameters
Same as above endpoints (page, limit, status, type, visibility)

### Examples

```bash
# Get my jobs (works for any authenticated user)
GET /api/jobs/user/my-jobs

# Get my open jobs
GET /api/jobs/user/my-jobs?status=open
```

### Use Cases
- 👤 General user job management
- 🏢 Client/Recruiter dashboard
- 📱 Mobile app "My Jobs" section

---

## 🔄 Comparison Table

| Feature | `/api/admin/jobs` | `/api/admin/my-jobs` | `/api/jobs/user/my-jobs` |
|---------|-------------------|----------------------|--------------------------|
| **Access** | Admin only | Admin only | All authenticated users |
| **Shows** | All platform jobs | Admin's own jobs | Current user's jobs |
| **Filters** | ✅ status, type, visibility | ✅ status, type, visibility | ✅ status, type, visibility |
| **Pagination** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Posted By Info** | ✅ Shows poster email | ❌ Not needed (all yours) | ❌ Not needed (all yours) |
| **Use Case** | Platform management | Personal job management | User dashboard |

---

## 📊 Filter Options Reference

### Status Values
```javascript
'draft'    // Jobs in draft mode
'open'     // Active jobs accepting applications
'closed'   // Closed jobs
'paused'   // Temporarily paused jobs
'filled'   // Jobs with filled positions
```

### Type Values
```javascript
'full-time'   // Full-time positions
'part-time'   // Part-time positions
'contract'    // Contract-based jobs
'freelance'   // Freelance projects
'internship'  // Internship opportunities
```

### Visibility Values
```javascript
'public'       // Publicly visible jobs
'private'      // Private job listings
'invite-only'  // Invitation-only jobs
```

---

## 💡 Common Scenarios

### Scenario 1: Admin Managing Platform
```bash
# View all jobs to moderate
GET /api/admin/jobs

# Find all draft jobs waiting for approval
GET /api/admin/jobs?status=draft

# Check all private listings for compliance
GET /api/admin/jobs?visibility=private
```

### Scenario 2: Admin Managing Own Jobs
```bash
# View my posted jobs
GET /api/admin/my-jobs

# Check my open positions
GET /api/admin/my-jobs?status=open

# Review my freelance projects
GET /api/admin/my-jobs?type=freelance
```

### Scenario 3: Client/Recruiter Dashboard
```bash
# View my jobs (as client/recruiter)
GET /api/jobs/user/my-jobs

# Check my active listings
GET /api/jobs/user/my-jobs?status=open
```

---

## 🔐 Authentication

All endpoints require authentication:

```javascript
// Headers
{
  "Authorization": "Bearer YOUR_TOKEN"
}
```

### Admin Endpoints
- `/api/admin/jobs` - Requires admin role
- `/api/admin/my-jobs` - Requires admin role

### General Endpoint
- `/api/jobs/user/my-jobs` - Requires any authenticated user

---

## 📝 JavaScript Examples

### Get All Platform Jobs (Admin)
```javascript
const getAllPlatformJobs = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `http://localhost:5000/api/admin/jobs?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    }
  );
  return await response.json();
};

// Usage
await getAllPlatformJobs({ status: 'open', type: 'freelance' });
```

### Get Admin's Own Jobs
```javascript
const getMyAdminJobs = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `http://localhost:5000/api/admin/my-jobs?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    }
  );
  return await response.json();
};

// Usage
await getMyAdminJobs({ status: 'open' });
```

### Get User's Own Jobs (Any Role)
```javascript
const getUserJobs = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `http://localhost:5000/api/jobs/user/my-jobs?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    }
  );
  return await response.json();
};

// Usage
await getUserJobs({ status: 'open', type: 'full-time' });
```

---

## 🎨 Frontend Implementation Suggestions

### Admin Dashboard - Three Tabs

```javascript
// Tab 1: All Platform Jobs
<Tab label="All Jobs">
  <JobsList endpoint="/api/admin/jobs" />
</Tab>

// Tab 2: My Posted Jobs
<Tab label="My Jobs">
  <JobsList endpoint="/api/admin/my-jobs" />
</Tab>

// Tab 3: Job Management
<Tab label="Moderate">
  <JobModeration endpoint="/api/admin/jobs" />
</Tab>
```

### Client/Recruiter Dashboard

```javascript
// Single view for their jobs
<MyJobsPage endpoint="/api/jobs/user/my-jobs" />
```

---

## ✅ Summary

**Three distinct endpoints for different purposes:**

1. **`/api/admin/jobs`** → See EVERYTHING (platform-wide)
2. **`/api/admin/my-jobs`** → See MY jobs (as admin)
3. **`/api/jobs/user/my-jobs`** → See MY jobs (as any user)

**All support the same filters:**
- ✅ `status` (draft, open, closed, paused, filled)
- ✅ `type` (full-time, part-time, contract, freelance, internship)
- ✅ `visibility` (public, private, invite-only)
- ✅ `page` & `limit` for pagination

This separation allows for:
- 🎯 Clear separation of concerns
- 🔒 Proper access control
- 📊 Better analytics and reporting
- 🎨 Cleaner frontend implementation

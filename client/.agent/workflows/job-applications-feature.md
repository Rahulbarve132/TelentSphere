---
description: Job Applications Viewing Feature
---

# Job Applications Viewing Feature

## Overview
A dashboard page for clients, recruiters, and admins to view and manage applications for a specific job.

## Location
- **Page**: `/app/dashboard/jobs/[jobId]/page.tsx`
- **Route**: `http://localhost:3000/dashboard/jobs/[jobId]`

## Features

### 📋 Candidate Management
- **List View**: Displays all applicants for a specific job
- **Rich Cards**: Shows avatar, name, headline, location, and skills
- **Quick Preview**: Cover letter and proposed rate visible inline

### 🔍 Search & Filtering
- **Real-time Search**: Filter candidates by name or email
- **Status Tabs**: Easily switch between Pending, Shortlisted, and Rejected applications

### ⚡ Actions
- **Shortlist**: Mark candidate as shortlisted
- **Hire**: Mark candidate as accepted
- **Reject**: Mark candidate as rejected
- **View Profile**: Link to candidate's full profile (placeholder)
- **Message**: Trigger message action (placeholder)

### 📊 Statistics
- **Total Candidates**: Total number of applications
- **Pending Review**: Count of applications waiting for review
- **Shortlisted**: Count of shortlisted candidates
- **Rejected**: Count of rejected candidates

## API Integration

### Endpoint
```
GET /api/applications/job/:jobId
```

### Response Format
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "string",
        "job": "string",
        "applicant": {
          "_id": "string",
          "email": "string",
          "profile": {
            "firstName": "string",
            "lastName": "string",
            "headline": "string",
            "avatar": "string",
            "skills": ["string"]
          }
        },
        "coverLetter": "string",
        "proposedRate": {
          "amount": number,
          "type": "string",
          "currency": "string"
        },
        "status": "pending|reviewed|shortlisted|rejected|accepted",
        "createdAt": "ISO Date"
      }
    ]
  }
}
```

## Updates
- **Status Update**: Uses `PATCH /api/applications/:id/status` with body `{ status: string }`

## UI Components Used
- Shadcn Cards, Buttons, Badges, Separator, Avatar, Tabs (newly added)
- Lucide React Icons
- Toast Notifications via Sonner

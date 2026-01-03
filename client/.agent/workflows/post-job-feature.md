---
description: Post Job Feature Documentation
---

# Post Job Feature

## Overview
A premium multi-step job posting interface for clients, recruiters, and admins to create job listings.

## Location
- **Page**: `/app/dashboard/post-job/page.tsx`
- **Route**: `http://localhost:3000/dashboard/post-job`

## Features

### 🎨 UI/UX Highlights
- **Multi-step Form**: 5-step process with visual progress tracking
- **Smooth Animations**: Fade-in and slide-in transitions between steps
- **Premium Design**: Gradient accents, glassmorphism effects, and modern aesthetics
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Real-time Validation**: Form validation at each step before progression

### 📋 Form Steps

#### Step 1: Basic Information
- Job Title (max 200 characters)
- Job Type (Full-time, Part-time, Contract, Freelance, Internship)
- Category (11 categories from web development to AI/ML)
- Experience Level (Entry, Mid, Senior, Lead, Executive)
- Job Description (max 10,000 characters)

#### Step 2: Requirements & Skills
- **Required Skills**: Add/remove skills with badges
- **Job Requirements**: Bulleted list of requirements
- **Benefits & Perks**: Highlight what candidates get

#### Step 3: Budget & Compensation
- **Budget Type**: Fixed Price, Hourly Rate, or Monthly Salary
- **Min/Max Range**: Set compensation range
- **Currency Selection**: USD, EUR, GBP, INR, CAD, AUD
- **Live Preview**: Shows formatted budget range

#### Step 4: Location & Timeline
- **Location Type**: Remote, Onsite, or Hybrid
- **Geographic Details**: City, State, Country (conditional based on type)
- **Application Deadline**: Optional date picker

#### Step 5: Success
- Confirmation screen with auto-redirect to dashboard

## API Integration

### Endpoint
```
POST http://localhost:5000/api/jobs
```

### Request Payload
The form submits data matching the Job model schema:

```json
{
  "title": "string",
  "description": "string",
  "type": "full-time|part-time|contract|freelance|internship",
  "category": "web-development|mobile-development|...",
  "skillsRequired": ["skill1", "skill2"],
  "experienceLevel": "entry|mid|senior|lead|executive",
  "budget": {
    "type": "fixed|hourly|monthly",
    "min": 0,
    "max": 0,
    "currency": "USD"
  },
  "location": {
    "type": "remote|onsite|hybrid",
    "city": "string (optional)",
    "state": "string (optional)",
    "country": "string (optional)"
  },
  "requirements": ["requirement1", "requirement2"],
  "benefits": ["benefit1", "benefit2"],
  "applicationDeadline": "ISO date string (optional)"
}
```

### Response Handling
- **Success**: Toast notification + redirect to dashboard after 2 seconds
- **Error**: Toast notification with error message

## User Access
- ✅ **Clients**: Can post jobs
- ✅ **Recruiters**: Can post jobs
- ✅ **Admins**: Can post jobs
- ❌ **Developers**: Cannot access (different menu)

## Navigation
The "Post a Job" link appears in the dashboard sidebar for authorized roles:
- Icon: PlusCircle (from lucide-react)
- Location: Second item in the sidebar menu
- Active state: Highlighted when on the post-job page

## Validation Rules

### Step 1
- Title must not be empty
- Description must not be empty

### Step 2
- At least one skill must be added

### Step 3
- Min budget must be > 0
- Max budget must be > 0
- Min budget cannot exceed max budget

### Step 4
- For Onsite/Hybrid: Country is required
- For Remote: Country is optional

## Technologies Used
- **React**: Component logic with hooks (useState)
- **Next.js**: App router and navigation
- **TypeScript**: Type-safe form data
- **Shadcn/UI**: UI components (Button, Input, Card, etc.)
- **Lucide React**: Icons
- **Axios**: API calls via configured instance
- **Sonner**: Toast notifications

## Future Enhancements
- [ ] Save as draft functionality
- [ ] Image/file attachments for job postings
- [ ] Preview mode before submission
- [ ] Edit existing jobs
- [ ] Duplicate job functionality
- [ ] Template system for recurring job posts

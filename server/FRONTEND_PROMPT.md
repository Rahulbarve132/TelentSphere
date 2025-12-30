# TalentSphere Frontend Development Prompt

## Project Overview

Build a modern, responsive frontend for **TalentSphere** - a Job/Talent Platform connecting developers with clients and recruiters. The backend API is already complete and documented in `API_DOCUMENTATION.md`.

---

## Tech Stack (Recommended)

- **Framework:** Next.js 14+ (App Router) or React 18+ with Vite
- **Styling:** Tailwind CSS v3+ with custom design system
- **State Management:** Redux Toolkit or Zustand
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios with interceptors
- **Icons:** Lucide React or React Icons
- **Animations:** Framer Motion
- **Charts:** Recharts (for admin dashboard)
- **Date Handling:** date-fns or dayjs

---

## Design Requirements

### Visual Style
- **Theme:** Modern, professional, tech-forward
- **Colors:** Use a primary color palette with dark mode support
- **Typography:** Clean sans-serif (Inter, Outfit, or similar from Google Fonts)
- **Components:** Rounded corners, subtle shadows, smooth transitions
- **Accessibility:** WCAG 2.1 AA compliant

### UI/UX Priorities
1. Mobile-first responsive design
2. Fast page loads with skeleton loaders
3. Toast notifications for user feedback
4. Empty states for no data scenarios
5. Error boundaries with friendly messages

---

## Core Features to Build

### 1. Authentication Module
- [ ] Login page with email/password
- [ ] Registration page with role selection (Developer/Client/Recruiter)
- [ ] Forgot password flow
- [ ] Reset password page
- [ ] Email verification handling
- [ ] Protected route wrapper
- [ ] Auth context/state management
- [ ] Token refresh mechanism
- [ ] Logout functionality

### 2. Public Pages
- [ ] Landing/Home page with hero section
- [ ] Job listing page with search and filters
- [ ] Individual job details page
- [ ] Featured jobs section
- [ ] About page
- [ ] Contact page

### 3. User Dashboard (All Roles)
- [ ] Dashboard overview with stats
- [ ] Profile management page
  - Edit personal info
  - Add/remove experience
  - Add/remove education
  - Upload/delete avatar
  - Skills management
  - Social links
- [ ] Account settings page
- [ ] Change password
- [ ] Notification center with unread count
- [ ] Mark notifications as read

### 4. Developer Features
- [ ] Browse and search jobs
- [ ] Apply for jobs with cover letter
- [ ] Upload resume when applying
- [ ] View my applications list
- [ ] Track application status
- [ ] Withdraw application

### 5. Client/Recruiter Features
- [ ] Create new job posting form
- [ ] Edit job posting
- [ ] My posted jobs list
- [ ] View applications for each job
- [ ] Update application status
- [ ] Rate applicants
- [ ] Add notes to applications
- [ ] Close/delete job

### 6. Admin Dashboard
- [ ] Overview stats (users, jobs, applications)
- [ ] User management table with filters
- [ ] Activate/deactivate users
- [ ] Verify users manually
- [ ] Job management table
- [ ] Moderate jobs (close, feature)
- [ ] Analytics charts
- [ ] Broadcast notification form

---

## Page Structure

```
/                           # Landing page
/jobs                       # Job listings
/jobs/[id]                  # Job details
/login                      # Login
/register                   # Registration
/forgot-password            # Forgot password
/reset-password?token=xxx   # Reset password
/verify-email?token=xxx     # Email verification

# Protected Routes
/dashboard                  # User dashboard
/dashboard/profile          # Edit profile
/dashboard/settings         # Account settings
/dashboard/notifications    # Notifications

# Developer Routes
/dashboard/applications     # My applications

# Client/Recruiter Routes
/dashboard/jobs             # My posted jobs
/dashboard/jobs/new         # Create job
/dashboard/jobs/[id]/edit   # Edit job
/dashboard/jobs/[id]/applications  # View applicants

# Admin Routes
/admin                      # Admin dashboard
/admin/users                # User management
/admin/jobs                 # Job management
/admin/analytics            # Analytics
/admin/broadcast            # Send notifications
```

---

## API Integration

### Base Configuration
```javascript
// api/axios.js
const API_BASE_URL = 'http://localhost:5000/api';

// Interceptors for:
// - Adding Authorization header
// - Handling 401 errors (redirect to login)
// - Token refresh on expiry
// - Global error handling
```

### Authentication Flow
1. Store `accessToken` in memory/state (not localStorage for security)
2. Store `refreshToken` in HTTP-only cookie (handled by backend)
3. On 401 error, attempt token refresh
4. If refresh fails, logout user

---

## Key Components to Build

### Layout Components
- `Navbar` - with auth state, user menu, notifications bell
- `Footer` - site links, social links
- `Sidebar` - for dashboard pages
- `Container` - max-width wrapper

### UI Components
- `Button` - variants: primary, secondary, outline, ghost
- `Input` - with label, error state, icons
- `Select` - custom styled dropdown
- `Modal` - reusable dialog
- `Card` - job card, application card, stat card
- `Badge` - status badges, skill tags
- `Avatar` - user avatar with fallback
- `Skeleton` - loading placeholders
- `Toast` - notification toasts
- `Pagination` - for lists
- `EmptyState` - for no data
- `Tabs` - tabbed navigation

### Feature Components
- `JobCard` - job listing card
- `JobFilters` - search and filter sidebar
- `ApplicationCard` - application status card
- `ProfileForm` - multi-section profile editor
- `ExperienceForm` - add/edit experience modal
- `EducationForm` - add/edit education modal
- `NotificationItem` - single notification row
- `StatCard` - dashboard stat widget

---

## Form Validations (Match Backend)

### Password Rules
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

### Registration
- Email: Valid email format
- First/Last name: 2-50 characters
- Role: developer, client, or recruiter

### Job Posting
- Title: 5-200 characters
- Description: 50-10,000 characters
- Required fields: title, description, type, category

---

## State Management Structure

```javascript
// Suggested Redux slices
store/
  ├── authSlice.js      // user, token, isAuthenticated
  ├── profileSlice.js   // profile data
  ├── jobsSlice.js      // jobs list, filters, pagination
  ├── applicationsSlice.js
  ├── notificationsSlice.js
  └── uiSlice.js        // modals, toasts, sidebar state
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000/uploads
```

---

## Development Phases

### Phase 1: Foundation (Week 1)
- Project setup with chosen tech stack
- Design system and base components
- Authentication flow complete
- Protected route handling

### Phase 2: Core Features (Week 2)
- Job listing and search
- Job details page
- User profile management
- Application flow

### Phase 3: Dashboard (Week 3)
- User dashboard
- My jobs (client/recruiter)
- My applications (developer)
- Notifications

### Phase 4: Admin & Polish (Week 4)
- Admin dashboard
- User/Job management
- Analytics charts
- Testing and bug fixes

---

## Quality Checklist

- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states for all async operations
- [ ] Error handling with user-friendly messages
- [ ] Form validation with inline errors
- [ ] Empty states for lists
- [ ] 404 page for unknown routes
- [ ] SEO meta tags on all pages
- [ ] Keyboard navigation support
- [ ] Dark mode toggle (optional but nice)

---

## API Reference

Refer to `API_DOCUMENTATION.md` for complete endpoint details including:
- Request/response formats
- Authentication requirements
- Validation rules
- Error codes

---

## Getting Started

1. Create new project: `npx create-next-app@latest talentsphere-client`
2. Install dependencies
3. Set up folder structure
4. Create design tokens (colors, spacing, typography)
5. Build base UI components
6. Implement auth flow
7. Build feature by feature

---

> **Note:** The backend runs on `http://localhost:5000`. Ensure CORS is configured for your frontend port.

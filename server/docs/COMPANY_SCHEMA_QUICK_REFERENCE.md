# Company Schema - Quick Reference Guide

## 🎯 Purpose
Enhanced company schema in Profile model specifically for **RECRUITERS ONLY** to onboard companies with verification support.

---

## 📋 Quick Facts

- **Location**: `src/models/Profile.js` → `company` field
- **Applicable To**: Recruiters only (NOT clients or talent)
- **Total Fields**: 14 fields across 3 categories
- **Verification Statuses**: unverified, pending, verified, rejected
- **Verification Methods**: website, social_media, document, none

---

## 🔑 Key Fields Summary

### Basic Info (7 fields)
```javascript
{
  name: String,              // Company name
  website: String,           // Company website
  size: String,              // '1', '1-10', '11-50', '51-200', '201-500', '500+', '501-1000', '1000+'
  industry: String,          // Industry/sector
  description: String,       // Max 2000 chars
  city: String,              // Location
  logo: String               // Logo URL/path
}
```

### Verification (5 fields)
```javascript
{
  isIndependentPractitioner: Boolean,  // Default: false
  verificationStatus: String,          // Default: 'unverified'
  verificationMethod: String,          // Default: null
  verifiedWebsite: String,
  verifiedSocialMedia: {
    platform: String,
    url: String,
    followers: Number
  }
}
```

### Contact (1 field)
```javascript
{
  contactEmail: String  // Validated email, auto-lowercase
}
```

---

## 🚀 Quick Start Examples

### 1. Create Recruiter Profile with Company
```javascript
const profile = await Profile.create({
  user: userId,
  firstName: "John",
  lastName: "Doe",
  company: {
    name: "TechRecruit Inc",
    website: "https://techrecruit.com",
    size: "51-200",
    industry: "Technology Staffing",
    city: "San Francisco",
    contactEmail: "contact@techrecruit.com"
  }
});
```

### 2. Update Company Info
```javascript
await Profile.findOneAndUpdate(
  { user: userId },
  {
    $set: {
      "company.description": "Leading tech recruitment firm...",
      "company.logo": "https://example.com/logo.png"
    }
  },
  { new: true }
);
```

### 3. Verify Company (Admin)
```javascript
await Profile.findByIdAndUpdate(
  profileId,
  {
    $set: {
      "company.verificationStatus": "verified",
      "company.verificationMethod": "website",
      "company.verifiedWebsite": "https://techrecruit.com"
    }
  }
);
```

### 4. Independent Practitioner
```javascript
const profile = await Profile.create({
  user: userId,
  firstName: "Jane",
  lastName: "Smith",
  company: {
    name: "Jane Smith Recruiting",
    isIndependentPractitioner: true,
    size: "1",
    industry: "Technology Staffing",
    contactEmail: "jane@recruiting.com"
  }
});
```

---

## 🔍 Common Queries

### Find Verified Companies
```javascript
Profile.find({ 'company.verificationStatus': 'verified' })
```

### Find Pending Verifications
```javascript
Profile.find({ 'company.verificationStatus': 'pending' })
```

### Find by Company Size
```javascript
Profile.find({ 'company.size': { $in: ['501-1000', '1000+'] } })
```

### Find Independent Practitioners
```javascript
Profile.find({ 'company.isIndependentPractitioner': true })
```

### Find by Industry
```javascript
Profile.find({ 'company.industry': 'Technology Staffing' })
```

---

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| `contactEmail` | Must match email pattern `/^\S+@\S+\.\S+$/` |
| `description` | Max 2000 characters |
| `size` | Must be one of enum values |
| `verificationStatus` | Must be: unverified, pending, verified, rejected |
| `verificationMethod` | Must be: website, social_media, document, none, null |

---

## 🛡️ Security Checklist

- [ ] Verify user role is 'recruiter' before allowing company data
- [ ] Only admins can update `verificationStatus` and `verificationMethod`
- [ ] Validate and sanitize all inputs
- [ ] Implement file size limits for logo uploads
- [ ] Validate email format on both client and server
- [ ] Prevent clients/talent from accessing company fields

---

## 📊 Verification Workflow

```
┌─────────────────┐
│   Unverified    │ ← Default state
│   (Default)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Pending      │ ← Recruiter submits info
│                 │
└────┬───────┬────┘
     │       │
     ▼       ▼
┌─────────┐ ┌─────────┐
│Verified │ │Rejected │ ← Admin reviews
└─────────┘ └─────────┘
```

---

## 🎨 Frontend Implementation

### Role-Based Rendering
```jsx
{user.role === 'recruiter' && (
  <CompanySection company={profile.company} />
)}
```

### Verification Badge
```jsx
const VerificationBadge = ({ status }) => {
  const config = {
    unverified: { color: 'gray', icon: '⚪', text: 'Not Verified' },
    pending: { color: 'yellow', icon: '🟡', text: 'Pending' },
    verified: { color: 'green', icon: '✅', text: 'Verified' },
    rejected: { color: 'red', icon: '❌', text: 'Rejected' }
  };
  
  return <Badge {...config[status]} />;
};
```

### Form Validation
```javascript
const errors = {};

if (company.description?.length > 2000) {
  errors.description = 'Max 2000 characters';
}

if (company.contactEmail && !isValidEmail(company.contactEmail)) {
  errors.contactEmail = 'Invalid email format';
}
```

---

## 📝 API Endpoints

### Create/Update Profile
```
PUT /api/profile
Body: { firstName, lastName, company: { ... } }
```

### Get Profile
```
GET /api/profile/:userId
Response: { ..., company: { ... } }
```

### Admin: Verify Company
```
PATCH /api/admin/profiles/:profileId/verify
Body: { verificationStatus, verificationMethod, ... }
```

---

## 🐛 Common Issues & Solutions

### Issue: Company fields not saving
**Solution**: Ensure user role is 'recruiter' and fields are properly nested under `company` object

### Issue: Verification status not updating
**Solution**: Check admin permissions and use correct enum values

### Issue: Email validation failing
**Solution**: Ensure email matches pattern and is properly formatted

### Issue: Description too long error
**Solution**: Enforce 2000 character limit on frontend before submission

---

## 📚 Related Documentation

- **Full Documentation**: `docs/COMPANY_SCHEMA_DOCUMENTATION.md`
- **Profile Model**: `src/models/Profile.js`
- **User Roles**: `src/models/User.js`

---

## 💡 Tips

1. **Always validate role** before showing/updating company fields
2. **Use enum values** exactly as defined in schema
3. **Implement proper error handling** for validation failures
4. **Show verification status** prominently in UI
5. **Allow admins only** to change verification status
6. **Support independent practitioners** with simplified flow

---

## 🔄 Migration from Old Schema

Old company fields are **backward compatible**. Existing data will:
- Continue to work without changes
- Get default values for new fields
- Have `verificationStatus: 'unverified'` by default

---

**Last Updated**: February 1, 2026  
**Version**: 2.0

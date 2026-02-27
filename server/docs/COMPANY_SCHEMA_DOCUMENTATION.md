# Company Schema Documentation

## Overview
The company schema has been enhanced in the Profile model to support comprehensive company onboarding and verification for **recruiters only**. This schema is NOT applicable to clients or talent users.

---

## Schema Location
**File:** `src/models/Profile.js`  
**Field:** `company` (nested object within Profile schema)

---

## Complete Company Schema Structure

```javascript
company: {
  // Basic Company Information
  name: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+', '1', '2-10', '501-1000', '1000+'],
  },
  industry: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [2000, 'Company description cannot exceed 2000 characters'],
  },
  city: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
    default: null,
  },
  
  // Verification Fields
  isIndependentPractitioner: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'unverified'],
    default: 'unverified',
  },
  verificationMethod: {
    type: String,
    enum: ['website', 'social_media', 'document', 'none', null],
    default: null,
  },
  verifiedWebsite: {
    type: String,
    trim: true,
  },
  verifiedSocialMedia: {
    platform: String,
    url: String,
    followers: Number,
  },
  
  // Contact Information
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
}
```

---

## Field Descriptions

### Basic Company Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | No | Official company name. Automatically trimmed. |
| `website` | String | No | Company website URL. Automatically trimmed. |
| `size` | String | No | Company size category. Must be one of the predefined enum values. |
| `industry` | String | No | Industry or sector the company operates in. |
| `description` | String | No | Detailed company description (max 2000 characters). |
| `city` | String | No | City where the company is located. |
| `logo` | String | No | URL or path to company logo image. Defaults to `null`. |

#### Company Size Options
- `'1'` - Solo practitioner
- `'1-10'` - Micro company
- `'2-10'` - Small startup
- `'11-50'` - Small company
- `'51-200'` - Medium company
- `'201-500'` - Large company
- `'500+'` - Enterprise (legacy)
- `'501-1000'` - Large enterprise
- `'1000+'` - Very large enterprise

### Verification Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `isIndependentPractitioner` | Boolean | No | Indicates if the recruiter is an independent practitioner (not part of a company). Defaults to `false`. |
| `verificationStatus` | String | No | Current verification status of the company. Defaults to `'unverified'`. |
| `verificationMethod` | String | No | Method used to verify the company. Defaults to `null`. |
| `verifiedWebsite` | String | No | The website URL that was verified. |
| `verifiedSocialMedia` | Object | No | Social media account used for verification. |
| `verifiedSocialMedia.platform` | String | No | Social media platform name (e.g., 'LinkedIn', 'Twitter'). |
| `verifiedSocialMedia.url` | String | No | URL to the verified social media profile. |
| `verifiedSocialMedia.followers` | Number | No | Number of followers on the verified social media account. |

#### Verification Status Options
- `'unverified'` - Default state, company not yet verified
- `'pending'` - Verification request submitted and under review
- `'verified'` - Company successfully verified
- `'rejected'` - Verification request rejected

#### Verification Method Options
- `'website'` - Verified via company website
- `'social_media'` - Verified via social media account
- `'document'` - Verified via official documents
- `'none'` - No verification method used
- `null` - Not yet verified

### Contact Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contactEmail` | String | No | Company contact email (may differ from user's personal email). Automatically converted to lowercase and validated. |

---

## Usage Guidelines

### 1. **Role-Based Access**
- **Recruiters**: Can create and update all company fields
- **Clients**: Should NOT have access to company fields (use basic profile fields only)
- **Talent**: Should NOT have access to company fields

### 2. **Validation Rules**
- Email validation: Must match pattern `/^\S+@\S+\.\S+$/`
- Description: Maximum 2000 characters
- All string fields are automatically trimmed
- Contact email is automatically converted to lowercase

### 3. **Verification Workflow**

```
1. Recruiter registers → verificationStatus: 'unverified'
2. Recruiter submits company info → verificationStatus: 'pending'
3. Admin reviews verification → verificationStatus: 'verified' or 'rejected'
```

### 4. **Independent Practitioners**
For recruiters who work independently without a company:
- Set `isIndependentPractitioner: true`
- Company fields can be minimal or omitted
- Verification may follow a different process

---

## API Examples

### Creating/Updating Recruiter Profile with Company Info

**Endpoint:** `PUT /api/profile` or `POST /api/profile`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "headline": "Senior Technical Recruiter",
  "company": {
    "name": "TechRecruit Solutions",
    "website": "https://techrecruit.com",
    "size": "51-200",
    "industry": "Technology Staffing",
    "description": "Leading technology recruitment firm specializing in software engineering and data science roles.",
    "city": "San Francisco",
    "logo": "https://example.com/logos/techrecruit.png",
    "isIndependentPractitioner": false,
    "contactEmail": "contact@techrecruit.com"
  }
}
```

### Updating Verification Status (Admin Only)

**Endpoint:** `PATCH /api/admin/profiles/:profileId/verify`

**Request Body:**
```json
{
  "company": {
    "verificationStatus": "verified",
    "verificationMethod": "website",
    "verifiedWebsite": "https://techrecruit.com"
  }
}
```

### Social Media Verification

**Request Body:**
```json
{
  "company": {
    "verificationStatus": "verified",
    "verificationMethod": "social_media",
    "verifiedSocialMedia": {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/company/techrecruit",
      "followers": 15000
    }
  }
}
```

### Independent Practitioner Example

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "headline": "Freelance Technical Recruiter",
  "company": {
    "name": "Jane Smith Recruiting",
    "isIndependentPractitioner": true,
    "industry": "Technology Staffing",
    "size": "1",
    "contactEmail": "jane@janesmith.com"
  }
}
```

---

## Frontend Implementation Guidelines

### 1. **Conditional Rendering**
Only show company fields when `user.role === 'recruiter'`:

```javascript
{user.role === 'recruiter' && (
  <CompanyInformationSection 
    company={profile.company}
    onUpdate={handleCompanyUpdate}
  />
)}
```

### 2. **Form Validation**
```javascript
const validateCompanyData = (company) => {
  const errors = {};
  
  if (company.description && company.description.length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters';
  }
  
  if (company.contactEmail && !isValidEmail(company.contactEmail)) {
    errors.contactEmail = 'Please provide a valid email address';
  }
  
  return errors;
};
```

### 3. **Verification Status Display**
```javascript
const getVerificationBadge = (status) => {
  const badges = {
    unverified: { color: 'gray', text: 'Not Verified' },
    pending: { color: 'yellow', text: 'Pending Verification' },
    verified: { color: 'green', text: 'Verified' },
    rejected: { color: 'red', text: 'Verification Rejected' }
  };
  
  return badges[status] || badges.unverified;
};
```

---

## Database Queries

### Find All Verified Companies
```javascript
const verifiedRecruiters = await Profile.find({
  'company.verificationStatus': 'verified'
}).populate('user', 'email role');
```

### Find Companies by Size
```javascript
const enterpriseRecruiters = await Profile.find({
  'company.size': { $in: ['501-1000', '1000+'] }
});
```

### Find Independent Practitioners
```javascript
const independentRecruiters = await Profile.find({
  'company.isIndependentPractitioner': true
});
```

### Find Pending Verifications
```javascript
const pendingVerifications = await Profile.find({
  'company.verificationStatus': 'pending'
}).populate('user', 'email firstName lastName');
```

---

## Security Considerations

1. **Role Verification**: Always verify user role is 'recruiter' before allowing company data updates
2. **Admin-Only Fields**: `verificationStatus` and `verificationMethod` should only be updatable by admins
3. **Email Validation**: Ensure contact email is properly validated to prevent spam
4. **Logo Upload**: Implement proper file validation and size limits for logo uploads
5. **Data Sanitization**: All string inputs are trimmed automatically, but additional sanitization may be needed

---

## Migration Notes

### Existing Data
- Existing profiles with basic company info will continue to work
- New fields will default to their specified default values
- `verificationStatus` will default to `'unverified'` for existing companies

### Backward Compatibility
- The schema is backward compatible with existing company data
- Old size values ('1-10', '11-50', etc.) are still valid
- New size values have been added without removing old ones

---

## Testing Checklist

- [ ] Recruiter can create profile with company info
- [ ] Recruiter can update company information
- [ ] Client/Talent cannot access company fields
- [ ] Admin can update verification status
- [ ] Email validation works correctly
- [ ] Description character limit is enforced
- [ ] Independent practitioner flag works correctly
- [ ] Verification status transitions work properly
- [ ] Social media verification data saves correctly
- [ ] Company size enum values are validated

---

## Related Files

- **Model**: `src/models/Profile.js`
- **Controller**: `src/controllers/profileController.js`
- **Routes**: `src/routes/profileRoutes.js`
- **Middleware**: `src/middleware/auth.js` (for role verification)

---

## Change Log

### Version 2.0 (Current)
- Added comprehensive company schema for recruiters
- Added verification fields (status, method, verified website/social media)
- Added independent practitioner support
- Added company contact email
- Added company description and logo fields
- Expanded company size options
- Enhanced validation rules

### Version 1.0 (Previous)
- Basic company fields (name, website, size, industry)
- Available for both clients and recruiters

---

## Support

For questions or issues related to the company schema, please contact the development team or refer to the main project documentation.

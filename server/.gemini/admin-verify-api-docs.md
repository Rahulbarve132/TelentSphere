# Admin User Verification API

## New Endpoint Created

### Update User Verification Status
**Endpoint:** `PUT /api/admin/users/:id/verify`  
**Access:** Private/Admin Only  
**Description:** Allows admins to change the verification status of any user (except other admins)

---

## Request Details

### Headers
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

### URL Parameters
- `id` (required) - The MongoDB ObjectId of the user to update

### Request Body
```json
{
  "isVerified": true  // or false
}
```

---

## Response Examples

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User verified successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "developer",
      "isActive": true,
      "isVerified": true,
      "createdAt": "2026-01-30T12:00:00.000Z",
      "updatedAt": "2026-01-30T12:05:00.000Z"
    }
  }
}
```

### Error Responses

**User Not Found (404)**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Missing isVerified Field (400)**
```json
{
  "success": false,
  "message": "isVerified field is required"
}
```

**Cannot Modify Admin (403)**
```json
{
  "success": false,
  "message": "Cannot modify admin verification status"
}
```

**Unauthorized (401)**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

## Usage Examples

### Verify a User
```bash
curl -X PUT http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011/verify \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isVerified": true}'
```

### Unverify a User
```bash
curl -X PUT http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011/verify \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isVerified": false}'
```

### Using JavaScript/Fetch
```javascript
const updateUserVerification = async (userId, isVerified) => {
  const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/verify`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isVerified })
  });
  
  const data = await response.json();
  return data;
};

// Verify a user
await updateUserVerification('507f1f77bcf86cd799439011', true);

// Unverify a user
await updateUserVerification('507f1f77bcf86cd799439011', false);
```

---

## Security Features

1. ✅ **Admin-Only Access:** Route is protected by both `authenticate` and `authorize('admin')` middleware
2. ✅ **Admin Protection:** Cannot modify verification status of other admin users
3. ✅ **Validation:** Requires `isVerified` field in request body
4. ✅ **User Existence Check:** Validates that the user exists before updating

---

## Related Endpoints

### Get All Users (with filters)
`GET /api/admin/users?role=developer&isActive=true&isVerified=false`

### Update User Status (Active/Verified)
`PUT /api/admin/users/:id/status`
```json
{
  "isActive": true,
  "isVerified": true
}
```

---

## Notes

- The `isVerified` field is a boolean value
- The endpoint returns the updated user object
- Admin users cannot have their verification status modified
- This endpoint is separate from `/status` to provide more granular control

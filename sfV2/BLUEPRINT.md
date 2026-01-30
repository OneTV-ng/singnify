# API Structure Blueprint

This document provides a high-level overview of the API endpoints, request/response structures, and key fields as derived from the Singnify Postman collection.

---

## Endpoints

### 1. Register
- **Method:** POST
- **Path:** /api/v2/php/register.php
- **Request Body:**
  - Required fields for member registration (see Postman collection for details)
- **Response:**
  - `status`: string
  - `message`: string
  - `member`: object (see Member Object)

### 2. Login
- **Method:** POST
- **Path:** /api/v2/php/login.php
- **Request Body:**
  - Required login credentials
- **Response:**
  - `status`, `message`, `link`, `user_id`, `passkey`, `email`, `uname`, `provider`, `uid`, `member_data` (see Member Object)

### 3. Forgot Password
- **Method:** POST
- **Path:** /api/v2/php/forgot-password.php
- **Request Body:**
  - Email or identifier
- **Response:**
  - `status`, `message`, `member` (see Member Object)

### 4. Forgot Password: Verify OTP
- **Method:** POST
- **Path:** /api/v2/php/verify-otp-forgot-password.php
- **Request Body:**
  - OTP and identifier
- **Response:**
  - `status`, `message`, `member` (see Member Object)

### 5. Reset Password
- **Method:** POST
- **Path:** /api/v2/php/reset-password.php
- **Request Body:**
  - New password, identifier, OTP
- **Response:**
  - `status`, `message`, `member` (see Member Object)

### 6. Upload Image Base64
- **Method:** POST
- **Path:** /api/v2/php/upload-photo.php
- **Request Body:**
  - `image`: base64 string or placeholder
- **Response:**
  - `status`, `message`, `imageName`

### 7. Upload Cover Art
- **Method:** POST
- **Path:** /api/v2/php/upload-cover-art.php
- **Request Body:**
  - `file`: file
  - `is_cover`: text (1 or 0)
- **Response:**
  - `status`, `message`, `imageName`

### 8. Update Profile
- **Method:** POST
- **Path:** /api/v2/php/update-profile.php
- **Request Body:**
  - Profile fields (see Member Object)
- **Response:**
  - `status`, `message`, `member` (see Member Object)

### 9. Update Password
- **Method:** POST
- **Path:** /api/v2/php/update-password.php
- **Request Body:**
  - Password fields
- **Response:**
  - `status`, `message`, `member` (see Member Object)

### 10. Discover
- **Method:** POST
- **Path:** /api/v2/php/discover.php
- **Request Body:**
  - Discovery parameters
- **Response:**
  - `status`, `message`, `introductions` (array), `result` (object with music data)

### 11. Save Audio
- **Method:** POST
- **Path:** /api/v2/php/save-audio.php
- **Request Body:**
  - Audio metadata, file URLs, etc.
- **Response:**
  - Standard status/message

### 12. Save Video, Save FaceVideo, Save DanceVideo
- **Method:** POST
- **Path:** /api/v2/php/save-video.php, /save-facevideo.php, /save-dancevideo.php
- **Request Body:**
  - Video metadata, file URLs, etc.
- **Response:**
  - Standard status/message

### 13. Show Listings
- **Method:** GET
- **Path:** /api/v2/php/show-listings.php
- **Response:**
  - Listings data

### 14. Display Charts (Top Weekly)
- **Method:** POST
- **Path:** /api/v2/php/display-charts.php
- **Response:**
  - Chart data

### 15. Display Genres
- **Method:** POST
- **Path:** /api/v2/php/display-genres.php
- **Response:**
  - Genre data

---

## Member Object (Common in Responses)
- `ID`: string
- `Username`: string
- `EmailAddress`: string
- `Password`: string
- `Active`: string
- `TimeNumber`: string
- `OAuthProvider`: string
- `OAuthUID`: string
- `FirstName`: string
- `LastName`: string
- `Picture`: string (URL or placeholder)
- `Gender`: string
- `Locale`: string/null
- `Created`: string/null
- `Modified`: string/null
- `Link`: string/null
- `Phone`: string
- `Country`: string
- `Facebook`, `Twitter`, `Instagram`, `YouTube`: string/null
- `StageName`: string
- `Suspension`: string/null
- `Referrer`: string
- `ReferralAmount`: string/null
- `Membership`: string/null
- `MembershipDeadline`: string/null
- `ActiveMembership`: string/null
- `IsServiceCharge`: string/null
- `ServiceChargeAmount`: string/null
- `IsMonthCharge`: string/null
- `MonthChargeAmount`: string/null
- `MonthChargePayTime`: string/null
- `MonthChargeExpireTime`: string/null
- `Contract`: string
- `IsVerified`: string/null
- `Signature`: string/null
- `SignedContract`: string/null
- `LatestNoteID`: string/null
- `RecordLabel`: string
- `WithdrawnPoints`: string/null
- `TotalPointsEarned`: string/null
- `IsPaused`: string
- `PointRoyalty`: string/null
- `StripeCustomerID`: string/null
- `About`: string
- `FCMToken`: string/null
- `IsArtist`: string
- `OTP`: string/null
- `Token`: string

---


---

## Authentication

Most endpoints require authentication via a session token or passkey. After a successful login, include the returned `passkey` or `Token` in your request headers or as a parameter, as required by the endpoint.

**Example Header:**
```
Authorization: Bearer <passkey or token>
```

---

## Request & Response Format

- **Content-Type:** Use `application/json` for most requests. For file uploads, use `multipart/form-data`.
- **Request Body:** Send data as a JSON object unless otherwise specified.
- **Response:** All responses are JSON objects containing at least `status` and `message` fields. Data objects (e.g., `member`, `result`, `introductions`) are included as needed.

---

## Error Handling

All endpoints return a `status` field (`success` or `error`) and a `message` describing the result. Handle errors by checking the `status` and displaying/logging the `message`.

**Example Error Response:**
```json
{
  "status": "error",
  "message": "Invalid credentials."
}
```

---

## Usage Guidelines

1. **Always refer to the latest Postman collection for required/optional fields.**
2. **Use HTTPS** for all API requests to ensure data security.
3. **Validate all input** on the client side before sending requests.
4. **Handle all error responses gracefully** and provide user feedback.
5. **For file uploads**, use the correct form-data keys as specified in the endpoint description.
6. **Do not share your authentication tokens**. Treat them as sensitive credentials.
7. **Paginate results** where applicable (e.g., listings, charts) to optimize performance.

---

## Best Practices

- **Security:**
  - Use strong passwords and encourage users to do the same.
  - Store tokens securely (never in plain text or public repositories).
  - Regularly update and rotate credentials.
- **API Usage:**
  - Respect rate limits and avoid making excessive requests.
  - Use appropriate HTTP methods (POST for data changes, GET for retrieval).
  - Log all API interactions for debugging and auditing.
- **Testing:**
  - Use the provided Postman collection to test all endpoints before integrating.
  - Validate responses against expected schemas.
- **Documentation:**
  - Keep this blueprint and the Postman collection up to date with any API changes.

---

## Contribution & Support

- For questions, bug reports, or feature requests, please contact the API maintainer or open an issue in the project repository.
- Contributions to documentation and test cases are welcome.
- For security issues, contact the maintainer directly and do not disclose vulnerabilities publicly.

---

*Last updated: January 27, 2026*

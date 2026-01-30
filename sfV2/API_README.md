# Singnify API Reference

This document provides a summary of all available API endpoints, their usage, and expected request/response structures as implemented in the current backend (see Postman collection).

---

- [Verify OTP for Forgot Password](#verify-otp-for-forgot-password)
- [Reset Password](#reset-password)
- [Upload Image Base64](#upload-image-base64)
## Register
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "member": { /* See Member Object below */ }
}
```
- [Upload Cover Art](#upload-cover-art)
- [Save Video/FaceVideo/DanceVideo](#save-videofacevideodancevideo)
## Login
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "link": "0",
  "user_id": "9237",
  "passkey": "...",
  "email": "...",
  "uname": "...",
  "provider": "",
  "uid": "",
  "member_data": { /* See Member Object below */ }
}
```
- [Show Listings](#show-listings)

## Forgot Password
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "member": { /* See Member Object below */ }
}
```
## Register
  - `status`: string
## Verify OTP for Forgot Password
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "member": { /* See Member Object below */ }
}
```
  - `message`: string
- **Endpoint:** `/api/v2/php/login.php`
## Reset Password
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "member": { /* See Member Object below */ }
}
```
- **Body:** `form-data` with fields: id, password
- **Method:** POST
## Upload Image Base64
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "imageName": "user_9237.png"
}
```
- **Endpoint:** `/api/v2/php/forgot-password.php`
## Verify OTP for Forgot Password
## Upload Cover Art
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "imageName": "cover_9237.png"
}
```
- **Method:** POST

## Update Profile
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "member": { /* See Member Object below */ }
}
```
## Reset Password
  - `status`, `message`, `member` (see Member Object)
## Update Password
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "member": { /* See Member Object below */ }
}
```

- **Response:**
## Discover
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "introductions": [ /* ... */ ],
  "result": { /* music data */ }
}
```
  - `status`, `message`, `imageName`
- **Body:** `form-data` with fields: file, is_cover
## Save Audio
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success"
}
```
- **Response:**
- **Endpoint:** `/api/v2/php/update-profile.php`
## Save Video/FaceVideo/DanceVideo
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success"
}
```
- **Body:** `form-data` with profile fields (see Member Object)
## Update Password
## Show Listings
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "listings": [ /* ... */ ]
}
```
- **Method:** POST
  - `status`, `message`, `member` (see Member Object)
## Display Charts
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "charts": [ /* ... */ ]
}
```

- **Body:** `form-data` with discovery parameters
## Display Genres
- **Expected Output:**
```json
{
  "status": "200",
  "message": "success",
  "genres": [ /* ... */ ]
}
```
- **Response:**
  - `status`, `message`, `introductions` (array), `result` (object)

## Save Audio
- **Method:** POST
- **Endpoint:** `/api/v2/php/save-audio.php`
- **Body:** `form-data` with audio metadata, file URLs, etc.
- **Response:**
  - `status`, `message`

## Save Video/FaceVideo/DanceVideo
- **Method:** POST
- **Endpoints:** `/api/v2/php/save-video.php`, `/save-facevideo.php`, `/save-dancevideo.php`
- **Body:** `form-data` with video metadata, file URLs, etc.
- **Response:**
  - `status`, `message`

## Show Listings
- **Method:** GET
- **Endpoint:** `/api/v2/php/show-listings.php`
- **Response:**
  - Listings data

## Display Charts
- **Method:** POST
- **Endpoint:** `/api/v2/php/display-charts.php`
- **Response:**
  - Chart data

## Display Genres
- **Method:** POST
- **Endpoint:** `/api/v2/php/display-genres.php`
- **Response:**
  - Genre data

---

## Member Object (Common in Responses)
- `ID`, `Username`, `EmailAddress`, `Password`, `Active`, `TimeNumber`, `OAuthProvider`, `OAuthUID`, `FirstName`, `LastName`, `Picture`, `Gender`, `Locale`, `Created`, `Modified`, `Link`, `Phone`, `Country`, `Facebook`, `Twitter`, `Instagram`, `YouTube`, `StageName`, `Suspension`, `Referrer`, `ReferralAmount`, `Membership`, `MembershipDeadline`, `ActiveMembership`, `IsServiceCharge`, `ServiceChargeAmount`, `IsMonthCharge`, `MonthChargeAmount`, `MonthChargePayTime`, `MonthChargeExpireTime`, `Contract`, `IsVerified`, `Signature`, `SignedContract`, `LatestNoteID`, `RecordLabel`, `WithdrawnPoints`, `TotalPointsEarned`, `IsPaused`, `PointRoyalty`, `StripeCustomerID`, `About`, `FCMToken`, `IsArtist`, `OTP`, `Token`

---

## Notes
- All requests should use `form-data` unless otherwise specified.
- All responses are JSON objects with at least `status` and `message` fields.
- For file uploads, use the correct form-data keys as specified above.
- Refer to the Postman collection for full details and example requests/responses.

---

*Last updated: January 27, 2026*

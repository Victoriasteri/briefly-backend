# Authentication API Contract

## Base URL

```
http://localhost:3000
```

_Note: Update this to your production URL when deployed_

---

## Authentication Flow

1. **Sign Up** → Create a new user account
2. **Sign In** → Authenticate and receive access/refresh tokens
3. **Use Access Token** → Include in `Authorization` header for protected routes
4. **Refresh Token** → Get new access token when current one expires
5. **Sign Out** → Invalidate current session

---

## Endpoints

### 1. Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "metadata": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Request Schema:**

- `email` (string, required): Valid email address
- `password` (string, required): Minimum 6 characters
- `metadata` (object, optional): Additional user metadata

**Success Response:** `201 Created`

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "created_at": "2025-01-21T12:00:00.000Z",
    ...
  },
  "message": "User created successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input or user already exists

```json
{
  "statusCode": 400,
  "message": "User already registered",
  "error": "Bad Request"
}
```

- `400 Bad Request` - Validation errors

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

### 2. Sign In

Authenticate user and receive access/refresh tokens.

**Endpoint:** `POST /auth/signin`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Request Schema:**

- `email` (string, required): Valid email address
- `password` (string, required): User password

**Success Response:** `200 OK`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {},
    "created_at": "2025-01-21T12:00:00.000Z",
    ...
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid credentials

```json
{
  "statusCode": 401,
  "message": "Invalid login credentials",
  "error": "Unauthorized"
}
```

- `400 Bad Request` - Validation errors

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be a string"],
  "error": "Bad Request"
}
```

---

### 3. Get Current User

Get the authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Success Response:** `200 OK`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "user_metadata": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "created_at": "2025-01-21T12:00:00.000Z",
  "updated_at": "2025-01-21T12:00:00.000Z",
  ...
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token

```json
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "error": "Unauthorized"
}
```

- `401 Unauthorized` - No authorization header

```json
{
  "statusCode": 401,
  "message": "No authorization header",
  "error": "Unauthorized"
}
```

---

### 4. Sign Out

Sign out the current user and invalidate the session.

**Endpoint:** `POST /auth/signout`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Success Response:** `200 OK`

```json
{
  "message": "Signed out successfully"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token

```json
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "error": "Unauthorized"
}
```

---

### 5. Refresh Token

Get a new access token using a refresh token.

**Endpoint:** `POST /auth/refresh`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Schema:**

- `refresh_token` (string, required): Valid refresh token

**Success Response:** `200 OK`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or expired refresh token

```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

- `400 Bad Request` - Validation errors

```json
{
  "statusCode": 400,
  "message": ["refresh_token must be a string"],
  "error": "Bad Request"
}
```

---

## Token Management

### Access Token

- **Usage:** Include in `Authorization` header for protected routes
- **Format:** `Authorization: Bearer <access_token>`
- **Expiration:** Set by Supabase (typically 1 hour)
- **Storage:** Store securely (e.g., in-memory, secure HTTP-only cookie)

### Refresh Token

- **Usage:** Use to obtain new access tokens when current one expires
- **Storage:** Store securely (e.g., secure HTTP-only cookie, secure storage)
- **Expiration:** Set by Supabase (typically longer-lived)

### Recommended Flow

1. Store both tokens securely after sign in
2. Include access token in all authenticated requests
3. When access token expires (401 response), use refresh token to get new tokens
4. If refresh token is invalid, redirect user to sign in

---

## Error Handling

All error responses follow this structure:

```json
{
  "statusCode": <number>,
  "message": <string | string[]>,
  "error": <string>
}
```

### Common Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data or validation errors
- `401 Unauthorized` - Authentication required or invalid credentials
- `500 Internal Server Error` - Server error

---

## Example Frontend Implementation

### TypeScript/JavaScript Example

```typescript
// API Client Configuration
const API_BASE_URL = 'http://localhost:3000';

// Token Storage (adjust based on your needs)
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// API Request Helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle token refresh on 401
  if (response.status === 401 && endpoint !== '/auth/signin') {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken);
      if (refreshed) {
        // Retry original request with new token
        headers.Authorization = `Bearer ${getAccessToken()}`;
        return fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      }
    }
    clearTokens();
    // Redirect to login
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Auth Functions
export async function signUp(
  email: string,
  password: string,
  metadata?: object,
) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, metadata }),
  });
}

export async function signIn(email: string, password: string) {
  const response = await apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setTokens(response.access_token, response.refresh_token);
  return response;
}

export async function signOut() {
  await apiRequest('/auth/signout', { method: 'POST' });
  clearTokens();
}

export async function getCurrentUser() {
  return apiRequest('/auth/me');
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    setTokens(response.access_token, response.refresh_token);
    return true;
  } catch (error) {
    clearTokens();
    return false;
  }
}
```

---

## Testing with cURL

### Sign Up

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "metadata": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }'
```

### Sign In

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Sign Out

```bash
curl -X POST http://localhost:3000/auth/signout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

---

## Notes

1. **CORS:** The API has CORS enabled, so it can be accessed from frontend applications.
2. **Email Confirmation:** Currently, emails are auto-confirmed for development. Adjust in production.
3. **Password Requirements:** Minimum 6 characters (enforced by validation).
4. **Token Security:** Always use HTTPS in production. Consider using HTTP-only cookies for token storage.
5. **Error Messages:** Validation errors return an array of messages, while business logic errors return a single message string.

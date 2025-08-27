# 💪 Workout Tracker API

## Overview

This is a robust backend API built with Express.js and MongoDB, designed to help users track their workouts, schedule fitness plans, and receive AI-powered personalized suggestions. It features user authentication, comprehensive workout management, and automated notifications.

## Features

- User Authentication: Secure user registration, login, and password management with JSON Web Tokens (JWT).
- Workout Management: Create, retrieve, update, and delete detailed workout logs including exercises, sets, reps, and weights.
- Exercise Database: Access a curated list of exercises with details on muscles, force, and difficulty level.
- Scheduling: Plan upcoming workouts with specific dates and receive timely email notifications.
- AI-Powered Suggestions: Get personalized fitness advice, progressive overload tips, and recovery recommendations from an OpenAI integration based on past workout history.
- Data Filtering & Pagination: Advanced filtering, sorting, and pagination capabilities for efficient data retrieval.
- Error Handling: Centralized error handling for consistent and informative API responses.

## Getting Started

### Installation

To get this project up and running locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/HassanAmirii/workout-tracker.git
    cd workout-tracker
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Create Configuration File**:
    Create a `config/config.env` file in the root directory and populate it with the required environment variables.
4.  **Seed Initial Data (Optional)**:
    To import initial exercise data, run:
    ```bash
    node seeder -i
    ```
    To delete all seeded data, run:
    ```bash
    node seeder -d
    ```
5.  **Run the Application**:
    - For development mode with `nodemon`:
      ```bash
      npm run dev
      ```
    - For production mode:
      ```bash
      npm start
      ```

### Environment Variables

All necessary environment variables must be defined in `config/config.env`.

- `NODE_ENV`: `development` or `production`
- `PORT`: Port for the server to run on (e.g., `8080`)
- `MONGO_URI`: MongoDB connection string (e.g., `mongodb+srv://user:password@cluster.mongodb.net/workout_tracker?retryWrites=true&w=majority`)
- `JWT_SECRET`: Secret key for JWT signing (e.g., `supersecretjwtkey123`)
- `JWT_EXPIRE`: JWT expiration time (e.g., `30d`)
- `JWT_COOKIE_EXPIRE`: JWT cookie expiration time in days (e.g., `30`)
- `SMTP_HOST`: SMTP server host for sending emails (e.g., `sandbox.smtp.mailtrap.io`)
- `SMTP_PORT`: SMTP server port (e.g., `2525`)
- `SMTP_EMAIL`: SMTP username (e.g., `your_mailtrap_username`)
- `SMTP_PASSWORD`: SMTP password (e.g., `your_mailtrap_password`)
- `FROM_EMAIL`: Sender email address (e.g., `noreply@workouttracker.com`)
- `OPENAI_API_KEY`: Your OpenAI API key for AI suggestions (e.g., `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## API Documentation

### Base URL

`http://localhost:8080/api/v1` (or your configured `PORT`)

### Endpoints

#### POST /api/v1/auth/register

Registers a new user.

**Request**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "StrongPassword123"
}
```

**Response**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "65b902e4d0c7f074d0f6e5a4",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-30T10:00:00.000Z"
  }
}
```

**Errors**:

- 400: Validation error (e.g., email already exists, invalid email format)
- 500: Server Error

#### POST /api/v1/auth/login

Logs in an existing user and returns a JWT.

**Request**:

```json
{
  "email": "john.doe@example.com",
  "password": "StrongPassword123"
}
```

**Response**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:

- 401: Invalid credentials
- 500: Server Error

#### GET /api/v1/auth/logout

Logs out the current user by clearing the JWT cookie. (Protected)

**Request**:
(No payload required)

**Response**:

```json
{
  "success": true,
  "data": {}
}
```

**Errors**:

- 401: Not authorized (if no valid token is provided)

#### PUT /api/v1/auth/update

Updates the current user's name and email. (Protected)

**Request**:

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "65b902e4d0c7f074d0f6e5a4",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "createdAt": "2024-01-30T10:00:00.000Z"
  }
}
```

**Errors**:

- 400: Validation error (e.g., email already exists, invalid email format)
- 401: Not authorized
- 500: Server Error

#### PUT /api/v1/auth/updatepassword

Updates the current user's password. (Protected)

**Request**:

```json
{
  "password": "CurrentStrongPassword123",
  "newpassword": "NewStrongPassword456"
}
```

**Response**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:

- 401: Not authorized, or invalid current password
- 500: Server Error

#### POST /api/v1/auth/forgetpassword

Sends a password reset email to the provided email address.

**Request**:

```json
{
  "email": "john.doe@example.com"
}
```

**Response**:

```json
{
  "success": true,
  "data": "Email sent"
}
```

**Errors**:

- 400: User not found with that email
- 500: Server Error (e.g., email sending failed)

#### PUT /api/v1/auth/resetpassword/:resettoken

Resets the user's password using a valid reset token.

**Request**:

```json
{
  "password": "NewStrongPassword456"
}
```

**Response**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:

- 400: Invalid or expired token
- 500: Server Error

#### GET /api/v1/exercises

Retrieves all exercises. Supports advanced filtering, sorting, and pagination. (Protected, as `advancedResults` filters by user ID by default)

**Request**:
(No payload required)

**Query Parameters**:

- `select`: Comma-separated list of fields to return (e.g., `name,level`)
- `sort`: Comma-separated list of fields to sort by (e.g., `name,-level`)
- `page`: Page number (e.g., `1`)
- `limit`: Number of results per page (e.g., `10`)
- Any exercise field for filtering (e.g., `level=beginner`, `primaryMuscles=Chest`)

**Response**:

```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 1
    }
  },
  "data": [
    {
      "_id": "65b902e4d0c7f074d0f6e5a5",
      "name": "Bench Press",
      "level": "intermediate",
      "primaryMuscles": ["Chest", "Triceps"],
      "category": "Strength"
    },
    {
      "_id": "65b902e4d0c7f074d0f6e5a6",
      "name": "Squat",
      "level": "expert",
      "primaryMuscles": ["Quadriceps", "Glutes"],
      "category": "Strength"
    }
  ]
}
```

**Errors**:

- 500: Server Error

#### GET /api/v1/workouts

Retrieves all workouts for the authenticated user. Supports advanced filtering, sorting, and pagination. (Protected)

**Request**:
(No payload required)

**Query Parameters**:

- `select`: Comma-separated list of fields to return (e.g., `name,status`)
- `sort`: Comma-separated list of fields to sort by (e.g., `name,-createdAt`)
- `page`: Page number (e.g., `1`)
- `limit`: Number of results per page (e.g., `10`)
- Any workout field for filtering (e.g., `status=completed`, `name=Leg Day`)

**Response**:

```json
{
  "success": true,
  "count": 1,
  "pagination": {},
  "data": [
    {
      "_id": "65b902e4d0c7f074d0f6e5a7",
      "name": "Full Body Workout",
      "description": "Intense full body session.",
      "exercises": [
        {
          "exercise": {
            "_id": "65b902e4d0c7f074d0f6e5a5",
            "name": "Bench Press"
          },
          "name": "Bench Press",
          "sets": 3,
          "reps": 8,
          "weight": 70,
          "restTime": 60,
          "_id": "65b902e4d0c7f074d0f6e5a8"
        }
      ],
      "status": "planned",
      "notes": "Focus on form.",
      "user": "65b902e4d0c7f074d0f6e5a4",
      "createdAt": "2024-01-30T10:00:00.000Z",
      "updatedAt": "2024-01-30T10:00:00.000Z"
    }
  ]
}
```

**Errors**:

- 401: Not authorized
- 500: Server Error

#### POST /api/v1/workouts

Creates a new workout for the authenticated user. (Protected)

**Request**:

```json
{
  "name": "Leg Day Power",
  "description": "Heavy lifting for legs.",
  "exercises": [
    {
      "exercise": "65b902e4d0c7f074d0f6e5a6",
      "sets": 4,
      "reps": 6,
      "weight": 100,
      "restTime": 90
    }
  ],
  "note": "Don't skip stretching!",
  "status": "planned"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "65b902e4d0c7f074d0f6e5a9",
    "name": "Leg Day Power",
    "description": "Heavy lifting for legs.",
    "exercises": [
      {
        "exercise": "65b902e4d0c7f074d0f6e5a6",
        "name": "Squat",
        "sets": 4,
        "reps": 6,
        "weight": 100,
        "restTime": 90,
        "_id": "65b902e4d0c7f074d0f6e5aa"
      }
    ],
    "status": "planned",
    "notes": "Don't skip stretching!",
    "user": "65b902e4d0c7f074d0f6e5a4",
    "createdAt": "2024-01-30T10:00:00.000Z",
    "updatedAt": "2024-01-30T10:00:00.000Z"
  }
}
```

**Errors**:

- 400: Validation error (e.g., missing required fields, invalid exercise ID)
- 401: Not authorized
- 500: Server Error

#### PUT /api/v1/workouts/:id

Updates a specific workout by ID for the authenticated user. (Protected)

**Request**:

```json
{
  "name": "Leg Day Focus",
  "status": "completed"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "65b902e4d0c7f074d0f6e5a9",
    "name": "Leg Day Focus",
    "description": "Heavy lifting for legs.",
    "exercises": [
      {
        "exercise": "65b902e4d0c7f074d0f6e5a6",
        "name": "Squat",
        "sets": 4,
        "reps": 6,
        "weight": 100,
        "restTime": 90,
        "_id": "65b902e4d0c7f074d0f6e5aa"
      }
    ],
    "status": "completed",
    "notes": "Don't skip stretching!",
    "user": "65b902e4d0c7f074d0f6e5a4",
    "createdAt": "2024-01-30T10:00:00.000Z",
    "updatedAt": "2024-01-30T10:30:00.000Z"
  }
}
```

**Errors**:

- 400: Validation error
- 401: Not authorized (user does not own the workout)
- 404: Workout not found
- 500: Server Error

#### DELETE /api/v1/workouts/:id

Deletes a specific workout by ID for the authenticated user. (Protected)

**Request**:
(No payload required)

**Response**:

```json
{
  "success": true,
  "data": {}
}
```

**Errors**:

- 401: Not authorized (user does not own the workout)
- 404: Workout not found
- 500: Server Error

#### GET /api/v1/schedule

Retrieves all workout schedules for the authenticated user. Supports advanced filtering, sorting, and pagination. (Protected)

**Request**:
(No payload required)

**Query Parameters**:

- `select`: Comma-separated list of fields to return
- `sort`: Comma-separated list of fields to sort by
- `page`: Page number
- `limit`: Number of results per page
- Any schedule field for filtering (e.g., `date=2024-02-15`, `title=Morning Run`)

**Response**:

```json
{
  "success": true,
  "count": 1,
  "pagination": {},
  "data": [
    {
      "_id": "65b902e4d0c7f074d0f6e5ab",
      "user": "65b902e4d0c7f074d0f6e5a4",
      "workout": {
        "_id": "65b902e4d0c7f074d0f6e5a9",
        "name": "Leg Day Focus",
        "description": "Heavy lifting for legs."
      },
      "title": "Gym Session",
      "date": "2024-02-15T08:00:00.000Z",
      "isNotified": false,
      "note": "Focus on squats and deadlifts.",
      "createdAt": "2024-01-30T10:00:00.000Z",
      "updatedAt": "2024-01-30T10:00:00.000Z"
    }
  ]
}
```

**Errors**:

- 401: Not authorized
- 500: Server Error

#### POST /api/v1/schedule

Creates a new workout schedule for the authenticated user. (Protected)

**Request**:

```json
{
  "title": "Evening Cardio",
  "date": "2024-02-16T18:00:00.000Z",
  "note": "30 minutes on the treadmill.",
  "workout": "65b902e4d0c7f074d0f6e5a9"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "65b902e4d0c7f074d0f6e5ac",
    "user": "65b902e4d0c7f074d0f6e5a4",
    "workout": "65b902e4d0c7f074d0f6e5a9",
    "title": "Evening Cardio",
    "date": "2024-02-16T18:00:00.000Z",
    "isNotified": false,
    "note": "30 minutes on the treadmill.",
    "createdAt": "2024-01-30T10:00:00.000Z",
    "updatedAt": "2024-01-30T10:00:00.000Z"
  }
}
```

**Errors**:

- 400: Validation error (e.g., missing required fields, invalid workout ID)
- 401: Not authorized
- 500: Server Error

#### PUT /api/v1/schedule/:id

Updates a specific workout schedule by ID for the authenticated user. (Protected)

**Request**:

```json
{
  "note": "45 minutes on the treadmill."
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "65b902e4d0c7f074d0f6e5ac",
    "user": "65b902e4d0c7f074d0f6e5a4",
    "workout": "65b902e4d0c7f074d0f6e5a9",
    "title": "Evening Cardio",
    "date": "2024-02-16T18:00:00.000Z",
    "isNotified": false,
    "note": "45 minutes on the treadmill.",
    "createdAt": "2024-01-30T10:00:00.000Z",
    "updatedAt": "2024-01-30T10:30:00.000Z"
  }
}
```

**Errors**:

- 400: Validation error
- 401: Not authorized (user does not own the schedule)
- 404: Schedule not found
- 500: Server Error

#### DELETE /api/v1/schedule/:id

Deletes a specific workout schedule by ID for the authenticated user. (Protected)

**Request**:
(No payload required)

**Response**:

```json
{
  "success": true,
  "data": {}
}
```

**Errors**:

- 401: Not authorized (user does not own the schedule)
- 404: Schedule not found
- 500: Server Error

#### GET /api/v1/suggestions

Retrieves AI-powered workout suggestions and advice based on the user's recent workout history. (Protected)

**Request**:
(No payload required)

**Response**:

```json
{
  "success": true,
  "data": "1. Progressive Overload Suggestions:\n   - For Bench Press: Consider increasing weight by 2.5-5kg for your next session if you hit your target reps comfortably. Alternatively, try to add one more rep to each set at the current weight.\n   - For Squats: Focus on increasing depth while maintaining form. Once perfected, consider adding 5-10kg to your working sets.\n2. Form Improvement Tips:\n   - Bench Press: Ensure your back is slightly arched, shoulder blades are retracted, and feet are firmly on the ground for stability. Keep elbows tucked in at about a 45-degree angle to protect your shoulders.\n   - Squats: Work on ankle mobility to improve squat depth. Keep your chest up, core engaged, and drive through your heels. Consider goblet squats for form practice.\n3. Recovery Recommendations:\n   - Ensure adequate protein intake (1.6-2.2g per kg of body weight) to support muscle repair.\n   - Aim for 7-9 hours of quality sleep per night. Consider active recovery days with light cardio or stretching.\n4. Exercise Variations:\n   - Bench Press: Incline dumbbell press, close-grip bench press, push-ups (weighted or elevated).\n   - Squats: Front squats, Bulgarian split squats, leg press, box squats.\n5. Safety Considerations:\n   - Always use spotters for heavy compound lifts like bench press and squats, especially when attempting new personal records.\n   - Listen to your body and don't push through sharp pain. Properly warm up before each session and cool down with stretching."
}
```

**Errors**:

- 401: Not authorized
- 500: Server Error (e.g., OpenAI API issue)

## Usage

After successfully installing and running the server, you can interact with the API using any HTTP client (e.g., Postman, Insomnia, or `curl`).
Authentication is handled via JWT. After logging in, you'll receive a token which should be included in the `Authorization` header as a Bearer token for all protected routes:

`Authorization: Bearer <your_jwt_token>`

Example of creating a workout:

```bash
curl -X POST \
  http://localhost:8080/api/v1/workouts \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
  -d '{
    "name": "Arm Blaster",
    "description": "Biceps and Triceps workout",
    "exercises": [
      {
        "exercise": "65b902e4d0c7f074d0f6e5a5",
        "sets": 3,
        "reps": 10,
        "weight": 20,
        "restTime": 60
      }
    ],
    "note": "Pump it up!",
    "status": "planned"
  }'
```

To fetch exercises, including advanced query options:

```bash
curl -X GET \
  "http://localhost:8080/api/v1/exercises?level=beginner&sort=-name&limit=5" \
  -H 'Authorization: Bearer <YOUR_JWT_TOKEN>'
```

## Technologies Used

| Technology | Description                                                                                  |
| :--------- | :------------------------------------------------------------------------------------------- |
| Node.js    | JavaScript runtime for server-side execution.                                                |
| Express.js | Fast, unopinionated, minimalist web framework for Node.js.                                   |
| MongoDB    | NoSQL database for flexible and scalable data storage.                                       |
| Mongoose   | MongoDB object data modeling (ODM) for Node.js.                                              |
| JWT        | JSON Web Tokens for secure authentication and authorization.                                 |
| Bcrypt.js  | Library for hashing passwords securely.                                                      |
| Nodemailer | Module for sending emails from Node.js applications (for password resets and notifications). |
| OpenAI API | Integrated for generating personalized fitness suggestions and advice.                       |
| Node-Cron  | Task scheduler to run recurring jobs, specifically for workout schedule notifications.       |
| Dotenv     | Loads environment variables from a `.env` file.                                              |
| Morgan     | HTTP request logger middleware for Node.js.                                                  |
| Chalk      | Terminal string styling for colorful console output.                                         |
| Axios      | Promise-based HTTP client for the browser and Node.js.                                       |
| Crypto     | Node.js built-in module for cryptographic functionality.                                     |

## License

This project is licensed under the ISC License.

## Author Info

**Guerrouf Aymen**

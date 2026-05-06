# CodeCraft Thailand Applet

This is a professional full-stack portfolio and administration system.

## Setup Requirements

To run this application locally or in production, you **MUST** configure the following environment variables:

1.  **MONGODB_URI**: Your MongoDB connection string.
    *   Example: `mongodb+srv://user:password@cluster.mongodb.net/database_name`
2.  **JWT_SECRET**: A secure random string for session encryption.
3.  **ADMIN_SECRET**: A password for initial admin registration.

### Local Development

1.  Create a `.env.local` file in the root directory.
2.  Add the variables mentioned above.
3.  Run `npm install` and then `npm run dev`.

### Common Issues

*   **"An unexpected error occurred" or "ไม่สามารถเชื่อมต่อฐานข้อมูลได้"**:
    *   This usually means `MONGODB_URI` is missing or incorrect.
    *   Make sure your IP address is whitelisted in MongoDB Atlas.
    *   Check that the username and password in the URI are correct.

## Features

*   **Responsive Portfolio**: Modern bento-grid design.
*   **Admin Dashboard**: Manage projects and user accounts.
*   **User Profiles**: Password-protected access for collaborators.
*   **LINE Contact Integration**: Floating contact buttons and QR code modal.

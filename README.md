# E-Learning Platform

A modern e-learning platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication with email verification
- Course creation and management
- Video lectures
- AI-powered chatbot for student support
- Admin dashboard
- User progress tracking
- Responsive design

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email
- Cohere AI for chatbot
- Bcrypt for password hashing

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- React Router
- Axios

## Quickstart

1. Clone the repository:
```bash
git clone https://github.com/WaveXagency/e-learning-pfa.git
cd e-learning-pfa
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with:
```
DB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_NAME=your_app_name
FROM_EMAIL=your_email
COHERE_API_KEY=your_cohere_key
```

4. Run the development servers:
```bash
# Start backend server
cd server
npm run dev

# Start frontend server
cd ../client
npm run dev
```

## API Overview

### Authentication
- POST /api/users/register - Register new user
- POST /api/users/verify - Verify email with OTP
- POST /api/users/login - User login
- GET /api/users/me - Get user profile

### Courses
- GET /api/courses - List all courses
- GET /api/courses/:id - Get course details
- POST /api/courses - Create new course (admin)
- PUT /api/courses/:id - Update course (admin)
- DELETE /api/courses/:id - Delete course (admin)

### Admin
- GET /api/admin/users - List all users
- GET /api/admin/stats - Get platform statistics
- POST /api/admin/courses - Create course
- POST /api/admin/:courseId/lecture - Add lecture

## Folder Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # State management
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
│
└── server/                # Backend Node.js application
    ├── controllers/      # Route controllers
    ├── models/          # Database models
    ├── routes/          # API routes
    ├── middleware/      # Custom middleware
    └── utils/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
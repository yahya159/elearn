import dotenv from 'dotenv';
dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET,
  dbUri: process.env.DB_URI,
  mailUser: process.env.SMTP_USER,
  mailPass: process.env.SMTP_PASS,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  fromName: process.env.FROM_NAME,
  fromEmail: process.env.FROM_EMAIL,
  cohereKey: process.env.COHERE_API_KEY,
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
}; 
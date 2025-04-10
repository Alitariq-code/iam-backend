import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import groupRoutes from './routes/group.routes.js';
import roleRoutes from './routes/role.routes.js';
import moduleRoutes from './routes/module.routes.js';
import permissionRoutes from './routes/permission.routes.js';

dotenv.config();

const app: Application = express();

// 💡 Morgan logs all incoming requests
app.use(morgan('dev'));

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: '🚀 IAM Backend is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/permissions', permissionRoutes);

// 404 route handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`❌ ${err.stack}`);
  res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

export default app;

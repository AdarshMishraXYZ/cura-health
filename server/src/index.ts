import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth.routes.js';
import { doctorsRouter } from './routes/doctors.routes.js';
import { appointmentsRouter } from './routes/appointments.routes.js';
import { triageRouter } from './routes/triage.routes.js';
import { prisma } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and CORS middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

// Health Check Endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      status: 'healthy',
      database: 'connected (PostgreSQL)',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'degraded',
      database: 'disconnected',
      error: err?.message,
    });
  }
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/triage', triageRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`🏥 Cura Health Backend running on http://localhost:${PORT}`);
  console.log(`📊 Connected to PostgreSQL database 'cura_health'`);
  console.log(`🤖 Gemini AI Triage Proxy active`);
});

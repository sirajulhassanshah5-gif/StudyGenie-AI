import express from 'express';
import cors from 'cors';
import { config } from './server/config/index.js';
import healthRoutes from './server/routes/healthRoutes.js';
import noteRoutes from './server/routes/noteRoutes.js';
import { requestLogger, errorHandler } from './server/middleware/index.js';

const app = express();

// Enable CORS
app.use(cors({ origin: config.corsOrigin }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Routes
app.use('/api', healthRoutes);
app.use('/api', noteRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'StudyGenie AI Express Server Running' });
});

// Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});

export default app;

import { HealthModel } from '../models/HealthModel.js';

export const getHealth = (req, res) => {
  try {
    const healthInfo = HealthModel.getHealthStatus();
    res.status(200).json(healthInfo);
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

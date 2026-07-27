// In-memory data store without database dependency
export const HealthModel = {
  getHealthStatus: () => {
    return {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'StudyGenie AI API Service',
    };
  },
};

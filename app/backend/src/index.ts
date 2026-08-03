import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON bodies

// API Routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'weallth-pwm-backend' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Weallth PWM Backend running on http://localhost:${PORT}`);
  console.log(`- API base URL: http://localhost:${PORT}/api/v1`);
});

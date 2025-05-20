const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerParser = require('@apidevtools/swagger-parser');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');
const commentRoutes = require('./routes/comment');
const dashboardRoutes = require('./routes/dashboard');
const { scheduleDeadlineNotifications } = require('./utils/cron');

// Initialize Express app
const app = express();

// Apply security and logging middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests
});
app.use(limiter);

// Mount routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/projects/:projectId/tasks', taskRoutes);
app.use('/projects/:projectId/tasks/:taskId/comments', commentRoutes);
app.use('/dashboard', dashboardRoutes);

// Serve Swagger UI
swaggerParser.parse('./docs/swagger.json').then(api => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(api));
});

// Schedule cron jobs
scheduleDeadlineNotifications();

// Apply global error handler
app.use(errorHandler);

module.exports = app;
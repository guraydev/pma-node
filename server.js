require('dotenv').config(); // Load .env variables
const app = require('./app');
const sequelize = require('./config/database');

// Start the server and sync database
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Database synced');
  });
}).catch(err => {
  console.error('Failed to sync database:', err.message);
});
require('dotenv').config();
 
const { once } = require('events');
 
const app = require('./app');
 
const PORT = process.env.PORT || 3000;
 

async function startServer() {
  try {
    const server = app.listen(PORT);
    await once(server, 'listening');
    console.log(`DriveSelect running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}
 
startServer();
const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers for resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {
  // Use default system DNS if custom configuration fails
}

let memoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workhive';
  
  try {
    // Attempt connecting to MongoDB instance
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected to database successfully`);
    return mongoose.connection;
  } catch (err) {
    console.log(`[MongoDB] Local daemon not reachable at ${primaryUri} (${err.message}).`);
    console.log(`[MongoDB] Starting embedded MongoDB engine (mongodb-memory-server)...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'workhive'
        }
      });
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Embedded MongoDB engine active & connected at ${memUri}`);
      return mongoose.connection;
    } catch (memErr) {
      console.error('[MongoDB] Fatal: Failed to initialize MongoDB engine:', memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };

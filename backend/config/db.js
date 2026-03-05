const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`🕷️ MongoDB Connected: ${conn.connection.host}`);
    
    // Create default collections if they don't exist
    await initializeCollections();
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const initializeCollections = async () => {
  const collections = ['projects', 'services', 'testimonials', 'messages'];
  
  for (const collection of collections) {
    try {
      await mongoose.connection.createCollection(collection);
      console.log(`📁 Collection '${collection}' initialized`);
    } catch (error) {
      // Collection might already exist
    }
  }
};

module.exports = connectDB;
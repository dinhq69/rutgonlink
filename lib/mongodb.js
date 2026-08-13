import { MongoClient } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

if (!process.env.MONGODB_URI) {
  throw new Error('Thiếu biến MONGODB_URI trong Environment Variables của Vercel');
}

const options = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000
};

const client = new MongoClient(process.env.MONGODB_URI, options);

// Giúp tự động dọn dẹp connection khi Serverless Function tạm dừng
attachDatabasePool(client);

export default client;

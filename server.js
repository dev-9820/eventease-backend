import 'dotenv/config';
import { connect } from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

(async () => {
  try {
    await connect(MONGO_URL);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('DB connection failed', err);
    process.exit(1);
  }
})();

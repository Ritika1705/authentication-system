import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from "dotenv";
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log('Server is running on port ', PORT);
});
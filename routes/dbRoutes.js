// routes/dbRoutes.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/db-test', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const message = dbState === 1 ? 'Database connection successful' : 'Database connection failed';
  res.render('test', { message });
});

export default router;
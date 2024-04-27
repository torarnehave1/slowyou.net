// routes/testRoutes.js
import express from 'express';

const router = express.Router();

router.get('/message', (req, res) => {
  res.render('test', { message: 'This is a test message' });
});

export default router;
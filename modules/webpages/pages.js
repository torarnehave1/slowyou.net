import express from 'express';
import dotenv from 'dotenv';
dotenv.config();





const router = express.Router();

router.get('/test', (req, res) => {

    console.log(__dirname);
  
    res.render('test', { message: 'This is a test message from the WPages END POINT' });
  });

router.get('/faq', (req, res) => {
    const faqs = [
      { question: 'Spørsmål1', answer: 'Answer 1' },
      { question: 'Question 2', answer: 'Answer 2' },
      { question: 'Question 3', answer: 'Answer 3' },
      { question: 'Question 4', answer: 'Answer 4' },
    ];
    res.render('view_faq', { faqs: faqs });
  });

  
  export default router;
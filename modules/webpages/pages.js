import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';




dotenv.config();


//Root for this endpoint are /w/endpointname app.use('/w', webpagesroutes);


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '..', '..');



router.get('/test', (req, res) => {
 
  console.log(filePath);
  
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



  router.get('/slow', (req, res) => {
    
    res.sendFile(path.join(filePath, 'public/landpages/slowyoutrening.html'));
  });
  
  export default router;
import { Router } from 'express';
const router = Router();
import MDfile from '../models/Mdfiles.js';
import mongoose from 'mongoose';

//app.use('/blog', MDfile);

// Create a dummy record for the MDfile
router.get('/dummy', async (req, res) => {
    try {
        const mdfile = new MDfile({
            _id: new mongoose.Types.ObjectId(),
            filename: 'Maiken_dummy_filename',
            title: 'dummy_title',
            content: 'dummy_content',
            author: 'dummy_author',
            createdAt: new Date(),
            updatedAt: new Date(),
            publishedAt: new Date('1964-07-24T11:48:00'), // Converting to proper Date object
            published: false, // Boolean value
            ImgURL: 'https://cdn.midjourney.com/5dd1c12e-33cc-412f-93f3-f1e04b681bdd/0_2.png'
        });
        await mdfile.save();
        res.status(201).send(mdfile);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
// write a router for adding a mdfile
router.post('/add', async (req, res) => {
  try {
    const mdfile = new MDfile({
      _id: new mongoose.Types.ObjectId(),
      filename: req.body.filename,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt,
      publishedAt: req.body.publishedAt,
      published: req.body.published,
      ImgURL: req.body.ImgURL
    });
    await mdfile.save();
    res.status(201).send(mdfile);
  } catch (error) {
      
    res.status(500).send(error);
  }
});





export default router;
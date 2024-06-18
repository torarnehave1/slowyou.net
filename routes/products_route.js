import { Router } from 'express';
import Product from '../models/product.js';
import Vegvisr from '../models/vegvisr.js';


const router = Router();


//Get all vegvisrs

router.get('/vegvisr', async (req, res) => {
  try {
    const vegvisrs = await Vegvisr.find({});
    console.log(vegvisrs);
    res.json(vegvisrs);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving vegvisrs' });
  }
});



router.post('/add', async (req, res) => {
  const { productName, description, category } = req.body;

  console.log(req.body);

  const product = new Product({
  
    name:productName,
    description,
    category
  });

  try {
    await product.save();
    res.send({ message: 'Product created successfully' });
  } catch (err) {
    res.status(400).send({ message: 'Error creating product' });
  }

});

export default router;
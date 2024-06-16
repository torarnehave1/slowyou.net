import { Router } from 'express';

import Product from '../models/product.js';


const router = Router();

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
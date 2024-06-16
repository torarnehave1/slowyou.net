const product = new Product({
    date,
    name,
    description,
    category
  });

  try {
    await product.save();
    res.send({ message: 'Product created successfully' });
  } catch (err) {
    res.status(400).send({ message: 'Error creating product' });
  }
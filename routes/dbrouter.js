import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();
const uri = "mongodb://localhost:27017/slowyounet";
const client = new MongoClient(uri);

router.get('/', async (req, res) => {
  try {
    await client.connect();
    
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const collection = client.db("admin").collection("personer");
    const documents = await collection.find().toArray();
    console.log(documents);
  
    res.send('Successfully connected to MongoDB!');
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    res.status(500).send('Failed to connect to MongoDB');
  } finally {
    await client.close();
  }
});

export default router;
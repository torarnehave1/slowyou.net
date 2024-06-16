// Importer nødvendige moduler
import { Router } from 'express';
const router = Router();
import Contact from '../models/contact.js';

// Definer ruten for å søke etter kontakter
router.get('/search', async (req, res) => {
  const query = req.query.query; // Hent søkestrengen fra URL-parameteren 'query'
  try {
    // Utfør søket basert på navn 
    const contacts = await Contact.find({Name: query});
    // Returner resultatene som JSON-respons
    // res.json(contacts);


   console.log(contacts.email);
   // res.send(contacts);
  } catch (error) {
    console.error('Error searching for contacts:', error);
    // Returner feilmelding hvis det oppstår en feil
    res.status(500).send('Error searching for contacts');
  }
});

// Eksporter routeren for å gjøre den tilgjengelig for resten av applikasjonen
export default router;


import { Router } from 'express';
import Vegvisr from '../../models/vegvisr.js';
import isAuthenticated from '../../public/globalfunctions/protected.js';
import User from '../../models/User.js';

const router = Router();


//Get all vegvisrs

router.get('/findall',isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username');
    const vegvisrs = await Vegvisr.find({});
    console.log(vegvisrs);
    res.json(vegvisrs);

} catch (ex) {
    console.error(ex);
    res.status(500).send('An error occurred while processing your request.');
}

});


export default router;
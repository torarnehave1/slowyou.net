import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;
import router from './routes/dbrouter.js'; // adjust the path to match your file structure


app.use('/', router);


app.get('/', (req, res) => {
 res.send('slowyou.net');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


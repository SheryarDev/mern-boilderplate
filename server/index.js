const express = require('express');
const connectToMonog = require('./db/dbConnection');
const authRoutes = require('./routes/Auth');
const cors = require('cors');
const app = express();
connectToMonog();

app.use(express.json());
 app.use(cors());

app.use('/api/auth', authRoutes);

app.listen(8080, () => {
  console.log('Now listening to port 8080');
});

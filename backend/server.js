const express = require('express');
const dotenv = require('dotenv');
const ppeRoutes = require('./routes/ppeRoutes');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/ppe', ppeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

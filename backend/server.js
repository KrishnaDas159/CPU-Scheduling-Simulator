const express = require('express');

const cors = require('cors');

const simulationRoutes = require('./routes/simulationRoutes');

const app = express();
const PORT = 3000;


app.use(cors()); 

app.use(express.json());




app.use('/api', simulationRoutes);


app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'CPU Scheduler API is running' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  

module.exports = app;


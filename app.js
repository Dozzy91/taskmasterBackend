require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes')
const { dbCreate } = require('./db/createDb');

const app = express();
const PORT = process.env.PORT || 5000;

// creating the database and tables
dbCreate();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// taskroutes
app.use('/task', taskRoutes);

// authRoute
app.use('/auth', authRoutes);

// run server
app.listen(PORT, () => {
    // console.log(`Server running at port ${PORT}`)
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Server running at port ${PORT}`);
    }
});

module.exports = app;
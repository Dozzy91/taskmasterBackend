require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes')
const { dbCreate } = require('./db/createDb');
const pool = require('./db/index');

const app = express();
const PORT = process.env.PORT || 3000;

// creating the database and tables
dbCreate();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// render db connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
      }
      console.log('Database connected successfully');
      release();
});

// let's call this the landing route to show up on render
app.get('/', (req, res) => {
    res.send('Welcome to Taskmaster Backend!');
  });

// taskroutes
app.use('/task', taskRoutes);

// authRoute
app.use('/auth', authRoutes);

// invalid routes
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Page not found' });
});

// run server
app.listen(PORT, () => {
    // console.log(`Server running at port ${PORT}`)
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Server running at port ${PORT}`);
    }
});

module.exports = app;
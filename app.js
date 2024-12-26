const express = require('express');
require('dotenv').config()
const { default: mongoose } = require('mongoose');
var cors = require('cors')
const app = express();
const PORT = process.env.PORT || 8000;


// Middleware to parse JSON requests
// app.use(cors({ origin: '*' }));
app.use(express.json(),cors({ origin: '*' }));
const uri = process.env.MONGODB_URL; // Replace with your MongoDB URI and database name

//connecting MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
 const db=mongoose.connection;

db.once('open', () => console.log("Connected"))




// Example route
app.get('/', (req, res) => {
  res.send('Hello, this is your Express app!');
});

// User Route
const userRoute = require('./routes/userRoute')
app.use('/user', userRoute, cors());

// Task Route
const taskRoute = require('./routes/taskRoute')
app.use('/task', taskRoute, cors());

const activityRoute = require('./routes/activityRoute')
app.use('/logs', activityRoute, cors())


app.listen(port, () => {
    console.log(`Server running on port ${PORT}`);
});
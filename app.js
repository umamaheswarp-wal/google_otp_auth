
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
require('./config/googleAuthConfig');


app.use(passport.initialize());
app.use(passport.session());


const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);



 
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



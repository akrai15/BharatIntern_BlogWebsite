// Import dependencies
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

// Create express app
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/blogDB');



// Create User model


// Define post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  email: String,
});

// Create Post model
const Post = mongoose.model('Post', postSchema);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  
});

// Create User model
const User = mongoose.model('User', userSchema);

// Session management
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true
}));


// Routes

// Render login page
app.get('/', async(req, res) => {
  const posts = await Post.find();
  
  res.render('home', { isLoggedIn: req.session.isLoggedIn ,posts:posts});
});
app.get('/home', (req, res) => {  
  res.render('home', { isLoggedIn: req.session.isLoggedIn });
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password });

  try {
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { message: 'An error occurred. Please try again.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ username });
    let message = '';
    if (!foundUser || foundUser.password !== password) {
      message = 'Invalid username or password.';
      res.render('login', { message });
      return;
    }
    req.session.isLoggedIn = true;
    req.session.email = foundUser.email;
    const posts = await Post.find();
    res.render('home', { isLoggedIn: req.session.isLoggedIn ,posts:posts});
  } catch (err) {
    console.error(err);
    message = 'An error occurred. Please try again.';
    res.render('login', { message });
  }
});
app.get('/compose', (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }
  res.render('compose',{ isLoggedIn: req.session.isLoggedIn });
});
app.post('/publish', async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { title, content } = req.body;
  const newPost = new Post({ title, content, email: req.session.email });

  try {
    await newPost.save();
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.render('compose', { message: 'An error occurred. Please try again.' });
  }
});

app.get('/blogs', async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }
  const posts = await Post.find();
  res.render('blogs', { isLoggedIn: req.session.isLoggedIn, posts: posts, email: req.session.email });
});



app.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/login');
});




// Server Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



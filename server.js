const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const port = 3000;

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://imshubhgupta123:W90HzLJDtoOn1eKG@cluster0.nme03ab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

// Set views directory and template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Define Mongoose schema and model
const rs_detailsSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String
});

const rs_details = mongoose.model('rs_details', rs_detailsSchema);

// Define routes to render EJS templates
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/Contact', (req, res) => {
  res.render('contact');
});

app.get('/Listing', (req, res) => {
  res.render('listing');
});

app.get('/Login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/portal', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  res.render('portal', { user });
});

// Signup route
// Signup route
app.post('/signup', async (req, res) => {
  const { fullname, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.send('<script>alert("Passwords do not match."); window.location.href="/signup";</script>');
  }

  try {
    // Check if user already exists with the provided email
    const existingUser = await rs_details.findOne({ email });

    if (existingUser) {
      return res.send('<script>alert("User already registered."); window.location.href="/signup";</script>');
    }

    const newUser = new rs_details({ fullname, email, password });
    await newUser.save();
    res.send('<script>alert("Successfully registered."); window.location.href="/Login";</script>');
  } catch (err) {
    console.error('Error saving user:', err.message);
    res.send('<script>alert("Error registering user."); window.location.href="/signup";</script>');
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await rs_details.findOne({ email });

    if (!user || user.password !== password) {
      return res.send('<script>alert("Invalid email or password."); window.location.href="/login";</script>');
    }

    req.session.user = user;
    res.redirect('/portal');
  } catch (err) {
    console.error('Error finding user:', err.message);
    res.send('<script>alert("Error logging in."); window.location.href="/login";</script>');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err.message);
    }
    res.send('<script>alert("Logged out successfully."); window.location.href="/";</script>');
  });
});

app.get('/getUserDetails', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.json({
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
      }
    });
  } else {
    res.json({
      success: false,
      error: 'User not found'
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

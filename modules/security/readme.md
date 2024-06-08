Building a user login and registration system using Node.js, Express, Passport.js, and MongoDB Atlas involves several steps. Below is a detailed guide to help you set up your application.

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account with a cluster set up
- Basic understanding of Node.js and Express

### Step-by-Step Guide

#### 1. Set Up Your Project
First, create a new directory for your project and initialize it with npm.

```sh
mkdir myapp
cd myapp
npm init -y
```

#### 2. Install Dependencies
Install the necessary packages including Express, Passport, Mongoose (for MongoDB), and other middleware.

```sh
npm install express passport passport-local mongoose bcryptjs express-session connect-flash
```

#### 3. Set Up Your Project Structure
Organize your project files as follows:

```
myapp/
├── config/
│   └── passport.js
├── models/
│   └── User.js
├── routes/
│   └── index.js
│   └── users.js
├── views/
│   └── layout.ejs
│   └── login.ejs
│   └── register.ejs
├── app.js
```

#### 4. Connect to MongoDB Atlas
Create a `.env` file to store your MongoDB Atlas URI and other environment variables.

```sh
npm install dotenv
```

`.env`
```env
MONGO_URI=<your_mongodb_atlas_uri>
SECRET=<your_secret_key>
```

Update your `app.js` to load environment variables and connect to MongoDB.

`app.js`
```js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
```

#### 5. Create the User Model
Create a User schema and model using Mongoose.

`models/User.js`
```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
```

#### 6. Configure Passport
Set up Passport.js to use the local strategy for authentication.

`config/passport.js`
```js
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered' });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
```

#### 7. Define Routes
Set up routes for the main pages and user authentication.

`routes/index.js`
```js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('welcome'));

module.exports = router;
```

`routes/users.js`
```js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
```

#### 8. Create Views
Set up your views using EJS.

`views/layout.ejs`
```html
<!DOCTYPE html>
<html>
<head>
  <title>SlowYou.io</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="/">SlowYou.io</a>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item"><a class="nav-link" href="/users/login">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/users/register">Register</a></li>
      </ul>
    </div>
  </nav>
  <div class="container">
    <% if (success_msg) { %>
      <div class="alert alert-success"><%= success_msg %></div>
    <% } %>
    <% if (error_msg) { %>
      <div class="alert alert-danger"><%= error_msg %></div>
    <% } %>
    <% if (error) { %>
      <div class="alert alert-danger"><%= error %></div>
    <% } %>
    <%= body %>
  </div>
</body>
</html>
```

`views/login.ejs`
```html
<% layout('layout') %>
<h1>Login</h1>
<form action="/users/login" method="POST">
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" name="email" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" name="password" class

="form-control" required>
  </div>
  <button type="submit" class="btn btn-primary">Login</button>
</form>
```

`views/register.ejs`
```html
<% layout('layout') %>
<h1>Register</h1>
<form action="/users/register" method="POST">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" name="name" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" name="email" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" name="password" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="password2">Confirm Password</label>
    <input type="password" name="password2" class="form-control" required>
  </div>
  <button type="submit" class="btn btn-primary">Register</button>
</form>
```

#### 9. Dashboard Page
Create a protected route for the dashboard page.

`routes/index.js` (Update to include the dashboard route)
```js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
```

`config/auth.js`
```js
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  }
};
```

`views/dashboard.ejs`
```html
<% layout('layout') %>
<h1>Welcome <%= user.name %></h1>
<p>You are logged in!</p>
<a href="/users/logout" class="btn btn-danger">Logout</a>
```

With these steps, you should have a basic user registration and login system set up using Node.js, Express, Passport.js, and MongoDB Atlas. You can further customize and secure the application as needed.

Passport.js does not include built-in support for email verification. Passport.js is a middleware for Node.js that provides authentication strategies for various services (e.g., OAuth, local authentication, etc.). Email verification typically involves sending an email with a verification link to the user, and handling the confirmation when the user clicks the link.

However, you can implement email verification in your Node.js application using Passport.js along with additional libraries for sending emails and managing tokens.

Here is an example workflow to implement email verification with Passport.js:

1. **Set up Passport for user authentication**: Use `passport-local` for local authentication (username/password).

2. **Send verification email**: Use a library like `nodemailer` to send the verification email.

3. **Generate verification token**: Use a library like `jsonwebtoken` or `uuid` to generate a unique token for email verification.

4. **Verify the token**: Create a route to handle the token verification.

### Step-by-Step Implementation

1. **Install required packages**:
   ```sh
   npm install express passport passport-local nodemailer jsonwebtoken bcryptjs
   ```

2. **Set up Passport Local Strategy**:

   ```javascript
   const passport = require('passport');
   const LocalStrategy = require('passport-local').Strategy;
   const bcrypt = require('bcryptjs');

   // Mock user database
   const users = [];

   passport.use(new LocalStrategy((username, password, done) => {
     const user = users.find(user => user.username === username);
     if (!user) {
       return done(null, false, { message: 'Incorrect username.' });
     }
     bcrypt.compare(password, user.password, (err, res) => {
       if (res) {
         return done(null, user);
       } else {
         return done(null, false, { message: 'Incorrect password.' });
       }
     });
   }));

   passport.serializeUser((user, done) => {
     done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
     const user = users.find(user => user.id === id);
     done(null, user);
   });
   ```

3. **Set up email sending with Nodemailer**:

   ```javascript
   const nodemailer = require('nodemailer');

   const transporter = nodemailer.createTransport({
     service: 'Gmail',
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-email-password',
     },
   });

   function sendVerificationEmail(user, token) {
     const url = `http://localhost:3000/verify-email?token=${token}`;
     transporter.sendMail({
       to: user.email,
       subject: 'Verify your email',
       html: `Click <a href="${url}">here</a> to verify your email.`,
     });
   }
   ```

4. **Generate and store verification token**:

   ```javascript
   const jwt = require('jsonwebtoken');

   function generateVerificationToken(user) {
     const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
     return token;
   }
   ```

5. **Create route for email verification**:

   ```javascript
   const express = require('express');
   const app = express();
   const bodyParser = require('body-parser');
   const session = require('express-session');

   app.use(bodyParser.urlencoded({ extended: false }));
   app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: false }));
   app.use(passport.initialize());
   app.use(passport.session());

   app.post('/register', (req, res) => {
     const { username, password, email } = req.body;
     const hashedPassword = bcrypt.hashSync(password, 10);
     const user = { id: users.length + 1, username, password: hashedPassword, email, verified: false };
     users.push(user);

     const token = generateVerificationToken(user);
     sendVerificationEmail(user, token);

     res.send('Registration successful, please check your email for verification link.');
   });

   app.get('/verify-email', (req, res) => {
     const token = req.query.token;
     jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
       if (err) {
         return res.send('Email verification failed.');
       }

       const user = users.find(user => user.id === decoded.id);
       if (user) {
         user.verified = true;
         res.send('Email successfully verified.');
       } else {
         res.send('User not found.');
       }
     });
   });

   app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

   app.get('/', (req, res) => {
     if (req.isAuthenticated() && req.user.verified) {
       res.send('Welcome to the secure area.');
     } else {
       res.send('Please login and verify your email.');
     }
   });

   app.listen(3000, () => {
     console.log('Server is running on http://localhost:3000');
   });
   ```

This example outlines the basic flow of email verification with Passport.js, handling user registration, sending a verification email, verifying the token, and securing routes based on email verification status.
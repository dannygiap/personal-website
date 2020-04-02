const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

mongoose
  .connect(
    'mongodb+srv://danny:ironman@cluster0-0r7qw.mongodb.net/test?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log('Successfully connected to mongoDB database');
  })
  .catch((err) => {
    console.log('Error: ', err.message);
  });

var blogSchema = new mongoose.Schema({
  image: String,
  title: String,
  body: String,
  created: { type: Date, default: Date.now }
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
// 	image: "https://images.unsplash.com/photo-1578241561880-0a1d5db3cb8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     title: "Test Blog 2",
//     body: "blahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahgblahg"
// });

//root route
app.get('/', (req, res) => {
  res.redirect('home');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/blog', (req, res) => {
  let query = Blog.find({}).sort({ _id: -1 });
  query.exec((err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('blog', { blogs: blogs });
    }
  });
});

// NEW Route
app.get('/blog/ironman', function(req, res) {
  res.render('new');
});

// CREATE Route
app.post('/blog', function(req, res) {
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.redirect('new');
    } else {
      // then redirect to the index
      res.redirect('/blog');
    }
  });
});

// SHOW Route
app.get('/blog/:id', (req, res) => {
  let id = req.params.id;
  Blog.findById({ _id: id }, (err, success) => {
    if (err) {
      res.redirect('/');
    } else {
      res.render('show', { blog: success });
    }
  });
});

// EDIT Route
app.get('/blog/:id/ironman', (req, res) => {
  let id = req.params.id;
  Blog.findById({ _id: id }, (err, success) => {
    if (err) {
      res.send('An error has occured');
    } else {
      res.render('edit', { blog: success });
    }
  });
});

// UPDATE Route
app.put('/blog/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, success) => {
    if (err) {
      res.send('An error has occured');
      console.log(err);
    } else {
      res.redirect('/blog/' + req.params.id);
    }
  });
});

// DELETE Route
app.delete('/blog/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.send('An error has occured');
    } else {
      res.redirect('/blog');
    }
  });
});

// app.listen(process.env.PORT, () => {
//   console.log(`Listening on port ${process.env.PORT}`);
// });

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

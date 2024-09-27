require('dotenv').config();
const createError = require("http-errors");
const express = require("express");
const favicon = require('serve-favicon');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

const sessions = require('express-session');
const mysqlStore = require('express-mysql-session')(sessions);
const flash = require('express-flash');
const multer = require('multer');
const { generateDefaultAvatar } = require('./middleware/avatarGenerator');

const app = express();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images/uploads')); // Save in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});
const upload = multer({ storage: storage });

app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
    partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
    extname: ".hbs", //expected file extension for handlebars files
    defaultLayout: "layout", //default layout for app, general template for all pages in app
    helpers: {
      nonEmptyObject: function (obj) {
        return (obj &&
          obj.constructor === Object &&
          Object.keys(obj).length > 0
        );
      },
      formatDateString: function (dateString) {
        return new Date(dateString).toLocaleString
          ("en-us", {
            dateStyle: "long",
            timeStyle: "medium"
          });
      },
      formatDate: function (dateString) {
        return new Date(dateString).toLocaleDateString("en-us", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      },      
    }, //adding new helpers to handlebars for extra functionality
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const sessionStore = new mysqlStore({/*default option */ }, require('./conf/database'))

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("csc 317 secret"));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(sessions({
  secret: "csc 317 secret",
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));

app.use(flash());

app.use(function (req, res, next) {
  console.log(req.session);
  if (req.session.user) {
    res.locals.isLoggedIn = true;
    res.locals.user = req.session.user;
  }
  next();
});

app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

// Route to handle avatar upload
app.post('/uploadAvatar', upload.single('avatar'), (req, res) => {
  const avatarUrl = `/images/uploads/${req.file.filename}`; // Path to save in DB
  const userId = req.session.user.id; // Assuming req.session.user contains the logged-in user

  // Update user's avatar in the database
  const query = 'UPDATE users SET avatar = ? WHERE id = ?';
  db.query(query, [avatarUrl, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    // Update session with the new avatar
    req.session.user.avatar = avatarUrl;
    res.json({ message: 'Avatar uploaded successfully', avatarUrl });
  });
});

// Route to serve default avatar if none is uploaded
app.get('/defaultAvatar/:username', (req, res) => {
  const username = req.params.username;
  const svg = generateDefaultAvatar(username); // Generate default avatar SVG
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

/**
 * Catch all route, if we get to here then the 
 * resource requested could not be found.
 */
app.use((req, res, next) => {
  next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})

/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

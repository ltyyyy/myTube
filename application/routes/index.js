var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { getRecentPosts } = require('../middleware/posts');

/* GET home page. */
router.get('/', getRecentPosts, function (req, res, next) {
  res.render('index', { title: 'CSC 317 App', name: "Abby Lin", js: ["flashmessage.js", "dropdown.js"] });
});

router.get("/login", function (req, res) {
  res.render('login', { title: 'Login', js: ["flashmessage.js"] });
});

router.get("/register", function (req, res) {
  res.render('register', { title: 'Register', js: ["flashmessage.js"] });
});

router.get("/postvideo", isLoggedIn, function (req, res) {
  res.render('postvideo', { title: 'Post a video', js: ["dropdown.js", "flashmessage.js"] });
});



module.exports = router;

var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');
var { isLoggedIn, isMyProfile } = require("../middleware/auth");
const { isUsernameUnique, usernameCheck, passwordCheck, isEmailUnique, confirmpasswordCheck } = require('../middleware/validation');
var {getPostsForUser} = require("../middleware/posts");
const { generateDefaultAvatar } = require('../middleware/avatarGenerator');
const fs = require('fs');
const path = require('path');


// Registration route
router.post('/register',
  usernameCheck,
  passwordCheck,
  confirmpasswordCheck,
  isUsernameUnique,
  isEmailUnique,
  async function (req, res, next) {
    var { username, email, password } = req.body;
    try {
      var hashedPassword = await bcrypt.hash(password, 3);
      
      // Generate the SVG avatar
      var avatarSVG = generateDefaultAvatar(username);

      // Insert into the database including the avatar
      var [resultObject, fields] = await db.execute(`INSERT INTO users
      (username, email, password, avatar)
      VALUES (?, ?, ?, ?);`, [username, email, hashedPassword, avatarSVG]);
      
      if (resultObject && resultObject.affectedRows == 1) {
        res.redirect('/login');
      } else {
        return res.redirect('/register');
      }

    } catch (error) {
      next(error);
    }
  });

router.post('/login', async function (req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.redirect('/login');
  } else {
    var [rows, fields] = await db.execute(
      `SELECT id, username, password, email, avatar 
       FROM users 
       WHERE username = ?`, 
      [username]
    );
    var user = rows[0];
    if (!user) {
      req.flash("error", `Log In Failed: Invalid username`);
      req.session.save(function (err) {
        return res.redirect('/login');
      });
    } else {
      var passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        // Add avatar to session
        req.session.user = {
          userId: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar // Include avatar in session
        };
        req.flash("success", `You are now logged in`);
        req.session.save(function (err) {
          
          return res.redirect('/');
        });
      } else {
        req.flash("error", `Log In Failed: Invalid password`);
        req.session.save(function (err) {
          return res.redirect('/login');
        });
      }
    }
  }
});


router.use(function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    return res.redirect('/login');
  }
});


router.get("/profile/:id(\\d+)", isLoggedIn, isMyProfile,getPostsForUser, function (req, res) {
  res.render('profile', { title: 'Profile', js: ["dropdown.js"] });
});


router.post("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(error);
    }
    return res.redirect('/');
  })
});


module.exports = router;
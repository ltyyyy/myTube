const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../conf/database");
const { isLoggedIn } = require("../middleware/auth");
const { getPostsById, getCommentsForPostById } = require("../middleware/posts");

// Use memory storage for multer to store files in memory and pass to the database
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/create",
  isLoggedIn,
  upload.fields([
    { name: "uploadVideo", maxCount: 1 },
    { name: "uploadThumbnail", maxCount: 1 },
  ]),
  async function (req, res, next) {
    var { title, description } = req.body;
    var { buffer: videoBuffer } = req.files["uploadVideo"][0];
    var { buffer: thumbnailBuffer } = req.files["uploadThumbnail"][0];
    var { userId } = req.session.user;

    try {
      var [insertResult, _] = await db.execute(
        `INSERT INTO posts (title, description, video, thumbnail, fk_userId) VALUES (?,?,?,?,?);`,
        [title, description, videoBuffer, thumbnailBuffer, userId]
      );

      if (insertResult && insertResult.affectedRows) {
        req.flash("success", "Your post was created!");
        return req.session.save(function (error) {
          if (error) next(error);
          return res.redirect(`/posts/${insertResult.insertId}`);
        });
      } else {
        next(new Error("Post could not be created"));
      }
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve and render a post along with its comments
router.get(
  "/:id(\\d+)",
  getPostsById,
  getCommentsForPostById,
  async function (req, res, next) {
    try {
      // Fetch post author's avatar
      const [authorRows] = await db.execute(
        `SELECT users.avatar, users.username FROM users 
         JOIN posts ON users.id = posts.fk_userId
         WHERE posts.id = ?`,
        [req.params.id]
      );

      if (authorRows.length > 0) {
        res.locals.currentPost.avatar = authorRows[0].avatar;
        res.locals.currentPost.username = authorRows[0].username;
      }

      res.render("viewpost", {
        title: `View Post ${req.params.id}`,
        js: ["dropdown.js", "flashmessage.js"],
      });
    } catch (error) {
      next(error);
    }
  }
);
// Route to serve the thumbnail as an image
router.get("/thumbnail/:postId", async function (req, res, next) {
  try {
    const { postId } = req.params;
    const [rows, _] = await db.execute(
      `SELECT thumbnail FROM posts WHERE id = ?`,
      [postId]
    );

    if (rows.length === 0) {
      return res.status(404).send("Thumbnail not found");
    }

    const thumbnail = rows[0].thumbnail;
    res.setHeader("Content-Type", "image/png"); // Adjust if you allow different image types
    res.end(thumbnail);
  } catch (error) {
    next(error);
  }
});

// Route to serve the video file
router.get("/video/:postId", async function (req, res, next) {
  try {
    const { postId } = req.params;
    const [rows, _] = await db.execute(`SELECT video FROM posts WHERE id = ?`, [
      postId,
    ]);

    if (rows.length === 0) {
      return res.status(404).send("Video not found");
    }

    const video = rows[0].video;
    res.setHeader("Content-Type", "video/mp4"); // Adjust if you allow different video types
    res.end(video);
  } catch (error) {
    next(error);
  }
});

router.get("/search", async function (req, res, next) {
  var { searchValue } = req.query;
  try {
    var [rows, _] = await db.execute(
      `SELECT id, title, thumbnail, concat_ws(' ', title, description) as haystack
            from posts
            having haystack like ?;`,
      [`%${searchValue}%`]
    );

    if (rows && rows.length == 0) {
      res.redirect("/");
    } else {
      res.locals.posts = rows;
      return res.render("index", {
        title: "CSC 317 App",
        name: "Abby Lin",
        js: ["flashmessage.js", "dropdown.js"],
      });
    }
  } catch (error) {
    next(error);
  }
});

// Post delete route
router.post("/delete", isLoggedIn, async function (req, res, next) {
  var { postId } = req.body;
  try {
    // First, delete the comments associated with the post
    await db.execute(`DELETE FROM comments WHERE fk_postId = ?;`, [postId]);

    // Then, delete the post itself
    var [deleteResult, _] = await db.execute(
      `DELETE FROM posts WHERE id = ?;`,
      [postId]
    );

    if (deleteResult && deleteResult.affectedRows === 1) {
      req.flash("success", "Post deleted successfully");
      return res.redirect("/");
    } else {
      return res.status(500).json({ message: "Failed to delete post" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

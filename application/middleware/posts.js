const db = require("../conf/database");
module.exports = {
  getPostsById: async function (req, res, next) {
    var { id } = req.params;
    try {
      let [rows, _] = await db.execute(
        `SELECT u.username, p.video, p.title, p.description, 
                p.id, p.createdAt
                FROM posts p
                JOIN users u ON p.fk_userId=u.id
                WHERE p.id=?;`,
        [id]
      );

      const post = rows[0];
      if (!post) {
        next(new Error("Post not found"));
      } else {
        res.locals.currentPost = post;
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  getRecentPosts: async function (req, res, next) {
    try {
      let [rows, _] = await db.execute(`
                SELECT id, title FROM posts
                ORDER BY createdAt DESC;`);
      res.locals.recentPosts = rows;
      next();
    } catch (error) {
      next(error);
    }
  },
  getPostsForUser: async function (req, res, next) {
    var { id } = req.params;

    try {
      let [rows, _] = await db.execute(
        `SELECT id, title FROM posts WHERE fk_userId=?;`,
        [id]
      );

      if (rows.length === 0) {
        res.locals.getPosts = [];
      } else {
        res.locals.getPosts = rows;
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  getCommentsForPostById: async function (req, res, next) {
    try {
      const [rows] = await db.execute(
        `SELECT comments.id, comments.text, comments.createdAt, users.username, users.avatar
               FROM comments 
               JOIN users ON comments.fk_authorId = users.id
               WHERE comments.fk_postId = ?
               ORDER BY comments.createdAt DESC`,
        [req.params.id]
      );

      res.locals.currentPost.comments = rows;
      res.locals.commentsCount = rows.length;
      next();
    } catch (error) {
      next(error);
    }
  },
};

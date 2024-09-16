var pathToFFMPEG = require('ffmpeg-static');
var exec = require('child_process').exec;
var db = require('../conf/database');

module.exports = {
    makeThumbnail: function (req, res, next) {
        if (!req.file) {
            next(new Error('File upload failed'));
        } else {
            try {
                var destinationOfThumbnail = `public/images/uploads/thumbnail-${req.file.filename.split(".")[0]}.png`
                var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
                exec(thumbnailCommand);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } catch (error) {
                next(error);
            }
        }

    },
    getPostsById: async function (req, res, next) {
        var { id } = req.params;
        try {
            let [rows, _] = await db.execute(
                `select u.username, p.video, p.title, p.description, 
                p.id, p.createdAt
                from posts p
                JOIN users u
                ON p.fk_userId=u.id
                WHERE p.id=?;`,
                [id]
            );

            const post = rows[0];
            if (!post) {

            } else {
                res.locals.currentPost = post;
                next();
            }


        } catch (error) {
            next(error);
        }
    },
    getCommentsForPostById: async function (req, res, next) {
        var { id } = req.params;
        try {
            let [rows, _] = await db.execute(
                `SELECT u.username,c.text,c.createdAt
                FROM comments c
                JOIN users u 
                ON c.fk_authorId=u.id
                WHERE c.fk_postId=?;`,
                [id]
            );
            res.locals.currentPost.comments = rows;
            next();
        } catch (error) {
            next(error);
        }
    },
    getRecentPosts: async function (req, res, next) {
        try {
            let [rows, _] = await db.execute(`
                select id,title,thumbnail from posts
                ORDER BY createdAt DESC
                LIMIT 20;`
            );
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
            `SELECT id, title, thumbnail FROM posts WHERE fk_userId=?;`,
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
      }

};
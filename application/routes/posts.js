var express = require('express');
var router = express.Router();
var multer = require('multer');
const { makeThumbnail, getPostsById, getCommentsForPostById } = require('../middleware/posts');
var db = require('../conf/database');
const { isLoggedIn } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/videos/uploads")
    },
    filename: function (req, file, cb) {
        var fileExt = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    },
});

const upload = multer({ storage: storage })

router.post("/create", isLoggedIn, upload.single("uploadVideo"), makeThumbnail, async function (req, res, next) {
    var { title, description } = req.body;
    var { path, thumbnail } = req.file;
    var { userId } = req.session.user;

    try {
        var [insertResult, _] = await db.execute(
            `INSERT INTO posts (title, description, video, thumbnail, fk_userId) VALUE (?,?,?,?,?);`,
            [title, description, path, thumbnail, userId]
        );

        if (insertResult && insertResult.affectedRows) {
            req.flash("success", "Your post was created!");
            return req.session.save(function (error) {
                if (error) next(error);
                return res.redirect(`/posts/${insertResult.insertId}`);
            })

        } else {
            next(new Error('Post could not be created'));
        }
    } catch (error) {
        next(error);
    }

});


router.get("/:id(\\d+)", getPostsById, getCommentsForPostById, function (req, res) {
    res.render('viewpost', { title: `View Post ${req.params.id}`, js: ["dropdown.js", "flashmessage.js"] });
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
            res.redirect('/');
        } else {
            res.locals.posts = rows;
            return res.render('index', { title: 'CSC 317 App', name: "Abby Lin", js: ["flashmessage.js", "dropdown.js"] });
        }
    } catch (error) {
        next(error);
    }


});

router.post('/delete', isLoggedIn, async function (req, res, next) {
    var { username } = req.session.user;
    var { postId, comment } = req.body;
    try {
        var [insertResult, _] = await db.execute(
            `DELETE FROM comments WHERE fk_postId = ?;`,
            [postId]
        );

        var [insertResult, _] = await db.execute(
            `DELETE FROM posts WHERE id = ?;`,
            [postId]
        );

        if (insertResult && insertResult.affectedRows == 1) {
            return res.status(201).json({
                commentId: insertResult.insertId,
                username: username,
                commentText: comment,
            });
        } else {
            return res.json({
                message: "error"
            });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
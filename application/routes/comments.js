var express = require('express');
const { isLoggedIn } = require('../middleware/auth');
var router = express.Router();
var db = require('../conf/database');

router.post('/create', isLoggedIn, async function(req, res, next) {
    var { userId, username, avatar } = req.session.user;
    var { postId, comment } = req.body;

    try {
        var [insertResult, _] = await db.execute(
            `INSERT INTO comments (text, fk_postId, fk_authorId) 
            VALUE (?, ?, ?)`,
            [comment, postId, userId]
        );

        if (insertResult && insertResult.affectedRows == 1) {  
            // Fetch the total number of comments for this post
            var [countResult, __] = await db.execute(
                `SELECT COUNT(*) as commentCount FROM comments WHERE fk_postId = ?`,
                [postId]
            );
            
            var commentCount = countResult[0].commentCount;

            return res.status(201).json({
                commentId: insertResult.insertId,
                username: username,
                commentText: comment,
                commentCount: commentCount,
                userAvatar: avatar
            });
        } else {
            res.status(500).json({
                message: "Error creating comment"
            });
        }
    } catch(error) {
        next(error);
    }
});

module.exports = router;
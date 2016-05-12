/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    users: function (req, res) {
        User.query('SELECT * FROM user WHERE id != ? and not exists(select * from action where mId = ? AND yId = user.id) ORDER BY RAND()', [ req.param('id'), req.param('id') ], function(err, results) {
            if (err) return res.serverError(err);
            return res.json(results);
        });

    },

    like: function(req, res) {
        User.query('SELECT * FROM action INNER JOIN user ON action.yId = user.id WHERE action.mId = ? AND action.action = true GROUP BY mId, yId', [ req.param('id') ], function(err, results) {
            if (err) return res.serverError(err);
            return res.json(results);
        });
    },

    dislike: function(req, res){
        User.query('SELECT * FROM action INNER JOIN user ON action.yId = user.id WHERE action.mId = ? AND action.action = false GROUP BY mId, yId', [ req.param('id') ], function(err, results) {
            if (err) return res.serverError(err);
            return res.json(results);
        });
    },



};


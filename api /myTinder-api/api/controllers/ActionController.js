
module.exports = {


    delete: function (req, res) {
        User.query('DELETE FROM `my_tinder`.`action` WHERE `action`.`mId` = ? AND yId = ?', [ req.param('mId'), req.param('yId') ], function(err, results) {
            if (err) return res.serverError(err);
            return res.json(results);
        });

    }


};


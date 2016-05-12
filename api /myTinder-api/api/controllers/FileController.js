/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    upload: function  (req, res) {
        if(req.method === 'GET')
            return res.json({'status':'GET not allowed'});
        //	Call to /upload via GET is error

        var uploadFile = req.file('uploadFile');
        console.log(uploadFile);

        uploadFile.upload({ dirname: '../../upload/'+ req.body.id}, function onUploadComplete (err, files) {
            //	Files will be uploaded to .tmp/uploads

            if (err) return res.serverError(err);
            //	IF ERROR Return and send 500 error with error

            console.log(files);
            res.json({id: req.body.id, status:200,file:files});
        });
    },
};


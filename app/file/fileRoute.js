const { log } = require('console');
/*****************
 * @Dependencies *
 *****************/

//Web Framework
const express = require('express');
var multer = require('multer');
const fileHandler = require('./fileHandler');
const path = require('path');

// //Initialize Express Router
const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../assets/'));
  },
  filename: function (req, file, cb) {
    const ownerId = req.user.id;
    const folderId = file.fieldname;
    file.name = Date.now();
    cb(null, `${ownerId}_${folderId}_${file.name}`);
  },
});
var upload = multer({ storage: storage });

router.post('/', upload.any(), (req, res) => {
  const folderId = req.files[0].fieldname;
  const name = req.files[0].originalname;

  fileHandler
    .saveFile(name, req.files[0].name, folderId)
    .then((data) => res.sendStatus(201))
    .catch((err) => res.sendStatus(err.status));
});

router.get('/search', (req, res) => {
  const { name, limit, skip } = req.query;
  fileHandler
    .searchFiles(name, req.user.id, limit, skip)
    .then((data) => res.send(data))
    .catch((err) => res.sendStatus(500));
});

router.delete('/', (req, res) => {
  const { id } = req.query;
  fileHandler
    .deleteFile(id, req.user.id)
    .then((data) => res.send(data))
    .catch((err) => res.sendStatus(500));
});
/************
 * @Exports *
 ************/

//Express Router
module.exports = router;

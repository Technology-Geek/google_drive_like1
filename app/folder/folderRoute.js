/*****************
 * @Dependencies *
 *****************/

//Web Framework
const express = require('express');
const { fstat } = require('fs');
const fileHandler = require('../file/fileHandler');
const folderHandler = require('./folderHandler');

// //Initialize Express Router
const router = express.Router();

router.get('/files', (req, res) => {
  const { folderId, limit, skip } = req.query;
  folderHandler
    .getSubFilesWithPagination(req.user.id, folderId, limit, skip)
    .then((data) => res.send(data))
    .catch((err) => res.sendStatus(500));
});

router.get('/folders', (req, res) => {
  const { folderId, limit, skip } = req.query;
  folderHandler
    .getSubFolderWithPagination(req.user.id, folderId, limit, skip)
    .then((data) => res.send(data))
    .catch((err) => res.sendStatus(500));
});

router.get('/search', (req, res) => {
  const { name } = req.query;
  folderHandler
    .searchSubFolderWithPagination(name, req.user.id)
    .then((data) => res.send(data))
    .catch((err) => res.sendStatus(500));
});

router.post('/', (req, res) => {
  const { name, parentId } = req.body;
  folderHandler
    .saveFolder(name, parentId, req.user.id)
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(500));
});

router.delete('/', (req, res) => {
  const { folderId } = req.query;
  folderHandler
    .deleteFolder(folderId, req.user.id)
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});

/************
 * @Exports *
 ************/

//Express Router
module.exports = router;

const fs = require('fs');
const db = require('../../database');
// DB Error Handler
const dbErrorHandler = require('../../utils/error/dbErrorHandler');

/*****************
 * @FolderHandlers *
 *****************/

// Save Folder
function saveFolder(name, parentId, ownerId) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO folders(name,parentId)
                      VALUES("${name}",${parentId})`;
    db.query(sql, (err, result) => {
      if (err) return reject(dbErrorHandler(err));
      if (result.affectedRows == 1) {
        const insertedFolder = result.insertId;
        const sql2 = `INSERT INTO owners(folderId, userId)
                                    VALUES(${insertedFolder},${ownerId})`;
        db.query(sql2, (err, result) => {
          if (err) return reject(dbErrorHandler(err));
          if (result.affectedRows == 1) {
            return resolve('Folder Saved');
          }
        });
      }
    });
  });
}

function getSubFolderWithPagination(ownerId, folderId, limit, skip) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT folders.name FROM folders JOIN owners ON
    folders.id=owners.folderId
        WHERE owners.userId=${ownerId} AND folders.parentId=${folderId} LIMIT ${limit} OFFSET ${skip}`;
    db.query(sql, (err, result) => {
      if (err) return reject(dbErrorHandler(err));
      else {
        resolve(JSON.stringify(result));
      }
    });
  });
}

function getSubFilesWithPagination(ownerId, folderId, limit, skip) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT files.name FROM files JOIN owners ON
    files.folderId=owners.folderId
        WHERE owners.userId=${ownerId} AND files.folderId=${folderId} LIMIT ${limit} OFFSET ${skip}`;
    db.query(sql, (err, result) => {
      if (err) return reject(dbErrorHandler(err));
      else {
        resolve(JSON.stringify(result));
      }
    });
  });
}

function searchSubFolderWithPagination(name, ownerId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT folders.name FROM folders JOIN owners ON
      folders.id=owners.folderId
          WHERE owners.userId=${ownerId} AND
          folders.name LIKE "%${name}%"`;
    db.query(sql, (err, result) => {
      if (err) return reject(dbErrorHandler(err));
      else {
        resolve(JSON.stringify(result));
      }
    });
  });
}

// Delete Folder
function deleteFolder(id, ownerId) {
  return new Promise((resolve, reject) => {
    getSubFilesWithPagination(ownerId, id, 1, 0)
      .then((data) => {
        if (JSON.parse(data).length == 0)
          return getSubFolderWithPagination(ownerId, id, 1, 0);
        else return reject('not empty');
      })
      .then((data) => {
        if (JSON.parse(data).length == 0) {
          const sql = `DELETE FROM owners WHERE userId=${ownerId} AND folderId=${id}`;
          db.query(sql, (err, result) => {
            if (err) return reject(dbErrorHandler(err));
            const sql = `DELETE FROM folders WHERE id=${id}`;
            db.query(sql, (err, result) => {
              if (err) return reject(dbErrorHandler(err));
              resolve('Folder deleted');
            });
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  searchSubFolderWithPagination,
  getSubFilesWithPagination,
  getSubFolderWithPagination,
  saveFolder,
  deleteFolder,
};

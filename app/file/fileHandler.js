const fs = require('fs');
const db = require('../../database');
// DB Error Handler
const dbErrorHandler = require('../../utils/error/dbErrorHandler');

// Save File
function saveFile(name, nameOnSys, folderId) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO files(name,folderId,nameOnDisk)
                  VALUES("${name}",${folderId},"${nameOnSys}")`;
    db.query(sql, (err, result) => {
      if (err) return reject(dbErrorHandler(err));
      if (result.affectedRows == 1) {
        resolve('File Saved');
      }
    });
  });
}

// Delete File
function deleteFile(id, ownerId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT files.folderId ,files.nameOnDisk FROM files 
          WHERE files.id=${id}`;
    db.query(sql, (err, result) => {
      if (err) return reject(dbErrorHandler(err));
      else {
        if (JSON.parse(JSON.stringify(result)).length > 0) {
          const file = JSON.parse(JSON.stringify(result[0]));
          console.log(file);
          const sql = `DELETE f FROM files f join owners ON
        f.folderId=owners.folderId
              WHERE owners.userId=${ownerId} AND f.id=${id}`;
          db.query(sql, (err, result) => {
            if (err) return reject(dbErrorHandler(err));
            else {
              fs.unlink(
                `./assets/${ownerId}_${file.folderId}_${file.nameOnDisk}`,
                () => resolve('done')
              );
            }
          });
        }
      }
    });
  });
}

function searchFiles(name, ownerId, limit, skip) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT files.name FROM files JOIN owners ON
    files.folderId=owners.folderId
          WHERE owners.userId=${ownerId} AND
          files.name LIKE "%${name}%" LIMIT ${limit} OFFSET ${skip}`;
    db.query(sql, (err, result) => {
      if (err) return reject(dbErrorHandler(err));
      else {
        resolve(JSON.stringify(result));
      }
    });
  });
}

module.exports = { deleteFile, saveFile, searchFiles };

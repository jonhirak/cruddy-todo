const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      //create new doc w/filesystem
      var file = exports.dataDir + `/${id}.txt`;
      fs.writeFile(file, text, (err) => {
        if (err) {
          callback(err);
        }

        callback(null, { id, text });
        console.log('Saved successfully!');
      });
    }
  });
};

exports.readAll = (callback) => {

  // callback(null, data);
  var readdir = Promise.promisify(fs.readdir);
  var readfile = Promise.promisify(fs.readFile);

  readdir(exports.dataDir)
    .then(array => {
      let promiseArr = array.map(file => {
        return readfile(exports.dataDir + '/' + file);
      });

      Promise.all(promiseArr)
        .then(resolved => {
          var result = resolved.map((buffer, i) => {
            var id = array[i].slice(0, array[i].indexOf('.'));
            var text = buffer.toString();
            console.log(id, text);
            return { id, text };
          });

          callback(null, result);
        })
        .catch(err => callback(err));
    })
    .catch(err => callback(err));
};

exports.readOne = (id, callback) => {
  var file = exports.dataDir + `/${id}.txt`;
  fs.readFile(file, (err, text) => {
    if (err) {
      callback(err);
    } else if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      text = text.toString();
      var data = {id, text};
      callback(null, data);
    }
  });
};

exports.update = (id, text, callback) => {
  var file = exports.dataDir + `/${id}.txt`;
  fs.open(file, 'r+', (err, fd) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(file, text, (err) => {
        if (err) {
          callback(err);
        } else {
          console.log('The file has been saved!');
          callback(null, id);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {

  var file = exports.dataDir + `/${id}.txt`;
  fs.unlink(file, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, id);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

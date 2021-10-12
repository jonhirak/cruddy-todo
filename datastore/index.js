const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw err;
    } else {
      //create new doc w/filesystem
      var file = exports.dataDir + `/${id}.txt`;
      fs.writeFile(file, text, (err) => {
        if (err) {
          throw err;
        }

        callback(null, { id, text });
        console.log('Saved successfully!');
      });
    }
  });
};

exports.readAll = (callback) => {

  // callback(null, data);
  fs.readdir(exports.dataDir, (err, files) => {

    var data = _.map(files, (file, i) => {
      file = file.slice(0, file.indexOf('.'));
      return { id: file, text: file };
    });

    if (err) {
      throw err;
    } else {
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

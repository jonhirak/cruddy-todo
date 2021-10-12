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
  fs.readdir(exports.dataDir, (err, files) => {

    var data = _.map(files, (file, i) => {
      file = file.slice(0, file.indexOf('.'));
      return { id: file, text: file };
    });

    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
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

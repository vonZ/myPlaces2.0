var mongoose = require('mongoose'); //library for the mongo database
var Grid = require('gridfs-stream');
var fs = require('fs');
var conn = mongoose.connection;

exports.init = function(app) {  
  //connection to the mongo database
  var  uri ="mongodb://localhost/myPlaces";
  Grid.mongo = mongoose.mongo;
  mongoose.connect(uri, {server:{auto_reconnect:true}});

  conn.once('open', function() {
    var gfs = Grid(conn.db);
    app.set('gridfs', gfs);
    console.log('connection open and the mongo db URI is' +uri);
  });
};


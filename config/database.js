var mongoose = require('mongoose'); //library for the mongo database
var Grid = require('gridfs-stream');
var fs = require('fs');
var conn = mongoose.connection;

exports.init = function(app) {  
  //connection to the mongo database
  var  uri ="mongodb://localhost/ToDoThings";
  Grid.mongo = mongoose.mongo;
  mongoose.connect(uri, {server:{auto_reconnect:true}});

  conn.once('open', function() {
    var gfs = Grid(conn.db);
    app.set('gridfs', gfs);
    console.log('connection open and the mongo db URI is' +uri);
  });
};

exports.uploadFile = function(file){
  var gfs = Grid(conn.db);
  var file_name = file.name;

  var writestream = gfs.createWriteStream({
        filename: file_name,
        mode:"w",
        content_type: part.mimetype
    });
   
    fs.createReadStream(url_image).pipe(writestream);
 
    writestream.on('close', function (file) {
        console.log(file.filename + 'Written To DB');
    });
};
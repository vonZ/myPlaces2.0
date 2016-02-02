var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  searchPlaceName: String,
  img: String,
  searchPlaceLat: {type: Number, default: 0},
  searchPlaceLng: {type: Number, default: 0}
});

mongoose.model('Post', PostSchema); 
mongoose.connect( 'mongodb://localhost/ToDoThings' );
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: { type : String },
	description: { type : String },
	category: { type : String },
	searchPlaceName: { type : String },
	img: { type : String },
	searchPlaceLat: {type: Number, default: 0},
	searchPlaceLng: {type: Number, default: 0},
	mapCollection: [{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'mapCollection' 
	}],
	upvotes: {type: Number, default: 0}
});

PostSchema.methods.upvote = function (cb) {
	this.upvotes += 1;
	this.save(cb);
};

PostSchema.methods.deleteItem = function (err, cb){
    this.remove( function (err){
  		if (err) throw err;
		console.log('Post successfully deleted!');
	});	
    this.save(cb);
};

mongoose.model('Post', PostSchema); 
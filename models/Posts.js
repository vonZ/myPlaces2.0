var mongoose = require('mongoose');

var imgPath = './public/files/';

var PostSchema = new mongoose.Schema({
	title: String,
	description: String,
	category: String,
	tags: String,
	searchPlaceName: String,
	img: { data: Buffer, contentType: String },
	searchPlaceLat: {type: Number, default: 0},
	searchPlaceLng: {type: Number, default: 0},
	mapCollection: [{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'mapCollection' 
	}],
	upvotes: {type: Number, default: 0},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
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
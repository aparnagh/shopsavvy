var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
	name: String,
	desc: String,
	img:
	{
		data: Buffer,
		contentType: String
	}
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
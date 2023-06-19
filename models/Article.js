import mongoose from "mongoose"

const articleSchema = new mongoose.Schema({
	_id: String,
	views: {
		type: Number,
		default: 0
	},
	likes: {
		type: Array,
		default: []
	}
}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Article", articleSchema)
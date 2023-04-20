import mongoose from "mongoose"

const articleSchema = new mongoose.Schema({
	views: {
		type: Number,
		default: 0
	},
	likes: {
		type: Array,
		default: []
	}
}, { strict: false }) // * add any unreg. field

export default mongoose.model("Article", articleSchema)
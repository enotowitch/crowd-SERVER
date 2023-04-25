import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
	likes: {
		type: Array,
		default: []
	},
	dislikes: {
		type: Array,
		default: []
	}
}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Comment", commentSchema)
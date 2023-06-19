import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
	_id: String,
	lastVisited: Number,
	lastReported: {
		type: Number,
		default: Math.floor(new Date() / 1000) // now
	}
}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Report", reportSchema)
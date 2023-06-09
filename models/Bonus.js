import mongoose from "mongoose"

const bonusSchema = new mongoose.Schema({
	_id: String,
	likes: {
		type: Array,
		default: []
	}
}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Bonus", bonusSchema)
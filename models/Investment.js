import mongoose from "mongoose"

const investmentSchema = new mongoose.Schema({
	closed: {
		type: Boolean,
		default: false
	}
}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Investment", investmentSchema)
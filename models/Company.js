import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
	_id: String
}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Company", companySchema)
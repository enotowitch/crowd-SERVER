import mongoose from "mongoose"

const investmentSchema = new mongoose.Schema({

}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Investment", investmentSchema)
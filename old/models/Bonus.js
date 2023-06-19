import mongoose from "mongoose"

const bonusSchema = new mongoose.Schema({

}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Bonus", bonusSchema)
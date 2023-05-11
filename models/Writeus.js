import mongoose from "mongoose"

const writeusSchema = new mongoose.Schema({

}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Writeus", writeusSchema)
import mongoose from "mongoose"

const articleSchema = new mongoose.Schema({
	// * todo ? any fields with "strict: false" => can cause problems with likes:number etc
}, { strict: false })

export default mongoose.model("Article", articleSchema)
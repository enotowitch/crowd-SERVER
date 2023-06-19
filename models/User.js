import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	img: {
		type: String,
		default: ""
	}
})

export default mongoose.model("User", userSchema)
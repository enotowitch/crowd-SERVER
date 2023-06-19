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
		default: "https://img.freepik.com/free-icon/user_318-644324.jpg?size=626&ext=jpg&ga=GA1.2.107752153.1670338047&semt=robertav1_2_sidr"
	}
})

export default mongoose.model("User", userSchema)
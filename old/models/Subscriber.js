import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		}
	}, { strict: false }
)

export default mongoose.model("Subscriber", subscriberSchema)
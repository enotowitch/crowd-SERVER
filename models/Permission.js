import mongoose from "mongoose"

const permissionSchema = new mongoose.Schema({
	_id: String,
	permission: {
		type: Array,
		default: []
	}
}, { strict: false, timestamps: true }) // * add any unreg. field

export default mongoose.model("Permission", permissionSchema)
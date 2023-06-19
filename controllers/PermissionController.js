import PermissionModel from "../models/Permission.js"

// ! addPermission
export const addPermission = async (req, res) => {

	const { arr } = req.body

	try {
		const find = await PermissionModel.find({})
		// if not created => create
		if (find.length === 0) {
			const doc = await new PermissionModel({ _id: 1 })
			await doc.save()
		} else {
			// if created: update with new arr
			await PermissionModel.findOneAndUpdate({ _id: 1 }, { permission: arr })
		}

		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? addPermission

// ! getPermissions
export const getPermissions = async (req, res) => {
	try {

		const permissions = await PermissionModel.find({})

		res.json(permissions[0].permission)

	} catch (error) {
		console.log(error)
	}
}
// ? getPermissions


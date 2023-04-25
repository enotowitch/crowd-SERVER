import CommentModel from "../models/Comment.js"
import UserModel from "../models/User.js"

// ! addComment
export const addComment = async (req, res) => {

	const { userId } = req

	const userInfo = await UserModel.findById(userId)
	const { password, ...user } = userInfo._doc // ! don't touch -password

	try {
		const doc = await new CommentModel({ ...req.body, user })
		const saved = await doc.save()
		res.json(saved)

	} catch (error) {
		console.log(error)
	}
}
// ? addComment

// ! getComments
export const getComments = async (req, res) => {

	const { articleId } = req.body

	try {
		const find = await CommentModel.find({ articleId })
		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getComments
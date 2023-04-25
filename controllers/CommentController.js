import CommentModel from "../models/Comment.js"

// ! addComment
export const addComment = async (req, res) => {

	const { userId } = req

	try {
		const doc = await new CommentModel({ ...req.body, userId })
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
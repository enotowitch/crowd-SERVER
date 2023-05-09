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
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? addComment

// ! getComments
export const getComments = async (req, res) => {

	const { articleId, skip } = req.body

	try {
		const find = await CommentModel.find({ articleId })
			.skip(skip)
		// .limit(12)

		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getComments

// ! rateComment
export const rateComment = async (req, res) => {

	const { act, commentId } = req.body
	const { userId } = req

	try {
		// * user can rate + or -, so userId can be only in likes or only in dislikes
		if (act === "+") {
			await CommentModel.findOneAndUpdate({ _id: commentId }, { $pull: { dislikes: userId } })
			await CommentModel.findOneAndUpdate({ _id: commentId }, { $pull: { likes: userId } })
			await CommentModel.findOneAndUpdate({ _id: commentId }, { $push: { likes: userId } })
		}
		if (act === "-") {
			await CommentModel.findOneAndUpdate({ _id: commentId }, { $pull: { likes: userId } })
			await CommentModel.findOneAndUpdate({ _id: commentId }, { $pull: { dislikes: userId } })
			await CommentModel.findOneAndUpdate({ _id: commentId }, { $push: { dislikes: userId } })
		}

		const comment = await CommentModel.find({ _id: commentId })
		const likes = comment[0].likes.length
		const dislikes = comment[0].dislikes.length
		const rating = likes > dislikes ? likes : Number(-dislikes)
		res.json({ ok: true, rating })

	} catch (error) {
		console.log(error)
	}
}
// ? rateComment
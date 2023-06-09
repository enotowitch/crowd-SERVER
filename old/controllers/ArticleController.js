import ArticleModel from "../models/Article.js"

// ! addArticle
export const addArticle = async (req, res) => {

	try {
		const doc = await new ArticleModel({ ...req.body })
		const saved = await doc.save()

		res.json({ ok: true, id: saved._id })

	} catch (error) {
		console.log(error)
	}
}
// ? addArticle

// ! getArticles
export const getArticles = async (req, res) => {

	const { skip } = req.body

	try {
		const find = await ArticleModel.find({}).skip(skip).limit(process.env.POST_LIMIT)
		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getArticles

// ! getArticle
export const getArticle = async (req, res) => {

	const { id } = req.params

	try {
		const inc = await ArticleModel.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { returnDocument: "after" })
		res.json(inc)

	} catch (error) {
		console.log(error)
	}
}
// ? getArticle

// ! likeArticle
export const likeArticle = async (req, res) => {

	const { id } = req.body // id=articleId
	const userId = req.userId

	try {
		const article = await ArticleModel.findById({ _id: id })

		if (!article.likes.includes(userId)) { // * no like from this user = like (put user id); has like = dislike
			const push = await ArticleModel.findOneAndUpdate({ _id: id }, { $push: { likes: userId } })
			res.json({ ok: true, value: push.likes.length + 1 })
		} else {
			const pull = await ArticleModel.findOneAndUpdate({ _id: id }, { $pull: { likes: userId } })
			res.json({ ok: true, value: pull.likes.length - 1 })
		}

	} catch (error) {
		console.log(error)
	}
}
// ? likeArticle

// ! deleteArticle
export const deleteArticle = async (req, res) => {

	const { id } = req.body // id=articleId

	try {
		const article = await ArticleModel.findOneAndDelete({ _id: id })
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? deleteArticle

// ! editArticle
export const editArticle = async (req, res) => {

	const { id } = req.body // id=articleId

	try {
		const article = await ArticleModel.findOneAndUpdate({ _id: id }, { ...req.body })
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? editArticle
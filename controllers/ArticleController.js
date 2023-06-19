import ArticleModel from "../models/Article.js"

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
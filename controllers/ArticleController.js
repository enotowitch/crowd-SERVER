import ArticleModel from "../models/Article.js"

// ! addArticle
export const addArticle = async (req, res) => {

	try {
		const doc = await new ArticleModel({ ...req.body })
		const saved = await doc.save()

		res.json(saved)

	} catch (error) {
		console.log(error)
	}
}
// ? addArticle

// ! getArticles
export const getArticles = async (req, res) => {

	try {
		const find = await ArticleModel.find({})
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
		const find = await ArticleModel.findById(id)
		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getArticle
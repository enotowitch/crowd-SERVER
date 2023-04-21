import jwt from "jsonwebtoken"

// * add userId to every req
// must be before Controller function
// example: app.post("/addArticle", middleware.addUserId, ArticleController.addArticle)

export const addUserId = async (req, res, next) => {
	try {
		const token = req.headers.authorization
		const decoded = jwt.verify(token, process.env.JWT)

		req.userId = decoded._id
		next()

	} catch (err) { console.log(err) }
}
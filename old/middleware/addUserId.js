import jwt from "jsonwebtoken"

// * add userId to every req
// must be before Controller function
// example: app.post("/addArticle", middleware.addUserId, ArticleController.addArticle)

export const addUserId = async (req, res, next) => {
	try {
		const token = req.headers.authorization
		// !!
		if (token) {
			const decoded = jwt.verify(token, process.env.JWT)
			req.userId = decoded
			next()
		} else {
			res.json()
		}

	} catch (err) {
		res.json(undefined)
		console.log(err)
	}
}
// * FOR EVAL: gray cause of eval
// * postType = article/bonus/company
import article from "../models/Article.js"
import bonus from "../models/Bonus.js"
import company from "../models/Company.js"
// * NOT FOR EVAL
import UserModel from "../models/User.js"

// ! likePost
export const likePost = async (req, res) => {

	const { id, postType } = req.body // id=articleId/bonusId; postType=article/bonus...
	const userId = req.userId

	try {
		const post = await eval(postType).findById({ _id: id }) // e.g: article.findById

		if (!post.likes.includes(userId)) { // * no like from this user = like (put user id); has like = dislike
			const push = await eval(postType).findOneAndUpdate({ _id: id }, { $push: { likes: userId } })
			res.json({ ok: true, value: push.likes.length + 1 })
		} else {
			const pull = await eval(postType).findOneAndUpdate({ _id: id }, { $pull: { likes: userId } })
			res.json({ ok: true, value: pull.likes.length - 1 })
		}

	} catch (error) {
		console.log(error)
	}
}
// ? likePost

// ! getPosts
export const getPosts = async (req, res) => {

	// current limits are 4/8/50
	const { skip, limit, postType } = req.body

	try {
		let posts
		// random posts for rightBar
		if (limit === 4) {
			posts = await eval(postType).find({})
			const randNums = []
			for (let i = 0; i < 15; i++) {
				const randNum = Math.floor(Math.random() * posts.length)
				if (!randNums.includes(randNum) && randNums.length < 4) {
					randNums.push(randNum)
				}
			}
			// get 4 random posts
			posts = [posts[randNums[0]], posts[randNums[1]], posts[randNums[2]], posts[randNums[3]]]
		}
		if (limit === 8) { // get last 8 posts (newest)
			posts = await eval(postType).find({})
			posts = posts.reverse()
			posts.splice(8)
		}
		if (limit === 50) {
			posts = await eval(postType).find({}).skip(skip).limit(limit)
			posts = posts.reverse()
		}
		res.json(posts)

	} catch (error) {
		console.log(error)
	}
}
// ? getPosts

// ! addPost
export const addPost = async (req, res) => {

	const { name, postType } = req.body // post id = post name
	const { userId } = req
	let user = await UserModel.find({ _id: userId })
	user = user[0]
	delete user._doc.password

	try {
		const doc = await eval(postType)({ ...req.body, _id: name, user })
		const saved = await doc.save()

		res.json({ ok: true, id: saved._id })

	} catch (error) {
		console.log(error)
	}
}
// ? addPost
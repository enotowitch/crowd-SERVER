import UserModel from "../models/User.js"
import ReportModel from "../models/Report.js"
import CommentModel from "../models/Comment.js"
import PermissionModel from "../models/Permission.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mailer from "../utils/mailer.js"
// 
import dotenv from 'dotenv'
dotenv.config()
//
const randomPass = () => String(Math.random().toFixed(8)).replace(/0./, "") // 11807976
const passwordHash = async (password) => await bcrypt.hash(password, 10)
const token = (userId) => jwt.sign(userId, process.env.JWT)

// ! type = Sign Up/Log In
export const auth = async (req, res) => {
	const { type, ...anyUserInfo } = req.body // ! DON'T add/modify: -type from "anyUserInfo"
	const { email, password } = req.body

	const dbUser = await UserModel.find({ email })

	// ! Sign Up
	if (type === "Sign Up") {
		// * no user with email
		if (dbUser.length === 0) {

			if (password.length < 6) {
				return res.json({ ok: false, msg: "password must have atleast 6 characters" })
			}

			try {
				const doc = await new UserModel(
					{
						...anyUserInfo,
						password: await passwordHash(req.body.password),
						img: email.charAt(0) + ".svg" // assuming /upload has imgs a-z.svg/0-9.svg
					})
				const saved = await doc.save()

				const { password, ...userInfoToClient } = saved._doc // ! DON'T add/modify: -password from "doc"

				const userId = String(saved._doc._id)

				return res.json({ ok: true, ...userInfoToClient, token: token(userId) })

			} catch (error) {
				console.log(error)
			}
		} else {
			// * email already exists
			return res.json({ ok: false, msg: "email already exists" })
		}
	}
	// ? Sign Up

	// ! Log In
	if (type === "Log In") {

		// * no user with this email
		if (dbUser.length === 0) {
			return res.json({ ok: false, msg: "wrong email or password" })
		}

		const isValidPass = await bcrypt.compare(password, dbUser[0].password)

		if (isValidPass) {

			const { password, ...userInfoToClient } = dbUser[0]._doc // ! DON'T add/modify: -password from "doc"

			const userId = String(dbUser[0]._doc._id)

			return res.json({ ok: true, ...userInfoToClient, token: token(userId) })
		} else {
			return res.json({ ok: false, msg: "wrong email or password" })
		}
	}

	// return res.json()
	// ? Log In
}

// ! autoAuth: verify token on every reload
export const autoAuth = async (req, res) => {

	try {
		const token = req.headers.authorization

		if (token) {
			const userId = jwt.verify(token, process.env.JWT)

			const findUser = await UserModel.find({ _id: userId })
			if (findUser.length > 0) {
				// ! isAdmin
				const userEmail = findUser[0]?.email
				const isAdmin = userEmail === process.env.ADMIN_EMAIL && true
				// ? isAdmin
				// ! isAuthor
				const permission = await PermissionModel.find({})
				const permissionEmails = permission[0]?.permission
				let isAuthor
				if (permissionEmails?.includes(userEmail)) {
					isAuthor = true
				}
				// ? isAuthor

				const { password, ...userInfoToClient } = findUser?.[0]?._doc // ! DON'T add/modify: -password from "doc"
				res.json({ ...userInfoToClient, isAdmin, isAuthor })

				// ! comment report
				const findReport = await ReportModel.find({})
				// report NOT created
				if (findReport.length === 0) {
					const doc = await new ReportModel({ _id: 1 })
					await doc.save()
				} else {
					// report created
					const now = Math.floor(new Date() / 1000)
					const report = await ReportModel.findOneAndUpdate({ _id: 1 }, { lastVisited: now })
					const unixDay = 60 * 60 * 24
					const { lastVisited, lastReported } = report

					// report sent more than 1 day ago => send report
					if (lastVisited - lastReported > unixDay) {
						// ! 1. find new comments (created during last day)
						const comments = await CommentModel.find({})
						const commentsArr = comments.map(comment => {
							const commentCreated = new Date(String(comment.createdAt)).getTime() / 1000
							const oneDayAgo = now - unixDay
							// comment created during last day (not reported)
							if (commentCreated > oneDayAgo) {
								const { value, postType, postId } = comment
								return { value, postType, postId } // commentText,article,bricks
							}
						}).filter(t => t) // clear undefined

						const commentsWithLinks = commentsArr.map(comment => {
							return `<div>${comment.value}, ${process.env.CLIENT_URL}/${comment.postType}/${comment.postId}</div>` // com text, CLIENT_URL/company/bricks
						})
						// ! 2. mailer
						mailer(process.env.ADMIN_EMAIL, `Comments report: ${new Date(now * 1000)}`, `
			<div style="font-size: 22px; margin-bottom: 15px"><b>Last day comments:</b></div>
				${commentsWithLinks}
			</div>`)
						// ! 3. DB: mailer report sent => update lastReported to now
						await ReportModel.findOneAndUpdate({ _id: 1 }, { lastReported: now })
					}
				}
				// ? comment report
			}
		} else {
			// !!
			return res.json({ err: "no token" })
		}
	} catch (error) {
		return res.json({ err: "error" })
	}
}
// ? autoAuth

// ! forgot
export const forgot = async (req, res) => {

	const { email } = req.body

	const findUser = await UserModel.find({ email })
	if (findUser.length === 0) {
		return res.json({ msg: "no user with this email" })
	} else {
		// ! user found
		// 1. send new random pass to user email
		mailer(email, "Password changed", `
		<div style="font-size: 22px; margin-bottom: 15px"><b>Password changed</b></div>
				<div style="font-size: 18px">New Password: <b>${randomPass()}</b></div>
		</div>`)
		// 2. write new random pass to DB
		await UserModel.findOneAndUpdate({ email }, { password: await passwordHash(randomPass()) })
		// 3. msg to front
		return res.json({ msg: `check ${email} for new password` })
	}
}
// ? forgot

// ! authGoogle
export const authGoogle = async (req, res) => {
	const { user } = req

	// if authGoogle ok
	if (user) {
		const gmail = user.emails?.[0].value
		const find = await UserModel.find({ email: gmail })

		let userId
		// ! no user with email = gmail => create user
		if (find.length === 0) {
			const doc = await new UserModel({
				email: gmail,
				password: await passwordHash(randomPass()),
				name: user.displayName,
				img: user.photos[0].value
			})
			const saved = await doc.save()
			userId = String(saved._doc._id)
		} else {
			// ! user with email = gmail exists
			userId = String(find[0]._id)
		}

		res.status(200).json({
			success: true,
			message: "successfull",
			user: user,
			token: token(userId)
			//   cookies: req.cookies
		});
	}

}
// ? authGoogle

// ! userChangeImg
export const userChangeImg = async (req, res) => {

	const { imgName } = req.body
	const { userId } = req

	await UserModel.findOneAndUpdate({ _id: userId }, { img: imgName })

	return res.json({ ok: true })
}
// ? userChangeImg

// ! userChangeName
export const userChangeName = async (req, res) => {

	const { newName } = req.body
	const { userId } = req

	if (newName.match(/[a-z]/i)) {
		const uniqUserName = await UserModel.find({ name: newName })
		// prevent dup user names
		if (uniqUserName.length > 0) {
			return
		}
		await UserModel.findOneAndUpdate({ _id: userId }, { name: newName })
	}

	return res.json({ ok: true })
}
// ? userChangeName
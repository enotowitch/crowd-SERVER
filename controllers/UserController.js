import UserModel from "../models/User.js"
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
				const doc = await new UserModel({ ...anyUserInfo, password: await passwordHash(password) })
				const saved = await doc.save()

				const { password, ...userInfoToClient } = saved._doc // ! DON'T add/modify: -password from "doc"

				const userId = String(saved._doc._id)

				res.json({ ok: true, ...userInfoToClient, token: token(userId) })

			} catch (error) {
				console.log(error)
			}
		} else {
			// * email already exists
			res.json({ ok: false, msg: "email already exists" })
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

			res.json({ ok: true, ...userInfoToClient, token: token(userId) })
		} else {
			return res.json({ ok: false, msg: "wrong email or password" })
		}
	}
	// ? Log In
}

// ! autoAuth: verify token on every reload
export const autoAuth = async (req, res) => {
	const token = req.headers.authorization

	if (token) {
		const userId = jwt.verify(token, process.env.JWT)

		const findUser = await UserModel.find({ _id: userId })
		// !! isAdmin
		const isAdmin = findUser[0]?.email === process.env.ADMIN_EMAIL && true

		const { password, ...userInfoToClient } = findUser?.[0]?._doc // ! DON'T add/modify: -password from "doc"
		res.json({ ...userInfoToClient, isAdmin })
	} else {
		// !!
		res.json()
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
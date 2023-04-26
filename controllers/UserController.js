import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
// 
import dotenv from 'dotenv'
dotenv.config()

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

			const passwordHash = await bcrypt.hash(password, 10)

			try {
				const doc = await new UserModel({ ...anyUserInfo, password: passwordHash })
				const saved = await doc.save()

				const { password, ...userInfoToClient } = saved._doc // ! DON'T add/modify: -password from "doc"

				const userId = String(saved._doc._id)
				const token = jwt.sign(userId, process.env.JWT)

				res.json({ ok: true, ...userInfoToClient, token })

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
			const token = jwt.sign(userId, process.env.JWT)

			res.json({ ok: true, ...userInfoToClient, token })
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
		const { password, ...userInfoToClient } = findUser[0]._doc // ! DON'T add/modify: -password from "doc"
		res.json(userInfoToClient)
	}
}
// ? autoAuth
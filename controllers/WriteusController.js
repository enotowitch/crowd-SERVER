import WriteusModel from "../models/Writeus.js"
import mailer from "../utils/mailer.js"

// ! writeus
export const writeus = async (req, res) => {

	const { email, name, subject, message } = req.body

	try {
		// ! DB
		const doc = await new WriteusModel({ ...req.body })
		const saved = await doc.save()
		res.json({ ok: true, msg: "Message received" })

		// ! mailer
		mailer(email, "We received your message", `
		<div style="font-size: 22px; margin-bottom: 15px"><b>Thank you</b> for contacting us, we will get back asap!</div>
				<div style="font-size: 18px"><b>Your name: </b>${name}</div>
				<div style="font-size: 18px"><b>Subject: </b>${subject}</div>
				<div style="font-size: 18px"><b>Your message: </b>${message}</div>
			`)

	} catch (error) {
		console.log(error)
	}
}
// ? writeus
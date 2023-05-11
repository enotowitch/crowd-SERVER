import SubscriberModel from "../models/Subscriber.js"
import mailer from "../utils/mailer.js"

// ! subscribe
export const subscribe = async (req, res) => {

	const { email } = req.body

	const find = await SubscriberModel.find({ email })

	// * not found in DB
	if (find.length === 0) {
		// ! DB
		const doc = await new SubscriberModel({ ...req.body })
		doc.save()

		// ! mailer
		mailer(email, "SUBSCRIPTION", `
				<div style="font-size: 22px"><b>Thank you</b> for subscription to our Newsletter!</div>
			`)

		return res.json({ ok: true, msg: "subscribed" })
	} else {
		// * found in DB
		return res.json({ ok: false, msg: "already subscribed" })
	}
}
// ? subscribe
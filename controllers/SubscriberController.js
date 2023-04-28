import SubscriberModel from "../models/Subscriber.js"
import nodemailer from "nodemailer"

// !! mailer
// * how to setup: 
// https://stackoverflow.com/questions/26948516/nodemailer-invalid-login
// search: Since May 30, 2022, Google no longer supports less secure apps...
function SendEmail(email, Subject, html) {
	// create reusable transporter object using the default SMTP transport 
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: '465',
		auth: {
			user: "copilotfunding@gmail.com",
			pass: "abxiihzeevcjsecr"
		},
		secureConnection: 'true',
		tls: {
			ciphers: 'SSLv3'
		}

	});

	// setup e-mail data with unicode symbols 
	var mailOptions = {
		from: "copilotfunding@gmail.com", // sender address 
		to: email, // list of receivers 
		subject: Subject, // Subject line 
		html: html // html body 
	};

	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log("ERROR----" + error);
		}
		console.log('Message sent: ' + info.response);
	});
}
// ?? mailer

// ! subscribe
export const subscribe = async (req, res) => {

	const { email } = req.body

	const find = await SubscriberModel.find({ email })

	// * not found in DB
	if (find.length === 0) {
		// ! mailer
		SendEmail(email, "SUBSCRIPTION", `
			<div style="font-size: 22px"><b>Thank you</b> for subscription to our Newsletter!</div>
		`)

		// ! DB
		const doc = await new SubscriberModel({ ...req.body })
		doc.save()

		return res.json({ ok: true, msg: "subscribed" })
		// ? DB
	} else {
		// * found in DB
		return res.json({ ok: false, msg: "already subscribed" })
	}
}
// ? subscribe
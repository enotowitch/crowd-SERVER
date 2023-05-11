import nodemailer from "nodemailer"

// !! mailer
// * how to setup: 
// https://stackoverflow.com/questions/26948516/nodemailer-invalid-login
// search: Since May 30, 2022, Google no longer supports less secure apps...
export default function mailer(email, Subject, html) {
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
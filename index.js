import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import multer from "multer"
import fs, { existsSync } from "fs"
// * js
import * as ArticleController from "./controllers/ArticleController.js"
import * as UserController from "./controllers/UserController.js"
import * as CommentController from "./controllers/CommentController.js"
import * as SubscriberController from "./controllers/SubscriberController.js"
import * as CompanyController from "./controllers/CompanyController.js"
import * as BonusController from "./controllers/BonusController.js"
import * as InvestmentController from "./controllers/InvestmentController.js"
import * as WriteusController from "./controllers/WriteusController.js"
import * as PostController from "./controllers/PostController.js"
import * as PermissionController from "./controllers/PermissionController.js"
import { addUserId } from "./middleware/addUserId.js"
import passport from "passport"
import cookieSession from "cookie-session"

// !! CONNECT
// ! use
const app = express()
app.use(express.json())
app.use(cors())
// ? use

mongoose.connect("mongodb+srv://copilotfunding:3sru7r2iDDseroEn@cluster0.10xud8x.mongodb.net/copilotfunding?retryWrites=true&w=majority")
	.then(console.log("DB OK"))
	.catch(err => console.log(err))

const PORT = process.env.PORT || 5000
app.listen(PORT, err => err ? console.log(err) : console.log(`SERVER OK, PORT:${PORT}`))
// ?? CONNECT

// !! ROUTES
// ! post: (general for article,company,bonus...)
app.post("/likePost", addUserId, PostController.likePost)
app.post("/getPosts", PostController.getPosts)
app.post("/addPost", addUserId, PostController.addPost)
// ? post
// ! article
app.get("/article/:id", ArticleController.getArticle)
app.post("/deleteArticle", ArticleController.deleteArticle)
app.post("/editArticle", ArticleController.editArticle)
// ? article
// ! user
app.post("/auth", UserController.auth)
app.post("/autoAuth", UserController.autoAuth)
app.post("/forgot", UserController.forgot)
app.post("/userChangeImg", addUserId, UserController.userChangeImg)
app.post("/userChangeName", addUserId, UserController.userChangeName)
// ? user
// ! comment
app.post("/addComment", addUserId, CommentController.addComment)
app.post("/rateComment", addUserId, CommentController.rateComment)
app.post("/getComments", CommentController.getComments)
// ? comment
// ! subscriber
app.post("/subscribe", SubscriberController.subscribe)
// ? subscriber
// ! company
app.get("/company/:id", CompanyController.getCompany)
app.post("/deleteCompany", CompanyController.deleteCompany)
app.post("/editCompany", CompanyController.editCompany)
app.get("/getTVL", CompanyController.getTVL)
// ? company
// ! bonus
app.get("/bonus/:id", BonusController.getBonus)
app.post("/deleteBonus", BonusController.deleteBonus)
app.post("/editBonus", BonusController.editBonus)
// ? bonus
// ! investment
app.post("/addInvestment", addUserId, InvestmentController.addInvestment)
app.post("/getInvestments", addUserId, InvestmentController.getInvestments)
app.post("/removeInvestment", InvestmentController.removeInvestment)
app.post("/deleteInvestment", InvestmentController.deleteInvestment)
app.get("/investment/:id", InvestmentController.getInvestment)
app.post("/editInvestment", InvestmentController.editInvestment)
app.post("/getInvested", addUserId, InvestmentController.getInvested)
app.post("/filterRevenue", addUserId, InvestmentController.filterRevenue)
// ? investment
// ! writeus
app.post("/writeus", WriteusController.writeus)
// ? writeus
// ! permission
app.post("/addPermission", PermissionController.addPermission)
app.post("/getPermissions", PermissionController.getPermissions)
// ? permission

// ! MULTER
const storage = multer.diskStorage({
	"destination": (req, file, cb) => {
		if (!existsSync("upload")) {
			fs.mkdirSync("upload")
		}
		cb(null, "upload")
	},
	"filename": (req, file, cb) => {
		cb(null, file.originalname)
	}
})

const upload = multer({ storage })

app.post("/upload", upload.single("image"), (req, res) => {
	res.json({
		url: `${process.env.SERVER_URL}upload/${req.file.originalname}`
	}
	)
})

app.use("/upload", express.static("upload"))
// ? MULTER

// ! saveRadarImg
app.post("/saveRadarImg", (req, res) => {
	const { base64Img, name } = req.body

	const data = base64Img.replace(/^data:image\/\w+;base64,/, '');

	// if no cards folder => create it
	if (!existsSync("cards")) {
		fs.mkdirSync("cards")
	}

	fs.writeFile(`cards/${name}.png`, data, { encoding: 'base64' }, function (err) {
		console.log("FINISHED")
	});
})
// ? saveRadarImg

// ! authGoogle
app.use(
	cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize());
app.use(passport.session());

import { Strategy } from "passport-google-oauth20"

passport.use(new Strategy({
	clientID: "255712379284-1imn0h8jv4vrogs5hg5ff1526ef0i86j.apps.googleusercontent.com",
	clientSecret: "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",
	callbackURL: `${process.env.SERVER_URL}auth/google/callback`,
	userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
	function (accessToken, refreshToken, profile, done) {
		done(null, profile);
	}
));

// ! routes
app.get('/auth/google',
	passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));

app.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login', successRedirect: process.env.CLIENT_URL + "/", }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	});

app.get("/auth/login/success", UserController.authGoogle);

app.get("/auth/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL + "/");
});
// ? routes

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
// ? authGoogle
// test commit
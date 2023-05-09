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
import { addUserId } from "./middleware/addUserId.js"

// !! CONNECT
// ! use
const app = express()
app.use(express.json())
app.use(cors())
// ? use

mongoose.connect("mongodb+srv://enotowitch:qwerty123@cluster0.9tnodta.mongodb.net/crowd?retryWrites=true&w=majority")
	.then(console.log("DB OK"))
	.catch(err => console.log(err))

const PORT = process.env.PORT || 5000
app.listen(PORT, err => err ? console.log(err) : console.log(`SERVER OK, PORT:${PORT}`))
// ?? CONNECT

// !! ROUTES
// ! article
app.post("/addArticle", addUserId, ArticleController.addArticle)
app.post("/getArticles", ArticleController.getArticles)
app.get("/article/:id", ArticleController.getArticle)
app.post("/likeArticle", addUserId, ArticleController.likeArticle)
app.post("/deleteArticle", ArticleController.deleteArticle)
app.post("/editArticle", ArticleController.editArticle)
// ? article
// ! user
app.post("/auth", UserController.auth)
app.post("/autoAuth", UserController.autoAuth)
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
app.post("/addCompany", CompanyController.addCompany)
app.get("/company/:id", CompanyController.getCompany)
app.post("/getCompanies", CompanyController.getCompanies)
app.post("/deleteCompany", CompanyController.deleteCompany)
app.post("/editCompany", CompanyController.editCompany)
app.get("/getTVL", CompanyController.getTVL)
// ? company
// ! bonus
app.post("/addBonus", BonusController.addBonus)
app.post("/getBonuses", BonusController.getBonuses)
app.get("/bonus/:id", BonusController.getBonus)
app.post("/deleteBonus", BonusController.deleteBonus)
app.post("/editBonus", BonusController.editBonus)
// ? bonus

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
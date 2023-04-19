import express from "express"
import cors from "cors"
import mongoose from "mongoose"
// * js
import * as ArticleController from "./controllers/ArticleController.js"

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
app.post("/addArticle", ArticleController.addArticle)
app.get("/getArticles", ArticleController.getArticles)
app.get("/article/:id", ArticleController.getArticle)
// ? article

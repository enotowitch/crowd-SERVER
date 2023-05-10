import InvestmentModel from "../models/Investment.js"

// ! addInvestment
export const addInvestment = async (req, res) => {

	try {
		const doc = await new InvestmentModel({ ...req.body })
		const saved = await doc.save()

		res.json({ ok: true, id: saved._id })

	} catch (error) {
		console.log(error)
	}
}
// ? addInvestment

// ! getInvestments
export const getInvestments = async (req, res) => {

	const { skip } = req.body

	try {
		const find = await InvestmentModel.find({}).skip(skip).limit(12)
		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getInvestments

// ! removeInvestment
export const removeInvestment = async (req, res) => {

	const { id } = req.body

	try {
		const find = await InvestmentModel.findOne({ _id: id })
		if (find.closed) {
			await InvestmentModel.updateOne({ _id: id }, { closed: false })
		} else {
			await InvestmentModel.updateOne({ _id: id }, { closed: true })
		}
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? removeInvestment
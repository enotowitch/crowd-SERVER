import InvestmentModel from "../models/Investment.js"

// ! addInvestment
export const addInvestment = async (req, res) => {

	const userId = req.userId
	const { end } = req.body

	try {
		// make investment infinite if user NOT providing end date
		let doc
		if (!end) {
			doc = await new InvestmentModel({ ...req.body, end: "9999-01-01", userId })
		} else {
			doc = await new InvestmentModel({ ...req.body, userId })
		}
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
	const userId = req.userId

	try {
		const find = await InvestmentModel.find({ userId })
			.skip(skip)
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

// ! deleteInvestment
export const deleteInvestment = async (req, res) => {

	const { id } = req.body

	try {
		await InvestmentModel.findOneAndDelete({ _id: id })
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? deleteInvestment

// ! getInvestment
export const getInvestment = async (req, res) => {

	const { id } = req.params

	try {
		const investment = await InvestmentModel.findById({ _id: id })
		res.json(investment)

	} catch (error) {
		console.log(error)
	}
}
// ? getInvestment

// ! editInvestment
export const editInvestment = async (req, res) => {

	const { id } = req.body

	try {
		await InvestmentModel.findOneAndUpdate({ _id: id }, { ...req.body })
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? editInvestment

// ! getInvested
export const getInvested = async (req, res) => {

	const userId = req.userId

	try {
		const find = await InvestmentModel.find({ userId })
		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getInvested

// ! filterRevenue
export const filterRevenue = async (req, res) => {

	const userId = req.userId
	const { platform } = req.body
	try {
		// * no platform selected => return all platforms
		if (!platform) {
			const find = await InvestmentModel.find({ userId })
			return res.json(find)
		} else {
			// * return selected platform
			// !! `filters` year on client 
			const find = await InvestmentModel.find({ userId, platform })
			return res.json(find)
		}

	} catch (error) {
		console.log(error)
	}
}
// ? filterRevenue
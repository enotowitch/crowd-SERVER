import BonusModel from "../models/Bonus.js"

// ! addBonus
export const addBonus = async (req, res) => {

	try {
		const doc = await new BonusModel({ ...req.body })
		const saved = await doc.save()

		res.json({ ok: true, id: saved._id })

	} catch (error) {
		console.log(error)
	}
}
// ? addBonus

// ! getBonuses
export const getBonuses = async (req, res) => {

	const { skip } = req.body

	try {
		const find = await BonusModel.find({}).skip(skip).limit(12)
		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getBonuses

// ! getBonus
export const getBonus = async (req, res) => {

	const { id } = req.params

	try {
		const bonus = await BonusModel.findById({ _id: id })
		res.json(bonus)

	} catch (error) {
		console.log(error)
	}
}
// ? getBonus

// ! deleteBonus
export const deleteBonus = async (req, res) => {

	const { id } = req.body

	try {
		await BonusModel.findOneAndDelete({ _id: id })
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? deleteBonus

// ! editBonus
export const editBonus = async (req, res) => {

	const { id } = req.body

	try {
		await BonusModel.findOneAndUpdate({ _id: id }, { ...req.body })
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? editBonus
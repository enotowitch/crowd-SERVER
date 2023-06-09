import BonusModel from "../models/Bonus.js"

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
import CompanyModel from "../models/Company.js"

// ! addCompany
export const addCompany = async (req, res) => {

	try {
		const doc = await new CompanyModel({ ...req.body })
		const saved = await doc.save()

		res.json({ ok: true, id: saved._id })

	} catch (error) {
		console.log(error)
	}
}
// ? addCompany

// ! getCompany
export const getCompany = async (req, res) => {

	const { id } = req.params

	try {
		const company = await CompanyModel.findById({ _id: id })
		res.json(company)

	} catch (error) {
		console.log(error)
	}
}
// ? getCompany

// ! getCompanies
export const getCompanies = async (req, res) => {

	try {
		const find = await CompanyModel.find({})
		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getCompanies
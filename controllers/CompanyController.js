import CompanyModel from "../models/Company.js"

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

// ! deleteCompany
export const deleteCompany = async (req, res) => {

	const { id } = req.body

	try {
		await CompanyModel.findOneAndDelete({ _id: id })
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? deleteCompany

// ! editCompany
export const editCompany = async (req, res) => {

	const { id } = req.body

	try {
		await CompanyModel.findOneAndUpdate({ _id: id }, { ...req.body })
		res.json({ ok: true })

	} catch (error) {
		console.log(error)
	}
}
// ? editCompany

// ! getTVL
export const getTVL = async (req, res) => {

	try {
		const companies = await CompanyModel.find({})
		const TVLs = []
		companies.map(company => TVLs.push({ name: company.name, TVL: company.TVL }))
		res.json(TVLs)

	} catch (error) {
		console.log(error)
	}
}
// ? getTVL
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

	const { skip } = req.body

	try {
		const find = await CompanyModel.find({}).skip(skip).limit(process.env.POST_LIMIT)
		res.json(find)

	} catch (error) {
		console.log(error)
	}
}
// ? getCompanies

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
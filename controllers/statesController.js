const data = {
	states: require("../model/statesData.json"),
	setStates: (data) => (this.states = data),
}

const States = require("../model/States")

const getAllStates = async (req, res) => {
	const facts = await States.find()
	const allStateData = []
	for (let i = 0; i < data.states.length; i++) {
		let funFacts = facts.find((fact) => fact.stateCode === data.states[i].code)
		const funFactsObj = { funfacts: funFacts?._doc.funfacts }
		allStateData.push({
			...data.states[i],
			...funFactsObj,
		})
	}
	const contig = allStateData.filter((state) => state.admission_number < 49)

	const nonContig = allStateData.filter((state) => state.admission_number >= 49)

	req.query.contig === "true"
		? res.json(contig)
		: req.query.contig === "false"
		? res.json(nonContig)
		: res.json(allStateData)
}

const getState = async (req, res) => {
	const fact = await States.findOne({ stateCode: req.params.state }).exec()
	const funFactObj = {
		funfacts: fact?._doc.funfacts,
	}

	const state = data.states.find((state) => state.code === req.params.state)
	const allStateData = {
		...state,
		...funFactObj,
	}

	res.json(allStateData)
}

const getStateName = (stateCode) => {
	const state = data.states.find((state) => state.code === stateCode)
	return state.state
}

const getCapital = (req, res) => {
	const state = data.states.find((state) => state.code === req.params.state)
	const response = {
		state: state.state,
		capital: state.capital_city,
	}
	res.json(response)
}

const getNickname = (req, res) => {
	const state = data.states.find((state) => state.code === req.params.state)
	const response = {
		state: state.state,
		nickname: state.nickname,
	}
	res.json(response)
}
const getPopulation = (req, res) => {
	const state = data.states.find((state) => state.code === req.params.state)
	const response = {
		state: state.state,
		population: state.population,
	}
	res.json(response)
}
const getAdmissionDate = (req, res) => {
	const state = data.states.find((state) => state.code === req.params.state)
	const response = {
		state: state.state,
		admitted: state.admission_date,
	}
	res.json(response)
}

const getfunFacts = async (req, res) => {
	const fact = await States.findOne({ stateCode: req.params?.state }).exec()
	const funFactObj = {
		funfact: fact?.funfacts[Math.floor(Math.random() * fact.funfacts.length)],
	}

	res.json(funFactObj)
}

const createFunFact = async (req, res) => {
	// If missing required parameter
	if (!req.body?.funfacts) {
		return res.status(400).json({ message: "State fun facts value required" })
	}

	const fact = await States.findOne({ stateCode: req.params.state }).exec()

	// to get old array of funFacts so we can add it to new array
	let result = null
	if (fact) {
		try {
			result = await States.findOneAndUpdate(
				{ stateCode: req.params.state },
				{ funfacts: [...fact?.funfacts, ...req.body.funfacts] },
				{
					new: true,
					upsert: true, // Make this update into an upsert
				}
			)
			res.status(200).json(result)
		} catch (err) {
			console.error(err)
		}
	} else {
		try {
			result = await States.create({
				stateCode: req.params.state,
				funfacts: req.body.funfacts,
			})
			res.status(200).json(result)
		} catch (err) {
			console.error(err)
		}
	}
}

const editFunFact = async (req, res) => {
	// If missing required parameter
	if (!req.body?.funfact || !req.body?.index) {
		return res.status(400).json({ message: "State fun fact value required" })
	}

	const fact = await States.findOne({ stateCode: req.params?.state }).exec()

	const index = req.body.index - 1

	try {
		fact.forEach((fact, i) => {
			if (i === index) {
				fact[i] = req.body.funfact
			}
		})
	} catch (err) {
		console.error(err)
		return res.status(404).json({
			message: `No Fun Fact found at that index for ${getStateName(
				req.params.state
			)}`,
		})
	}

	try {
		const result = await States.findOneAndUpdate(
			{ stateCode: req.params.state },
			{ funfacts: fact?.funfacts },
			{ upsert: true }
		)

		res.status(201).json(result)
	} catch (err) {
		console.error(err)
	}
}

const deleteFunFact = async (req, res) => {
	// If missing required parameter
	if (!req.body?.index) {
		return res
			.status(400)
			.json({ message: "State fun fact index value required" })
	}

	const fact = await States.findOne({ stateCode: req.params?.state }).exec()
	const index = req.body?.index - 1

	fact?.funfacts?.splice(index, 1)

	try {
		const result = await States.findOneAndUpdate(
			{ stateCode: req.params?.state },
			{ funfacts: fact?.funfacts },
			{ upsert: true }
		)

		res.status(201).json(result)
	} catch (err) {
		console.error(err)
	}
}

module.exports = {
	data,
	getAllStates,
	getState,
	getCapital,
	getNickname,
	getPopulation,
	getAdmissionDate,
	getfunFacts,
	createFunFact,
	editFunFact,
	deleteFunFact,
}

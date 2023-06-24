const data = {
	states: require("../model/statesData.json"),
	setStates: (data) => (this.states = data),
}

const States = require("../model/States")

const getAllStates = async (req, res) => {
	const facts = await States.find()

	const allStateData = data.states.map((state) => {
		const funFacts = facts.find((fact) => fact.stateCode === state.code)
		const funFactsObj = { funfacts: funFacts?._doc.funfacts }
		return { ...state, ...funFactsObj }
	})
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
		population: state.population.toLocaleString("en-US"),
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
	try {
		const funFactObj = {
			funfact: fact.funfacts[Math.floor(Math.random() * fact.funfacts.length)],
		}
		res.json(funFactObj)
	} catch (err) {
		console.error(err)
		return res.status(404).json({
			message: `No Fun Facts found for ${getStateName(req.params.state)}`,
		})
	}
}

const createFunFact = async (req, res) => {
	// If missing required parameter
	if (!req.body?.funfacts) {
		return res.status(400).json({ message: "State fun facts value required" })
	}
	if (!Array.isArray(req.body.funfacts)) {
		return res
			.status(400)
			.json({ message: "State fun facts value must be an array" })
	}

	const fact = await States.findOne({ stateCode: req.params.state }).exec()

	// to get old array of funFacts so we can add it to new array
	let result = null
	if (fact) {
		try {
			fact.funfacts = [...fact.funfacts, ...req.body.funfacts]
			result = await fact.save()
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
	if (!req.body?.funfact) {
		return res.status(400).json({ message: "State fun fact value required" })
	}
	if (!req.body?.index) {
		return res
			.status(400)
			.json({ message: "State fun fact index value required" })
	}
	const fact = await States.findOne({ stateCode: req.params.state }).exec()
	const index = parseInt(req.body.index - 1)
	if (!fact?.funfacts) {
		return res.status(400).json({
			message: `No Fun Facts found for ${getStateName(req.params.state)}`,
		})
	}
	if (!fact?.funfacts[index]) {
		return res.status(404).json({
			message: `No Fun Fact found at that index for ${getStateName(
				req.params.state
			)}`,
		})
	}

	try {
		fact.funfacts[index] = req.body.funfact
		await fact.save()
		res.status(200).json(fact)
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
	const index = parseInt(req.body?.index - 1)
	if (fact?.funfacts.length === 0) {
		return res.status(400).json({
			message: `No Fun Facts found for ${getStateName(req.params.state)}`,
		})
	}
	if (!fact?.funfacts[index]) {
		return res.status(400).json({
			message: `No Fun Fact found at that index for ${getStateName(
				req.params.state
			)}`,
		})
	}

	try {
		fact.funfacts.splice(index, 1)
		const result = await States.findOneAndUpdate(
			{ stateCode: req.params?.state },
			{ funfacts: fact?.funfacts },
			{ new: true, upsert: true }
		)
		res.status(200).json(result)
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

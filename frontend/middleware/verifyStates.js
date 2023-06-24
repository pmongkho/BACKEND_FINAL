const stateController = require("../controllers/statesController")

//array from statesData.json
const data = stateController.data.states

//create a new array of just state codes
const stateCodes = data.map((state) => state.code)

const verifyStates = async (req, res, next) => {
	// reg ex to find state code in url
	const pattern = /\b[a-zA-Z]{2}\b/g
	// find match
	const match = req.url?.match(pattern)
	// change state code to string we can use
	const stateCode = match?.join("").toUpperCase()
	// see if we can find it
	const found = stateCodes?.find((code) => code === stateCode)

	// if not found return 400
	if (!found) {
		return res
			.status(400)
			.json({ message: "Invalid state abbreviation parameter" })
	} else {
		// if we found replace the url with the right one
		const replace = req.url?.replace(pattern, found)
		req.url = replace
		next()
	}
}

module.exports = verifyStates

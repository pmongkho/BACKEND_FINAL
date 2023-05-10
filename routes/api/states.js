const express = require("express")
const router = express.Router()
const stateController = require("../../controllers/statesController")

router.route("/").get(stateController.getAllStates)
router.route("/:state").get(stateController.getState)
router.route("/:state/capital").get(stateController.getCapital)
router.route("/:state/nickname").get(stateController.getNickname)
router.route("/:state/population").get(stateController.getPopulation)
router.route("/:state/admission").get(stateController.getAdmissionDate)
router
	.route("/:state/funfact")
	.get(stateController.getfunFacts)
	.post(stateController.createFunFact)
	.patch(stateController.editFunFact)
	.delete(stateController.deleteFunFact)

module.exports = router

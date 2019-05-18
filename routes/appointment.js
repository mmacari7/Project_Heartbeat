// Router for profile actions / requests
const express = require("express")
const router = express.Router()
const appointmentsData = require('../data/appointments')

// Create an appointment
router.post('/create', async (req, res) => {
	try {
		if (req.session.userid !== req.body.userId)
			throw "Invalid request";
		let newApt = {
			userId: req.body.userId,
			useremail: req.body.useremail,
			practitionerId: req.body.practitionerId,
			practitionerName: req.body.pracname,
			insurance: req.body.insurancedrop,
			procedureInterest: req.body.procdrop,
			costSeen: req.body.cost,
			verification: false
		};

		let appointment = await appointmentsData.create(newApt);
		res.redirect("/profile");

	} catch (error) {
		res.status(400);
		res.send(error);
	}
})

module.exports = router

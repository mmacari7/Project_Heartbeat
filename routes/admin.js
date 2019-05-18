const express = require("express");
const router = express.Router();
const practitioners = require('../data/practitioners');
const profiles = require('../data/profiles');
const appointments = require('../data/appointments');
const bcrypt = require("bcrypt");
const { ObjectID } = require("mongodb");

// Start Practitioners
router.get("/main", async (req, res) => {
	try {
		let allPractitioners;
		let allProfiles;
		let allAppointments;
		let user = await profiles.get(req.session.userid);
		allAppointments = await appointments.readAll();
		allPractitioners = await practitioners.getAll();
		allProfiles = await profiles.getAll();
		let options = {
			layout: false,
			title: "Admin",
			pageType: "profile-page",
			user: user,
			appointments: allAppointments,
			practitioners: allPractitioners,
			profiles: allProfiles
		};
		res.render("pages/admin.hbs", options);
	} catch (error) {
		res.status(400);
		console.log(error);
		res.send(error);
	}
});

router.get('/profile/:email', async (req, res) => {
	try {
		let profile = await profiles.getbyEmail(req.params.email);
		res.json(profile);
	} catch (error) {
		console.log(error);
		res.send("error");
	}
});

router.post('/profile/create', async (req, res) => {
	try {
		let profile = req.body;
		(profile.isAdmin == "true") ? profile.isAdmin = true : profile.isAdmin = false;
		profile.photo = "";
		profile.password = await bcrypt.hash(profile.password, 16);
		profile = await profiles.create(profile);
		console.log(profile);
		res.redirect("/admin/main");
	} catch (error) {
		console.log(error);
		res.send("error");
	}
});

router.post('/profile/edit', async (req, res) => {
	try {
		let profile = req.body;
		let _id = ObjectID(req.body._id);
		delete profile._id;
		(profile.isAdmin == "true") ? profile.isAdmin = true : profile.isAdmin = false;
		profile.photo = "";
		if (profile.password) {
			profile.password = await bcrypt.hash(profile.password, 16);
		}
		else {
			delete profile.password;
		}
		await profiles.update(_id, { $set: profile });
		res.redirect("/admin/main");
	} catch (error) {
		console.log(error);
		res.send("error");
	}
});

router.get('/profile/delete/:id', async (req, res) => {
	try {
		await profiles.remove(ObjectID(req.params.id));
		res.json({success: "success"});
	} catch (error) {
		console.log(error)
		res.send(error);
	}
});

router.get('/practitioner/:practitionerId', async (req, res) => {
	try {
		let practitioner = await practitioners.get(req.params.practitionerId);
		res.json(practitioner);
	} catch (error) {
		console.log(error);
		res.send("error");
	}
});

router.post('/practitioner/create', async (req, res) => {
	try {
		let practitioner = {
			name: req.body.name,
			location: [
				{ lat: parseFloat(req.body.lat) },
				{ long: parseFloat(req.body.long) }
			],
			procedures: [],
			providers: req.body.provider
		};
                if (typeof practitioner.providers === 'string')
                    practitioner.providers = [practitioner.providers];
		for (let i = 0; i < req.body.procedure.length; i++) {
			let procedure = req.body.procedure[i];
			let cost = parseFloat(req.body.cost[i]);
			let object = {};
			object[procedure] = cost;
			practitioner.procedures.push(object);
		};
		practitioner = await practitioners.create(practitioner);
		res.redirect("/admin/main");
	} catch (error) {
                console.log(error);
		res.send("error");
	}
});

router.post('/practitioner/edit', async (req, res) => {
	try {
		let practitioner = {
			name: req.body.name,
			location: [
				{ lat: parseFloat(req.body.lat) },
				{ long: parseFloat(req.body.long) }
			],
			procedures: [],
			providers: req.body.provider
		};
		for (let i = 0; i < req.body.procedure.length; i++) {
			let procedure = req.body.procedure[i];
			let cost = parseFloat(req.body.cost[i]);
			let object = {};
			object[procedure] = cost;
			practitioner.procedures.push(object);
		};
		await practitioners.update(ObjectID(req.body._id), { $set: practitioner });
		res.redirect("/admin/main");
	} catch (error) {
		console.log(error);
		res.send("error");
	}
});

router.get('/practitioner/delete/:id', async (req, res) => {
	try {
		await practitioners.remove(ObjectID(req.params.id));
		res.json({success: "success"});
	} catch (error) {
		console.log(error)
		res.send(error);
	}
});

router.get('/appointment/:appointmentId', async (req, res) => {
	try {
		let appointment = await appointments.read(req.params.appointmentId);
		res.json(appointment);
	} catch (error) {
		console.log(error);
		res.send("error");
	}
});

router.post('/appointment/create', async (req, res) => {
	try {
		let appointment = req.body;
		appointment.verification = false;
		appointment = await appointments.create(appointment);
		console.log(appointment);
		res.redirect("/admin/main");
	} catch (error) {
		console.log(error);
		res.send("error");
	}
});

router.post('/appointment/edit', async (req, res) => {
	try {
		let appointment = req.body;
		let _id = ObjectID(req.body._id);
		delete appointment._id;
		(appointment.verification == "true") ? appointment.verification = true : appointment.verification = false;
		await appointments.update(_id, { $set: appointment });
		res.redirect("/admin/main");
	} catch (error) {
		console.log(error);
		res.send("error");
	}
});

router.get('/appointment/delete/:id', async (req, res) => {
	try {
		await appointments.delete(ObjectID(req.params.id));
		res.json({success: "success"});
	} catch (error) {
		console.log(error)
		res.send(error);
	}
});


router.get('/practitioners', async (req, res) => {
	let allPractitioners;
	try {
		allPractitioners = await practitioners.getAll();
	} catch (e) {
		res.status(500);
		res.send(e);
		return;
	}

	res.render('pages/admin/practitioners/index.hbs',
		{
			layout: false,
			practitioners: allPractitioners
		});
});

router.post('/practitioners/create', async (req, res) => {
	let id;
	try {
		id = await practitioners.create(req.body);
	} catch (e) {
		res.status(400);
		res.send({ error: e });
		return;
	}

	res.status(200);
	res.send({ result: 'success', id: id });
});

router.post('/practitioners/update', async (req, res) => {
	try {
		await practitioners.update(ObjectID(req.body._id), req.body.update_);
	} catch (e) {
		res.status(400);
		res.send({ error: e });
		return;
	}

	res.status(200);
	res.send({ result: 'success' });
});

router.post('/practitioners/delete', async (req, res) => {
	try {
		await practitioners.remove(ObjectID(req.body._id));
	} catch (e) {
		res.status(400);
		res.send({ error: e });
		return;
	}

	res.status(200);
	res.send({ result: 'success' });
});
// End Practitioners

// Start Profiles
router.get('/profiles', async (req, res) => {
	let allProfiles;
	try {
		allProfiles = await profiles.getAll();
	} catch (e) {
		res.status(500);
		res.send(e);
		return;
	}

	res.render('pages/admin/profiles/index.hbs',
		{
			layout: false,
			profiles: allProfiles
		});
});

router.post('/profiles/create', async (req, res) => {
	let id;
	try {
		req.body.password = await bcrypt.hash(req.body.password, 16);
		id = await profiles.create(req.body);
	} catch (e) {
		res.status(400);
		res.send({ error: e });
		return;
	}

	res.status(200);
	res.send({ result: 'success', id: id });
});

router.post('/profiles/update', async (req, res) => {
	try {
		if (req.body.update_['$set'].password) {
			req.body.update_['$set'].password = await bcrypt.hash(req.body.update_['$set'].password, 16);
		}
		await profiles.update(ObjectID(req.body._id), req.body.update_);
	} catch (e) {
		res.status(400);
		res.send({ error: e });
		return;
	}

	res.status(200);
	res.send({ result: 'success' });
});

router.post('/profiles/delete', async (req, res) => {
	try {
		await profiles.remove(ObjectID(req.body._id));
	} catch (e) {
		res.status(400);
		res.send({ error: e });
		return;
	}

	res.status(200);
	res.send({ result: 'success' });
});
// End Profiles

// Start Appointments
router.get('/appointments', async (req, res) => {
	let allAppointments;
	try {
		allAppointments = await appointments.readAll();
	} catch (e) {
		res.status(500);
		res.send(e);
		return;
	}

	res.render('pages/admin/appointments/index.hbs',
		{
			layout: false,
			profiles: allAppointments
		});
});

router.post('/appointments/update', async (req, res) => {
	try {
		await appointments.update(ObjectID(req.body._id), req.body.update_);
	} catch (e) {
		res.status(400);
		res.send({ error: e });
		return;
	}

	res.status(200);
	res.send({ result: 'success' });
});

router.post('/appointments/delete', async (req, res) => {
	try {
		await appointments.delete(ObjectID(req.body._id));
	} catch (e) {
		res.status(400);
		res.send({ error: e });
		return;
	}

	res.status(200);
	res.send({ result: 'success' });
});
// End Appointments

module.exports = router;

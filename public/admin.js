$("button.btn-profile-edit").click(function () {
	let email = $(this).parent().parent().children(".email").text();
	let user = function () {
		let tmp = null;
		$.ajax({
			'async': false,
			'type': "GET",
			'dataType': 'json',
			'url': "/admin/profile/" + email,
			'success': function (data) {
				tmp = data;
			}
		});
		return tmp;
	}();
	let modal = $("#profileEdit");
	modal.find("#firstName").val(user.firstName);
	modal.find("#lastName").val(user.lastName);
	modal.find("#email").val(user.email);
	modal.find("#insuranceProvider").val(user.insuranceProvider);
	modal.find("#isAdmin").val(user.isAdmin.toString());
	modal.find("#_id").val(user._id);
	modal.modal('show');
});

$("button.btn-profile-delete").click(function () {
	let id = $(this).parent().parent().attr("name");
	let profile = function () {
		let tmp = null;
		$.ajax({
			'async': false,
			'type': "GET",
			'dataType': 'json',
			'url': "/admin/profile/delete/" + id,
			'success': function (data) {
				tmp = data;
			}
		});
		return tmp;
	}();
	location.reload();
});

$("button.btn-appointment-edit").click(function () {
	let appointmentId = $(this).parent().parent().attr("name");
	let appointment = function () {
		let tmp = null;
		$.ajax({
			'async': false,
			'type': "GET",
			'dataType': 'json',
			'url': "/admin/appointment/" + appointmentId,
			'success': function (data) {
				tmp = data;
			}
		});
		return tmp;
	}();
	let modal = $("#appointmentEdit");
	modal.find("#userId").val(appointment.userId);
	modal.find("#userEmail").val(appointment.useremail);
	modal.find("#practitionerId").val(appointment.practitionerId);
	modal.find("#practitionerName").val(appointment.practitionerName);
	modal.find("#insurance").val(appointment.insurance);
	modal.find("#procedureInterest").val(appointment.procedureInterest);
	modal.find("#costSeen").val(appointment.costSeen);
	modal.find("#verification").val(appointment.verification.toString());
	modal.find("#_id").val(appointment._id);
	modal.modal('show');
});

$("button.btn-appointment-delete").click(function () {
	let id = $(this).parent().parent().attr("name");
	let appointment = function () {
		let tmp = null;
		$.ajax({
			'async': false,
			'type': "GET",
			'dataType': 'json',
			'url': "/admin/appointment/delete/" + id,
			'success': function (data) {
				tmp = data;
			}
		});
		return tmp;
	}();
	location.reload();
});

$("button.btn-practitioner-edit").click(function () {
	let practitionerId = $(this).parent().parent().attr("name");
	let practitioner = function () {
		let tmp = null;
		$.ajax({
			'async': false,
			'type': "GET",
			'dataType': 'json',
			'url': "/admin/practitioner/" + practitionerId,
			'success': function (data) {
				tmp = data;
			}
		});
		return tmp;
	}();
	let modal = $("#practitionerEdit");
	let procedures1 = modal.find("#procedures1");
	let procedures2 = modal.find("#procedures2")
	let providers = modal.find("#providers")
	procedures1.empty();
	procedures2.empty();
	providers.empty();
	for (let i = 0; i < practitioner.procedures.length; i++) {
		for (let key in practitioner.procedures[i]) {
			let procedureEl = document.createElement("input");
			procedureEl.type = "text";
			procedureEl.setAttribute('class', "form-control");
			procedureEl.name = "procedure";
			let costEl = document.createElement("input");
			costEl.type = "number";
			costEl.setAttribute('step', "0.01");
			costEl.setAttribute('class', "form-control");
			costEl.name = "cost";
			procedureEl.setAttribute("value", key);
			costEl.setAttribute("value", practitioner.procedures[i][key])
			procedures1.append(procedureEl);
			procedures2.append(costEl);
		}
	}
	for (let i = 0; i < practitioner.providers.length; i++) {
		let providerEl = document.createElement("input");
		providerEl.type = "text";
		providerEl.setAttribute('class', "form-control");
		providerEl.name = "provider";
		providerEl.setAttribute("value", practitioner.providers[i]);
		providers.append(providerEl);
	}
	modal.find("#name").val(practitioner.name);
	modal.find("#lat").val(practitioner.location[0].lat);
	modal.find("#long").val(practitioner.location[1].long);
	modal.find("#_id").val(practitioner._id);
	modal.modal('show');
});

$("button.btn-practitioner-delete").click(function () {
	let id = $(this).parent().parent().attr("name");
	let practitioner = function () {
		let tmp = null;
		$.ajax({
			'async': false,
			'type': "GET",
			'dataType': 'json',
			'url': "/admin/practitioner/delete/" + id,
			'success': function (data) {
				tmp = data;
			}
		});
		return tmp;
	}();
	location.reload();
});

$("button.btn-practitioner-edit-procedures").click(function () {
	let modal = $("#practitionerEdit");
	let procedures1 = modal.find("#procedures1");
	let procedures2 = modal.find("#procedures2")
	let procedureEl = document.createElement("input");
	procedureEl.type = "text";
	procedureEl.setAttribute('class', "form-control");
	procedureEl.name = "procedure";
	let costEl = document.createElement("input");
	costEl.type = "number";
	costEl.setAttribute('step', "0.01");
	costEl.setAttribute('class', "form-control");
	costEl.name = "cost";
	procedures1.append(procedureEl);
	procedures2.append(costEl);
});

$("button.btn-practitioner-edit-providers").click(function () {
	let modal = $("#practitionerEdit");
	let providers = modal.find("#providers");
	let providerEl = document.createElement("input");
	providerEl.type = "text";
	providerEl.setAttribute('class', "form-control");
	providerEl.name = "provider";
	providers.append(providerEl);
});

$("button.btn-practitioner-create-procedures").click(function () {
	let modal = $("#practitionerCreate");
	let procedures1 = modal.find("#procedures1");
	let procedures2 = modal.find("#procedures2")
	let procedureEl = document.createElement("input");
	procedureEl.type = "text";
	procedureEl.setAttribute('class', "form-control");
	procedureEl.name = "procedure";
	let costEl = document.createElement("input");
	costEl.type = "number";
	costEl.setAttribute('step', "0.01");
	costEl.setAttribute('class', "form-control");
	costEl.name = "cost";
	procedures1.append(procedureEl);
	procedures2.append(costEl);
});

$("button.btn-practitioner-create-providers").click(function () {
	let modal = $("#practitionerCreate");
	let providers = modal.find("#providers");
	let providerEl = document.createElement("input");
	providerEl.type = "text";
	providerEl.setAttribute('class', "form-control");
	providerEl.name = "provider";
	providers.append(providerEl);
});
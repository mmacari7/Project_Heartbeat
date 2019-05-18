# Project Heartbeat

### Overview

When visiting the site, users will be taken to a landing page where they can sign in or sign up. After signing in they will be taken to their profile page where they can access the map page and book new appointments. After booking appointments they can see their appointments on their profile page. Admins can additionally access the admin panel where they can modify profiles, appointments, and practitioners. Appointments are booked through the map aggregate on the website. If a user is not signed in or signed up and attempts to book an appointment, they will be re-routed to the login page. 

### Running

First, start your MongoDB server and ensure that `config/mongoConnection.js` is configured properly. Ensure that you are in the project directory, then run the following commands:

```js
npm install
npm run seed
npm start
```

## MAP API
In order to get the full functionality of the website, a google map API key will need to be generated and inserted into a specific file location.
The map partial script for the Google API should be placed under a folder at ./views/partials/***map/apikey.hbs***
Inside of this apikey.hbs at the given file location should contain:

```<script src="https://maps.googleapis.com/maps/api/js?key=YOURKEYHERE" type="text/javascript"></script>```

This was modified slightly from the initial Google Maps API documentation to get rid of the call back causing synchronousy issues with the /public/map/js/healthmap.js client side file. It was resolving the AJAX call to populate the map on document ready prior to the map initialization, hence the slight alteration for the proper functionality. 

### Profiles

Here are several profiles included which can be used to test the site:

|email						|password			|admin	|
|---------------------------|-------------------|-------|
|`lieutenant_dan@gmail.com`	|`iaintgotnolegs`	|`yes`	|
|`jaime_lannister@yahoo.com`|`lionheart`		|`no`	|
|`pbaressi@stevens.edu`		|`dangernoodle`		|`yes`	|

These profiles were created using passwords that are in the seed folder. We use a package called ***bcrypt*** to send the passwords through a 16 salt round hashing. Aside from in the seed file for demonstrational purposes, there are no unhashed passwords anywhere in the source code nor the data base for proper security.

### External Sources
If you like the design of the project, you can find the material-kit we used for the front end by Creative Tim in the link here:
https://demos.creative-tim.com/material-kit/index.html

This material-kit provides assets that design and style html with some animation and a friendly user interface and color pattern.

The health map was generated using the google maps javascript API which can be found here:
https://developers.google.com/maps/documentation/javascript/tutorial

### References
Regarding the design layout, the inspiration came from the following link:
https://cloudfour.com/thinks/the-hidden-power-of-handlebars-partials/

# General Routing and Web Structure
***The routes folder contains all of the routes that our project uses.***

### ./routes/admin.js
* This route contains the routes for the /admin/ section of our profile
* A get route at /admin/main for fetching all of the data from the entire data base in /data/practitioners, /data/appointments and /data/profiles folder
* Get /admin/profile/:email, which gets a profile by email from /data/profiles
* Post /admin/profile/create that uses the /data/profiles.create method to create a profile
* Post /admin/profile/edit that uses /data/profiles.update method to update a user profile
* Get /admin/profile/delete:id which uses /data/profiles.remove method to remove a profile from the data base
* Get /admin/practitioner/:practitionerId which uses /data/practitioners.get to get a practioner from collection
* Post /admin/practitioner/create which uses /data/practitioners.create to create a new practitioner
* Post /admin/practitioner/edit which uses /data/practitioners.update to update a practitioner
* Get /admin/practitioner/delete/:id which uses /data/practitioners.remove to remove practitioner
* Get /admin/appointment/:appointmentId which uses /data/appointments.read to get an appointment from db
* Post /admin/appointment/create which uses /data/appointments.create to create an appointment to db
* Post /admin/appointment/edi which uses /data/appointments.update to update an appointment
* Get /admin/appointment/delete/:id which uses /data/appointments.delete to delete an appointment from db
* Get /admin/practitioners which gets all practitioners from db through /data/practitioners.getAll
* Post /admin/pracitioners/create which creates a new practitioner in db through /data/practitioners.create
* Post /admin/practitioners/update to update practitioner in db through /data/practitioners.update
* Post /admin/practitioners/delete to delete practitoner in db through /data/pracititoners.remove
* Get /admin/profiles to get all profiles from db through /data/profiles.getAll
* Post /admin/profiles/create to create a profile in DB through /data/profile.create
* Post /admin/profiles/update to update profile in DB through /data/profile.update
* Post /admin/profiles/delete to delete profile from DB through /data/profile.remove
* Get /admn/appointments which uses /data/appointments.readall to get all appointments from db
* Post /admin/appointments/update to update appointment in db through /data/appoointments.update
* Post /admin/appointments/delete to delete appointment from db through /data/appointments.delete

### ./routes/appointments.js
* Appointment route for non-admin appointment creation
* Post /appointments/create to create an appointment in the db

### ./routes/map.js
* Get /map which is the route to get all practitioners in DB and load the markers onto the map
* Get /map/match which is used by the healthmap.js client side jquery via ajax call to get the matching practitioners for the map marker filtering
* Get /map/all which his used by the healthmap.js client side jquery via ajax call to get all practitoners from the DB for the map markers on the map
* Get /map/checklogin which is used by the healthmap.js client side jquery via ajax call to check the users login state and authentication on the request.session middleware

### ./routes/profile.js
* Get /profile/signup is the route to get and render the sign up page
* Post /profile/signup which is the route to post to the signup page and create a new profile in the db on success
* Get /profile/login which is the route to get and render the login page
* Post /profile/login which is the route to post to the login page and authenticate the users login
* Get /profile which is the route used to render the profile page 
* Post /profile/edit which is the route used to edit the logged in user profile
* Get /profile/logout logs the user out and destroys the session authentication

### ./routes/index.js
* This is used to configure all of the routing for the website

### ./data
* This is the folder contatining all of the data operations for each of the collcetion in the data base. Each of the corresponding subfolders contain CRUD operations for each, plus some extra for what was needed.

### ./data/seeds
* This is the file that contains the seed to seed the data base to demo the website

### ./public/map/js/healthmap.js
* This is the client side script that renders the map and all of its functionality including the dynamic form filling and booking options with the google map API

### ./public/map/mapstyle.css
* This is a CSS subdocument added to our material kit that allows us to style the map and containerize it in a way that makes it user interface friendly

### ./public/admin.js && ./public/common.js
* Common is a client side file that is filled with helper functions for the admin.js file. The admin.js file contains the client side processing done for all administrative controls on the website. 

### ./views
* This folder contains all of the corresponding documents and handlebars that have to do with the layout of the entire website. These views utilize ./assets from material kit that add the front end aspects that are seen.

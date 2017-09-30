const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost/code_camp_review");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// ********** SCHEMA SET UP ***********
var codeCampSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var CodeCamp = mongoose.model("Codecamp", codeCampSchema);

// use to seed db with AZ Bootcamp item - run once & then comment out
// CodeCamp.create({
// 	name: "University of Arizona Full-Stack Flex Coding Bootcamp", 
// 	image: "https://codingbootcamp.ce.arizona.edu/wp-content/themes/Arizona/media/img/arizona_certificate.svg ",
// 	description: "24 Week Web Developer Bootcamp"
// 	}, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("Codecamp created");
// 			console.log(codecamp);
// 		}
// });

app.get("/", function(req, res){
	res.render("landing");
});

//INDEX - shows all codecamps
app.get("/codecamps", function(req, res){
	//get all codecamps from DB
	CodeCamp.find({}, function(err, allCodeCamps){
		if(err){
			console.log(err);
		} else {
			res.render("index", {codecamps:allCodeCamps});
		}
	});
});

// CREATE route - adds new codecamp to DB
app.post("/codecamps", function(req, res){
	//get data from form 
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description
	var newCodeCamp = {name: name, image: image, description: desc}
	//create new campground and save to database
	CodeCamp.create(newCodeCamp, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to codecamps page 
			res.redirect("/codecamps");
		}
	});
	
});

//NEW route - shows form to create new codecamp
app.get("/codecamps/new", function(req, res){
	res.render("new.ejs");
});

//SHOW route - shows more info about a codecamp
app.get("/codecamps/:id", function(req, res){
	//find the campground with the provided id
	CodeCamp.findById(req.params.id, function(err, foundCodeCamp){
		if(err){
			console.log(err);
		} else {
			res.render("show", {codecamp: foundCodeCamp});
		}
	});
});

app.listen(process.env.PORT || 3000, function(){
	console.log("CodeCamp Review server has started!");
});
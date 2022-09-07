const express = require("express");
const { Router } = express;
const User = require("../models").user;
const { ValidationError } = require("sequelize");
const { toJWT, toData } = require("../auth/jwt");

const router = new Router();

router.post("/register/", async (req, res, next) => {
	const { name, email, password } = req.body;

	try {
		if (!name || !password || !email) {
			res.status(400).send("Must provide all data");
		} else {
			const userToCreate = await User.create(req.body);
			res.json(userToCreate);
		}
	} catch (e) {
		if (e instanceof ValidationError) {
			console.error("Captured validation error: ", e.errors[0].message);
			res.status(400).send("E-mail allready in use or password too short");
		} else {
			console.error(e);
			res.status(400).send("Incorrect data");
		}
	}
});

router.post("/login", async (req, res, next) => {
	const { email, password } = req.body;
	const userToLogin = await User.findOne({ where: { email: email } });
	if (userToLogin) {
		if (password === userToLogin.password) {
			//succes
			const data = { userId: userToLogin.id };
			console.log("Data", data);
			const token = toJWT(data);
			res.send({ token: token });
		} else {
			res.status(400).send("Username and/or password incorrect");
		}
	} else {
		res.status(400).send("Username and/or password incorrect *");
	}
});

module.exports = router;

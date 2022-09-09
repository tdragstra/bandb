const express = require("express");
const { Router } = express;
const User = require("../models").user;
const { ValidationError } = require("sequelize");
const { toJWT, toData } = require("../auth/jwt");
const bcrypt = require("bcrypt");
const router = new Router();
const authMiddleware = require("../auth/middleware.js");

router.post("/register/", async (req, res, next) => {
	const { name, email, password } = req.body;

	try {
		if (!name || !password || !email) {
			res.status(400).send("Must provide all data");
		} else {
			const userToCreate = await User.create({
				email,
				password: bcrypt.hashSync(password, 10),
				name,
			});
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

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).send({
			message: "Please supply a valid email and password",
		});
	} else {
		// 1. find user based on email address
		const user = await User.findOne({
			where: {
				email: email,
			},
		});
		if (!user) {
			res.status(400).send({
				message: "User with that email does not exist",
			});
		}
		// 2. use bcrypt.compareSync to check the password against the stored hash
		else if (bcrypt.compareSync(password, user.password)) {
			// 3. if the password is correct, return a JWT with the userId of the user (user.id)
			const jwt = toJWT({ userId: user.id });
			res.send({
				jwt,
				user,
			});
		} else {
			res.status(400).send({
				message: "Password was incorrect",
			});
		}
	}
});

// router.post("/login", async (req, res, next) => {
// 	const { email, password } = req.body;
// 	const userToLogin = await User.findOne({ where: { email: email } });
// 	if (userToLogin) {
// 		if (password === userToLogin.password) {
// 			//succes
// 			const data = { userId: userToLogin.id };
// 			console.log("Data", data);
// 			const token = toJWT(data);
// 			res.send({ token: token });
// 		} else {
// 			res.status(400).send("Username and/or password incorrect");
// 		}
// 	} else {
// 		res.status(400).send("Username and/or password incorrect *");
// 	}
// });

router.get("/", authMiddleware, async (req, res, next) => {
	const data = await User.findOne({ where: (id = req.user.id) });
	res.json({ data });
});

// router.get("/", async (req, res, next) => {
// 	const auth =
// 		req.headers.authorization && req.headers.authorization.split(" ");
// 	if (auth && auth[0] === "Bearer" && auth[1]) {
// 		try {
// 			const data = toData(auth[1]);
// 			const allImages = await Image.findAll();
// 			res.json(allImages);
// 		} catch (e) {
// 			res.status(400).send("Invalid JWT token");
// 		}
// 	} else {
// 		res.status(401).send({
// 			message: "Please supply some valid credentials",
// 		});
// 	}
// });

router.get("/jwt", async (req, res, next) => {
	res.send({
		jwt: toJWT({ userId: 1 }),
	});
});

router.get("/test-auth", authMiddleware, (req, res) => {
	res.send({
		message: `Thanks for visiting the secret endpoint ${req.user.name}.`,
	});
});

module.exports = router;
